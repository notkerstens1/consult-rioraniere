/* ========================================
   DR. RANIERE SOUSA — MAIN JS V2
   ======================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  /* ----------------------------------------
     LENIS SMOOTH SCROLL
     ---------------------------------------- */
  if (!prefersReducedMotion) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ----------------------------------------
     GSAP REGISTER
     ---------------------------------------- */
  gsap.registerPlugin(ScrollTrigger);

  const revealY = isMobile ? 30 : 50;
  const revealDuration = isMobile ? 0.7 : 0.9;

  /* ----------------------------------------
     SCROLL PROGRESS BAR
     ---------------------------------------- */
  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });

  /* ----------------------------------------
     NAVBAR
     ---------------------------------------- */
  const navbar = document.querySelector('.navbar');

  ScrollTrigger.create({
    start: '100vh top',
    onEnter: () => {
      navbar.classList.add('visible');
      gsap.to(navbar, { y: 0, opacity: 1, duration: 0.4 });
    },
    onLeaveBack: () => {
      navbar.classList.remove('visible');
      gsap.to(navbar, { y: -100, opacity: 0, duration: 0.3 });
    },
  });

  /* ----------------------------------------
     HERO HEADLINE REVEAL
     ---------------------------------------- */
  const heroMask = document.querySelector('.hero .headline-mask');
  if (heroMask) {
    gsap.from(heroMask.querySelector('.headline-inner'), {
      yPercent: 110,
      duration: 1.1,
      ease: 'power4.out',
      delay: 0.3,
    });
  }

  // Hero elements fade in
  gsap.from('.hero .reveal-el', {
    y: revealY,
    opacity: 0,
    duration: revealDuration,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.7,
  });

  /* ----------------------------------------
     HEADLINE MASK REVEAL (scroll-triggered)
     ---------------------------------------- */
  gsap.utils.toArray('.reveal-section .headline-mask').forEach((mask) => {
    const inner = mask.querySelector('.headline-inner');
    if (!inner) return;

    gsap.from(inner, {
      yPercent: 110,
      duration: 1.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: mask,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ----------------------------------------
     REVEAL ON SCROLL — sections
     ---------------------------------------- */
  gsap.utils.toArray('.reveal-section').forEach((section) => {
    const els = section.querySelectorAll('.reveal-el');
    if (!els.length) return;

    gsap.from(els, {
      y: revealY,
      opacity: 0,
      duration: revealDuration,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ----------------------------------------
     PARALLAX IMAGES
     ---------------------------------------- */
  if (!prefersReducedMotion) {
    gsap.utils.toArray('.parallax-img').forEach((img) => {
      gsap.to(img, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.parallax-container'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /* ----------------------------------------
     SECTION DIVIDERS
     ---------------------------------------- */
  gsap.utils.toArray('.section-divider').forEach((divider) => {
    gsap.from(divider, {
      scaleX: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: divider,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ----------------------------------------
     COUNTER ANIMATION
     ---------------------------------------- */
  gsap.utils.toArray('.counter').forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => { el.textContent = Math.round(obj.val); },
    });
  });

  /* ----------------------------------------
     BEFORE / AFTER SLIDER
     ---------------------------------------- */
  document.querySelectorAll('[data-ba-slider]').forEach((slider) => {
    const afterEl = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });

    // Auto-animate hint
    if (!prefersReducedMotion) {
      ScrollTrigger.create({
        trigger: slider,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          const proxy = { val: 50 };
          gsap.to(proxy, {
            val: 30,
            duration: 0.8,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
            onUpdate: () => {
              afterEl.style.clipPath = `inset(0 ${100 - proxy.val}% 0 0)`;
              handle.style.left = proxy.val + '%';
            },
            onComplete: () => {
              afterEl.style.clipPath = 'inset(0 50% 0 0)';
              handle.style.left = '50%';
            },
          });
        },
      });
    }
  });

  /* ----------------------------------------
     FAQ ACCORDION
     ---------------------------------------- */
  document.querySelectorAll('.faq-question').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach((i) => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
