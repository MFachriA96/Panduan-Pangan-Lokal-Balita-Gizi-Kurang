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
  totalPages: 7,
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
  { index: 0, title: 'Sampul Depan (Cover)', sub: 'Panduan Praktis PMT Balita Gizi Kurang', img: 'assets/pages/page_1.webp' },
  { index: 1, title: 'Halaman Judul & Filosofi', sub: 'Your Guide to a Positive Journey', img: 'assets/pages/page_2.webp' },
  { index: 2, title: 'Pengantar Program Gizi', sub: 'Data & Sasaran Puskesmas Wonokromo', img: 'assets/pages/page_3.webp' },
  { index: 3, title: 'Apa Itu Gizi Kurang?', sub: 'Pemantauan Posyandu & Karakteristik Balita', img: 'assets/pages/page_4.webp' },
  { index: 4, title: 'Prinsip Makanan Tambahan', sub: 'Mendukung Pertumbuhan & Energi Protein', img: 'assets/pages/page_5.webp' },
  { index: 5, title: 'Variasi Bahan Makanan Lokal', sub: 'Energi, Hewani, Nabati, Sayur, & Buah', img: 'assets/pages/page_6.webp' },
  { index: 6, title: 'Evaluasi & Kuesioner (G-Form)', sub: 'Umpan Balik & Konfirmasi Pembaca', img: null }
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
  closingGformBtn: document.getElementById('closingGformBtn'),
  restartBookBtn: document.getElementById('restartBookBtn'),
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
    console.debug('Audio note:', e);
  }
}

// ==========================================
// 4. GOOGLE FORM INTEGRATION
// ==========================================
function updateGFormLinks() {
  const gformUrl = GOOGLE_FORM_URL;
  if (DOM.navGformBtn) DOM.navGformBtn.href = gformUrl;
  if (DOM.drawerGformBtn) DOM.drawerGformBtn.href = gformUrl;
  if (DOM.closingGformBtn) DOM.closingGformBtn.href = gformUrl;
}

// ==========================================
// 5. STPAGEFLIP INITIALIZATION & SIZING
// ==========================================
function calculateBookDimensions() {
  const vpWidth = DOM.bookViewport.clientWidth;
  const vpHeight = DOM.bookViewport.clientHeight;

  // Available space minus padding
  const availWidth = Math.max(300, vpWidth - (vpWidth < 880 ? 60 : 120));
  const availHeight = Math.max(360, vpHeight - 40);

  // A4 ratio width / height = 0.707
  const pageAspect = 0.707;

  let pageW, pageH;

  if (vpWidth < 880) {
    // Single page mode on smaller screens
    pageH = Math.min(availHeight, availWidth / pageAspect);
    pageW = pageH * pageAspect;
  } else {
    // 2-page spread mode on desktop/tablets
    // 2 pages side-by-side: total width = 2 * pageW
    const maxSingleW = availWidth / 2;
    pageH = Math.min(availHeight, maxSingleW / pageAspect);
    pageW = pageH * pageAspect;
  }

  return {
    width: Math.floor(pageW),
    height: Math.floor(pageH)
  };
}

function initFlipbook() {
  const dims = calculateBookDimensions();
  const isMobile = window.innerWidth < 880;

  AppState.pageFlip = new St.PageFlip(DOM.flipbookEl, {
    width: dims.width,
    height: dims.height,
    size: 'fixed',
    minWidth: 260,
    maxWidth: 800,
    minHeight: 360,
    maxHeight: 1100,
    showCover: true,
    usePortrait: isMobile,
    maxShadowOpacity: 0.6,
    showPageCorners: true,
    flippingTime: 700,
    startPage: 0,
    swipeDistance: 30
  });

  // Load from HTML elements inside #flipbook
  AppState.pageFlip.loadFromHTML(document.querySelectorAll('.page-sheet'));

  // Event Listeners from StPageFlip
  AppState.pageFlip.on('flip', (e) => {
    AppState.currentPage = e.data;
    playPaperFlipSound();
    syncUIWithPage(e.data);
  });

  AppState.pageFlip.on('changeOrientation', (e) => {
    console.log('PageFlip orientation changed:', e.data);
  });

  AppState.pageFlip.on('init', () => {
    DOM.loader.classList.add('hidden');
    syncUIWithPage(0);
  });

  // Fallback hide loader after 800ms
  setTimeout(() => {
    DOM.loader.classList.add('hidden');
  }, 800);
}

