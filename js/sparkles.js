/**
 * Sparkle Effects System - Dark Edition
 * Creates magical sparkle particles for cursor trail and hover effects
 */

class SparkleSystem {
    constructor() {
        this.container = document.getElementById('sparkle-container');
        this.cursorGlow = document.getElementById('cursor-glow');
        this.isEnabled = true;
        this.lastSparkleTime = 0;
        this.sparkleDelay = 80;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!this.prefersReducedMotion) {
            this.init();
        }
    }
    
    init() {
        // Custom cursor glow
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Hover effects
        this.initHoverEffects();
        
        // Sparkles on love notes
        this.initNoteSparkles();
    }
    
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Update cursor glow position
        if (this.cursorGlow) {
            this.cursorGlow.style.left = `${e.clientX}px`;
            this.cursorGlow.style.top = `${e.clientY}px`;
        }
        
        // Create sparkle trail
        const now = Date.now();
        if (now - this.lastSparkleTime > this.sparkleDelay && this.isEnabled) {
            this.createCursorSparkle(e.clientX, e.clientY);
            this.lastSparkleTime = now;
        }
    }
    
    initHoverEffects() {
        // Add hover class to cursor for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .bento-card, .note-modern, .timeline-card-modern, .main-heart-container');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursorGlow) {
                    this.cursorGlow.classList.add('hovering');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (this.cursorGlow) {
                    this.cursorGlow.classList.remove('hovering');
                }
            });
        });
    }
    
    initNoteSparkles() {
        const notes = document.querySelectorAll('.note-modern');
        
        notes.forEach(note => {
            note.addEventListener('mouseenter', () => this.burstSparkles(note));
        });
    }
    
    createCursorSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle';
        
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;
        
        const size = Math.random() * 4 + 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        // Random color - mostly rose with occasional white
        const colors = [
            '#f43f5e',
            '#fb7185', 
            '#fda4af',
            '#ffffff',
        ];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.boxShadow = `0 0 ${size * 2}px ${sparkle.style.background}`;
        
        this.container.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 600);
    }
    
    burstSparkles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                this.createBurstSparkle(centerX, centerY, Math.max(rect.width, rect.height) / 2);
            }, i * 25);
        }
    }
    
    createBurstSparkle(centerX, centerY, radius) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.position = 'fixed';
        sparkle.style.zIndex = '9999';
        
        const size = Math.random() * 8 + 4;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    createSparkleAt(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.position = 'fixed';
        
        const size = Math.random() * 10 + 5;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }
}

// Confetti System - Dark Edition
class ConfettiSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.colors = [
            '#f43f5e', // rose-500
            '#fb7185', // rose-400
            '#fda4af', // rose-300
            '#ffffff', // white
            '#e11d48', // rose-600
        ];
    }
    
    burst(count = 150) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.createConfetti(), i * 8);
        }
    }
    
    createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const startX = Math.random() * window.innerWidth;
        confetti.style.left = `${startX}px`;
        confetti.style.top = '-20px';
        
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        // Different shapes
        const shapes = ['circle', 'square', 'heart', 'star'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
            confetti.style.backgroundColor = color;
        } else if (shape === 'square') {
            confetti.style.backgroundColor = color;
        } else if (shape === 'heart') {
            confetti.innerHTML = '♥';
            confetti.style.fontSize = `${size}px`;
            confetti.style.color = color;
            confetti.style.background = 'none';
            confetti.style.width = 'auto';
            confetti.style.height = 'auto';
            confetti.style.textShadow = `0 0 ${size}px ${color}`;
        } else if (shape === 'star') {
            confetti.innerHTML = '✦';
            confetti.style.fontSize = `${size}px`;
            confetti.style.color = color;
            confetti.style.background = 'none';
            confetti.style.width = 'auto';
            confetti.style.height = 'auto';
        }
        
        const duration = Math.random() * 2 + 2;
        confetti.style.animationDuration = `${duration}s`;
        
        this.container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Initialize after preloader
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        setTimeout(() => {
            window.sparkleSystem = new SparkleSystem();
            window.confettiSystem = new ConfettiSystem('confetti-container');
        }, 3500);
    }
});
