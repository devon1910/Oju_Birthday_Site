/**
 * Preloader Animation System
 * Creates a dramatic entrance with particles, animations, and curtain reveal
 */

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.curtainLeft = document.getElementById('curtain-left');
        this.curtainRight = document.getElementById('curtain-right');
        this.mainContent = document.getElementById('main-content');
        this.particlesContainer = document.querySelector('.preloader-particles');
        
        this.minLoadTime = 3000; // Minimum time to show preloader
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        // Create floating particles
        this.createParticles();
        
        // Wait for minimum time and page load
        window.addEventListener('load', () => this.onLoad());
        
        // Fallback if load event already fired
        if (document.readyState === 'complete') {
            this.onLoad();
        }
    }
    
    createParticles() {
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'preloader-particle';
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = Math.random() * 3 + 3;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(244, 63, 94, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                animation: particleFloat ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
            `;
            
            this.particlesContainer.appendChild(particle);
        }
        
        // Add keyframe animation
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.5;
                    }
                    25% {
                        transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.2);
                        opacity: 1;
                    }
                    50% {
                        transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(0.8);
                        opacity: 0.7;
                    }
                    75% {
                        transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.1);
                        opacity: 0.9;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    onLoad() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minLoadTime - elapsed);
        
        setTimeout(() => this.hidePreloader(), remaining);
    }
    
    hidePreloader() {
        // Phase 1: Fade out preloader content
        this.preloader.classList.add('hidden');
        
        // Phase 2: Open curtains after preloader fades
        setTimeout(() => {
            this.curtainLeft.classList.add('open');
            this.curtainRight.classList.add('open');
            
            // Phase 3: Show main content
            setTimeout(() => {
                this.mainContent.style.opacity = '1';
                this.mainContent.style.transition = 'opacity 0.8s ease';
                
                // Trigger hero animations
                this.triggerHeroAnimations();
                
                // Remove preloader and curtains from DOM
                setTimeout(() => {
                    this.preloader.remove();
                    this.curtainLeft.remove();
                    this.curtainRight.remove();
                }, 1000);
                
            }, 500);
            
        }, 800);
    }
    
    triggerHeroAnimations() {
        // Character reveal is handled by CSS, but we can trigger additional effects
        const charElements = document.querySelectorAll('.char-reveal');
        charElements.forEach((char, index) => {
            char.style.animationPlayState = 'running';
        });
        
        // Create initial sparkle burst at center
        setTimeout(() => {
            this.createEntranceSparkles();
        }, 500);
    }
    
    createEntranceSparkles() {
        const heroName = document.querySelector('.hero-name');
        if (!heroName) return;
        
        const rect = heroName.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'entrance-sparkle';
                
                const angle = (i / 20) * Math.PI * 2;
                const distance = Math.random() * 150 + 50;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    width: ${Math.random() * 8 + 4}px;
                    height: ${Math.random() * 8 + 4}px;
                    background: radial-gradient(circle, #ffffff, #f43f5e);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 100;
                    transform: translate(-50%, -50%);
                `;
                
                document.body.appendChild(sparkle);
                
                // Animate outward
                requestAnimationFrame(() => {
                    sparkle.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    sparkle.style.transform = `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`;
                    sparkle.style.opacity = '0';
                });
                
                setTimeout(() => sparkle.remove(), 800);
                
            }, i * 30);
        }
    }
}

// Initialize preloader
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();
});