// ==========================================
// 6. UI SYNCHRONIZATION
// ==========================================
function syncUIWithPage(pageIndex) {
  const total = AppState.totalPages;
  const isCover = pageIndex === 0;
  const isEnd = pageIndex >= total - 1;

  // Indicators
  DOM.pageDisplay.textContent = `Halaman ${pageIndex + 1} / ${total}`;
  DOM.pageSlider.value = pageIndex;

  const currentMeta = PAGE_METAS[pageIndex] || {};
  DOM.spreadDisplay.textContent = currentMeta.title || `Halaman ${pageIndex + 1}`;

  // Center cover or back-cover cleanly without left empty shadow
  if (isCover) {
    DOM.flipbookEl.classList.add('on-cover');
    DOM.flipbookEl.classList.remove('on-back-cover');
  } else if (isEnd) {
    DOM.flipbookEl.classList.remove('on-cover');
    DOM.flipbookEl.classList.add('on-back-cover');
  } else {
    DOM.flipbookEl.classList.remove('on-cover', 'on-back-cover');
  }

  // Next / Prev button disabled states
  DOM.prevBtn.disabled = isCover;
  DOM.bottomPrevBtn.disabled = isCover;
  DOM.nextBtn.disabled = isEnd;
  DOM.bottomNextBtn.disabled = isEnd;

  // Sync TOC items
  DOM.tocItems.forEach((item) => {
    const itemPage = parseInt(item.getAttribute('data-page'), 10);
    if (itemPage === pageIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Sync Thumbnails
  DOM.thumbCards.forEach((card) => {
    const cardPage = parseInt(card.getAttribute('data-page'), 10);
    if (cardPage === pageIndex) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      card.classList.remove('active');
    }
  });
}

function turnToPage(index) {
  if (!AppState.pageFlip) return;
  const target = Math.max(0, Math.min(index, AppState.totalPages - 1));
  AppState.pageFlip.flip(target);
  closeAllDrawers();
}

// ==========================================
// 7. DRAWERS & MODALS MANAGEMENT
// ==========================================
function openTocDrawer() {
  closeThumbDrawer();
  DOM.tocDrawer.classList.add('open');
  DOM.backdrop.classList.add('visible');
  DOM.tocToggleBtn.classList.add('active');
}

function closeTocDrawer() {
  DOM.tocDrawer.classList.remove('open');
  DOM.tocToggleBtn.classList.remove('active');
  if (!DOM.thumbDrawer.classList.contains('open')) {
    DOM.backdrop.classList.remove('visible');
  }
}

function openThumbDrawer() {
  closeTocDrawer();
  DOM.thumbDrawer.classList.add('open');
  DOM.backdrop.classList.add('visible');
  DOM.thumbToggleBtn.classList.add('active');
}

function closeThumbDrawer() {
  DOM.thumbDrawer.classList.remove('open');
  DOM.thumbToggleBtn.classList.remove('active');
  if (!DOM.tocDrawer.classList.contains('open')) {
    DOM.backdrop.classList.remove('visible');
  }
}

function closeAllDrawers() {
  closeTocDrawer();
  closeThumbDrawer();
  DOM.backdrop.classList.remove('visible');
}

// ==========================================
// 8. ZOOM HD MODAL LOGIC
// ==========================================
function openZoomModal() {
  const pageIdx = Math.min(AppState.currentPage, 5); // Pages 0..5 have images
  const meta = PAGE_METAS[pageIdx];
  if (!meta || !meta.img) {
    // If on closing page, zoom into page 6
    DOM.zoomImg.src = 'assets/pages/page_6.webp';
    DOM.zoomPageTitle.textContent = `Mode Zoom HD - Halaman 6`;
  } else {
    DOM.zoomImg.src = meta.img;
    DOM.zoomPageTitle.textContent = `Mode Zoom HD - Halaman ${pageIdx + 1}: ${meta.title}`;
  }

  AppState.zoomScale = 1.0;
  AppState.zoomPos = { x: 0, y: 0 };
  applyZoomTransform();

  DOM.zoomModal.classList.add('open');
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
  const currentUrl = window.location.href;
  DOM.shareUrlInput.value = currentUrl;

  const shareText = encodeURIComponent('Baca Buku Panduan Praktis Makanan Tambahan Balita Gizi Kurang - Puskesmas Wonokromo');
  const encodedUrl = encodeURIComponent(currentUrl);

  DOM.waShareBtn.href = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;
  DOM.telegramShareBtn.href = `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`;

  DOM.shareModal.classList.add('open');
}

function closeShareModal() {
  DOM.shareModal.classList.remove('open');
}

// ==========================================
// 10. AUTO-PLAY PRESENTATION MODE
// ==========================================
function toggleAutoPlay() {
  if (AppState.autoPlayInterval) {
    clearInterval(AppState.autoPlayInterval);
    AppState.autoPlayInterval = null;
    DOM.autoPlayBtn.classList.remove('active');
    DOM.autoPlayIcon.setAttribute('data-lucide', 'play');
    lucide.createIcons();
  } else {
    DOM.autoPlayBtn.classList.add('active');
    DOM.autoPlayIcon.setAttribute('data-lucide', 'pause');
    lucide.createIcons();

    AppState.autoPlayInterval = setInterval(() => {
      if (AppState.currentPage >= AppState.totalPages - 1) {
        toggleAutoPlay(); // Stop when reaching end
      } else {
        AppState.pageFlip.flipNext();
      }
    }, 4500);
  }
}

// ==========================================
// 11. AMBIENT THEMES & FULLSCREEN
// ==========================================
function cycleTheme() {
  document.body.classList.remove(AppState.themes[AppState.themeIndex]);
  AppState.themeIndex = (AppState.themeIndex + 1) % AppState.themes.length;
  document.body.classList.add(AppState.themes[AppState.themeIndex]);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn('Fullscreen error:', err);
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

  // TOC Item Click
  DOM.tocItems.forEach((item) => {
    item.addEventListener('click', () => {
      initAudioContext();
      const page = parseInt(item.getAttribute('data-page'), 10);
      turnToPage(page);
    });
  });

  // Thumbnail Card Click
  DOM.thumbCards.forEach((card) => {
    card.addEventListener('click', () => {
      initAudioContext();
      const page = parseInt(card.getAttribute('data-page'), 10);
      turnToPage(page);
    });
  });

  // Zoom Modal
  DOM.zoomModalBtn.addEventListener('click', openZoomModal);
  DOM.closeZoomBtn.addEventListener('click', closeZoomModal);
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

  // Restart Book CTA
  if (DOM.restartBookBtn) {
    DOM.restartBookBtn.addEventListener('click', () => {
      turnToPage(0);
    });
  }

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
        const dims = calculateBookDimensions();
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
