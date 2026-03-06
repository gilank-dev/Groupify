/**
 * Groupify - Lightweight & Smart Version
 * Optimized for performance, fairness, and intelligence
 */

// ============================================
// State & Config
// ============================================
const state = {
  isShuffling: false,
  currentGroups: [],
  diceAnimation: null,
  diceSound: null,
};

const config = {
  STORAGE_KEY: 'gf_data',
  HISTORY_KEY: 'gf_history',
};

// ============================================
// Utility Functions
// ============================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const generateId = () => `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;

// Fisher-Yates shuffle dengan entropy tambahan untuk keacakan lebih baik
const shuffleArray = (arr) => {
  const shuffled = [...arr];
  const len = shuffled.length;
  
  if (len <= 1) return shuffled;
  
  // Multiple passes untuk keacakan lebih baik
  for (let pass = 0; pass < 3; pass++) {
    for (let i = len - 1; i > 0; i--) {
      // Enhanced randomness dengan crypto jika tersedia
      let j;
      if (window.crypto && window.crypto.getRandomValues) {
        const randomBytes = new Uint32Array(1);
        window.crypto.getRandomValues(randomBytes);
        j = randomBytes[0] % (i + 1);
      } else {
        j = Math.floor(Math.random() * (i + 1));
      }
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  
  return shuffled;
};

// Distribusi yang lebih adil dengan algoritma advanced
const distributeGroups = (items, numGroups, mode = 'balanced') => {
  if (numGroups < 1 || items.length === 0) {
    return Array.from({ length: numGroups }, () => []);
  }
  
  // Ensure numGroups tidak lebih dari items
  const actualGroups = Math.min(numGroups, items.length);
  const groups = Array.from({ length: actualGroups }, () => []);
  
  if (mode === 'random') {
    // Random dengan ensuring tidak ada group kosong
    const shuffled = shuffleArray(items);
    
    // First, pastikan setiap group dapat minimal 1 item
    for (let i = 0; i < actualGroups && i < shuffled.length; i++) {
      groups[i].push(shuffled[i]);
    }
    
    // Sisa items diacak
    for (let i = actualGroups; i < shuffled.length; i++) {
      const randomGroup = Math.floor(Math.random() * actualGroups);
      groups[randomGroup].push(shuffled[i]);
    }
  } else {
    // Balanced mode - distribusi paling adil
    const shuffled = shuffleArray(items);
    const baseSize = Math.floor(shuffled.length / actualGroups);
    const remainder = shuffled.length % actualGroups;
    
    let index = 0;
    for (let i = 0; i < actualGroups; i++) {
      // Group pertama dapat extra item jika ada remainder
      const groupSize = baseSize + (i < remainder ? 1 : 0);
      for (let j = 0; j < groupSize && index < shuffled.length; j++) {
        groups[i].push(shuffled[index++]);
      }
    }
  }
  
  return groups;
};

const calculateStats = (groups) => {
  if (!groups || groups.length === 0) {
    return { totalGroups: 0, totalMembers: 0, avgMembers: 0, minMembers: 0, maxMembers: 0, distribution: 0 };
  }
  
  const totalGroups = groups.length;
  const totalMembers = groups.reduce((sum, g) => sum + g.length, 0);
  const avgMembers = totalGroups > 0 ? Math.round((totalMembers / totalGroups) * 10) / 10 : 0;
  const minMembers = Math.min(...groups.map((g) => g.length));
  const maxMembers = Math.max(...groups.map((g) => g.length));
  const distribution = maxMembers - minMembers;
  
  return { totalGroups, totalMembers, avgMembers, minMembers, maxMembers, distribution };
};

const debounce = (fn, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const formatDate = (date) => new Date(date).toLocaleString('id-ID', {
  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
});

// ============================================
// Storage
// ============================================
const storage = {
  get: (key, defaults) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaults;
    } catch {
      return defaults;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

// ============================================
// Audio (Web Audio API - Smart)
// ============================================
const audio = {
  ctx: null,
  enabled: true,
  volume: 0.3,
  diceInterval: null,

  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  },

  play(frequency, type, duration, gain = this.volume) {
    if (!this.enabled || !this.ctx) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.frequency.value = frequency;
      osc.type = type;
      gainNode.gain.setValueAtTime(gain, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Silent fail untuk audio
    }
  },

  click() { this.init(); this.play(800, 'sine', 0.1); },
  
  success() {
    this.init();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.play(freq, 'sine', 0.3, this.volume * 0.8), i * 100);
    });
  },
  
  error() { this.init(); this.play(200, 'sawtooth', 0.3, this.volume * 0.5); },
  
  reveal() { this.init(); this.play(1000, 'sine', 0.1, this.volume * 0.15); },

  startDiceRoll(duration = 5) {
    if (!this.enabled) return () => {};
    this.init();
    const endTime = Date.now() + duration * 1000;
    
    this.diceInterval = setInterval(() => {
      if (Date.now() > endTime) {
        this.stopDiceRoll();
        return;
      }
      this.play(150 + Math.random() * 200, 'square', 0.08, this.volume * 0.3);
    }, 80);
    
    return () => this.stopDiceRoll();
  },

  stopDiceRoll() {
    if (this.diceInterval) {
      clearInterval(this.diceInterval);
      this.diceInterval = null;
    }
  },

  setEnabled(value) {
    this.enabled = value;
    if (this.ctx && !value) this.ctx.suspend();
    if (this.ctx && value) this.ctx.resume();
  },
};

