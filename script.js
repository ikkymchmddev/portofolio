/**
 * Rizqi Muchamad Anafis (Ikky) - Portfolio Scripts
 * Handles UI interactions, themes, filters, animations, and modal details.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initHeaderScroll();
  initActiveNav();
  initSkillFilters();
  initStatCounters();
  initProjectModals();
  initContactForm();
  initCopyEmail();
  initBackToTop();
});

/* =========================================================
   1. Theme Toggle (Dark / Light)
   ========================================================= */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const html = document.documentElement;
  
  // Check persisted or system theme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  html.setAttribute('data-theme', currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const activeTheme = html.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* =========================================================
   2. Mobile Navigation
   ========================================================= */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* =========================================================
   3. Header Scroll Effect
   ========================================================= */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* =========================================================
   4. Active Navigation on Scroll
   ========================================================= */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(sec => observer.observe(sec));
}

/* =========================================================
   5. Skill Filtering
   ========================================================= */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('#skill-filters .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* =========================================================
   6. Stat Counters Animation
   ========================================================= */
function initStatCounters() {
  const statsSection = document.getElementById('stats-grid');
  const counters = document.querySelectorAll('.stat-number');
  if (!statsSection || counters.length === 0) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          animateValue(counter, 0, target, 1500);
        });
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);

  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      element.innerText = Math.floor(easedProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = end;
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* =========================================================
   7. Project Modals & Details
   ========================================================= */
const PROJECT_DETAILS = {
  padi: {
    title: 'PADI: Regional Infrastructure Reporting System',
    category: 'Enterprise / Municipal Infrastructure',
    description: 'PADI is a comprehensive civic incident management platform connecting citizens directly with public works authorities. Built to process geolocated hazard reports with real-time triage, image verification, and automated municipal routing.',
    highlights: [
      'Interactive mapping with geo-clustering using Mapbox GL',
      'Automated SLA calculation and public works team dispatch',
      'End-to-end audit trails for public accountability',
      'PostgreSQL database optimized with spatial PostGIS queries'
    ],
    tech: ['Next.js 14', 'Node.js', 'PostgreSQL', 'Mapbox GL', 'Docker', 'TailwindCSS'],
    repo: 'https://github.com/ikkymchmddev'
  },
  webclip: {
    title: 'WebClip: Intelligent Content Clipper & Summarizer',
    category: 'AI Tooling & Developer Productivity',
    description: 'WebClip is an automated knowledge extraction system. It strips boilerplate DOM trees from web articles and uses LLM models to extract bullet summaries, key takeaways, and action items, synchronizing to markdown notes instantly.',
    highlights: [
      'Sub-2-second article extraction and markdown formatting',
      'Configurable LLM prompts with token streaming support',
      'Client-side storage with encrypted sync options',
      'Clean keyboard-first user interface'
    ],
    tech: ['TypeScript', 'FastAPI', 'Python', 'Gemini API', 'IndexedDB'],
    repo: 'https://github.com/ikkymchmddev'
  },
  accelerator: {
    title: 'AI Accelerator Integration Hub',
    category: 'Production Backend & Cloud Architecture',
    description: 'A high-throughput API gateway designed to orchestrate AI inference across heterogeneous LLM endpoints. Features robust multi-tenant token billing, fallback routing, and distributed Redis response caching.',
    highlights: [
      'Reduced average endpoint latency by 45% via aggressive caching',
      'Automatic failover switching during provider outages',
      'Detailed telemetry dashboards with per-request latency tracking',
      'Containerized deployment with zero-downtime updates'
    ],
    tech: ['Node.js', 'Express', 'Redis', 'Docker', 'Prometheus', 'Jest'],
    repo: 'https://github.com/ikkymchmddev'
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const detailButtons = document.querySelectorAll('.project-details-btn');

  if (!modalBackdrop || !modalContent) return;

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      const data = PROJECT_DETAILS[projectKey];
      if (!data) return;

      modalContent.innerHTML = `
        <span class="project-badge" style="margin-bottom: 12px; display: inline-block;">${data.category}</span>
        <h3 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 16px; color: var(--text-primary);">${data.title}</h3>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">${data.description}</p>
        
        <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">Key Architectural Highlights:</h4>
        <ul style="list-style: disc; margin-left: 20px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.6;">
          ${data.highlights.map(h => `<li style="margin-bottom: 6px;">${h}</li>`).join('')}
        </ul>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
          ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 12px;">
          <a href="${data.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <span>Explore on GitHub</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      `;

      modalBackdrop.classList.add('open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* =========================================================
   8. Contact Form Handling
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');
  const submitBtn = document.getElementById('form-submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, true);
      isValid = false;
    } else {
      setError(nameInput, false);
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      setError(emailInput, true);
      isValid = false;
    } else {
      setError(emailInput, false);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setError(subjectInput, true);
      isValid = false;
    } else {
      setError(subjectInput, false);
    }

    // Validate Message
    if (messageInput.value.trim().length < 10) {
      setError(messageInput, true);
      isValid = false;
    } else {
      setError(messageInput, false);
    }

    if (!isValid) return;

    // Simulate sending state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Thank you! Your message has been sent successfully.', 'success');
    }, 1000);
  });

  function setError(inputElement, hasError) {
    const parent = inputElement.closest('.form-group');
    if (!parent) return;
    if (hasError) {
      parent.classList.add('has-error');
    } else {
      parent.classList.remove('has-error');
    }
  }
}

/* =========================================================
   9. Copy Email Functionality
   ========================================================= */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const emailToCopy = 'contact.ikkydev@gmail.com';

  copyBtn.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        fallbackCopy(emailToCopy);
      });
    } else {
      fallbackCopy(emailToCopy);
    }
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Email address copied to clipboard!');
  }
}

/* =========================================================
   10. Back to Top Button
   ========================================================= */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top-btn');
  if (!topBtn) return;

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* =========================================================
   Toast Notification Helper
   ========================================================= */
function showToast(message, type = 'normal') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
