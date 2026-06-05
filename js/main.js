/* =================================================================
   Chef Donovan Smith — Shared JavaScript
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll-triggered fade-up ──────────────────────────────────
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '-60px' });

  document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));

  // ── Mobile menu ───────────────────────────────────────────────
  const backdrop = document.getElementById('mobile-backdrop');
  const panel    = document.getElementById('mobile-panel');
  const openBtn  = document.getElementById('hamburger-btn');
  const closeBtn = document.getElementById('close-menu-btn');

  function openMenu() {
    backdrop?.classList.add('open');
    panel?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    backdrop?.classList.remove('open');
    panel?.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));

  // ── Menu page: sticky tab highlighting ───────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn[data-section]');
  if (tabBtns.length) {
    const tabObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    document.querySelectorAll('.menu-section').forEach(sec => tabObs.observe(sec));

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.section)?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ── Testimonial carousel ─────────────────────────────────────
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots   = carousel.querySelectorAll('.testimonial-dot');
    let current  = 0;
    let timer;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function startTimer() {
      timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
    }

    // Initialise
    goTo(0);
    startTimer();

    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      goTo(i);
      clearInterval(timer);
      startTimer();
    }));
  }

  // ── Experience accordion ──────────────────────────────────────
  const accordionItems = document.querySelectorAll('.exp-accordion-item');
  if (accordionItems.length) {
    accordionItems.forEach(item => {
      const header = item.querySelector('.exp-accordion-header');
      const body   = item.querySelector('.exp-accordion-body');
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        accordionItems.forEach(i => {
          i.classList.remove('open');
          i.querySelector('.exp-accordion-body').style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
          setTimeout(() => {
            const top = header.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          }, 60);
        }
      });
    });
  }

  // ── Lightbox ──────────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg  = lightbox.querySelector('.lb-img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const open = src => { lbImg.src = src; lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const close = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => open(el.dataset.lightbox || el.src || el.querySelector('img')?.src));
    });
    lbClose.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // ── Reservation form ──────────────────────────────────────────
  const form = document.getElementById('inquiry-form');
  if (form) {
    const todayStr = new Date().toISOString().split('T')[0];
    const dateInput = form.querySelector('[name="date"]');
    if (dateInput) dateInput.min = todayStr;

    function showError(name, msg) {
      const el = form.querySelector(`[data-error="${name}"]`);
      if (el) { el.textContent = msg; el.classList.add('visible'); }
    }
    function clearError(name) {
      const el = form.querySelector(`[data-error="${name}"]`);
      if (el) { el.textContent = ''; el.classList.remove('visible'); }
    }
    function clearAllErrors() {
      form.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; el.classList.remove('visible'); });
    }

    // clear on input
    form.querySelectorAll('.form-input').forEach(inp => {
      inp.addEventListener('input', () => clearError(inp.name));
    });

    function validate() {
      clearAllErrors();
      let valid = true;
      const v = (n) => form.querySelector(`[name="${n}"]`)?.value?.trim() || '';

      if (!v('fullName'))  { showError('fullName', 'Full name is required.'); valid = false; }
      if (!v('email'))     { showError('email', 'Email address is required.'); valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) { showError('email', 'Please enter a valid email address.'); valid = false; }
      if (!v('phone'))     { showError('phone', 'Phone number is required.'); valid = false; }
      if (!v('guests'))    { showError('guests', 'Please select a guest count.'); valid = false; }
      if (!v('date'))      { showError('date', 'Preferred date is required.'); valid = false; }
      else if (v('date') < todayStr) { showError('date', 'Please select a future date.'); valid = false; }
      if (!v('location'))  { showError('location', 'Island / location is required.'); valid = false; }
      return valid;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) return;

      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const data = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Server error');
        submitBtn.textContent = '✓ Thank You — We\'ll Be In Touch';
        submitBtn.style.background = 'transparent';
        submitBtn.style.color = 'rgba(239,231,210,0.5)';
        submitBtn.style.border = 'none';
        form.querySelectorAll('.form-input').forEach(inp => inp.disabled = true);
      } catch {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Something Went Wrong — Please Try Again';
        submitBtn.className = 'btn-full btn-error';
      }
    });
  }

});
