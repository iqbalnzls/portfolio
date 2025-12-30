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

// Galaxy center point
let centerX = 0;
let centerY = 0;

// Star class with depth layers and orbital motion
class Star {
    constructor(layer = 'mid') {
        this.layer = layer;
        this.reset();
    }

    reset() {
        // Position stars in orbital pattern around center
        centerX = canvas.width * 0.5;
        centerY = canvas.height * 0.5;

        // Random angle and distance from center
        this.angle = Math.random() * Math.PI * 2;

        // Set properties based on depth layer
        switch (this.layer) {
            case 'far':
                // Far stars: tiny, slow orbit, dim
                this.size = Math.random() * 0.8 + 0.3;
                this.orbitSpeed = (Math.random() * 0.0001 + 0.00005);
                this.opacity = Math.random() * 0.3 + 0.2;
                this.twinkleSpeed = Math.random() * 0.008 + 0.003;
                this.color = { r: 180, g: 200, b: 255 };
                this.distance = Math.random() * canvas.width * 0.8 + 100;
                this.parallaxFactor = 0.3;
                break;
            case 'near':
                // Near stars: larger, faster orbit, brighter
                this.size = Math.random() * 2 + 1.5;
                this.orbitSpeed = (Math.random() * 0.0004 + 0.0002);
                this.opacity = Math.random() * 0.3 + 0.6;
                this.twinkleSpeed = Math.random() * 0.02 + 0.01;
                this.color = { r: 255, g: 255, b: 255 };
                this.distance = Math.random() * canvas.width * 0.3 + 50;
                this.parallaxFactor = 1.5;
                break;
            default: // 'mid'
                // Mid stars: medium everything
                this.size = Math.random() * 1.2 + 0.6;
                this.orbitSpeed = (Math.random() * 0.0002 + 0.0001);
                this.opacity = Math.random() * 0.4 + 0.3;
                this.twinkleSpeed = Math.random() * 0.012 + 0.005;
                this.color = { r: 220, g: 230, b: 255 };
                this.distance = Math.random() * canvas.width * 0.5 + 80;
                this.parallaxFactor = 0.8;
        }

        this.baseSize = this.size;
        this.baseOpacity = this.opacity;
        // Calculate initial position
        this.x = centerX + Math.cos(this.angle) * this.distance;
        this.y = centerY + Math.sin(this.angle) * this.distance;
        // Offset for cursor interaction
        this.offsetX = 0;
        this.offsetY = 0;
    }

    update() {
        // Update center position (in case of resize)
        centerX = canvas.width * 0.5;
        centerY = canvas.height * 0.5;

        // Twinkle effect
        this.opacity += this.twinkleSpeed;
        if (this.opacity > this.baseOpacity + 0.15 || this.opacity < this.baseOpacity - 0.15) {
            this.twinkleSpeed *= -1;
        }

        // Orbital motion - rotate around center
        this.angle += this.orbitSpeed;

        // Base position from orbit
        const baseX = centerX + Math.cos(this.angle) * this.distance;
        const baseY = centerY + Math.sin(this.angle) * this.distance;

        // Calculate distance from mouse for cursor interaction
        const dx = mouseX - (baseX + this.offsetX);
        const dy = mouseY - (baseY + this.offsetY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120 * this.parallaxFactor;

        // Push stars away from cursor
        if (dist < maxDist && isMouseMoving) {
            const force = (maxDist - dist) / maxDist;
            const angle = Math.atan2(dy, dx);
            this.offsetX -= Math.cos(angle) * force * 3 * this.parallaxFactor;
            this.offsetY -= Math.sin(angle) * force * 3 * this.parallaxFactor;
            this.size = this.baseSize * (1 + force * 0.5);
        } else {
            this.size = this.baseSize;
        }

        // Dampen offset back to zero
        this.offsetX *= 0.95;
        this.offsetY *= 0.95;

        // Final position
        this.x = baseX + this.offsetX;
        this.y = baseY + this.offsetY;
    }

    draw() {
        const { r, g, b } = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.fill();
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

// Initialize stars with depth layers
function initStars() {
    stars = [];
    const isMobile = window.innerWidth < 768;

    // Many more stars for dense galaxy effect
    const baseCount = Math.floor((canvas.width * canvas.height) / (isMobile ? 1500 : 600));

    // Far layer: many tiny dim stars (70% of total)
    const farCount = Math.floor(baseCount * 0.70);
    for (let i = 0; i < farCount; i++) {
        stars.push(new Star('far'));
    }

    // Mid layer: medium stars (25% of total)
    const midCount = Math.floor(baseCount * 0.25);
    for (let i = 0; i < midCount; i++) {
        stars.push(new Star('mid'));
    }

    // Near layer: few larger stars (5% of total)
    const nearCount = Math.floor(baseCount * 0.05);
    for (let i = 0; i < nearCount; i++) {
        stars.push(new Star('near'));
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

// Scroll reveal animation for project cards (repeats on scroll up/down)
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Remove class when out of view to replay animation
            entry.target.classList.remove('visible');
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

    // Skill categories fade in (repeats on scroll)
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Reset when out of view
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }, { threshold: 0.1 });

    skillCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = `all 0.6s ease ${index * 0.1}s`;
        skillObserver.observe(category);
    });

    // About section fade in (repeats on scroll)
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
                } else {
                    // Reset when out of view
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                }
            });
        }, { threshold: 0.2 });

        aboutObserver.observe(aboutContent);
    }

    // Contact section fade in (repeats on scroll)
    const contactIntro = document.querySelector('.contact-intro');
    const contactLinks = document.querySelectorAll('.contact-link');

    if (contactIntro) {
        contactIntro.style.opacity = '0';
        contactIntro.style.transform = 'translateY(20px)';
        contactIntro.style.transition = 'all 0.6s ease';

        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                }
            });
        }, { threshold: 0.2 });

        contactObserver.observe(contactIntro);
    }

    contactLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-20px)';
        link.style.transition = `all 0.5s ease ${index * 0.1}s`;

        const linkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                } else {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateX(-20px)';
                }
            });
        }, { threshold: 0.2 });

        linkObserver.observe(link);
    });

    // Section titles fade in (repeats on scroll)
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'all 0.6s ease';

        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                }
            });
        }, { threshold: 0.3 });

        titleObserver.observe(title);
    });
});

// Mobile menu toggle (if needed in the future)
console.log('Portfolio loaded successfully!');

// ============================================
// TYPEWRITER EFFECT
// ============================================

const typewriterElement = document.getElementById('typewriter');
const titles = [
    'Software Engineer',
    'Tech Enthusiast',
    'Problem Solver'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        // Remove characters
        typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        // Add characters
        typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    // If word is complete
    if (!isDeleting && charIndex === currentTitle.length) {
        // Pause at end of word
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Move to next word
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter when DOM is loaded
if (typewriterElement) {
    setTimeout(typeWriter, 1000);
}

// ============================================
// IMAGE MODAL FUNCTIONALITY
// ============================================

function openImageModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');

    modal.classList.add('show');
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');

    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});
