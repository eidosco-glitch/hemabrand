'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
    const { user } = useAuth() || {}
    const [loadedWishlist, setLoadedWishlist] = useState([])

    // Derive actual wishlist — empty when no user logged in (no setState needed)
    const wishlist = user ? loadedWishlist : []

    // Load wishlist from Firestore whenever the logged-in user changes
    useEffect(() => {
        if (!user) return
        const ref = doc(db, 'users', user.uid)
        getDoc(ref)
            .then(snap => {
                setLoadedWishlist(snap.exists() ? (snap.data().wishlist || []) : [])
                if (!snap.exists()) setDoc(ref, { wishlist: [] })
            })
            .catch(() => setLoadedWishlist([]))
    }, [user])

    // Returns true if toggled successfully, false if not logged in
    const toggleWishlist = async (productId) => {
        if (!user) return false
        const ref = doc(db, 'users', user.uid)
        if (loadedWishlist.includes(productId)) {
            await updateDoc(ref, { wishlist: arrayRemove(productId) })
            setLoadedWishlist(prev => prev.filter(id => id !== productId))
        } else {
            await setDoc(ref, { wishlist: arrayUnion(productId) }, { merge: true })
            setLoadedWishlist(prev => [...new Set([...prev, productId])])
        }
        return true
    }

    const isInWishlist = (productId) => wishlist.includes(productId)

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => useContext(WishlistContext)
