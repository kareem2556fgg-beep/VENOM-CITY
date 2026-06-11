// ── Toggle Chapter ───────────────────────────────────────
    function toggleChapter(header) {
        const block = header.parentElement;
        block.classList.toggle('open');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const navItems = document.querySelectorAll('.nav-item');
        const contentWrapper = document.getElementById('content-wrapper');

        // ── Active Nav ──────────────────────────────────────
        const sectionObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navItems.forEach(n => n.classList.remove('active'));
                    const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
                    if (active) active.classList.add('active');
                    else document.querySelector('#nav-home')?.classList.add('active');
                }
            });
        }, { rootMargin: '-30% 0px -60% 0px' });
        document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

        // ── Smooth Transition ────────────────────────────────
        navItems.forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                if (href) {
                    e.preventDefault();
                    contentWrapper.classList.add('fade-out');
                    setTimeout(() => {
                        if (href === '#' || href === '') {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                        } else {
                            const targetSection = document.querySelector(href);
                            if (targetSection) targetSection.scrollIntoView({ behavior: 'auto', block: 'start' });
                        }
                        setTimeout(() => contentWrapper.classList.remove('fade-out'), 50);
                    }, 220);
                }
            });
        });

        // ── Navbar Shrink ────────────────────────────────────
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });

        // ── Scroll Animations ────────────────────────────────
        const fadeObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        document.querySelectorAll('.fade-in-item').forEach(item => fadeObs.observe(item));

        // ── Toast ────────────────────────────────────────────
        function showToast(msg) {
            document.querySelector('.toast-notification')?.remove();
            const t = document.createElement('div');
            t.className = 'toast-notification';
            t.textContent = msg;
            document.body.appendChild(t);
            requestAnimationFrame(() => t.classList.add('toast-show'));
            setTimeout(() => { t.classList.remove('toast-show'); setTimeout(() => t.remove(), 300); }, 2200);
        }

        // ── Discord Copy ─────────────────────────────────────
        document.querySelectorAll('.discord-tag').forEach(tag => {
            tag.addEventListener('click', e => {
                e.stopPropagation();
                const name = tag.querySelector('span')?.textContent?.trim();
                if (!name) return;
                navigator.clipboard.writeText(name)
                    .then(() => showToast(`✅ تم نسخ: ${name}`))
                    .catch(() => showToast(`📋 ${name}`));
            });
        });

        // ── Service Cards ────────────────────────────────────
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', () => {
                const url = card.getAttribute('data-url');
                if (url) window.open(url, '_blank');
                else showToast(`🔗 جاري الانتقال...`);
            });
        });
    });