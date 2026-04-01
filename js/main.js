/**
 * MegaHUD Landing Page - Main JavaScript
 * Handles: scroll animations, mobile menu, navbar scroll state, smooth scrolling
 */

(function () {
  'use strict';

  // --- DOM References ---
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const fadeElements = document.querySelectorAll('.fade-in');
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');

  // --- Scroll State for Navbar ---
  function updateNavState() {
    if (window.scrollY > 20) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  // --- Mobile Menu Toggle ---
  function toggleMobileMenu() {
    const isActive = mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Intersection Observer for Fade-In Animations ---
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: make everything visible immediately
      fadeElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = nav.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Close mobile menu if open
        closeMobileMenu();
      });
    });
  }

  // --- Stagger Fade-In for Grid Items ---
  function initStaggeredAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var grids = document.querySelectorAll('.features__grid, .pricing__grid');

    grids.forEach(function (grid) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var children = entry.target.querySelectorAll('.fade-in');
              children.forEach(function (child, index) {
                setTimeout(function () {
                  child.classList.add('visible');
                }, index * 80);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px -20px 0px',
        }
      );

      observer.observe(grid);
    });
  }

  // --- Event Listeners ---
  window.addEventListener('scroll', updateNavState, { passive: true });

  hamburger.addEventListener('click', toggleMobileMenu);

  mobileMenuLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // --- Init ---
  updateNavState();
  initSmoothScroll();
  initScrollAnimations();
  initStaggeredAnimations();
})();
