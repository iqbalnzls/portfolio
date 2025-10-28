// ============================================
// UNIVERSE BACKGROUND WITH STARS AND CURSOR INTERACTION
// ============================================

const canvas = document.getElementById('universe');
const ctx = canvas.getContext('2d');
const cursorGlow = document.querySelector('.cursor-glow');

let stars = [];
let shootingStars = [];
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

// Star class
class Star {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.baseSize = this.size;
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = 0;
        this.vy = 0;
    }

    update() {
        // Twinkle effect
        this.opacity += this.twinkleSpeed;
        if (this.opacity > 1 || this.opacity < 0.3) {
            this.twinkleSpeed *= -1;
        }

        // Calculate distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        // Push stars away from cursor
        if (distance < maxDistance && isMouseMoving) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 2;
            this.vy -= Math.sin(angle) * force * 2;

            // Make stars grow when pushed
            this.size = this.baseSize * (1 + force * 0.5);
        } else {
            this.size = this.baseSize;
        }

        // Apply velocity with damping
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Slowly return to base position
        this.x += (this.baseX - this.x) * 0.01;
        this.y += (this.baseY - this.y) * 0.01;

        // Slow vertical drift
        this.baseY -= this.speed * 0.2;

        // Reset if out of bounds
        if (this.baseY < -10) {
            this.baseY = canvas.height + 10;
            this.baseX = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();

        // Add glow effect for larger stars
        if (this.size > 1.5) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150, 200, 255, ${this.opacity * 0.2})`;
            ctx.fill();
        }
    }
}

// Shooting Star class
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height / 2;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 10 + 10;
        this.opacity = 1;
        this.angle = Math.PI / 4; // 45 degrees
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.02;

        // Remove if faded out or off screen
        if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
            return false;
        }
        return true;
    }

    draw() {
        const gradient = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(150, 200, 255, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        ctx.stroke();
    }
}

// Initialize stars
function initStars() {
    stars = [];
    // Reduce star count on mobile for better performance
    const isMobile = window.innerWidth < 768;
    const divisor = isMobile ? 5000 : 3000;
    const starCount = Math.floor((canvas.width * canvas.height) / divisor);
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

// Create shooting stars randomly (only on desktop for performance)
function createShootingStar() {
    const isMobile = window.innerWidth < 768;
    if (!isMobile && Math.random() < 0.001 && shootingStars.length < 3) {
        shootingStars.push(new ShootingStar());
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create shooting stars randomly
    createShootingStar();

    // Update and draw regular stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Update and draw shooting stars
    shootingStars = shootingStars.filter(shootingStar => {
        shootingStar.draw();
        return shootingStar.update();
    });

    requestAnimationFrame(animate);
}

// Cursor tracking
let moveTimeout;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;

    // Update cursor glow position
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
    cursorGlow.style.opacity = '1';

    // Reset moving state after a delay
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

// Hide cursor glow when mouse leaves window
document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// Initialize
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
    resizeCanvas();
    animate();
});

// ============================================
// SMOOTH SCROLL AND NAVIGATION
// ============================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add active state to navigation on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Scroll reveal animation for project cards
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        // Stagger animation delay for multiple cards
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // Skill categories fade in
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    skillCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = `all 0.6s ease ${index * 0.1}s`;
        skillObserver.observe(category);
    });

    // About section fade in
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        aboutContent.style.opacity = '0';
        aboutContent.style.transform = 'translateY(30px)';
        aboutContent.style.transition = 'all 0.8s ease';

        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });

        aboutObserver.observe(aboutContent);
    }
});

// Mobile menu toggle (if needed in the future)
console.log('Portfolio loaded successfully!');
