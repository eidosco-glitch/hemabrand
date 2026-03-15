/**
 * Inserts Cloudinary transformation params into a Cloudinary URL so images
 * are served at maximum quality directly from Cloudinary's CDN.
 * For non-Cloudinary URLs the original src is returned unchanged.
 */
export function cloudinaryOptimized(src) {
    if (!src || !src.includes('res.cloudinary.com')) return src
    const keyword = '/upload/'
    const idx = src.indexOf(keyword)
    if (idx === -1) return src
    const base = src.slice(0, idx + keyword.length)
    const rest = src.slice(idx + keyword.length)
    // Don't add transforms if they're already there
    if (rest.startsWith('f_') || rest.startsWith('q_') || rest.startsWith('w_')) return src
    return `${base}f_auto,q_auto:best/${rest}`
}