// ============================================
// Quotes Database (Expanded)
// ============================================
const quotes = [
  { text: 'Kesuksesan adalah jumlah dari usaha kecil yang diulang setiap hari.', author: 'Robert Collier' },
  { text: 'Kerja tim membuat mimpi menjadi kenyataan.', author: 'Unknown' },
  { text: 'Bersama kita bisa mencapai lebih dari yang pernah kita bayangkan.', author: 'Unknown' },
  { text: 'Satu tim, satu mimpi, satu tujuan!', author: 'Unknown' },
  { text: 'Hebat sendirian, luar biasa bersama-sama.', author: 'Unknown' },
  { text: 'Tim yang hebat bukan tentang keterampilan individu, tapi tentang kerja sama.', author: 'Phil Jackson' },
  { text: 'Jika kamu ingin pergi cepat, pergi sendirian. Jika kamu ingin pergi jauh, pergi bersama-sama.', author: 'African Proverb' },
  { text: 'Bakat memenangkan pertandingan, tapi kerja tim dan kecerdasan memenangkan kejuaraan.', author: 'Michael Jordan' },
  { text: 'Percayalah kamu bisa, maka kamu sudah setengah jalan.', author: 'Theodore Roosevelt' },
  { text: 'Kamu tidak harus hebat untuk memulai, tapi kamu harus memulai untuk menjadi hebat.', author: 'Zig Ziglar' },
  { text: 'Kekuatan tim adalah setiap anggota. Kekuatan setiap anggota adalah tim.', author: 'Phil Jackson' },
  { text: 'Tidak ada yang bisa mencapai kesuksesan sendirian.', author: 'Unknown' },
  { text: 'Individu bermain game, tim memenangkan kejuaraan.', author: 'Unknown' },
  { text: 'Kolaborasi adalah kunci untuk membuka potensi maksimal.', author: 'Unknown' },
  { text: 'Belajar dari kemarin, hidup untuk hari ini, berharap untuk besok.', author: 'Albert Einstein' },
];

const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

// ============================================
// Effects (Optimized)
// ============================================
const effects = {
  emojiContainer: null,
  confettiCanvas: null,
  ctx: null,
  particles: [],
  animationId: null,
  enabled: true,

  init() {
    this.emojiContainer = $('#emojiContainer');
    this.confettiCanvas = $('#confettiCanvas');
    if (this.confettiCanvas) {
      this.ctx = this.confettiCanvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  },

  resize() {
    if (!this.confettiCanvas) return;
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  },

  blastEmoji(count = 40) {
    if (!this.enabled || !this.emojiContainer) return;
    const emojis = ['🎊', '🎉', '✨', '⭐', '🔥', '🎈', '💫', '🌟'];
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.className = 'emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.animationDuration = `${2 + Math.random() * 1.5}s`;
        emoji.style.fontSize = `${1.2 + Math.random()}rem`;
        this.emojiContainer.appendChild(emoji);
        setTimeout(() => emoji.remove(), 3500);
      }, i * 50);
    }
  },

  explodeConfetti(count = 100) {
    if (!this.enabled || !this.ctx) return;
    const colors = ['#D97D55', '#6FA4AF', '#B8C4A9', '#FF6B6B', '#4ECDC4', '#FFE66D'];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.confettiCanvas.width / 2,
        y: this.confettiCanvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 5,
        gravity: 0.4,
        drag: 0.96,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        opacity: 1,
      });
    }

    if (!this.animationId) this.animateConfetti();
    setTimeout(() => this.stopConfetti(), 4000);
  },

  animateConfetti() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.003;

      if (p.y > this.confettiCanvas.height || p.opacity <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.animationId = null;
    }
  },

  stopConfetti() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
    if (this.ctx) this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
  },

  setEnabled(value) {
    this.enabled = value;
    if (!value) this.stopConfetti();
  },
};

