document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  /* --- Mobile Navigation Toggle --- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Header Scroll Effect --- */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* --- FAQ Accordion --- */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', function() {
          const isActive = item.classList.contains('active');
          faqItems.forEach(function(el) { el.classList.remove('active'); });
          if (!isActive) { item.classList.add('active'); }
        });
      }
    });
  }

  /* --- Project Gallery Filtering --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(function(card) {
          const category = card.getAttribute('data-category');
          card.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
        });
      });
    });
  }

  /* --- Scroll Animation --- */
  const animateElements = document.querySelectorAll('.animate-in');
  if (animateElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animateElements.forEach(function(el) { observer.observe(el); });
  } else {
    animateElements.forEach(function(el) { el.classList.add('visible'); });
  }

  /* --- Counter Animation --- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000;
          const start = performance.now();

          function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            counter.textContent = current + suffix;
            if (progress < 1) { requestAnimationFrame(update); }
            else { counter.textContent = target + suffix; }
          }
          requestAnimationFrame(update);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { counterObserver.observe(c); });
  }

  /* --- Services Carousel --- */
  const track = document.getElementById('servicesCarousel');
  if (track) {
    const container = track.closest('.carousel-container');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const dotsContainer = container.querySelector('.carousel-dots');
    const cards = Array.from(track.children);
    let currentIndex = 0;

    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateCarousel() {
      const perView = getCardsPerView();
      const maxIndex = Math.max(0, cards.length - perView);
      currentIndex = Math.min(currentIndex, maxIndex);
      const offset = -(currentIndex * (100 / perView));
      track.style.transform = 'translateX(' + offset + '%)';

      // Update dots
      dotsContainer.querySelectorAll('.carousel-dot').forEach(function(dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });

      // Buttons
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const perView = getCardsPerView();
      const totalDots = Math.max(1, cards.length - perView + 1);
      for (var i = 0; i < totalDots; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function(idx) {
          return function() {
            currentIndex = idx;
            updateCarousel();
          };
        }(i));
        dotsContainer.appendChild(dot);
      }
    }

    prevBtn.addEventListener('click', function() {
      if (currentIndex > 0) currentIndex--;
      updateCarousel();
    });

    nextBtn.addEventListener('click', function() {
      const perView = getCardsPerView();
      const maxIndex = Math.max(0, cards.length - perView);
      if (currentIndex < maxIndex) currentIndex++;
      updateCarousel();
    });

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    track.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextBtn.click();
        } else {
          prevBtn.click();
        }
      }
    }, { passive: true });

    // Keyboard support
    container.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') { prevBtn.click(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { nextBtn.click(); e.preventDefault(); }
    });
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Services carousel');

    // Init
    buildDots();
    updateCarousel();

    // Rebuild on resize (debounced)
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        buildDots();
        updateCarousel();
      }, 250);
    });

    // Auto-slide (slow)
    var autoSlideInterval;
    var autoSlideDelay = 5000; // 5 seconds

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(function() {
        var perView = getCardsPerView();
        var maxIndex = Math.max(0, cards.length - perView);
        if (currentIndex >= maxIndex) {
          currentIndex = 0;
        } else {
          currentIndex++;
        }
        updateCarousel();
      }, autoSlideDelay);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Pause on interaction, resume after leaving
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    // Pause briefly after manual navigation
    function pauseAndResume() {
      stopAutoSlide();
      setTimeout(startAutoSlide, autoSlideDelay);
    }

    prevBtn.addEventListener('click', pauseAndResume);
    nextBtn.addEventListener('click', pauseAndResume);
    dotsContainer.addEventListener('click', function() {
      // dots already trigger via their own listener
      setTimeout(pauseAndResume, 0);
    });

    // Start auto-slide
    startAutoSlide();
  }
  /* --- Contact Form Handling --- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(function() {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#2D6A4F';
        submitBtn.style.borderColor = '#2D6A4F';

        setTimeout(function() {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }
});