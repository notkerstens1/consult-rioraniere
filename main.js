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
    }, 300);
  });

  /* ----------------------------------------
     COOKIE BANNER (LGPD)
     ---------------------------------------- */
  (function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    const KEY = 'raniere-cookie-consent';
    const saved = localStorage.getItem(KEY);

    if (!saved) {
      setTimeout(() => {
        banner.classList.add('visible');
        banner.setAttribute('aria-hidden', 'false');
      }, 1200);
    } else {
      // Se já consentiu, expor o status para futuros scripts (GA4, Meta Pixel)
      window.__cookieConsent = saved;
    }

    banner.querySelectorAll('[data-cookie]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-cookie');
        localStorage.setItem(KEY, choice);
        window.__cookieConsent = choice;
        banner.classList.remove('visible');
        banner.setAttribute('aria-hidden', 'true');
        // Dispatch event para integrações futuras
        window.dispatchEvent(new CustomEvent('cookie-consent', { detail: { choice } }));
      });
    });
  })();

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
    // Hero: subtle telha (warm orange-red) grid on white background + reactive ao mouse
    createAnimatedGrid('gridHero', {
      color: '202, 83, 36', numSquares: 18, maxOpacity: 0.05, cellSize: 62, duration: 1300, mouseReactive: true,
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
     TESTIMONIALS AUTO-ROTATE
     ---------------------------------------- */
  (function initTestimonialsRotate() {
    const track = document.querySelector('[data-testimonials]');
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length < 2) return;

    let idx = 0;
    let paused = false;
    const INTERVAL = 6000;

    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });
    track.addEventListener('touchstart', () => { paused = true; }, { passive: true });

    setInterval(() => {
      if (paused) return;
      idx = (idx + 1) % cards.length;
      const target = cards[idx];
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }, INTERVAL);
  })();

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

  /* ----------------------------------------
     CASOS — dados, grid, modal e lightbox
     ---------------------------------------- */
  const CASOS_DATA = [
    {
      slug: 'kaike',
      tag: 'Criança · Classe III',
      title: 'Tratamento ortodôntico e ortopédico de Classe III',
      description: 'Correção da Classe III esquelética em fase de crescimento. A intervenção ortopédica precoce redirecionou o crescimento maxilar e evitou a necessidade de cirurgia ortognática no futuro.',
      before: 8,
      after: 8,
    },
    {
      slug: 'jenifer',
      tag: 'Criança · Classe II',
      title: 'Tratamento ortodôntico e ortopédico de Classe II',
      description: 'Correção de Classe II esquelética em paciente em crescimento. Planejamento ortopédico conduzido para restabelecer a relação sagital das bases ósseas antes da finalização ortodôntica.',
      before: 11,
      after: 11,
    },
    {
      slug: 'maria-luiza',
      tag: 'Adolescente · Apinhamento severo',
      title: 'Apinhamento severo sem extrações nem desgastes',
      description: 'Apinhamento severo resolvido com expansão e controle biomecânico preciso — sem remover dentes e sem desgastar esmalte. Diagnóstico 3D permitiu planejar cada movimento dentário dentro do envelope ósseo disponível.',
      before: 3,
      after: 3,
    },
    {
      slug: 'vanessa',
      tag: 'Adulto · Mordida aberta',
      title: 'Mordida aberta anterior sem cirurgia ortognática',
      description: 'Mordida aberta em paciente adulto tratada com ancoragem esquelética e biomecânica de intrusão posterior. O planejamento permitiu o fechamento da mordida sem recorrer à cirurgia ortognática.',
      before: 6,
      after: 6,
    },
    {
      slug: 'julia',
      tag: 'Adulto · Classe II + ortognática',
      title: 'Discrepância esquelética Classe II com cirurgia ortognática',
      description: 'Classe II esquelética com indicação cirúrgica. Preparo ortodôntico pré-cirúrgico coordenado com o cirurgião buco-maxilo e planejamento digital para garantir previsibilidade do resultado funcional e estético.',
      before: 3,
      after: 5,
    },
    {
      slug: 'gabriella',
      tag: 'Adulto · Classe III + ortognática + implantes',
      title: 'Classe III com cirurgia ortognática e reabilitação por implantes',
      description: 'Discrepância esquelética de Classe III associada a perdas dentárias. Tratamento multidisciplinar envolvendo ortodontia, cirurgia ortognática e implantodontia, com planejamento integrado do início ao fim.',
      before: 7,
      after: 5,
    },
  ];

  const casosGrid = document.getElementById('casosGrid');
  const casoModal = document.getElementById('casoModal');
  const casoModalContent = document.getElementById('casoModalContent');
  const casoModalScroll = document.getElementById('casoModalScroll');
  const casoLightbox = document.getElementById('casoLightbox');
  const casoLightboxImg = document.getElementById('casoLightboxImg');
  const casoLightboxCaption = document.getElementById('casoLightboxCaption');

  if (casosGrid && casoModal) {
    // Render grid
    CASOS_DATA.forEach((caso) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'caso-card reveal-el';
      card.setAttribute('data-caso-slug', caso.slug);
      card.setAttribute('aria-label', `Ver caso: ${caso.title}`);
      card.innerHTML = `
        <div class="caso-card-media">
          <img class="caso-card-before" src="assets/casos/${caso.slug}/before/01.webp" alt="Antes do tratamento — ${caso.tag}" loading="lazy" decoding="async">
          <img class="caso-card-after" src="assets/casos/${caso.slug}/after/01.webp" alt="Depois do tratamento — ${caso.tag}" loading="lazy" decoding="async">
          <span class="caso-card-badge">Antes → Depois</span>
        </div>
        <div class="caso-card-body">
          <span class="caso-card-tag">${caso.tag}</span>
          <h3 class="caso-card-title">${caso.title}</h3>
          <span class="caso-card-more">
            Ver caso completo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      `;
      card.addEventListener('click', () => openCasoModal(caso.slug));
      casosGrid.appendChild(card);
    });

    // Modal open/close
    let currentCaso = null;
    let currentGallery = [];

    function openCasoModal(slug) {
      const caso = CASOS_DATA.find((c) => c.slug === slug);
      if (!caso) return;
      currentCaso = caso;

      // Galeria pareada: foto N do "antes" ao lado da foto N do "depois"
      const pairCount = Math.min(caso.before, caso.after);
      const extraBefore = Math.max(0, caso.before - pairCount);
      const extraAfter  = Math.max(0, caso.after  - pairCount);

      // Lightbox array: intercala antes/depois dos pares, depois sobras
      currentGallery = [];
      for (let i = 1; i <= pairCount; i++) {
        const n = String(i).padStart(2, '0');
        currentGallery.push({
          src: `assets/casos/${caso.slug}/before/${n}.webp`,
          caption: `Antes (par ${i})`,
        });
        currentGallery.push({
          src: `assets/casos/${caso.slug}/after/${n}.webp`,
          caption: `Depois (par ${i})`,
        });
      }
      for (let i = pairCount + 1; i <= caso.before; i++) {
        currentGallery.push({
          src: `assets/casos/${caso.slug}/before/${String(i).padStart(2, '0')}.webp`,
          caption: `Antes (foto adicional ${i - pairCount})`,
        });
      }
      for (let i = pairCount + 1; i <= caso.after; i++) {
        currentGallery.push({
          src: `assets/casos/${caso.slug}/after/${String(i).padStart(2, '0')}.webp`,
          caption: `Depois (foto adicional ${i - pairCount})`,
        });
      }

      // Render dos pares
      const pairsHtml = Array.from({ length: pairCount }, (_, i) => {
        const n = String(i + 1).padStart(2, '0');
        const idxBefore = i * 2;      // posição no currentGallery
        const idxAfter  = i * 2 + 1;
        return `
          <div class="caso-pair">
            <button type="button" class="caso-thumb caso-pair-thumb" data-lightbox-index="${idxBefore}" aria-label="Par ${i + 1} — Antes">
              <img src="assets/casos/${caso.slug}/before/${n}.webp" alt="Antes — par ${i + 1}" loading="lazy" decoding="async">
              <span class="caso-pair-label caso-pair-label-before">Antes</span>
            </button>
            <button type="button" class="caso-thumb caso-pair-thumb" data-lightbox-index="${idxAfter}" aria-label="Par ${i + 1} — Depois">
              <img src="assets/casos/${caso.slug}/after/${n}.webp" alt="Depois — par ${i + 1}" loading="lazy" decoding="async">
              <span class="caso-pair-label caso-pair-label-after">Depois</span>
            </button>
          </div>
        `;
      }).join('');

      // Sobras
      const extraOffset = pairCount * 2;
      const extraBeforeHtml = Array.from({ length: extraBefore }, (_, i) => {
        const n = String(pairCount + i + 1).padStart(2, '0');
        const idx = extraOffset + i;
        return `<button type="button" class="caso-thumb" data-lightbox-index="${idx}" aria-label="Antes — foto adicional ${i + 1}"><img src="assets/casos/${caso.slug}/before/${n}.webp" alt="Antes do tratamento, foto adicional ${i + 1}" loading="lazy" decoding="async"></button>`;
      }).join('');

      const extraAfterHtml = Array.from({ length: extraAfter }, (_, i) => {
        const n = String(pairCount + i + 1).padStart(2, '0');
        const idx = extraOffset + extraBefore + i;
        return `<button type="button" class="caso-thumb" data-lightbox-index="${idx}" aria-label="Depois — foto adicional ${i + 1}"><img src="assets/casos/${caso.slug}/after/${n}.webp" alt="Depois do tratamento, foto adicional ${i + 1}" loading="lazy" decoding="async"></button>`;
      }).join('');

      const extrasHtml = (extraBefore || extraAfter) ? `
        <div class="caso-extras">
          <h4 class="caso-extras-title">Fotos adicionais</h4>
          ${extraBefore ? `
            <div class="caso-gallery-group">
              <span class="caso-gallery-label caso-gallery-label-before">Antes</span>
              <div class="caso-thumbs">${extraBeforeHtml}</div>
            </div>
          ` : ''}
          ${extraAfter ? `
            <div class="caso-gallery-group">
              <span class="caso-gallery-label caso-gallery-label-after">Depois</span>
              <div class="caso-thumbs">${extraAfterHtml}</div>
            </div>
          ` : ''}
        </div>
      ` : '';

      casoModalContent.innerHTML = `
        <div class="caso-modal-header">
          <span class="caso-modal-tag">${caso.tag}</span>
          <h2 class="caso-modal-title" id="casoModalTitle">${caso.title}</h2>
        </div>

        <div class="caso-modal-slider">
          <div class="ba-slider caso-ba-slider" data-ba-slider>
            <div class="ba-before">
              <img src="assets/casos/${caso.slug}/before/01.webp" alt="Antes do tratamento" loading="eager">
            </div>
            <div class="ba-after">
              <img src="assets/casos/${caso.slug}/after/01.webp" alt="Depois do tratamento" loading="eager">
            </div>
            <span class="ba-label ba-label-before">Antes</span>
            <span class="ba-label ba-label-after">Depois</span>
            <div class="ba-handle">
              <div class="ba-handle-line"></div>
              <div class="ba-handle-knob">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l-4 6 4 6M13 4l4 6-4 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="ba-handle-line"></div>
            </div>
          </div>
          <p class="caso-modal-slider-hint">Arraste para comparar antes e depois</p>
        </div>

        <p class="caso-modal-scroll-hint" aria-hidden="true">
          <span>Continue rolando para ver a evolução completa</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </p>

        <div class="caso-modal-text">
          <p>${caso.description}</p>
        </div>

        <div class="caso-modal-gallery">
          <h3 class="caso-gallery-title">Evolução foto a foto</h3>
          <p class="caso-gallery-sub">Cada par mostra a mesma vista clínica antes e depois do tratamento.</p>
          <div class="caso-pairs">${pairsHtml}</div>
          ${extrasHtml}
        </div>

        <div class="caso-modal-cta">
          <a href="https://wa.me/5584991989595" class="shiny-cta" target="_blank" rel="noopener">
            QUERO AVALIAR MEU CASO <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="cta-arrow"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      `;

      // Reset scroll
      if (casoModalScroll) casoModalScroll.scrollTop = 0;

      // Init B/A slider inside modal
      initBASlider(casoModalContent.querySelector('[data-ba-slider]'));

      // Wire thumb clicks
      casoModalContent.querySelectorAll('[data-lightbox-index]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-lightbox-index'), 10);
          openLightbox(idx);
        });
      });

      casoModal.classList.add('open');
      casoModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }

    function closeCasoModal() {
      casoModal.classList.remove('open');
      casoModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      currentCaso = null;
      currentGallery = [];
    }

    casoModal.querySelectorAll('[data-caso-close]').forEach((el) => {
      el.addEventListener('click', closeCasoModal);
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (casoLightbox.classList.contains('open')) {
        closeLightbox();
      } else if (casoModal.classList.contains('open')) {
        closeCasoModal();
      }
    });

    /* Lightbox logic */
    let lightboxIndex = 0;

    function openLightbox(index) {
      if (!currentGallery.length) return;
      lightboxIndex = index;
      renderLightbox();
      casoLightbox.classList.add('open');
      casoLightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      casoLightbox.classList.remove('open');
      casoLightbox.setAttribute('aria-hidden', 'true');
    }

    function renderLightbox() {
      const item = currentGallery[lightboxIndex];
      if (!item) return;
      casoLightboxImg.src = item.src;
      casoLightboxImg.alt = item.caption;
      casoLightboxCaption.textContent = item.caption;
    }

    function lightboxPrev() {
      lightboxIndex = (lightboxIndex - 1 + currentGallery.length) % currentGallery.length;
      renderLightbox();
    }

    function lightboxNext() {
      lightboxIndex = (lightboxIndex + 1) % currentGallery.length;
      renderLightbox();
    }

    casoLightbox.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
    casoLightbox.querySelector('[data-lightbox-prev]').addEventListener('click', lightboxPrev);
    casoLightbox.querySelector('[data-lightbox-next]').addEventListener('click', lightboxNext);

    // Click on backdrop closes
    casoLightbox.addEventListener('click', (e) => {
      if (e.target === casoLightbox) closeLightbox();
    });

    // Arrow keys inside lightbox
    document.addEventListener('keydown', (e) => {
      if (!casoLightbox.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    });

    // Swipe on lightbox
    let touchStartX = 0;
    let touchEndX = 0;
    casoLightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    casoLightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) lightboxNext();
        else lightboxPrev();
      }
    }, { passive: true });

    /* Reusable B/A slider initializer (used inside modal) */
    function initBASlider(slider) {
      if (!slider) return;
      const afterEl = slider.querySelector('.ba-after');
      const handle = slider.querySelector('.ba-handle');
      let isDragging = false;

      function setPosition(x) {
        const rect = slider.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        // "depois" aparece do lado direito: quanto mais à direita o handle, mais "antes" fica escondido
        afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
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
    }
  }

})();
