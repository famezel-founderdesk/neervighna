// 1. Initialize Lenis (Smooth Scrolling)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Check if GSAP is loaded
if (typeof gsap !== 'undefined') {
    
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Enable JS-only styles safely
    document.body.classList.add('js-enabled');

    // 2. Custom Cursor
    const cursor = document.getElementById('cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.2 });
        });
        document.querySelectorAll('a, button, .dosha-card, .treatment-item, .t-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 3. Text Reveal Animation
    gsap.utils.toArray('.reveal-text').forEach(el => {
        gsap.fromTo(el, 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } }
        );
    });

    // 4. Homepage Logic
    if (document.body.classList.contains('index-page')) {
        gsap.fromTo('.hero-text .reveal-up', 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
        );

        let leafPath = document.querySelector('.leaf-path');
        if (leafPath) {
            let length = leafPath.getTotalLength();
            leafPath.style.strokeDasharray = length;
            leafPath.style.strokeDashoffset = length;
            gsap.to(leafPath, { strokeDashoffset: 0, duration: 2, delay: 0.5, ease: 'power2.inOut' });
        }
        
        gsap.to('.mandala-spin', {
            rotation: 360, transformOrigin: 'center center', duration: 40, repeat: -1, ease: 'none'
        });
    }

    // 5. Doshas Page Logic
    if (document.body.classList.contains('doshas-page')) {
        const stages = document.querySelectorAll('.dosha-text');
        const arts = document.querySelectorAll('.dosha-art');
        const dots = document.querySelectorAll('.dot');
        
        ScrollTrigger.create({
            trigger: '#doshas-pin',
            start: 'top top',
            end: '+=1500',
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                let activeIndex = Math.floor(self.progress * 3);
                if (activeIndex > 2) activeIndex = 2;

                stages.forEach((stage, i) => { i === activeIndex ? stage.classList.add('active') : stage.classList.remove('active'); });
                arts.forEach((art, i) => { i === activeIndex ? art.classList.add('active') : art.classList.remove('active'); });
                if(dots.length > 0) {
                    dots.forEach((dot, i) => { i === activeIndex ? dot.classList.add('active') : dot.classList.remove('active'); });
                }
            }
        });

        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                tabContents.forEach(c => c.classList.remove('active'));
                document.getElementById(`tab-${tab}`).classList.add('active');
                gsap.fromTo(`#tab-${tab}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
            });
        });
    }

    // 6. Treatments Page Logic
    if (document.body.classList.contains('treatments-page')) {
        const hWrap = document.querySelector('.h-treatments-wrapper');
        if (hWrap) {
            gsap.to(hWrap, {
                x: () => -(hWrap.scrollWidth - window.innerWidth + 64) + 'px', ease: 'none',
                scrollTrigger: { trigger: '#h-treatments', start: 'top top', end: '+=2000', pin: true, scrub: 1, invalidateOnRefresh: true }
            });
        }
    }

    // 7. About Page Logic
    if (document.body.classList.contains('about-page')) {
        const path = document.querySelector('.timeline-path');
        if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            gsap.to(path, { strokeDashoffset: 0, scrollTrigger: { trigger: '#timeline', start: 'top 50%', end: 'bottom 50%', scrub: 1 } });
        }
    }

    // 8. General Scroll Animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, { y: 50, opacity: 0, duration: 1, scrollTrigger: { trigger: title, start: 'top 85%' } });
    });

    const navbar = document.getElementById('navbar');
    if (navbar) {
        ScrollTrigger.create({
            start: 'top -50',
            onUpdate: (self) => {
                if (self.scroll() > 50) {
                    navbar.style.padding = '1rem 4rem';
                    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                } else {
                    navbar.style.padding = '1.5rem 4rem';
                    navbar.style.boxShadow = 'none';
                }
            }
        });
    }

    // 9. Premium Footer Logic
    function updateTime() {
        const timeElement = document.getElementById('live-time');
        if(timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour12: false });
            timeElement.textContent = timeString;
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    gsap.from(".footer-col", {
        y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: "#main-footer", start: "top 85%" }
    });

    gsap.to(".marquee-track", {
        xPercent: -50, repeat: -1, duration: 20, ease: "linear"
    });

    document.querySelectorAll('.footer-links a, .footer-contact a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { x: 10, color: 'var(--accent-3)', opacity: 1, duration: 0.3 });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { x: 0, color: 'var(--accent-1)', opacity: 0.8, duration: 0.3 });
        });
    });

} else {
    // Fallback if GSAP fails
    document.querySelectorAll('.reveal-up, .reveal-text').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}