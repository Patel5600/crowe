// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initCursorFollower();
    initStatCounters();
    initButtonInteractions();
    initParallaxEffect();
    initKineticTypography();
});

// ===================================
// KINETIC TYPOGRAPHY
// ===================================
function initKineticTypography() {
    const title = document.getElementById('kineticTitle');
    if (!title) return;

    const text = title.textContent;
    title.innerHTML = '';
    title.style.opacity = '1';

    // Split text into characters
    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.className = 'kinetic-char';
        span.style.animationDelay = `${index * 0.05}s`;
        title.appendChild(span);
    });

    // Trigger animations after a short delay
    setTimeout(() => {
        const chars = title.querySelectorAll('.kinetic-char');
        chars.forEach(char => char.classList.add('animate'));
    }, 100);
}

// ===================================
// CUSTOM CURSOR FOLLOWER
// ===================================
function initCursorFollower() {
    const cursorFollower = document.getElementById('cursorFollower');

    if (!cursorFollower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let isMouseMoving = false;

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        cursorFollower.style.opacity = '1';
    });

    // Smooth cursor following animation
    function animateCursor() {
        const speed = 0.15;

        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;

        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Scale up on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.borderColor = 'hsl(180, 90%, 60%)';
        });

        el.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.borderColor = 'hsl(260, 95%, 65%)';
        });
    });
}

// ===================================
// ANIMATED STAT COUNTERS
// ===================================
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    let current = 0;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ===================================
// BUTTON INTERACTIONS
// ===================================
function initButtonInteractions() {
    const heroBtns = document.querySelectorAll('.hero-btn');
    const exploreBtn = document.getElementById('exploreBtn'); // legacy
    const learnBtn = document.getElementById('learnBtn');    // legacy

    // Add ripple effect to all buttons (including new hero buttons)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', createRippleEffect);
    });

    // Log clicks for demo
    heroBtns.forEach(btn => {
        btn.addEventListener('click', () => console.log(btn.textContent + ' clicked'));
    });
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

function playSuccessAnimation() {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.transform = 'scale(1.02)';
        setTimeout(() => {
            hero.style.transform = 'scale(1)';
        }, 200);
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, hsl(260, 95%, 65%), hsl(180, 90%, 60%));
        color: white;
        border-radius: 0.75rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// PARALLAX EFFECT FOR CARDS & SCENES
// ===================================
function initParallaxEffect() {
    const cards = document.querySelectorAll('.card');
    const scenes = document.querySelectorAll('.cinematic-scene');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        // Existing Card Parallax
        cards.forEach((card, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            card.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Cinematic Scene Parallax (Applies to all scenes)
        scenes.forEach(scene => {
            // Background moves slightly (far away)
            const bgLayer = scene.querySelector('.layer-bg');
            if (bgLayer) {
                const bgX = (mouseX - 0.5) * -15;
                const bgY = (mouseY - 0.5) * -15;
                bgLayer.style.transform = `scale(1.1) translate(${bgX}px, ${bgY}px)`;
            }

            // Smoke moves more (closer)
            const smokeLayer = scene.querySelector('.layer-mid');
            if (smokeLayer) {
                const smokeX = (mouseX - 0.5) * -40;
                const smokeY = (mouseY - 0.5) * -40;
                smokeLayer.style.transform = `translate(${smokeX}px, ${smokeY}px)`;
            }

            // Title moves most (foreground) - if any exist inside
            const title = scene.querySelector('.cinematic-title');
            if (title) {
                const titleX = (mouseX - 0.5) * 60;
                const titleY = (mouseY - 0.5) * 60;
                title.style.transform = `translate(${titleX}px, ${titleY}px)`;
            }
        });
    });
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
document.addEventListener('keydown', (e) => {
    // Press 'E' to trigger Explore
    if (e.key === 'e' || e.key === 'E') {
        const btn = document.getElementById('exploreBtn') || document.getElementById('projectsBtn');
        if (btn) btn.click();
    }

    // Press 'L' to trigger Learn More
    if (e.key === 'l' || e.key === 'L') {
        const btn = document.getElementById('learnBtn') || document.getElementById('contactBtn');
        if (btn) btn.click();
    }
});

// ===================================
// PERFORMANCE MONITORING
// ===================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }, 0);
    });
}

// ===================================
// DYNAMIC ANIMATIONS
// ===================================
// Add additional CSS keyframes for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .hero-section {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);
