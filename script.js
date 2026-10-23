/**
 * Rizqi Muchamad Anafis (Ikky) - Skrip Portofolio
 * Menangani interaksi UI, tema gelap/terang, filter keahlian, animasi angka, modal rincian proyek, dan formulir kontak.
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
   1. Pengalih Tema (Gelap / Terang)
   ========================================================= */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const html = document.documentElement;
  
  // Cek tema tersimpan di localStorage atau preferensi sistem operasi
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
      showToast(`Beralih ke mode ${newTheme === 'dark' ? 'gelap' : 'terang'}`);
    });
  }
}

/* =========================================================
   2. Navigasi Mobile (Hamburger Menu)
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
   3. Efek Gulir Header
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
   4. Penanda Menu Aktif saat Halaman Digulir
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
   5. Filter Kategori Keahlian Teknis
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
   6. Animasi Angka Statistik saat Terlihat
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
      // Kurva perlambatan halus (easeOutQuad)
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
   7. Modal Rincian Proyek (Bahasa Indonesia)
   ========================================================= */
const PROJECT_DETAILS = {
  padi: {
    title: 'PADI: Sistem Pelaporan Infrastruktur Daerah',
    category: 'Layanan Publik / Smart City',
    description: 'PADI adalah platform manajemen pengaduan masyarakat secara langsung kepada dinas infrastruktur pemerintah daerah. Dirancang untuk memproses laporan kerusakan jalan dan fasilitas umum lengkap dengan koordinat geolokasi presisi, unggahan media verifikasi, dan alur disposisi dinas otomatis.',
    highlights: [
      'Peta interaktif berbasis Mapbox GL dengan kemampuan clustering titik laporan',
      'Kalkulasi SLA penanganan otomatis dan dispatch langsung ke petugas lapangan',
      'Riwayat audit laporan publik yang transparan dan dapat dipantau pelapor',
      'Optimasi database PostgreSQL dengan ekstensi spasial PostGIS'
    ],
    tech: ['Next.js 14', 'Node.js', 'PostgreSQL', 'Mapbox GL', 'Docker', 'TailwindCSS'],
    repo: 'https://github.com/ikkymchmddev'
  },
  webclip: {
    title: 'WebClip: Peringkas & Kliping Konten Cerdas Berbasis AI',
    category: 'AI & Alat Produktivitas Developer',
    description: 'WebClip adalah sistem ekstraksi dan sintesis artikel berbasis kecerdasan buatan. Membersihkan format halaman web dari iklan atau elemen yang mengganggu, lalu memanfaatkan model LLM mutakhir untuk menyajikan poin-poin intisari, ringkasan eksekutif, dan sinkronisasi ke catatan digital.',
    highlights: [
      'Proses ekstraksi teks dan format Markdown bersih dalam waktu di bawah 2 detik',
      'Prompt LLM yang dapat dikonfigurasi dengan dukungan streaming respons',
      'Penyimpanan lokal di browser dengan opsi enkripsi data pengguna',
      'Desain antarmuka minimalis dengan dukungan navigasi cepat keyboard'
    ],
    tech: ['TypeScript', 'FastAPI', 'Python', 'Gemini API', 'IndexedDB'],
    repo: 'https://github.com/ikkymchmddev'
  },
  accelerator: {
    title: 'AI Accelerator Integration Hub',
    category: 'Produksi Backend & Arsitektur Cloud',
    description: 'Middleware backend berperforma tinggi untuk mengorkestrasi inferensi kecerdasan buatan di berbagai penyedia model LLM. Dilengkapi sistem multi-tenant token billing, peralihan otomatis jika terjadi gangguan penyedia (failover routing), dan caching respons dengan Redis.',
    highlights: [
      'Memangkas rata-rata waktu respons API hingga 45% berkat sistem caching agresif',
      'Peralihan otomatis tanpa downtime saat salah satu penyedia AI mengalami kendala',
      'Telemetri mendalam dengan pemantauan metrik latensi per permintaan (Prometheus)',
      'Arsitektur microservices berbasis kontainer Docker dengan skalabilitas elastis'
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
        
        <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">Sorotan Arsitektur & Fitur Utama:</h4>
        <ul style="list-style: disc; margin-left: 20px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.6;">
          ${data.highlights.map(h => `<li style="margin-bottom: 6px;">${h}</li>`).join('')}
        </ul>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
          ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 12px;">
          <a href="${data.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <span>Lihat Repositori di GitHub</span>
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
   8. Validasi & Pengiriman Formulir Kontak
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

    // Validasi Nama
    if (!nameInput.value.trim()) {
      setError(nameInput, true);
      isValid = false;
    } else {
      setError(nameInput, false);
    }

    // Validasi Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      setError(emailInput, true);
      isValid = false;
    } else {
      setError(emailInput, false);
    }

    // Validasi Subjek
    if (!subjectInput.value.trim()) {
      setError(subjectInput, true);
      isValid = false;
    } else {
      setError(subjectInput, false);
    }

    // Validasi Pesan
    if (messageInput.value.trim().length < 10) {
      setError(messageInput, true);
      isValid = false;
    } else {
      setError(messageInput, false);
    }

    if (!isValid) return;

    // Simulasi status pengiriman
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mengirim Pesan...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Terima kasih! Pesan Anda telah berhasil dikirim.', 'success');
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
   9. Fitur Salin Email ke Clipboard
   ========================================================= */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const emailToCopy = 'contact.ikkydev@gmail.com';

  copyBtn.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast('Alamat email berhasil disalin ke papan klip!');
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
    showToast('Alamat email berhasil disalin ke papan klip!');
  }
}

/* =========================================================
   10. Tombol Kembali ke Atas
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
   Bantuan Notifikasi Toast
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
