/* ============================================
   LS PUBLICIDAD & EVENTOS - APP.JS
   Core functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === AOS INIT ===
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

    // === LUCIDE ICONS ===
    lucide.createIcons();

    // === NAVBAR SCROLL ===
    const nav = document.querySelector('.nav-main');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // === MOBILE MENU ===
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // === PORTFOLIO FILTER ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            masonryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // === PORTFOLIO MODAL ===
    const modal = document.getElementById('portfolioModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    masonryItems.forEach(item => {
        item.addEventListener('click', () => {
            const bg = item.querySelector('.placeholder-img');
            const title = item.dataset.title || 'Proyecto';
            const desc = item.dataset.desc || '';
            if (bg) {
                modalImg.style.background = window.getComputedStyle(bg).background;
                modalImg.style.height = '400px';
                modalImg.style.borderRadius = '12px';
            }
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    modal?.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // === SMART FORM VALIDATION ===
    const form = document.getElementById('smartForm');
    const inputs = form?.querySelectorAll('.form-input[required]');
    const validateField = (input) => {
        const val = input.value.trim();
        const errEl = input.parentElement.querySelector('.form-error');
        let valid = true;
        if (!val) {
            valid = false;
            if (errEl) { errEl.textContent = 'Este campo es obligatorio'; errEl.style.display = 'block'; }
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            valid = false;
            if (errEl) { errEl.textContent = 'Email no válido'; errEl.style.display = 'block'; }
        } else if (input.type === 'tel' && !/^[\d\s\+\-\(\)]{8,}$/.test(val)) {
            valid = false;
            if (errEl) { errEl.textContent = 'Teléfono no válido'; errEl.style.display = 'block'; }
        } else {
            if (errEl) errEl.style.display = 'none';
        }
        input.classList.toggle('error', !valid);
        input.classList.toggle('valid', valid);
        return valid;
    };
    inputs?.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(input);
        });
    });
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        let allValid = true;
        inputs.forEach(input => { if (!validateField(input)) allValid = false; });
        if (allValid) {
            const btn = form.querySelector('.btn-submit');
            btn.textContent = '✓ Mensaje Enviado';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            setTimeout(() => {
                btn.textContent = 'Enviar Planificación';
                btn.style.background = '';
                form.reset();
                inputs.forEach(i => { i.classList.remove('valid'); });
            }, 3000);
        }
    });

    // === COUNTER ANIMATION ===
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current) + suffix;
        }, 20);
    };
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // === TESTIMONIAL CAROUSEL ===
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-slide').length;
    const goToSlide = (n) => {
        currentSlide = n;
        if (track) track.style.transform = `translateX(-${n * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === n));
    };
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
    setInterval(() => { goToSlide((currentSlide + 1) % totalSlides); }, 5000);

    // === SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // === WHATSAPP FLOAT PULSE ===
    const waFloat = document.querySelector('.wa-float');
    if (waFloat) waFloat.classList.add('animate-pulse-gold');

    // === ADD fadeIn KEYFRAME ===
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(style);
});
