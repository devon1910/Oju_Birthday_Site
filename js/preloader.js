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
        
        this.minLoadTime = 1500; // Reduced to 1.5 seconds
        this.maxLoadTime = 4000; // Maximum 4 seconds no matter what
        this.startTime = Date.now();
        this.hasHidden = false;
        
        this.init();
    }
    
    init() {
        // Create floating particles
        if (this.particlesContainer) {
            this.createParticles();
        }
        
        // Wait for page load
        window.addEventListener('load', () => this.onLoad());
        
        // Fallback if load event already fired
        if (document.readyState === 'complete') {
            this.onLoad();
        }
        
        // Maximum timeout - don't wait forever
        setTimeout(() => {
            if (!this.hasHidden) {
                console.log('Preloader max timeout reached');
                this.hidePreloader();
            }
        }, this.maxLoadTime);
    }
    
    createParticles() {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'preloader-particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = Math.random() * 2 + 2;
            
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
        
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% { transform: translate(0, 0); opacity: 0.5; }
                    50% { transform: translate(10px, -10px); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    onLoad() {
        if (this.hasHidden) return;
        
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minLoadTime - elapsed);
        
        setTimeout(() => this.hidePreloader(), remaining);
    }
    
    hidePreloader() {
        if (this.hasHidden) return;
        this.hasHidden = true;
        
        // Phase 1: Fade out preloader
        if (this.preloader) {
            this.preloader.classList.add('hidden');
        }
        
        // Phase 2: Open curtains quickly
        setTimeout(() => {
            if (this.curtainLeft) this.curtainLeft.classList.add('open');
            if (this.curtainRight) this.curtainRight.classList.add('open');
            
            // Phase 3: Show main content
            setTimeout(() => {
                if (this.mainContent) {
                    this.mainContent.style.opacity = '1';
                    this.mainContent.style.transition = 'opacity 0.5s ease';
                }
                
                // Trigger hero animations
                this.triggerHeroAnimations();
                
                // Dispatch event for other scripts
                window.dispatchEvent(new CustomEvent('preloaderComplete'));
                
                // Remove preloader and curtains from DOM
                setTimeout(() => {
                    if (this.preloader) this.preloader.remove();
                    if (this.curtainLeft) this.curtainLeft.remove();
                    if (this.curtainRight) this.curtainRight.remove();
                }, 500);
                
            }, 300);
            
        }, 400);
    }
    
    triggerHeroAnimations() {
        const charElements = document.querySelectorAll('.char-reveal');
        charElements.forEach((char) => {
            char.style.animationPlayState = 'running';
        });
    }
}

// Initialize preloader
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();
});
