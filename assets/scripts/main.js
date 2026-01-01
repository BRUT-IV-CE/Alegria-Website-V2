/**
 * ALEGRIA PARIS - Main JavaScript
 * ================================
 * Core functionality and initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initRevealAnimations();
    initStarsBackground();
    initAccordions();
    initSmoothScroll();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const menuClose = document.querySelector('.menu-close');

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        // Toggle header--solid when the hero overlay is out of view
        const heroOverlay = document.querySelector('.hero-overlay');
        if (heroOverlay) {
            const overlayObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        header.classList.add('header--solid');
                    } else {
                        header.classList.remove('header--solid');
                    }
                });
            }, { root: null, threshold: 0 });

            overlayObserver.observe(heroOverlay);
        }
    }
            let heroVisible = false;

            const heroOverlay = document.querySelector('.hero-overlay');
            if (heroOverlay) {
                // Initialize heroVisible based on initial intersection
                const initRect = heroOverlay.getBoundingClientRect();
                heroVisible = (initRect.top < window.innerHeight && initRect.bottom > 0);

                const overlayObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        heroVisible = entry.isIntersecting;

                        if (!entry.isIntersecting) {
                            // Overlay left viewport: make header solid. Apply scrolled state depending on current scroll.
                            header.classList.add('header--solid');
                            if (window.scrollY > 50) {
                                header.classList.add('scrolled');
                            }
                        } else {
                            // Overlay visible: keep header transparent and remove scrolled/solid states
                            header.classList.remove('header--solid');
                            header.classList.remove('scrolled');
                        }
                    });
                }, { root: null, threshold: 0 });

                overlayObserver.observe(heroOverlay);
            }

            window.addEventListener('scroll', () => {
                // If hero is visible, keep header transparent regardless of scroll
                if (heroVisible) {
                    header.classList.remove('scrolled');
                    return;
                }

                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

    // Mobile menu toggle
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu on link click
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav) {
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Close menu button
    if (menuClose && mainNav) {
        menuClose.addEventListener('click', () => {
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
}

/**
 * Scroll effects for various elements
 */
function initScrollEffects() {
    // Parallax effect for hero backgrounds
    const heroBackgrounds = document.querySelectorAll('.hero-background');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        heroBackgrounds.forEach(bg => {
            const speed = 0.5;
            bg.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/**
 * Reveal animations on scroll
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

/**
 * Animated stars background
 */
function initStarsBackground() {
    const starsContainers = document.querySelectorAll('.stars-container');
    
    starsContainers.forEach(container => {
        createStars(container, 50);
    });
}

function createStars(container, count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size class
        const sizeClasses = ['', 'star--small', 'star--large'];
        star.classList.add(sizeClasses[Math.floor(Math.random() * 3)]);
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        
        container.appendChild(star);
    }
}

/**
 * Accordion functionality
 */
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all accordions in the same group
            const accordionGroup = item.parentElement;
            const allItems = accordionGroup.querySelectorAll('.accordion-item');
            allItems.forEach(i => i.classList.remove('active'));
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Format price in EUR
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Export utilities for use in other modules
window.AlegriUtils = {
    debounce,
    formatPrice,
    createStars
};
