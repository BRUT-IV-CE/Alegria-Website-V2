/**
 * ALEGRIA PARIS - Product Gallery
 * ================================
 * Product image gallery with thumbnails
 */

document.addEventListener('DOMContentLoaded', () => {
    const galleries = document.querySelectorAll('.product-gallery');
    galleries.forEach(initProductGallery);
});

/**
 * Initialize product gallery
 */
function initProductGallery(gallery) {
    const mainImage = gallery.querySelector('.product-gallery-main img');
    const thumbnails = gallery.querySelectorAll('.product-thumb');
    
    if (!mainImage || !thumbnails.length) return;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update main image
            const newSrc = thumb.querySelector('img').src;
            const newAlt = thumb.querySelector('img').alt;
            
            // Fade transition
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = newSrc;
                mainImage.alt = newAlt;
                mainImage.style.opacity = '1';
            }, 200);
            
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
    
    // Set first thumbnail as active
    if (thumbnails[0]) {
        thumbnails[0].classList.add('active');
    }
}

/**
 * Product zoom functionality (optional)
 */
function initProductZoom(gallery) {
    const mainImage = gallery.querySelector('.product-gallery-main');
    const img = mainImage?.querySelector('img');
    
    if (!mainImage || !img) return;
    
    mainImage.addEventListener('mousemove', (e) => {
        const rect = mainImage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        
        img.style.transformOrigin = `${x}% ${y}%`;
    });
    
    mainImage.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.5)';
    });
    
    mainImage.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
}
