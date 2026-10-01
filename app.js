/**
 * Buku Panduan PMT Balita Gizi Kurang - Flipbook Application
 * Features: StPageFlip 3D physics, Sound synthesis, Responsive spread,
 * Right Drawer TOC, Visual Thumbnails, Zoom HD, and Google Form integration.
 */

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
// Google Form URL provided by user
const CLEAN_GFORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfOfoPuaTh7JMjJ1oFSze31kfmUiqKKR8ETR2IQn9tKEXeLnw/viewform';

const urlParams = new URLSearchParams(window.location.search);
const queryGForm = urlParams.get('form') || urlParams.get('gform');
let GOOGLE_FORM_URL = queryGForm || CLEAN_GFORM_URL;

const AppState = {
  pageFlip: null,
  currentPage: 0,
  totalPages: 26,
  soundEnabled: true,
  autoPlayInterval: null,
  zoomScale: 1.0,
  zoomPos: { x: 0, y: 0 },
  isPanning: false,
  startPan: { x: 0, y: 0 },
  themeIndex: 0,
  themes: ['theme-light', 'theme-dark', 'theme-warm']
};

const PAGE_METAS = [
  { index: 0,  title: 'Sampul Depan (Cover)',         sub: 'Panduan Praktis PMT Balita Gizi Kurang',           img: 'assets/pages/page_1.webp' },
  { index: 1,  title: 'Pengantar Program Gizi',        sub: 'Latar Belakang & Pendampingan Balita',             img: 'assets/pages/page_2.webp' },
  { index: 2,  title: 'Apa Itu Gizi Kurang?',          sub: 'Definisi, Ciri-ciri & Pemantauan',                img: 'assets/pages/page_3.webp' },
  { index: 3,  title: 'Prinsip Makanan Tambahan',      sub: 'Pertumbuhan & Pemulihan Status Gizi',              img: 'assets/pages/page_4.webp' },
  { index: 4,  title: 'Variasi Bahan Makanan',         sub: 'Energi, Hewani, Nabati, Sayur & Buah',            img: 'assets/pages/page_5.webp' },
  { index: 5,  title: 'Pemberian Makan Responsif',     sub: 'Kasih Sayang & Kesabaran Memberi Makan',          img: 'assets/pages/page_6.webp' },
  { index: 6,  title: 'Tips Pemilihan Bahan Makanan',  sub: 'Memilih Pangan Lokal Segar & Berkualitas',         img: 'assets/pages/page_7.webp' },
  { index: 7,  title: 'Panduan Angka Kecukupan Gizi',  sub: 'AKG Balita Sehari (Energi & Protein)',             img: 'assets/pages/page_8.webp' },
  { index: 8,  title: 'Kebutuhan Makanan Sehari',      sub: 'Porsi Makanan Utama & Selingan Seimbang',          img: 'assets/pages/page_9.webp' },
  { index: 9,  title: 'Lengkapi Makanan Balita (1)',   sub: 'Variasi Menu Pagi & Siang',                        img: 'assets/pages/page_10.webp' },
  { index: 10, title: 'Lengkapi Makanan Balita (2)',   sub: 'Variasi Menu Makan Malam',                         img: 'assets/pages/page_11.webp' },
  { index: 11, title: 'Lengkapi Makanan Balita (3)',   sub: 'Kudapan Bergizi untuk Balita',                     img: 'assets/pages/page_12.webp' },
  { index: 12, title: 'Ukuran Porsi Bahan Pangan',     sub: 'Panduan Takaran Bahan Pangan Lokal',              img: 'assets/pages/page_13.webp' },
  { index: 13, title: 'Menu Balita 6-11 Bulan (1)',    sub: 'Resep MP-ASI Pangan Lokal',                       img: 'assets/pages/page_14.webp' },
  { index: 14, title: 'Menu Balita 6-11 Bulan (2)',    sub: 'Variasi Bubur & Puree Padat Gizi',                 img: 'assets/pages/page_15.webp' },
  { index: 15, title: 'Menu Balita 6-11 Bulan (3)',    sub: 'Menu Spesial Kaya Protein Hewani',                 img: 'assets/pages/page_16.webp' },
  { index: 16, title: 'Menu Balita 12-23 Bulan (1)',   sub: 'Nasi Tim & Lauk Pauk Bergizi',                    img: 'assets/pages/page_17.webp' },
  { index: 17, title: 'Menu Balita 12-23 Bulan (2)',   sub: 'Olahan Ikan, Telur & Sayur Hijau',                img: 'assets/pages/page_18.webp' },
  { index: 18, title: 'Menu Balita 24-59 Bulan (1)',   sub: 'Menu Makanan Keluarga Padat Gizi',                img: 'assets/pages/page_19.webp' },
  { index: 19, title: 'Menu Balita 24-59 Bulan (2)',   sub: 'Selingan Sehat Kaya Vitamin',                      img: 'assets/pages/page_20.webp' },
  { index: 20, title: 'Pemantauan ke Posyandu',        sub: 'Penimbangan Rutin Setiap Bulan',                   img: 'assets/pages/page_21.webp' },
  { index: 21, title: 'Peran Ibu, Kader & Petugas',    sub: 'Kolaborasi Bersama Cegah Stunting',                img: 'assets/pages/page_22.webp' },
  { index: 22, title: 'Monitoring & Evaluasi (G-Form)',sub: 'Mohon 5 Menit Mengisi Form Evaluasi',              img: 'assets/pages/page_23.webp' },
  { index: 23, title: 'Catatan Penutup & Harapan',     sub: 'Pesan Kasih Sayang Tumbuh Kembang',               img: 'assets/pages/page_24.webp' },
  { index: 24, title: 'Daftar Pustaka',                sub: 'Referensi Ilmiah & Panduan Kemenkes',              img: 'assets/pages/page_25.webp' },
  { index: 25, title: 'Sampul Belakang',               sub: 'Mahasiswa S1 Gizi UNESA',                         img: 'assets/pages/page_26.webp' }
];

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const DOM = {
  loader: document.getElementById('loader'),
  bookViewport: document.getElementById('bookViewport'),
  bookStage: document.getElementById('bookStage'),
  flipbookEl: document.getElementById('flipbook'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  bottomPrevBtn: document.getElementById('bottomPrevBtn'),
  bottomNextBtn: document.getElementById('bottomNextBtn'),
  pageDisplay: document.getElementById('pageDisplay'),
  spreadDisplay: document.getElementById('spreadDisplay'),
  pageSlider: document.getElementById('pageSlider'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  soundIcon: document.getElementById('soundIcon'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  fullscreenBtn: document.getElementById('fullscreenBtn'),
  fullscreenIcon: document.getElementById('fullscreenIcon'),
  tocToggleBtn: document.getElementById('tocToggleBtn'),
  tocDrawer: document.getElementById('tocDrawer'),
  closeTocBtn: document.getElementById('closeTocBtn'),
  thumbToggleBtn: document.getElementById('thumbToggleBtn'),
  thumbDrawer: document.getElementById('thumbDrawer'),
  closeThumbBtn: document.getElementById('closeThumbBtn'),
  backdrop: document.getElementById('backdrop'),
  autoPlayBtn: document.getElementById('autoPlayBtn'),
  autoPlayIcon: document.getElementById('autoPlayIcon'),
  zoomModalBtn: document.getElementById('zoomModalBtn'),
  zoomModal: document.getElementById('zoomModal'),
  closeZoomBtn: document.getElementById('closeZoomBtn'),
  floatingCloseZoomBtn: document.getElementById('floatingCloseZoomBtn'),
  footerCloseZoomBtn: document.getElementById('footerCloseZoomBtn'),
  zoomViewport: document.getElementById('zoomViewport'),
  zoomImg: document.getElementById('zoomImg'),
  zoomPageTitle: document.getElementById('zoomPageTitle'),
  zoomInBtn: document.getElementById('zoomInBtn'),
  zoomOutBtn: document.getElementById('zoomOutBtn'),
  zoomResetBtn: document.getElementById('zoomResetBtn'),
  zoomLevelText: document.getElementById('zoomLevelText'),
  shareBtn: document.getElementById('shareBtn'),
  shareModal: document.getElementById('shareModal'),
  closeShareBtn: document.getElementById('closeShareBtn'),
  shareUrlInput: document.getElementById('shareUrlInput'),
  copyShareBtn: document.getElementById('copyShareBtn'),
  copyText: document.getElementById('copyText'),
  copyIcon: document.getElementById('copyIcon'),
  waShareBtn: document.getElementById('waShareBtn'),
  telegramShareBtn: document.getElementById('telegramShareBtn'),
  // GForm Links
  navGformBtn: document.getElementById('navGformBtn'),
  drawerGformBtn: document.getElementById('drawerGformBtn'),
  pageGformBtn: document.getElementById('pageGformBtn'),
  tocItems: document.querySelectorAll('.toc-item'),
  thumbCards: document.querySelectorAll('.thumb-card')
};

// ==========================================
// 3. SYNTHESIZED PAPER FLIP AUDIO (Web Audio API)
// ==========================================
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playPaperFlipSound() {
  if (!AppState.soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.18; // 180ms duration
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate textured white noise burst mimicking paper sliding
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter to sculpt rustle sound
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.18);
    filter.Q.value = 1.6;

    // Gain envelope
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(now);
    noise.stop(now + 0.18);
  } catch (e) {
    console.warn('Audio playback silent fallback', e);
  }
}

// ==========================================
// 4. GOOGLE FORM URL SYNC
// ==========================================
function updateGFormLinks() {
  const gformUrl = GOOGLE_FORM_URL;
  if (DOM.navGformBtn) DOM.navGformBtn.href = gformUrl;
  if (DOM.drawerGformBtn) DOM.drawerGformBtn.href = gformUrl;
  const pGform = document.getElementById('pageGformBtn');
  if (pGform) pGform.href = gformUrl;
}

// ==========================================
// 5. STPAGEFLIP INITIALIZATION & SIZING
// ==========================================
function calculateBookDimensions() {
  const isMobile = window.innerWidth <= 768;
  const availWidth = DOM.bookViewport.clientWidth - (isMobile ? 24 : 80);
  const availHeight = DOM.bookViewport.clientHeight - (isMobile ? 16 : 40);

  // Aspect ratio of the booklet page (~1:1.414, A4/B5 format)
  const pageAspect = 1.414;

  if (isMobile) {
    // Single page mode on mobile portrait
    let pageW = availWidth;
    let pageH = pageW * pageAspect;

    if (pageH > availHeight) {
      pageH = availHeight;
      pageW = pageH / pageAspect;
    }

    return {
      width: Math.round(pageW),
      height: Math.round(pageH),
      mode: 'portrait'
    };
  } else {
    // 2 pages side-by-side: total width = 2 * pageW
    const maxSingleW = availWidth / 2;
    let singleW = maxSingleW;
    let singleH = singleW * pageAspect;

    if (singleH > availHeight) {
      singleH = availHeight;
      singleW = singleH / pageAspect;
    }

    return {
      width: Math.round(singleW),
      height: Math.round(singleH),
      mode: 'landscape'
    };
  }
}

function initFlipbook() {
  try {
    const dims = calculateBookDimensions();

    AppState.pageFlip = new St.PageFlip(DOM.flipbookEl, {
      width: dims.width,
      height: dims.height,
      size: 'fixed',
      minWidth: 260,
      maxWidth: 900,
      minHeight: 380,
      maxHeight: 1200,
      drawShadow: true,
      flippingTime: 700,
      usePortrait: true,
      startPage: 0,
      showCover: true,
      autoSize: true,
      maxShadowOpacity: 0.5,
      mobileScrollSupport: false
    });

    const pages = document.querySelectorAll('.page-sheet');
    AppState.totalPages = pages.length;
    DOM.pageSlider.max = AppState.totalPages - 1;

    AppState.pageFlip.loadFromHTML(pages);

    // Flipbook Event Listeners
    AppState.pageFlip.on('flip', (e) => {
      AppState.currentPage = e.data;
      updateUIState(AppState.currentPage);
      playPaperFlipSound();
    });

    AppState.pageFlip.on('changeState', (e) => {
      if (e.data === 'flipping') {
        initAudioContext();
      }
    });

    // Hide loader once ready
    setTimeout(() => {
      DOM.loader.classList.add('hidden');
      updateUIState(0);
    }, 450);

  } catch (err) {
    console.error('Failed to initialize PageFlip:', err);
    DOM.loader.innerHTML = '<p style="color:#ef4444;font-weight:600;">Gagal memuat flipbook. Silakan segarkan halaman.</p>';
  }
}

// ==========================================
// 6. UI UPDATES (Controls, Indicators, TOC)
// ==========================================
function updateUIState(pageIndex) {
  const total = AppState.totalPages;
  const isCover = pageIndex === 0;
  const isEnd = pageIndex >= total - 1;

  // Nav Arrows State
  DOM.prevBtn.disabled = isCover;
  DOM.bottomPrevBtn.disabled = isCover;
  DOM.nextBtn.disabled = isEnd;
  DOM.bottomNextBtn.disabled = isEnd;

  // Indicators & Slider
  DOM.pageDisplay.textContent = `Halaman ${pageIndex + 1} / ${total}`;
  DOM.pageSlider.value = pageIndex;

  const currentMeta = PAGE_METAS[pageIndex] || {};
  DOM.spreadDisplay.textContent = currentMeta.title || `Halaman ${pageIndex + 1}`;

  // Update TOC active state
  DOM.tocItems.forEach((item) => {
    const itemPage = parseInt(item.getAttribute('data-page'), 10);
    item.classList.toggle('active', itemPage === pageIndex);
  });

  // Update Thumbnail active state
  DOM.thumbCards.forEach((card) => {
    const cardPage = parseInt(card.getAttribute('data-page'), 10);
    card.classList.toggle('active', cardPage === pageIndex);
  });

  // Scroll active thumbnail into view inside drawer
  const activeCard = document.querySelector(`.thumb-card[data-page="${pageIndex}"]`);
  if (activeCard && DOM.thumbDrawer.classList.contains('open')) {
    activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Preload next image if near
  if (pageIndex + 1 < total) {
    const nextImg = new Image();
    nextImg.src = `assets/pages/page_${pageIndex + 2}.webp`;
  }
}

function turnToPage(index) {
  if (!AppState.pageFlip) return;
  const target = Math.max(0, Math.min(index, AppState.totalPages - 1));
  AppState.pageFlip.flip(target);
}

// ==========================================
// 7. DRAWERS (Table of Contents & Thumbnails)
// ==========================================
function openTocDrawer() {
  closeThumbDrawer();
  DOM.tocDrawer.classList.add('open');
  DOM.backdrop.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeTocDrawer() {
  DOM.tocDrawer.classList.remove('open');
  if (!DOM.thumbDrawer.classList.contains('open')) {
    DOM.backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

function openThumbDrawer() {
  closeTocDrawer();
  DOM.thumbDrawer.classList.add('open');
  DOM.backdrop.classList.add('visible');
  document.body.style.overflow = 'hidden';

  // Ensure active thumbnail is highlighted
  const activeCard = document.querySelector(`.thumb-card[data-page="${AppState.currentPage}"]`);
  if (activeCard) {
    setTimeout(() => {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }, 150);
  }
}

function closeThumbDrawer() {
  DOM.thumbDrawer.classList.remove('open');
  if (!DOM.tocDrawer.classList.contains('open')) {
    DOM.backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

function closeAllDrawers() {
  closeTocDrawer();
  closeThumbDrawer();
  closeShareModal();
  closeZoomModal();
}

// ==========================================
// 8. ZOOM HD MODAL LOGIC
// ==========================================
function openZoomModal() {
  const pageIdx = AppState.currentPage;
  const meta = PAGE_METAS[pageIdx];
  const pageTitle = meta ? meta.title : `Halaman ${pageIdx + 1}`;
  
  DOM.zoomImg.src = `assets/pages/page_${pageIdx + 1}.webp`;
  DOM.zoomPageTitle.innerHTML = `<span class="zoom-title-badge">Hal ${pageIdx + 1}</span> <span class="zoom-title-text">${pageTitle}</span>`;

  AppState.zoomScale = 1.0;
  AppState.zoomPos = { x: 0, y: 0 };
  applyZoomTransform();

  DOM.zoomModal.classList.add('open');
  lucide.createIcons();
}

function closeZoomModal() {
  DOM.zoomModal.classList.remove('open');
}

function setZoomScale(scale) {
  AppState.zoomScale = Math.max(0.8, Math.min(scale, 3.5));
  DOM.zoomLevelText.textContent = `${Math.round(AppState.zoomScale * 100)}%`;
  applyZoomTransform();
}

function applyZoomTransform() {
  DOM.zoomImg.style.transform = `translate(${AppState.zoomPos.x}px, ${AppState.zoomPos.y}px) scale(${AppState.zoomScale})`;
}

// Pan handling inside Zoom Viewport
DOM.zoomViewport.addEventListener('mousedown', (e) => {
  if (AppState.zoomScale <= 1.0) return;
  AppState.isPanning = true;
  AppState.startPan = { x: e.clientX - AppState.zoomPos.x, y: e.clientY - AppState.zoomPos.y };
});

window.addEventListener('mousemove', (e) => {
  if (!AppState.isPanning) return;
  AppState.zoomPos = {
    x: e.clientX - AppState.startPan.x,
    y: e.clientY - AppState.startPan.y
  };
  applyZoomTransform();
});

window.addEventListener('mouseup', () => {
  AppState.isPanning = false;
});

// Touch Pan
DOM.zoomViewport.addEventListener('touchstart', (e) => {
  if (AppState.zoomScale <= 1.0 || e.touches.length !== 1) return;
  AppState.isPanning = true;
  AppState.startPan = {
    x: e.touches[0].clientX - AppState.zoomPos.x,
    y: e.touches[0].clientY - AppState.zoomPos.y
  };
}, { passive: true });

DOM.zoomViewport.addEventListener('touchmove', (e) => {
  if (!AppState.isPanning || e.touches.length !== 1) return;
  AppState.zoomPos = {
    x: e.touches[0].clientX - AppState.startPan.x,
    y: e.touches[0].clientY - AppState.startPan.y
  };
  applyZoomTransform();
}, { passive: true });

DOM.zoomViewport.addEventListener('touchend', () => {
  AppState.isPanning = false;
});

// ==========================================
// 9. SHARE MODAL LOGIC
// ==========================================
function openShareModal() {
  const currentUrl = window.location.href.split('#')[0];
  DOM.shareUrlInput.value = currentUrl;

  const shareText = encodeURIComponent(`Buku Panduan Praktis PMT Pangan Lokal Balita Gizi Kurang - Puskesmas Wonokromo:\n${currentUrl}`);
  DOM.waShareBtn.href = `https://api.whatsapp.com/send?text=${shareText}`;
  DOM.telegramShareBtn.href = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('Panduan Praktis Balita Gizi Kurang')}`;

  DOM.shareModal.classList.add('open');
}

function closeShareModal() {
  DOM.shareModal.classList.remove('open');
}

// ==========================================
// 10. AUTO-PLAY FEATURE
// ==========================================
function toggleAutoPlay() {
  if (AppState.autoPlayInterval) {
    clearInterval(AppState.autoPlayInterval);
    AppState.autoPlayInterval = null;
    DOM.autoPlayBtn.classList.remove('active');
    DOM.autoPlayIcon.setAttribute('data-lucide', 'play');
  } else {
    DOM.autoPlayBtn.classList.add('active');
    DOM.autoPlayIcon.setAttribute('data-lucide', 'pause');
    AppState.autoPlayInterval = setInterval(() => {
      if (AppState.currentPage >= AppState.totalPages - 1) {
        toggleAutoPlay(); // Stop when reaching end
        return;
      }
      initAudioContext();
      AppState.pageFlip.flipNext();
    }, 4500);
  }
  lucide.createIcons();
}

// ==========================================
// 11. AMBIENT THEMES & FULLSCREEN
// ==========================================
function cycleTheme() {
  const currentTheme = AppState.themes[AppState.themeIndex];
  AppState.themeIndex = (AppState.themeIndex + 1) % AppState.themes.length;
  const newTheme = AppState.themes[AppState.themeIndex];

  document.body.classList.remove(currentTheme);
  document.body.classList.add(newTheme);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn('Fullscreen request blocked:', err);
    });
    DOM.fullscreenIcon.setAttribute('data-lucide', 'minimize');
  } else {
    document.exitFullscreen().catch((err) => console.warn(err));
    DOM.fullscreenIcon.setAttribute('data-lucide', 'maximize');
  }
  lucide.createIcons();
}

// ==========================================
// 12. EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
  // Navigation Arrows
  DOM.prevBtn.addEventListener('click', () => {
    initAudioContext();
    AppState.pageFlip.flipPrev();
  });

  DOM.nextBtn.addEventListener('click', () => {
    initAudioContext();
    AppState.pageFlip.flipNext();
  });

  DOM.bottomPrevBtn.addEventListener('click', () => {
    initAudioContext();
    AppState.pageFlip.flipPrev();
  });

  DOM.bottomNextBtn.addEventListener('click', () => {
    initAudioContext();
    AppState.pageFlip.flipNext();
  });

  // Slider Scrubber
  DOM.pageSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    turnToPage(val);
  });

  // Sound Toggle
  DOM.soundToggleBtn.addEventListener('click', () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    DOM.soundToggleBtn.classList.toggle('active', AppState.soundEnabled);
    DOM.soundIcon.setAttribute('data-lucide', AppState.soundEnabled ? 'volume-2' : 'volume-x');
    lucide.createIcons();
    if (AppState.soundEnabled) playPaperFlipSound();
  });

  // Ambient Theme
  DOM.themeToggleBtn.addEventListener('click', cycleTheme);

  // Fullscreen
  DOM.fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Drawers
  DOM.tocToggleBtn.addEventListener('click', () => {
    if (DOM.tocDrawer.classList.contains('open')) {
      closeTocDrawer();
    } else {
      openTocDrawer();
    }
  });

  DOM.closeTocBtn.addEventListener('click', closeTocDrawer);

  DOM.thumbToggleBtn.addEventListener('click', () => {
    if (DOM.thumbDrawer.classList.contains('open')) {
      closeThumbDrawer();
    } else {
      openThumbDrawer();
    }
  });

  DOM.closeThumbBtn.addEventListener('click', closeThumbDrawer);
  DOM.backdrop.addEventListener('click', closeAllDrawers);

  // Dynamic selector for all TOC Items
  document.getElementById('tocList').addEventListener('click', (e) => {
    const item = e.target.closest('.toc-item');
    if (item) {
      initAudioContext();
      const page = parseInt(item.getAttribute('data-page'), 10);
      turnToPage(page);
      closeTocDrawer();
    }
  });

  // Dynamic selector for all Thumbnail Cards
  document.getElementById('thumbGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.thumb-card');
    if (card) {
      initAudioContext();
      const page = parseInt(card.getAttribute('data-page'), 10);
      turnToPage(page);
      closeThumbDrawer();
    }
  });

  // Zoom Modal
  DOM.zoomModalBtn.addEventListener('click', openZoomModal);
  DOM.closeZoomBtn.addEventListener('click', closeZoomModal);
  if (DOM.floatingCloseZoomBtn) DOM.floatingCloseZoomBtn.addEventListener('click', closeZoomModal);
  if (DOM.footerCloseZoomBtn) DOM.footerCloseZoomBtn.addEventListener('click', closeZoomModal);
  
  // Close zoom modal on clicking backdrop
  DOM.zoomModal.addEventListener('click', (e) => {
    if (e.target === DOM.zoomModal) {
      closeZoomModal();
    }
  });

  DOM.zoomInBtn.addEventListener('click', () => setZoomScale(AppState.zoomScale + 0.3));
  DOM.zoomOutBtn.addEventListener('click', () => setZoomScale(AppState.zoomScale - 0.3));
  DOM.zoomResetBtn.addEventListener('click', () => {
    AppState.zoomPos = { x: 0, y: 0 };
    setZoomScale(1.0);
  });

  // Share Modal
  DOM.shareBtn.addEventListener('click', openShareModal);
  DOM.closeShareBtn.addEventListener('click', closeShareModal);

  DOM.copyShareBtn.addEventListener('click', () => {
    DOM.shareUrlInput.select();
    navigator.clipboard.writeText(DOM.shareUrlInput.value).then(() => {
      DOM.copyText.textContent = 'Tersalin!';
      setTimeout(() => { DOM.copyText.textContent = 'Salin'; }, 2000);
    });
  });

  // Auto-Play
  DOM.autoPlayBtn.addEventListener('click', toggleAutoPlay);

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (DOM.zoomModal.classList.contains('open')) {
      if (e.key === 'Escape') closeZoomModal();
      return;
    }
    if (DOM.shareModal.classList.contains('open')) {
      if (e.key === 'Escape') closeShareModal();
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      initAudioContext();
      AppState.pageFlip.flipNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      initAudioContext();
      AppState.pageFlip.flipPrev();
    } else if (e.key === 'Escape') {
      closeAllDrawers();
    } else if (e.key === 'Home') {
      turnToPage(0);
    } else if (e.key === 'End') {
      turnToPage(AppState.totalPages - 1);
    }
  });

  // Window Resize: re-evaluate PageFlip dimensions with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (AppState.pageFlip) {
        AppState.pageFlip.updateFromHtml(document.querySelectorAll('.page-sheet'));
      }
    }, 250);
  });
}

// ==========================================
// 13. INITIALIZE ON DOM LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  lucide.createIcons();

  // 2. Setup G-Form links
  updateGFormLinks();

  // 3. Setup Events
  setupEventListeners();

  // 4. Initialize Flipbook
  initFlipbook();
});
