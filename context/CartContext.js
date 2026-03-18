'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const addItem = useCallback((product, size, color, quantity = 1) => {
        setItems(prev => {
            const key = `${product.id}-${size}-${color}`
            const existing = prev.find(i => i.key === key)
            if (existing) {
                return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
            }
            return [...prev, { key, product, size, color, quantity }]
        })
    }, [])

    const removeItem = useCallback((key) => {
        setItems(prev => prev.filter(i => i.key !== key))
    }, [])

    const updateQuantity = useCallback((key, quantity) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(i => i.key !== key))
        } else {
            setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i))
        }
    }, [])

    const clearCart = useCallback(() => setItems([]), [])

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
