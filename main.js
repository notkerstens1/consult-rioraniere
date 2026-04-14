/* ========================================
   DR. RANIERE SOUSA — MAIN JS V2
   ======================================== */

(function () {
  'use strict';

  /* ----------------------------------------
     LOADER DISMISS
     ---------------------------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 900);
  });

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
     ANIMATED GRID BACKGROUNDS
     ---------------------------------------- */
  function createAnimatedGrid(id, options) {
    const container = document.getElementById(id);
    if (!container) return;

    const {
      numSquares  = 25,
      maxOpacity  = 0.07,
      duration    = 1100,
      cellSize    = 55,
      color       = '245, 246, 236',
      mouseReactive = false,
    } = options || {};

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Grid line pattern
    const defs     = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pId      = 'gp-' + id;
    const pattern  = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', pId);
    pattern.setAttribute('width', cellSize);
    pattern.setAttribute('height', cellSize);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');

    const gridPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gridPath.setAttribute('d', `M ${cellSize} 0 L 0 0 0 ${cellSize}`);
    gridPath.setAttribute('fill', 'none');
    gridPath.setAttribute('stroke', `rgba(${color}, 0.07)`);
    gridPath.setAttribute('stroke-width', '0.5');

    pattern.appendChild(gridPath);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', `url(#${pId})`);
    svg.appendChild(bgRect);

    container.appendChild(svg);

    // Auto-animate: random squares flash in/out
    function animateSquares() {
      const w    = container.offsetWidth;
      const h    = container.offsetHeight;
      if (!w || !h) return;

      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);

      for (let i = 0; i < numSquares; i++) {
        setTimeout(() => {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', Math.floor(Math.random() * cols) * cellSize + 1);
          rect.setAttribute('y', Math.floor(Math.random() * rows) * cellSize + 1);
          rect.setAttribute('width',  cellSize - 2);
          rect.setAttribute('height', cellSize - 2);
          rect.setAttribute('fill', `rgba(${color}, 0)`);
          rect.style.transition = `fill ${duration}ms ease`;
          svg.appendChild(rect);

          requestAnimationFrame(() => {
            rect.setAttribute('fill', `rgba(${color}, ${maxOpacity})`);
          });

          setTimeout(() => {
            rect.setAttribute('fill', `rgba(${color}, 0)`);
            setTimeout(() => rect.remove(), duration);
          }, duration);
        }, i * (duration / numSquares * 2));
      }
      setTimeout(animateSquares, duration * 2.5);
    }

    // Mouse-reactive squares (dark sections only)
    if (mouseReactive && window.matchMedia('(hover: hover)').matches) {
      const section       = container.parentElement;
      const mouseSquares  = [];

      section.addEventListener('mousemove', (e) => {
        const rect   = container.getBoundingClientRect();
        const mx     = e.clientX - rect.left;
        const my     = e.clientY - rect.top;
        const radius = 140;
        const col    = Math.floor(mx / cellSize);
        const row    = Math.floor(my / cellSize);

        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            const cx   = (col + dx) * cellSize + cellSize / 2;
            const cy   = (row + dy) * cellSize + cellSize / 2;
            const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
            const key  = `${col + dx}-${row + dy}`;

            if (dist < radius && !mouseSquares.find(s => s.key === key)) {
              const opacity = (1 - dist / radius) * maxOpacity * 3;
              const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
              r.setAttribute('x', (col + dx) * cellSize + 1);
              r.setAttribute('y', (row + dy) * cellSize + 1);
              r.setAttribute('width',  cellSize - 2);
              r.setAttribute('height', cellSize - 2);
              r.setAttribute('fill', `rgba(${color}, ${opacity})`);
              r.style.transition = 'fill 0.25s ease';
              svg.appendChild(r);

              const sq = { key, el: r };
              mouseSquares.push(sq);

              setTimeout(() => {
                r.setAttribute('fill', `rgba(${color}, 0)`);
                setTimeout(() => {
                  r.remove();
                  const idx = mouseSquares.indexOf(sq);
                  if (idx > -1) mouseSquares.splice(idx, 1);
                }, 350);
              }, 500);
            }
          }
        }
      });
    }

    // Trigger via IntersectionObserver
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSquares();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    obs.observe(container);
  }

  if (!prefersReducedMotion) {
    // Hero: subtle telha (warm orange-red) grid on white background
    createAnimatedGrid('gridHero', {
      color: '202, 83, 36', numSquares: 18, maxOpacity: 0.05, cellSize: 62, duration: 1300,
    });
    // Depoimentos: soft marmore grid on dark background + mouse reactive
    createAnimatedGrid('gridDepoimentos', {
      color: '245, 246, 236', numSquares: 18, maxOpacity: 0.07, cellSize: 56, duration: 1100, mouseReactive: true,
    });
    // CTA Final: slightly stronger marmore grid + mouse reactive
    createAnimatedGrid('gridCTA', {
      color: '245, 246, 236', numSquares: 14, maxOpacity: 0.09, cellSize: 56, duration: 1050, mouseReactive: true,
    });
  }

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
