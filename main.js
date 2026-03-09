document.addEventListener('DOMContentLoaded', () => {

    // ── Typing Animation ──────────────────────────────
    const roles = ['Software Engineer', 'Full-Stack Developer', 'AI Engineer'];
    const typingEl = document.getElementById('typing-text');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseAfterType = 2000;
    const pauseAfterDelete = 500;

    function type() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            typingEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(type, pauseAfterType);
                return;
            }
            setTimeout(type, typeSpeed);
        } else {
            typingEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, pauseAfterDelete);
                return;
            }
            setTimeout(type, deleteSpeed);
        }
    }

    type();

    // ── Smooth Scroll ─────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Intersection Observer for Fade-in ─────────────
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Staggered fade-in for hero children
    const heroChildren = document.querySelectorAll('.headline, .sub-headline, .descriptionText, .cta-buttons, .stats-bar, .social-links');
    heroChildren.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
        observer.observe(el);
    });

    // ── Code Particle Effect on Photo Hover ────────────
    const canvas = document.getElementById('code-particles');
    const ctx = canvas.getContext('2d');
    const particles = [];
    let mouseX = 0, mouseY = 0;
    let isOverPhoto = false;
    let spawnTimer = 0;

    const codeTokens = [
        '{', '}', '()', '=>', '</>', 'const', 'let', 'fn', 'async',
        '[ ]', '&&', '||', '++', '/**/', 'import', '===', 'return',
        '::', '0x', 'true', 'null', '<T>', '...', '?.', 'await'
    ];
    const colors = ['#c792ea', '#82aaff', '#c3e88d', '#f78c6c', '#89ddff', '#ffcb6b'];

    function resizeCanvas() {
        if (window.innerWidth <= 768) {
            canvas.width = window.innerWidth;
        } else {
            canvas.width = window.innerWidth * 0.6;
        }
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse/touch over viewport
    function handlePointerMove(clientX, clientY) {
        if (window.innerWidth <= 768 || clientX < window.innerWidth * 0.6) {
            isOverPhoto = true;
            mouseX = clientX;
            mouseY = clientY;
        } else {
            isOverPhoto = false;
        }
    }

    document.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    document.addEventListener('mouseleave', () => { isOverPhoto = false; });
    document.addEventListener('touchend', () => { isOverPhoto = false; });

    function spawnParticle() {
        const token = codeTokens[Math.floor(Math.random() * codeTokens.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.2;

        particles.push({
            x: mouseX,
            y: mouseY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.3,
            text: token,
            color: color,
            alpha: 0.9,
            size: 10 + Math.random() * 4,
            life: 1,
            decay: 0.006 + Math.random() * 0.008,
            rotation: (Math.random() - 0.5) * 0.4,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn particles when hovering
        if (isOverPhoto) {
            spawnTimer++;
            if (spawnTimer % 3 === 0) {  // spawn every 3 frames
                spawnParticle();
            }
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            p.rotation += p.rotationSpeed;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.font = `${p.size}px 'Courier New', monospace`;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life * 0.7;
            ctx.fillText(p.text, 0, 0);
            ctx.restore();
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ── Navbar scroll effect ──────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.style.background = 'rgba(10, 12, 16, 0.7)';
            navbar.style.backdropFilter = 'blur(12px)';
            navbar.style.borderRadius = '0';
            navbar.style.top = '0';
            navbar.style.width = '100%';
            navbar.style.maxWidth = '100%';
            navbar.style.padding = '0 5%';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.top = '20px';
            navbar.style.width = '92%';
            navbar.style.maxWidth = '1200px';
            navbar.style.padding = '0 8px';
        }
    });

    // ── Fade-in style ─────────────────────────────────
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    // ── Mobile Sidebar Toggle ─────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');

    function toggleSidebar() {
        if (!menuToggle || !sidebar || !overlay) return;
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
    });
});
