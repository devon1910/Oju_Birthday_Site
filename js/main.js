/**
 * Main JavaScript - Birthday Website Dark Edition
 * Handles typewriter, scroll reveal, lightbox, and easter eggs
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero background image handler immediately
    initHeroBackground();
    initCurrentYear();
    
    // Wait for preloader to finish
    window.addEventListener('preloaderComplete', () => {
        initTypewriter();
        initScrollReveal();
        initLightbox();
        initEasterEgg();
        initSmoothScroll();
        initParallax();
        initPhotoHover();
    });
    
    // Fallback in case preloader event doesn't fire
    setTimeout(() => {
        initTypewriter();
        initScrollReveal();
        initLightbox();
        initEasterEgg();
        initSmoothScroll();
        initParallax();
        initPhotoHover();
    }, 2500);
});

/**
 * Hero Background Image Handler
 */
function initHeroBackground() {
    const heroImg = document.getElementById('hero-bg-img');
    if (!heroImg) return;
    
    // Handle image load error
    heroImg.addEventListener('error', () => {
        heroImg.classList.add('error');
        heroImg.style.display = 'none';
    });
    
    // Handle successful load
    heroImg.addEventListener('load', () => {
        heroImg.classList.remove('error');
        heroImg.style.display = 'block';
    });
}

/**
 * Photo Hover Effects
 */
function initPhotoHover() {
    const photos = document.querySelectorAll('.scatter-photo');
    
    photos.forEach(photo => {
        photo.addEventListener('mouseenter', () => {
            // Create subtle sparkle effect
            if (window.sparkleSystem) {
                const rect = photo.getBoundingClientRect();
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const x = rect.left + Math.random() * rect.width;
                        const y = rect.top + Math.random() * rect.height;
                        window.sparkleSystem.createSparkleAt(x, y);
                    }, i * 100);
                }
            }
        });
    });
}

/**
 * Typewriter Effect
 */
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    const messages = [
        "Today is your special day, and I wanted to celebrate you...",
        "Every moment with you is a gift I treasure...",
        "You light up my world in ways words cannot describe...",
        "Here's to another beautiful year of your amazing life...",
        "I am so grateful to have you in my life..."
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    const typeSpeed = 50;
    const deleteSpeed = 25;
    const pauseTime = 2500;
    
    function type() {
        const currentMessage = messages[messageIndex];
        
        if (isPaused) {
            setTimeout(type, pauseTime);
            isPaused = false;
            isDeleting = true;
            return;
        }
        
        if (isDeleting) {
            element.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
            }
            
            setTimeout(type, deleteSpeed);
        } else {
            element.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentMessage.length) {
                isPaused = true;
            }
            
            setTimeout(type, typeSpeed);
        }
    }
    
    setTimeout(type, 500);
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (!revealElements.length) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

/**
 * Photo Gallery Lightbox
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    if (!lightbox) return;
    
    // Support both scattered and bento gallery images
    const galleryImages = document.querySelectorAll('.scatter-image, .bento-image');
    let currentImageIndex = 0;
    const imageUrls = [];
    
    galleryImages.forEach((img, index) => {
        imageUrls.push(img.src);
        
        // Find parent clickable element
        const frame = img.closest('.photo-frame') || img.closest('.bento-card');
        if (frame) {
            frame.addEventListener('click', () => openLightbox(index));
        }
    });
    
    function openLightbox(index) {
        if (imageUrls.length === 0) return;
        
        currentImageIndex = index;
        lightboxImage.src = imageUrls[currentImageIndex];
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => lightbox.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
        lightboxImage.src = imageUrls[currentImageIndex];
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
        lightboxImage.src = imageUrls[currentImageIndex];
    }
    
    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', showPrevImage);
    nextBtn?.addEventListener('click', showNextImage);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': showPrevImage(); break;
            case 'ArrowRight': showNextImage(); break;
        }
    });
    
    // Touch swipe
    let touchStartX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? showNextImage() : showPrevImage();
        }
    }, { passive: true });
}

/**
 * Easter Egg - Click heart 5 times for confetti
 */
function initEasterEgg() {
    const mainHeart = document.getElementById('main-heart');
    if (!mainHeart) return;
    
    let clickCount = 0;
    let resetTimer = null;
    
    mainHeart.addEventListener('click', () => {
        clickCount++;
        
        // Visual feedback - pulse effect
        const icon = mainHeart.querySelector('.main-heart-icon');
        if (icon) {
            icon.style.transform = 'scale(1.4)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 200);
        }
        
        // Create heart burst
        createHeartBurst(mainHeart);
        
        // Reset counter after 2 seconds
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            clickCount = 0;
        }, 2000);
        
        // Trigger confetti on 5 clicks
        if (clickCount >= 5) {
            if (window.confettiSystem) {
                window.confettiSystem.burst(200);
            }
            clickCount = 0;
            createSparkleExplosion(mainHeart);
        }
    });
}

/**
 * Create heart burst effect
 */
function createHeartBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = Math.random() * 80 + 40;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        const heart = document.createElement('div');
        heart.innerHTML = '♥';
        heart.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: ${Math.random() * 14 + 10}px;
            color: #f43f5e;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            text-shadow: 0 0 10px #f43f5e;
        `;
        
        document.body.appendChild(heart);
        
        let progress = 0;
        const duration = 600;
        const startTime = performance.now();
        
        function animateHeart(currentTime) {
            progress = (currentTime - startTime) / duration;
            
            if (progress >= 1) {
                heart.remove();
                return;
            }
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const x = endX * easeOut;
            const y = endY * easeOut;
            const opacity = 1 - progress;
            const scale = 1 - progress * 0.5;
            
            heart.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
            heart.style.opacity = opacity;
            
            requestAnimationFrame(animateHeart);
        }
        
        requestAnimationFrame(animateHeart);
    }
}

/**
 * Create sparkle explosion effect
 */
function createSparkleExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            if (window.sparkleSystem) {
                const angle = (i / 25) * Math.PI * 2;
                const distance = Math.random() * 120 + 60;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                window.sparkleSystem.createSparkleAt(x, y);
            }
        }, i * 15);
    }
}

/**
 * Set current year
 */
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = `© ${new Date().getFullYear()}`;
    }
}

/**
 * Smooth scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Parallax Effects
 */
function initParallax() {
    const orbs = document.querySelectorAll('.orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        orbs.forEach((orb, index) => {
            const speed = 0.05 + (index * 0.02);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    // Mouse parallax for orbs
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        
        orbs.forEach((orb, index) => {
            const factor = (index + 1) * 0.5;
            orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
}
