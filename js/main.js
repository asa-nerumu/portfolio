/* ============================================================
   main.js — Interactions & Interactivity
   - Hamburger menu toggle
   - 3D card tilt effect
   - Scroll reveal (IntersectionObserver)
   - Active nav link tracking
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // HAMBURGER MENU
  // ============================================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
  const toggleIcon = menuToggle.querySelector('.material-symbols-outlined');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    toggleIcon.textContent = 'close';
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    toggleIcon.textContent = 'menu';
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  }

  menuToggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when a link is tapped
  menuLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });


  // ============================================================
  // 3D CARD TILT EFFECT (desktop only — no hover on touch devices)
  // ============================================================
  var desktopMQ = window.matchMedia('(min-width: 768px) and (hover: hover)');

  function initCardTilt() {
    var cards = document.querySelectorAll('.card');
    var MAX_TILT = 5;

    cards.forEach(function (card) {
      function onMove(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -MAX_TILT;
        var rotateY = ((x - centerX) / centerX) * MAX_TILT;
        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-20px) scale(1.05)';
      }

      function onLeave() {
        card.style.transform = '';
      }

      if (desktopMQ.matches) {
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
      }

      desktopMQ.addEventListener('change', function (e) {
        if (e.matches) {
          card.addEventListener('mousemove', onMove);
          card.addEventListener('mouseleave', onLeave);
        } else {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
          card.style.transform = '';
        }
      });
    });
  }

  initCardTilt();


  // ============================================================
  // SCROLL REVEAL — IntersectionObserver
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  // ============================================================
  // ACTIVE NAV LINK TRACKING (scroll-based)
  // ============================================================
  var sectionIds = ['home', 'creations', 'about', 'contact'];
  var sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var navLinks = document.querySelectorAll('.navbar__link');

  function updateActiveLink() {
    var scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('navbar__link--active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('navbar__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();


  // ============================================================
  // LIGHTBOX — Image Preview on Card Click
  // ============================================================
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxBackdrop = document.getElementById('lightbox-backdrop');

  function openLightbox(src, alt) {
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxImg.src = src;
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImg.src = '';
  }

  document.querySelectorAll('.gallery__item .card').forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      var img = card.querySelector('.card__image');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });


  // ============================================================
  // GALLERY — Show More Pagination (9 items per page)
  // ============================================================
  var ITEMS_PER_PAGE = 9;
  var galleryItems = document.querySelectorAll('.gallery__item');
  var showMoreBtn = document.getElementById('show-more-btn');
  var visibleCount = 0;

  function showNextBatch() {
    var end = Math.min(visibleCount + ITEMS_PER_PAGE, galleryItems.length);
    for (var i = visibleCount; i < end; i++) {
      galleryItems[i].classList.remove('is-hidden');
    }
    visibleCount = end;
    if (visibleCount >= galleryItems.length && showMoreBtn) {
      showMoreBtn.classList.add('is-hidden');
    }
  }

  if (galleryItems.length > 0) {
    galleryItems.forEach(function (item) {
      item.classList.add('is-hidden');
    });
    showNextBatch();
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', showNextBatch);
  }

})();