// ============================================
// Toast Notifications
// ============================================
const showToast = (message, type = 'info') => {
  const container = $('#toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ============================================
// Main App Functions
// ============================================
const elements = {};

const cacheElements = () => {
  elements.namesInput = $('#namesInput');
  elements.groupCount = $('#groupCount');
  elements.shuffleMode = $('#shuffleMode');
  elements.soundToggle = $('#soundToggle');
  elements.emojiToggle = $('#emojiToggle');
  elements.autoSaveToggle = $('#autoSaveToggle');
  elements.shuffleBtn = $('#shuffleBtn');
  elements.exportBtn = $('#exportBtn');
  elements.exportPdfBtn = $('#exportPdfBtn');
  elements.clearBtn = $('#clearBtn');
  elements.sampleDataBtn = $('#sampleDataBtn');
  elements.importBtn = $('#importBtn');
  elements.pasteBtn = $('#pasteBtn');
  elements.increaseGroups = $('#increaseGroups');
  elements.decreaseGroups = $('#decreaseGroups');
  elements.themeToggle = $('#themeToggle');
  elements.historyBtn = $('#historyBtn');
  elements.resultsSection = $('#resultsSection');
  elements.resultsGrid = $('#resultsGrid');
  elements.quoteSection = $('#quoteSection');
  elements.quoteText = $('#quoteText');
  elements.quoteAuthor = $('#quoteAuthor');
  elements.charCount = $('#charCount');
  elements.historyPanel = $('#historyPanel');
  elements.historyContent = $('#historyContent');
  elements.copyResultsBtn = $('#copyResultsBtn');
  elements.printResultsBtn = $('#printResultsBtn');
  elements.loadingScreen = $('#loadingScreen');
  elements.diceOverlay = $('#diceOverlay');
  elements.diceProgress = $('#diceProgress');
  elements.diceText = $('#diceText');
};

const getNames = () => {
  const value = elements.namesInput?.value || '';
  return value.split('\n').map((n) => n.trim()).filter((n) => n.length > 0);
};

const updateCharCount = () => {
  if (elements.charCount) {
    elements.charCount.textContent = `${getNames().length} nama`;
  }
};

const loadSavedData = () => {
  const data = storage.get(config.STORAGE_KEY, {
    names: '',
    groupCount: 4,
    shuffleMode: 'balanced'
  });

  if (elements.namesInput) elements.namesInput.value = data.names || '';
  if (elements.groupCount) elements.groupCount.value = data.groupCount?.toString() || '4';
  if (elements.shuffleMode) elements.shuffleMode.value = data.shuffleMode || 'balanced';
};

const saveData = () => {
  storage.set(config.STORAGE_KEY, {
    names: elements.namesInput?.value || '',
    groupCount: parseInt(elements.groupCount?.value) || 4,
    shuffleMode: elements.shuffleMode?.value || 'balanced',
  });
};

const loadSampleData = () => {
  const samples = [
    'Ahmad Rizki', 'Budi Santoso', 'Citra Dewi', 'Dian Pratama',
    'Eka Putri', 'Fajar Nugraha', 'Gita Permata', 'Hendra Wijaya',
    'Indah Sari', 'Joko Susilo', 'Kartika Sari', 'Leo Pratama',
    'Maya Putri', 'Nanda Saputra', 'Olivia Tan', 'Putri Handayani',
    'Rudi Hartono', 'Siti Nurhaliza', 'Tono Sudirjo', 'Umar Bakri',
    'Vina Panduwinata', 'Wawan Setiawan', 'Yuni Shara', 'Zainal Abidin',
  ];
  if (elements.namesInput) {
    elements.namesInput.value = samples.join('\n');
    audio.click();
    updateCharCount();
    saveData();
    showToast('Sample data loaded', 'success');
  }
};

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (elements.namesInput) {
      elements.namesInput.value = text;
      updateCharCount();
      saveData();
      showToast('Data berhasil di-paste', 'success');
    }
  } catch {
    showToast('Gagal mengakses clipboard', 'error');
  }
};

const importFromFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt,.csv';
  input.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (elements.namesInput && event.target?.result) {
        elements.namesInput.value = event.target.result;
        updateCharCount();
        saveData();
        showToast('File berhasil diimport', 'success');
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

const adjustGroupCount = (delta) => {
  if (!elements.groupCount) return;
  const newValue = parseInt(elements.groupCount.value) + delta;
  if (newValue >= 2 && newValue <= 50) {
    elements.groupCount.value = newValue.toString();
    audio.click();
    saveData();
  } else {
    audio.error();
    showToast('Jumlah kelompok harus 2-50!', 'warning');
  }
};

const displayResults = (groups) => {
  // Show quote
  const quote = getRandomQuote();
  if (elements.quoteText && elements.quoteAuthor) {
    elements.quoteText.textContent = `"${quote.text}"`;
    elements.quoteAuthor.textContent = `- ${quote.author}`;
    if (elements.quoteSection) {
      elements.quoteSection.hidden = false;
      elements.quoteSection.classList.add('visible');
    }
  }

  // Update stats
  const stats = calculateStats(groups);
  const statsElements = {
    totalGroups: $('#totalGroups'),
    totalMembers: $('#totalMembers'),
    avgMembers: $('#avgMembers'),
    distribution: $('#distribution'),
  };
  if (statsElements.totalGroups) statsElements.totalGroups.textContent = stats.totalGroups;
  if (statsElements.totalMembers) statsElements.totalMembers.textContent = stats.totalMembers;
  if (statsElements.avgMembers) statsElements.avgMembers.textContent = stats.avgMembers;
  if (statsElements.distribution) statsElements.distribution.textContent = `±${stats.distribution}`;

  // Create cards with staggered animation
  if (elements.resultsGrid) {
    elements.resultsGrid.innerHTML = '';
    groups.forEach((group, index) => {
      const card = document.createElement('div');
      card.className = 'group-card';
      card.innerHTML = `
        <div class="group-header">
          <div class="group-number">${index + 1}</div>
          <div class="group-title">Kelompok ${index + 1}</div>
        </div>
        <ul class="group-members">
          ${group.map((m) => `<li class="group-member">${escapeHtml(m)}</li>`).join('')}
        </ul>
        <div class="member-count">${group.length} anggota</div>
      `;
      elements.resultsGrid.appendChild(card);
      setTimeout(() => {
        card.classList.add('visible');
        audio.reveal();
      }, index * 80);
    });
  }

  // Show section
  if (elements.resultsSection) {
    elements.resultsSection.hidden = false;
    elements.resultsSection.classList.add('visible');
  }

  // Enable buttons
  if (elements.exportBtn) elements.exportBtn.disabled = false;
  if (elements.exportPdfBtn) elements.exportPdfBtn.disabled = false;

  // Scroll
  setTimeout(() => {
    elements.resultsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 400);

  saveData();
};

const handleShuffle = async () => {
  if (state.isShuffling) return;

  const names = getNames();
  const numGroups = parseInt(elements.groupCount?.value || '4');
  const mode = elements.shuffleMode?.value || 'balanced';
  const duration = 5; // Default duration

  // Validation
  if (names.length === 0) {
    showToast('⚠️ Masukkan nama terlebih dahulu!', 'error');
    elements.namesInput?.focus();
    elements.namesInput?.classList.add('animate-shake');
    setTimeout(() => elements.namesInput?.classList.remove('animate-shake'), 500);
    audio.error();
    return;
  }
  if (numGroups < 2 || numGroups > 50) {
    showToast('⚠️ Jumlah kelompok harus 2-50!', 'error');
    audio.error();
    return;
  }
  if (names.length < numGroups) {
    showToast(`⚠️ Jumlah nama (${names.length}) harus lebih banyak dari kelompok (${numGroups})!`, 'error');
    audio.error();
    return;
  }

  // Check for duplicate names
  const nameCounts = {};
  const duplicates = [];
  names.forEach((name) => {
    const normalizedName = name.toLowerCase().trim();
    nameCounts[normalizedName] = (nameCounts[normalizedName] || 0) + 1;
    if (nameCounts[normalizedName] === 2) {
      duplicates.push(name);
    }
  });

  if (duplicates.length > 0) {
    const dupList = duplicates.slice(0, 5).join(', ');
    const moreText = duplicates.length > 5 ? ` dan ${duplicates.length - 5} lainnya` : '';
    showToast(`⚠️ Ada nama yang sama: ${dupList}${moreText}. Gunakan nama yang unik!`, 'error');
    audio.error();
    return;
  }

  state.isShuffling = true;
  if (elements.shuffleBtn) elements.shuffleBtn.disabled = true;

  audio.click();
  state.diceSound = audio.startDiceRoll(duration);

  // Show dice overlay
  if (elements.diceOverlay) {
    elements.diceOverlay.classList.add('active');
    elements.diceOverlay.setAttribute('aria-hidden', 'false');
    
    // Reset and start progress animation
    if (elements.diceProgress) {
      elements.diceProgress.style.animation = 'none';
      elements.diceProgress.offsetHeight; // Trigger reflow
      elements.diceProgress.style.animation = `progress ${duration}s linear forwards`;
    }
    
    // Update dice text
    const diceMessages = ['Mengocok nama...', 'Mengacak kelompok...', 'Memproses...', 'Hampir selesai...'];
    let msgIndex = 0;
    const messageInterval = setInterval(() => {
      if (elements.diceText) {
        elements.diceText.textContent = diceMessages[msgIndex % diceMessages.length];
        msgIndex++;
      }
    }, duration * 250);
    
    // Store interval for cleanup
    state.diceAnimation = { interval: messageInterval };
  }

  // Wait for duration
  await new Promise((resolve) => setTimeout(resolve, duration * 1000));

  // Cleanup
  if (state.diceAnimation?.interval) {
    clearInterval(state.diceAnimation.interval);
    state.diceAnimation = null;
  }
  if (state.diceSound) {
    state.diceSound();
    state.diceSound = null;
  }

  // Hide dice
  if (elements.diceOverlay) {
    elements.diceOverlay.classList.remove('active');
    elements.diceOverlay.setAttribute('aria-hidden', 'true');
  }

  // Distribute names dengan algoritma yang lebih adil
  const groups = distributeGroups(names, numGroups, mode);
  state.currentGroups = groups;

  // Celebration
  effects.blastEmoji();
  effects.explodeConfetti();
  audio.success();

  displayResults(groups);

  // Save history
  const history = storage.get(config.HISTORY_KEY, []);
  history.unshift({
    id: generateId(),
    timestamp: new Date().toISOString(),
    names: names.slice(0, 10).join(', ') + (names.length > 10 ? '...' : ''),
    groupCount: numGroups,
    mode: mode,
    stats: calculateStats(groups),
  });
  if (history.length > 50) history.splice(50);
  storage.set(config.HISTORY_KEY, history);

  state.isShuffling = false;
  if (elements.shuffleBtn) elements.shuffleBtn.disabled = false;
};

const handleExport = () => {
  if (state.currentGroups.length === 0) {
    showToast('⚠️ Belum ada hasil untuk diekspor!', 'warning');
    return;
  }
  
  audio.click();

  let csv = 'Kelompok,Nama Anggota\n';
  state.currentGroups.forEach((group, i) => {
    group.forEach((member) => {
      csv += `Kelompok ${i + 1},"${member}"\n`;
    });
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kelompok_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('✅ File CSV berhasil diunduh', 'success');
};

const handleCopyResults = async () => {
  if (state.currentGroups.length === 0) {
    showToast('⚠️ Belum ada hasil untuk disalin!', 'warning');
    return;
  }

  let text = '📊 HASIL PEMBAGIAN KELOMPOK 📊\n\n';
  const stats = calculateStats(state.currentGroups);
  text += `Total: ${stats.totalGroups} kelompok | ${stats.totalMembers} anggota\n\n`;

  state.currentGroups.forEach((group, i) => {
    text += `🎯 Kelompok ${i + 1} (${group.length} anggota):\n`;
    group.forEach((member, idx) => {
      text += `   ${idx + 1}. ${member}\n`;
    });
    text += '\n';
  });

  const success = await copyToClipboard(text);
  if (success) {
    showToast('✅ Hasil disalin ke clipboard', 'success');
  } else {
    showToast('❌ Gagal menyalin', 'error');
  }
};

const handlePrintResults = () => {
  if (state.currentGroups.length === 0) {
    showToast('⚠️ Belum ada hasil untuk dicetak!', 'warning');
    return;
  }
  audio.click();
  window.print();
};

const handleClear = () => {
  audio.click();
  if (!confirm('Yakin ingin menghapus semua data?')) return;

  if (elements.namesInput) elements.namesInput.value = '';
  if (elements.groupCount) elements.groupCount.value = '4';
  if (elements.resultsSection) elements.resultsSection.hidden = true;
  if (elements.quoteSection) elements.quoteSection.hidden = true;
  if (elements.exportBtn) elements.exportBtn.disabled = true;
  if (elements.exportPdfBtn) elements.exportPdfBtn.disabled = true;

  state.currentGroups = [];
  updateCharCount();
  storage.remove(config.STORAGE_KEY);
  showToast('✅ Data berhasil direset', 'success');
};

const toggleTheme = () => {
  audio.click();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newValue = !isDark;
  document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light');

  const themeIcon = elements.themeToggle?.querySelector('.icon');
  if (themeIcon) themeIcon.textContent = newValue ? '☀️' : '🌙';

  showToast(`Theme ${newValue ? 'Dark' : 'Light'} diaktifkan`, 'success');
};

const toggleHistory = () => {
  audio.click();
  if (!elements.historyPanel) return;

  elements.historyPanel.hidden = !elements.historyPanel.hidden;
  if (!elements.historyPanel.hidden) renderHistory();
};

const renderHistory = () => {
  const history = storage.get(config.HISTORY_KEY, []);
  if (!elements.historyContent) return;

  if (history.length === 0) {
    elements.historyContent.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">Belum ada riwayat</p>';
    return;
  }

  elements.historyContent.innerHTML = history
    .map(
      (item) => `
        <div class="history-item">
          <div class="history-item-header">
            <span class="history-date">${formatDate(item.timestamp)}</span>
            <span class="history-groups">${item.groupCount} Kelompok</span>
          </div>
          <div class="history-names">${escapeHtml(item.names)}</div>
        </div>
      `
    )
    .join('');
};

const clearHistory = () => {
  if (!confirm('Hapus semua riwayat?')) return;
  storage.remove(config.HISTORY_KEY);
  renderHistory();
  showToast('✅ Riwayat dihapus', 'success');
};

const setupEventListeners = () => {
  // Main actions
  elements.shuffleBtn?.addEventListener('click', handleShuffle);
  elements.exportBtn?.addEventListener('click', handleExport);
  elements.exportPdfBtn?.addEventListener('click', () => { 
    if (state.currentGroups.length === 0) {
      showToast('⚠️ Belum ada hasil untuk diekspor!', 'warning');
      return;
    }
    audio.click(); 
    window.print(); 
  });
  elements.clearBtn?.addEventListener('click', handleClear);

  // Inputs
  elements.namesInput?.addEventListener('input', debounce(() => { 
    updateCharCount(); 
    saveData(); 
  }, 300));
  elements.groupCount?.addEventListener('change', saveData);
  elements.shuffleMode?.addEventListener('change', saveData);

  // Stepper
  elements.increaseGroups?.addEventListener('click', () => adjustGroupCount(1));
  elements.decreaseGroups?.addEventListener('click', () => adjustGroupCount(-1));

  // Toggles
  elements.soundToggle?.addEventListener('change', (e) => {
    audio.setEnabled(e.target.checked);
  });
  elements.emojiToggle?.addEventListener('change', (e) => {
    effects.setEnabled(e.target.checked);
  });

  // Utility buttons
  elements.sampleDataBtn?.addEventListener('click', loadSampleData);
  elements.pasteBtn?.addEventListener('click', pasteFromClipboard);
  elements.importBtn?.addEventListener('click', importFromFile);

  // Header
  elements.themeToggle?.addEventListener('click', toggleTheme);
  elements.historyBtn?.addEventListener('click', toggleHistory);

  // Results actions
  elements.copyResultsBtn?.addEventListener('click', handleCopyResults);
  elements.printResultsBtn?.addEventListener('click', handlePrintResults);

  // Close buttons
  $('#closeHistoryBtn')?.addEventListener('click', () => {
    if (elements.historyPanel) elements.historyPanel.hidden = true;
  });
  $('#clearHistoryBtn')?.addEventListener('click', clearHistory);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleShuffle();
    }
    if (e.key === 'Escape') {
      if (elements.historyPanel) elements.historyPanel.hidden = true;
    }
  });
};

const hideLoadingScreen = () => {
  if (elements.loadingScreen) {
    elements.loadingScreen.classList.add('hidden');
    setTimeout(() => elements.loadingScreen.remove(), 400);
  }
};

// ============================================
// Initialize
// ============================================
const init = () => {
  cacheElements();
  loadSavedData();
  setupEventListeners();
  effects.init();
  updateCharCount();
  hideLoadingScreen();
  console.log('🎲 Groupify initialized (Smart & Fair version)');
};

// Start app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
