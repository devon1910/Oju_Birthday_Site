/**
 * Floating Rose Petals Animation - Dark Edition
 * Creates an organic, dreamy petal falling effect using Canvas API
 */

class PetalAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.petalCount = this.isMobile() ? 20 : 40;
        this.animationId = null;
        this.isRunning = false;
        
        // Petal colors - rose tones with transparency for dark background
        this.colors = [
            'rgba(244, 63, 94, 0.6)',   // rose-500
            'rgba(251, 113, 133, 0.5)', // rose-400
            'rgba(253, 164, 175, 0.4)', // rose-300
            'rgba(255, 255, 255, 0.3)', // white
            'rgba(225, 29, 72, 0.5)',   // rose-600
        ];
        
        this.init();
    }
    
    isMobile() {
        return window.innerWidth < 768;
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createPetals();
        this.start();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createPetals() {
        this.petals = [];
        for (let i = 0; i < this.petalCount; i++) {
            this.petals.push(this.createPetal());
        }
    }
    
    createPetal(startFromTop = false) {
        const size = Math.random() * 12 + 6;
        return {
            x: Math.random() * this.canvas.width,
            y: startFromTop ? -size : Math.random() * this.canvas.height,
            size: size,
            speedY: Math.random() * 0.8 + 0.3,
            speedX: Math.random() * 0.3 - 0.15,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 1.5,
            oscillationSpeed: Math.random() * 0.015 + 0.005,
            oscillationDistance: Math.random() * 30 + 15,
            oscillationOffset: Math.random() * Math.PI * 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: Math.random() * 0.4 + 0.3,
            flip: Math.random() * Math.PI,
            flipSpeed: Math.random() * 0.015 + 0.005,
            type: Math.random() > 0.7 ? 'heart' : 'petal', // Mix of petals and small hearts
        };
    }
    
    drawPetal(petal) {
        this.ctx.save();
        this.ctx.translate(petal.x, petal.y);
        this.ctx.rotate((petal.rotation * Math.PI) / 180);
        
        const scaleX = Math.cos(petal.flip);
        this.ctx.scale(scaleX, 1);
        this.ctx.globalAlpha = petal.opacity;
        
        if (petal.type === 'heart') {
            this.drawHeart(petal);
        } else {
            this.drawPetalShape(petal);
        }
        
        this.ctx.restore();
    }
    
    drawPetalShape(petal) {
        const s = petal.size;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, -s);
        this.ctx.bezierCurveTo(s * 0.8, -s * 0.5, s * 0.8, s * 0.5, 0, s);
        this.ctx.bezierCurveTo(-s * 0.8, s * 0.5, -s * 0.8, -s * 0.5, 0, -s);
        
        // Gradient fill
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, s);
        gradient.addColorStop(0, petal.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Subtle glow
        this.ctx.shadowColor = petal.color;
        this.ctx.shadowBlur = 5;
    }
    
    drawHeart(petal) {
        const s = petal.size * 0.6;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.5, -s, 0, -s * 0.5);
        this.ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.5, 0, s * 0.3);
        
        this.ctx.fillStyle = petal.color;
        this.ctx.fill();
        
        this.ctx.shadowColor = petal.color;
        this.ctx.shadowBlur = 8;
    }
    
    updatePetal(petal, time) {
        petal.y += petal.speedY;
        petal.x += Math.sin(time * petal.oscillationSpeed + petal.oscillationOffset) * 0.4;
        petal.x += petal.speedX;
        petal.rotation += petal.rotationSpeed;
        petal.flip += petal.flipSpeed;
        
        if (petal.y > this.canvas.height + petal.size) {
            Object.assign(petal, this.createPetal(true));
        }
        
        if (petal.x < -petal.size) {
            petal.x = this.canvas.width + petal.size;
        } else if (petal.x > this.canvas.width + petal.size) {
            petal.x = -petal.size;
        }
    }
    
    animate(time) {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.petals.forEach(petal => {
            this.updatePetal(petal, time);
            this.drawPetal(petal);
        });
        
        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate(0);
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    setDensity(density) {
        const targetCount = Math.floor(this.petalCount * density);
        while (this.petals.length > targetCount) {
            this.petals.pop();
        }
        while (this.petals.length < targetCount) {
            this.petals.push(this.createPetal());
        }
    }
}

// Initialize when DOM is ready and preloader is done
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        function initPetals() {
            if (window.petalAnimation) return; // Already initialized
            
            window.petalAnimation = new PetalAnimation('petals-canvas');
            
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                window.addEventListener('scroll', () => {
                    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                    const scrollY = window.scrollY;
                    
                    if (scrollY > heroBottom * 0.5) {
                        window.petalAnimation.setDensity(0.25);
                    } else {
                        window.petalAnimation.setDensity(1);
                    }
                });
            }
        }
        
        // Wait for preloader event
        window.addEventListener('preloaderComplete', initPetals);
        
        // Fallback
        setTimeout(initPetals, 2500);
    }
});
