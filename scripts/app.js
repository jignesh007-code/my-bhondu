/**
 * ============================================================================
 * APP.JS - Watercolor Botanical Scrapbook Script (Version 3.5)
 * Top-Zero Entry, Particle Burst, 3D Flip Polaroids, & Pinky Promise Seal.
 * ============================================================================
 */

(function () {
  'use strict';

  // DOM Elements
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeCard = document.getElementById('envelope-card');
  const btnOpenEnvelope = document.getElementById('btn-open-envelope');
  const mainLetterContent = document.getElementById('main-letter-content');
  const readingProgress = document.getElementById('reading-progress');
  const particlesContainer = document.getElementById('particles-container');
  const burstCanvas = document.getElementById('burst-canvas');

  // Memory Garden Elements
  const gardenModal = document.getElementById('garden-memory-modal');
  const gardenModalBackdrop = document.getElementById('garden-modal-backdrop');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalFlowerIcon = document.getElementById('modal-flower-icon');
  const modalPhotoContainer = document.getElementById('modal-photo-container');
  const modalPhotoImg = document.getElementById('modal-photo-img');
  const modalMemoryTitle = document.getElementById('modal-memory-title');
  const modalMemoryBody = document.getElementById('modal-memory-body');
  const modalCaptionTag = document.getElementById('modal-caption-tag');
  const gardenPhotoFlipCards = document.querySelectorAll('.garden-photo-flip-card');
  const galleryScroll = document.getElementById('garden-photos-gallery');
  const galleryDots = document.querySelectorAll('#gallery-dots .dot');

  // Pinky Promise Seal Elements
  const btnPinkySeal = document.getElementById('btn-pinky-seal');
  const pinkyWaxStamp = document.getElementById('pinky-wax-stamp');
  const sealPromptText = document.getElementById('seal-prompt-text');
  const sealConfirmationText = document.getElementById('seal-confirmation-text');

  // Easter Egg Modal Elements
  const btnEasterEgg = document.getElementById('btn-easter-egg');
  const easterEggModal = document.getElementById('easter-egg-modal');
  const eggModalBackdrop = document.getElementById('egg-modal-backdrop');
  const btnCloseEgg = document.getElementById('btn-close-egg');

  // Interactive Commitments List
  const commitmentItems = document.querySelectorAll('.interactive-check-item');

  /**
   * MEMORY GARDEN DATABASE
   */
  const memoriesData = {
    1: {
      flower: '🌷',
      image: 'assets/photos/photo01.jpg',
      title: 'A Tulip Memory',
      body: '"that random conversation that somehow lasted forever."',
      tag: 'memory 01 • late night'
    },
    2: {
      flower: '🌻',
      image: 'assets/photos/photo02.png',
      title: 'A Sunflower Memory',
      body: '"that stupid thing we laughed about for 20 minutes straight."',
      tag: 'memory 02 • pure joy'
    },
    3: {
      flower: '🌷',
      image: 'assets/photos/photo03.jpg',
      title: 'A Tulip Memory',
      body: '"one of those quiet moments when everything felt calm."',
      tag: 'memory 03 • calm'
    },
    4: {
      flower: '🌻',
      image: 'assets/photos/photo04.png',
      title: 'A Sunflower Memory',
      body: '"that chocolate 🫠 (you know exactly which one)."',
      tag: 'memory 04 • sweet moments'
    }
  };

  /**
   * 1. CANVASES & OPENING PARTICLE BURST (PETALS & GOLD STARDUST)
   */
  function triggerOpeningBurst() {
    if (!burstCanvas) return;
    const ctx = burstCanvas.getContext('2d');
    if (!ctx) return;

    burstCanvas.width = window.innerWidth;
    burstCanvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#fcdcd6', '#e88b88', '#fae2cc', '#df8e1d', '#d5e5d2', '#ffffff'];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 3;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        isPetal: Math.random() > 0.4
      });
    }

    function animateBurst() {
      ctx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.isPetal) {
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius * 1.8, p.radius, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animateBurst);
      } else {
        ctx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
      }
    }

    animateBurst();
  }

  /**
   * 2. ENVELOPE OPENING & AUTO-PLAY MUSIC (TOP-ZERO START)
   */
  let isEnvelopeOpened = false;

  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // Ensure window scroll is strictly at top (0,0) before revealing letter
    window.scrollTo(0, 0);

    // Trigger Petal & Gold Sparkle Burst
    triggerOpeningBurst();

    // Automatic Music Playback on Letter Open
    if (window.ScrapbookPlayer && typeof window.ScrapbookPlayer.play === 'function') {
      window.ScrapbookPlayer.play();
    }

    envelopeCard.classList.add('open');

    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      document.body.classList.remove('envelope-active');
      mainLetterContent.classList.add('visible');
      mainLetterContent.removeAttribute('aria-hidden');

      // Re-affirm scroll top zero
      window.scrollTo(0, 0);

      if (window.ScrapbookPlayer && typeof window.ScrapbookPlayer.show === 'function') {
        window.ScrapbookPlayer.show();
      }

      triggerScrollReveals();
    }, 850);
  }

  /**
   * 3. SCROLL REVEALS USING INTERSECTION OBSERVER
   */
  let revealObserver = null;

  function initScrollReveals() {
    const revealItems = document.querySelectorAll('.reveal-item');
    if (!revealItems.length) return;

    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -50px 0px',
          threshold: 0.08
        }
      );

      revealItems.forEach((item) => {
        revealObserver.observe(item);
      });
    } else {
      revealItems.forEach((item) => item.classList.add('is-revealed'));
    }
  }

  function triggerScrollReveals() {
    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.9) {
        item.classList.add('is-revealed');
        if (revealObserver) {
          revealObserver.unobserve(item);
        }
      }
    });
  }

  /**
   * 4. READING PROGRESS BAR
   */
  function initProgressBar() {
    if (!readingProgress) return;
    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
              const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
              readingProgress.style.width = `${progress}%`;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /**
   * 5. AMBIENT PETAL PARTICLES
   */
  function createAmbientPetals() {
    if (!particlesContainer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const petalCount = 14;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal-particle';

      const left = Math.random() * 100;
      const duration = Math.random() * 8 + 14;
      const delay = Math.random() * 10;

      petal.style.left = `${left}%`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;

      fragment.appendChild(petal);
    }

    particlesContainer.appendChild(fragment);
  }

  /**
   * 6. INTERACTIVE MEMORY GARDEN MODAL
   */
  function openGardenMemory(id) {
    const memory = memoriesData[id];
    if (!memory || !gardenModal) return;

    if (modalFlowerIcon) modalFlowerIcon.textContent = memory.flower;
    if (modalMemoryTitle) modalMemoryTitle.textContent = memory.title;
    if (modalMemoryBody) modalMemoryBody.textContent = memory.body;
    if (modalCaptionTag) modalCaptionTag.textContent = memory.tag;

    if (modalPhotoContainer && modalPhotoImg) {
      if (memory.image) {
        modalPhotoImg.src = memory.image;
        modalPhotoContainer.classList.remove('hidden');
      } else {
        modalPhotoContainer.classList.add('hidden');
        modalPhotoImg.src = '';
      }
    }

    gardenModal.classList.add('active');
    gardenModal.removeAttribute('aria-hidden');
  }

  function closeGardenMemory() {
    if (!gardenModal) return;
    gardenModal.classList.remove('active');
    gardenModal.setAttribute('aria-hidden', 'true');
  }

  /**
   * 7. MOBILE CAROUSEL SCROLL DOTS LISTENER
   */
  function initCarouselScroll() {
    if (!galleryScroll || !galleryDots.length) return;

    galleryScroll.addEventListener('scroll', () => {
      const scrollLeft = galleryScroll.scrollLeft;
      const cardWidth = galleryScroll.offsetWidth * 0.85;
      const activeIndex = Math.min(
        galleryDots.length - 1,
        Math.max(0, Math.round(scrollLeft / cardWidth))
      );

      galleryDots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }, { passive: true });
  }

  /**
   * 8. INTERACTIVE COMMITMENTS CHECKLIST
   */
  function initCommitments() {
    commitmentItems.forEach((item) => {
      item.addEventListener('click', () => {
        item.classList.toggle('completed');
        const check = item.querySelector('.animated-checkmark');
        if (check) {
          check.textContent = item.classList.contains('completed') ? '♡' : '✓';
        }
      });
    });
  }

  /**
   * 9. INTERACTIVE PINKY PROMISE SEAL
   */
  function initPinkySeal() {
    if (!btnPinkySeal || !pinkyWaxStamp) return;

    btnPinkySeal.addEventListener('click', () => {
      pinkyWaxStamp.classList.toggle('is-sealed');

      if (pinkyWaxStamp.classList.contains('is-sealed')) {
        if (sealPromptText) sealPromptText.style.display = 'none';
        if (sealConfirmationText) sealConfirmationText.classList.remove('hidden');
      } else {
        if (sealPromptText) sealPromptText.style.display = 'block';
        if (sealConfirmationText) sealConfirmationText.classList.add('hidden');
      }
    });
  }

  /**
   * 10. MAGNETIC PIN BOARD HOVER TILT
   */
  function initMagneticCards() {
    const magneticCards = document.querySelectorAll('.magnetic-card');
    magneticCards.forEach((card) => {
      const defaultTilt = parseFloat(card.getAttribute('data-tilt') || 0);

      card.addEventListener('mouseenter', () => {
        card.style.transform = `translateY(-8px) rotate(${defaultTilt * 1.5}deg) scale(1.03)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `rotate(${defaultTilt}deg)`;
      });
    });
  }

  /**
   * 11. SECRET EASTER EGG MODAL
   */
  function openEasterEgg() {
    if (!easterEggModal) return;
    easterEggModal.classList.add('active');
    easterEggModal.removeAttribute('aria-hidden');
  }

  function closeEasterEgg() {
    if (!easterEggModal) return;
    easterEggModal.classList.remove('active');
    easterEggModal.setAttribute('aria-hidden', 'true');
  }

  /**
   * 12. INITIALIZATION & EVENT BINDINGS
   */
  function initApp() {
    if (btnOpenEnvelope) {
      btnOpenEnvelope.addEventListener('click', openEnvelope);
    }
    if (envelopeCard) {
      envelopeCard.addEventListener('click', (e) => {
        if (e.target.closest('.envelope-flap') || e.target.closest('.wax-seal')) {
          openEnvelope();
        }
      });
    }

    // 3D Flip Photo cards click in the Memory Garden
    gardenPhotoFlipCards.forEach((card) => {
      card.addEventListener('click', () => {
        const memoryId = card.getAttribute('data-memory-id');
        openGardenMemory(memoryId);
      });
    });

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeGardenMemory);
    if (gardenModalBackdrop) gardenModalBackdrop.addEventListener('click', closeGardenMemory);

    if (btnEasterEgg) btnEasterEgg.addEventListener('click', openEasterEgg);
    if (btnCloseEgg) btnCloseEgg.addEventListener('click', closeEasterEgg);
    if (eggModalBackdrop) eggModalBackdrop.addEventListener('click', closeEasterEgg);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeGardenMemory();
        closeEasterEgg();
      }
      if ((e.key === ' ' || e.key === 'Enter') && document.activeElement === btnOpenEnvelope) {
        e.preventDefault();
        openEnvelope();
      }
    });

    initScrollReveals();
    initProgressBar();
    createAmbientPetals();
    initCarouselScroll();
    initCommitments();
    initPinkySeal();
    initMagneticCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
