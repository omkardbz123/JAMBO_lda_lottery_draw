/**
 * Mega Lottery Draw - Interactive Stage Controller
 * Series No: 1111 - 1360
 * Background: PALCO 8X3 Stage
 * Theatrical Curtain Welcome Page with Smooth Broadcast Transitions
 * 100% Synchronized Bilingual Support: Portuguese (PT) & English (EN)
 * New Objects: Coluna de Som LG, Fogão a Gás Prince, Ar-Condicionado Prince, Geleira Prince
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Bilingual Localization System (PT default, switchable to EN)
  // =========================================================================
  const I18N = {
    pt: {
      curtainEyebrow: 'BEM-VINDOS',
      curtainTitleW1: 'AO SORTEIO',
      curtainTitleW2: 'DE PRÉMIOS',
      curtainTitle: 'Bem-vindos ao Sorteio de Prémios',
      curtainSubtitle: 'GRANDE SORTEIO OFICIAL DE PRÉMIOS EXCLUSIVOS',
      curtainButton: 'ABRIR O PALCO',
      curtainHint: 'Pressione ESPAÇO ou clique para iniciar',
      curtainLangBtn: 'Mudar para Inglês (EN)',
      welcomeTitle: 'Bem-vindos ao Sorteio de Prémios',
      seriesLabel: 'Série Nº: 1111 — 1360',
      spinWheel: 'Gire a Roda',
      congrats: 'Parabéns!',
      youAreWinner: 'É O VENCEDOR!',
      claimNextDraw: (nextRound) => `Levantar o Prémio e Próxima Rodada (${nextRound}/4)`,
      viewAllWinners: '🏆 Ver todos os Vencedores',
      drawOf: (current, total) => `SORTEIO ${current} DE ${total}`,
      soundOn: 'Som Ligado',
      soundMuted: 'Sem Som',
      winnersCount: (count, total) => `Vencedores (${count}/${total})`,
      fullScreen: 'Ecrã',
      exitFullScreen: 'Janela',
      drawerTitle: 'Resultados do Sorteio',
      drawerAwaiting: 'Aguardando Sorteio...',
      drawerTokenLabel: 'NÚMERO:',
      copyWinners: '📋 Copiar Lista de Vencedores',
      copySuccess: '✅ Copiado com Sucesso!',
      noWinnersYet: 'Ainda não foram sorteados vencedores!',
      resetSession: '🔄 Reiniciar Sessão',
      resetConfirm: 'Tem a certeza de que deseja reiniciar o sorteio? Todos os números vencedores serão limpos.',
      allDrawnAlert: 'Todos os números da Série 1111 a 1360 já foram sorteados!',
      summaryTitle: 'Sorteio Concluído !',
      summarySubtitle: 'Os 4 Prémios Exclusivos foram Atribuídos com Sucesso aos números Vencedores',
      closeSummary: '✕ Fechar Resumo',
      startNewLottery: '🔄 Iniciar Novo Sorteio',
      copyReportHeader: '🏆 VENCEDORES DO GRANDE SORTEIO DE PRÉMIOS 🏆\nSérie Nº: 1111 — 1360\n=========================================\n\n',
      copyReportFooter: 'Parabéns a todos os números contemplados!'
    },
    en: {
      curtainEyebrow: 'WELCOME',
      curtainTitleW1: 'TO THE PRIZE',
      curtainTitleW2: 'DRAW',
      curtainTitle: 'Welcome to the Prize Draw',
      curtainSubtitle: 'OFFICIAL EXCLUSIVE PRIZE DRAW',
      curtainButton: 'OPEN THE STAGE',
      curtainHint: 'Press SPACE or click to open',
      curtainLangBtn: 'Switch to Portuguese (PT)',
      welcomeTitle: 'Welcome to the Prize Draw',
      seriesLabel: 'Series No: 1111 — 1360',
      spinWheel: 'SPIN THE WHEEL',
      congrats: 'Congratulations!',
      youAreWinner: 'YOU ARE THE WINNER',
      claimNextDraw: (nextRound) => `Claim Prize & Next Draw (${nextRound}/4)`,
      viewAllWinners: '🏆 View All Winners',
      drawOf: (current, total) => `DRAW ${current} OF ${total}`,
      soundOn: 'Sound On',
      soundMuted: 'Sound Muted',
      winnersCount: (count, total) => `Winners (${count}/${total})`,
      fullScreen: 'Fullscreen',
      exitFullScreen: 'Exit Fullscreen',
      drawerTitle: 'Lottery Draw Results',
      drawerAwaiting: 'Awaiting Draw...',
      drawerTokenLabel: 'TOKEN:',
      copyWinners: '📋 Copy Winners List',
      copySuccess: '✅ Copied to Clipboard!',
      noWinnersYet: 'No winners drawn yet!',
      resetSession: '🔄 Reset Entire Session',
      resetConfirm: 'Are you sure you want to reset the entire lottery draw session? All current winning tokens will be cleared.',
      allDrawnAlert: 'All tokens from Series 1111 to 1360 have already won!',
      summaryTitle: 'LOTTERY DRAW COMPLETE !',
      summarySubtitle: 'All 4 exclusive prizes have been successfully awarded to winning tokens',
      closeSummary: '✕ Close Summary',
      startNewLottery: '🔄 Start New Lottery',
      copyReportHeader: '🏆 MEGA LOTTERY DRAW WINNERS 🏆\nSeries No: 1111 — 1360\n=========================================\n\n',
      copyReportFooter: 'Congratulations to all winning tokens!'
    }
  };

  // =========================================================================
  // 2. Exclusive New Prizes (4 Rounds)
  // =========================================================================
  const PRIZES = [
    {
      id: 1,
      name: {
        pt: 'Coluna de Som LG XBOOM RNC5',
        en: 'LG XBOOM RNC5 Sound Tower'
      },
      badge: {
        pt: '1º PRÉMIO',
        en: '1ST PRIZE'
      },
      subtitle: {
        pt: 'Double Super Bass Boost • Luzes de Festa Multicolor • Modo DJ & Karaoke',
        en: 'Double Super Bass Boost • Party Lighting • DJ App & Karaoke Star'
      },
      image: 'image/coluna_lg.png',
      icon: '🔊'
    },
    {
      id: 2,
      name: {
        pt: 'Fogão a Gás Prince 4 Bocas',
        en: 'Prince 4-Burner Gas Cooker'
      },
      badge: {
        pt: '2º PRÉMIO',
        en: '2ND PRIZE'
      },
      subtitle: {
        pt: 'Grelhas em Ferro Fundido • Forno com Vidro Duplo • Ignição Automática',
        en: 'Cast Iron Grid • Double Glass Oven • Auto Ignition • Stainless Steel'
      },
      image: 'image/fogao_prince.png',
      icon: '🔥'
    },
    {
      id: 3,
      name: {
        pt: 'Ar-Condicionado Inverter Prince',
        en: 'Prince Inverter Air Conditioner'
      },
      badge: {
        pt: '3º PRÉMIO',
        en: '3RD PRIZE'
      },
      subtitle: {
        pt: 'Dual Inverter • Refrigeração Rápida Turbo • Alta Eficiência Energética',
        en: 'Dual Inverter • Fast Turbo Cooling • Eco Energy Saving • Silent Mode'
      },
      image: 'image/ar_condicionado_prince.png',
      icon: '❄️'
    },
    {
      id: 4,
      name: {
        pt: 'Geleira Prince Duas Portas',
        en: 'Prince Double-Door Refrigerator'
      },
      badge: {
        pt: 'GRANDE PRÉMIO',
        en: 'GRAND PRIZE'
      },
      subtitle: {
        pt: 'Tecnologia Frost Free • Multi Fluxo de Ar • Vidro Temperado • Baixo Consumo',
        en: 'Smart Frost Free • Multi Air Flow • Tempered Glass • Low Energy Consumption'
      },
      image: 'image/geleira_prince.png',
      icon: '🧊'
    }
  ];

  // Series Range: 1111 to 1360
  const MIN_TOKEN = 1111;
  const MAX_TOKEN = 1360;

  // =========================================================================
  // 3. Application State & Storage
  // =========================================================================
  const STORAGE_KEY = 'lottery_palco_series_v4';
  let currentLang = 'pt';
  let soundEnabled = true;
  let currentRound = 0; // 0 = Draw 1, 1 = Draw 2, 2 = Draw 3, 3 = Draw 4
  let drawnTokens = new Set();
  let winnersHistory = []; // array of { round, prize, token, formattedToken, time }
  let isSpinning = false;
  let masterRafId = null;
  let currentReelDigits = [1, 1, 1, 1]; // Starts on Series base 1111
  let curtainsOpened = false;

  function getLocalized(val) {
    if (typeof val === 'object' && val !== null) {
      return val[currentLang] || val.pt || val.en || '';
    }
    return val || '';
  }

  // =========================================================================
  // 4. Web Audio Synthesizer
  // =========================================================================
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.clickBuffer = null;
      this.lastTickTime = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.createClickBuffer();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    createClickBuffer() {
      if (!this.ctx) return;
      try {
        const sampleRate = this.ctx.sampleRate;
        const length = Math.floor(sampleRate * 0.02); // 20ms
        const buffer = this.ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
          const env = Math.exp(-i / (sampleRate * 0.0035));
          const noise = (Math.random() * 2 - 1) * 0.55;
          const thud = Math.sin(2 * Math.PI * 220 * (i / sampleRate)) * 0.45;
          data[i] = (noise + thud) * env;
        }
        this.clickBuffer = buffer;
      } catch (e) {}
    }

    playCurtainOpen() {
      if (!soundEnabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, this.ctx.currentTime); // G4
        osc.frequency.exponentialRampToValueAtTime(784, this.ctx.currentTime + 0.6); // G5

        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.8);
      } catch (e) {}
    }

    playTick() {
      if (!soundEnabled || !this.ctx || !this.clickBuffer) return;
      const now = performance.now();
      if (now - this.lastTickTime < 38) return;
      this.lastTickTime = now;

      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.clickBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
      } catch (e) {}
    }

    playReelLock(index) {
      if (!soundEnabled || !this.ctx) return;
      try {
        const baseFreqs = [146.83, 196.00, 246.94, 329.63];
        const freq = baseFreqs[index] || 329.63;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 1.4, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.07);

        gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);
      } catch (e) {}
    }

    playFanfare() {
      if (!soundEnabled || !this.ctx) return;
      try {
        const chords = [
          { f: 261.63, t: 0.0, d: 0.15 },
          { f: 329.63, t: 0.12, d: 0.15 },
          { f: 392.00, t: 0.24, d: 0.18 },
          { f: 523.25, t: 0.36, d: 0.45 },
          { f: 659.25, t: 0.50, d: 0.45 },
          { f: 783.99, t: 0.65, d: 0.90 }
        ];

        chords.forEach(note => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, this.ctx.currentTime + note.t);

          gain.gain.setValueAtTime(0.35, this.ctx.currentTime + note.t);
          gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + note.t + note.d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + note.t);
          osc.stop(this.ctx.currentTime + note.t + note.d);
        });
      } catch (e) {}
    }
  }

  const audio = new SoundManager();

  // =========================================================================
  // 5. Confetti Engine
  // =========================================================================
  class ConfettiEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.active = false;
      this.animId = null;
      this.colors = ['#ffca3a', '#00f2fe', '#ff5964', '#38bdf8', '#ffde7a', '#ffffff', '#8a2be2'];

      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    start(burstCount = 150) {
      this.active = true;
      this.particles = [];
      for (let i = 0; i < burstCount; i++) {
        this.particles.push(this.createParticle(true));
      }
      if (!this.animId) {
        this.loop();
      }
    }

    createParticle(isInitial = false) {
      const w = this.canvas.width;
      return {
        x: Math.random() * w,
        y: isInitial ? Math.random() * (this.canvas.height * 0.4) : -20,
        size: Math.random() * 10 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      };
    }

    stop() {
      this.active = false;
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.active && this.particles.length < 180 && Math.random() < 0.3) {
        this.particles.push(this.createParticle(false));
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();

        if (p.y > this.canvas.height + 40) {
          if (this.active) {
            this.particles[i] = this.createParticle(false);
          } else {
            this.particles.splice(i, 1);
          }
        }
      }

      if (this.particles.length > 0 || this.active) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
      }
    }
  }

  const confetti = new ConfettiEngine('confetti-canvas');

  // =========================================================================
  // 6. DOM Element Map
  // =========================================================================
  const dom = {
    // Stage Curtains Welcome Screen
    stageCurtains: document.getElementById('stage-curtains'),
    btnOpenCurtains: document.getElementById('btn-open-curtains'),
    btnOpenCurtainsText: document.getElementById('btn-open-curtains-text'),
    curtainEyebrow: document.getElementById('curtain-eyebrow'),
    titleWordPrize: document.getElementById('title-word-prize'),
    titleWordDraw: document.getElementById('title-word-draw'),
    curtainTitle: document.getElementById('curtain-title'),
    curtainSubtitle: document.getElementById('curtain-subtitle'),
    curtainSeriesText: document.getElementById('curtain-series-text'),
    curtainHintText: document.getElementById('curtain-hint-text'),
    btnCurtainLang: document.getElementById('btn-curtain-lang'),
    curtainLangText: document.getElementById('curtain-lang-text'),

    // Navigation HUD
    topNavHud: document.getElementById('top-nav-hud'),
    navRoundText: document.getElementById('nav-round-text'),
    btnSound: document.getElementById('btn-sound'),
    soundIcon: document.getElementById('sound-icon'),
    soundText: document.getElementById('sound-text'),
    btnOpenDrawer: document.getElementById('btn-open-drawer'),
    drawerBtnBadge: document.getElementById('drawer-btn-badge'),
    btnFullscreen: document.getElementById('btn-fullscreen'),
    fullscreenIcon: document.getElementById('fullscreen-icon'),
    fullscreenText: document.getElementById('fullscreen-text'),
    btnLang: document.getElementById('btn-lang'),
    langOptPt: document.getElementById('lang-opt-pt'),
    langOptEn: document.getElementById('lang-opt-en'),

    // Showcase View
    showcaseView: document.getElementById('showcase-view'),
    showcaseWelcomeText: document.getElementById('showcase-welcome-text'),
    showcaseSeriesPill: document.getElementById('showcase-series-pill'),
    seriesLabelText: document.getElementById('series-label-text'),
    showcasePrizeImg: document.getElementById('showcase-prize-img'),
    showcasePrizeBadge: document.getElementById('showcase-prize-badge'),
    showcasePrizeTitle: document.getElementById('showcase-prize-title'),
    showcasePrizeSubtitle: document.getElementById('showcase-prize-subtitle'),

    // Wheel View & Celebratory Overlays
    wheelView: document.getElementById('wheel-view'),
    winnerHeaderGroup: document.getElementById('winner-header-group'),
    winnerCongratsText: document.getElementById('winner-congrats-text'),
    winnerYouAreText: document.getElementById('winner-youare-text'),
    winnerFlankLeft: document.getElementById('winner-flank-left'),
    winnerFlankRight: document.getElementById('winner-flank-right'),
    winnerFlankImgLeft: document.getElementById('winner-flank-img-left'),
    winnerFlankImgRight: document.getElementById('winner-flank-img-right'),
    winnerLaurelBadge: document.getElementById('winner-laurel-badge'),
    winnerLaurelBadgeTag: document.getElementById('winner-laurel-badge-tag'),
    winnerLaurelTitle: document.getElementById('winner-laurel-title'),

    // Unified 4-Reel Cylinder
    mainTokenCylinder: document.getElementById('main-token-cylinder'),
    reelStrips: [
      document.getElementById('reel-strip-0'),
      document.getElementById('reel-strip-1'),
      document.getElementById('reel-strip-2'),
      document.getElementById('reel-strip-3')
    ],
    reelSlots: [
      document.getElementById('reel-slot-0'),
      document.getElementById('reel-slot-1'),
      document.getElementById('reel-slot-2'),
      document.getElementById('reel-slot-3')
    ],

    // Bottom Action Buttons
    btnSpinWheel: document.getElementById('btn-spin-wheel'),
    spinBtnText: document.getElementById('spin-btn-text'),
    btnNextDraw: document.getElementById('btn-next-draw'),
    nextDrawBtnText: document.getElementById('next-draw-btn-text'),
    btnFinalSummary: document.getElementById('btn-final-summary'),
    viewWinnersBtnText: document.getElementById('view-winners-btn-text'),

    // Winners Drawer
    drawerBackdrop: document.getElementById('drawer-backdrop'),
    winnersDrawer: document.getElementById('winners-drawer'),
    drawerTitleText: document.getElementById('drawer-title-text'),
    btnCloseDrawer: document.getElementById('btn-close-drawer'),
    drawerWinnersList: document.getElementById('drawer-winners-list'),
    btnCopyWinners: document.getElementById('btn-copy-winners'),
    btnResetSession: document.getElementById('btn-reset-session'),

    // Finale Summary Modal
    finaleModal: document.getElementById('finale-modal'),
    finaleTitleText: document.getElementById('finale-title-text'),
    finaleSubtitleText: document.getElementById('finale-subtitle-text'),
    finaleGrid: document.getElementById('finale-grid'),
    btnFinaleClose: document.getElementById('btn-finale-close'),
    btnFinaleRestart: document.getElementById('btn-finale-restart')
  };

  // =========================================================================
  // 7. Curtain Welcome Stage Controller
  // =========================================================================
  function openCurtains() {
    if (curtainsOpened) return;
    audio.init();
    audio.playCurtainOpen();
    curtainsOpened = true;
    if (dom.stageCurtains) {
      dom.stageCurtains.classList.add('curtains-opened');
    }
  }

  function closeCurtains() {
    curtainsOpened = false;
    if (dom.stageCurtains) {
      dom.stageCurtains.classList.remove('curtains-opened');
    }
  }

  // =========================================================================
  // 8. Series No 1111 - 1360 Token Generation
  // =========================================================================
  function generateWinningToken() {
    const totalPossible = MAX_TOKEN - MIN_TOKEN + 1; // 250 tokens
    if (drawnTokens.size >= totalPossible) {
      alert(I18N[currentLang].allDrawnAlert);
      return MIN_TOKEN;
    }
    let candidate;
    do {
      candidate = Math.floor(Math.random() * totalPossible) + MIN_TOKEN;
    } while (drawnTokens.has(candidate));

    drawnTokens.add(candidate);
    return candidate;
  }

  function formatToken(num) {
    return String(num).padStart(4, '0');
  }

  function generateStripSequence(start_d, target_d, min_digits) {
    const curr_end = (start_d + min_digits - 1) % 10;
    const diff = (target_d - curr_end + 10) % 10;
    const totalDigits = min_digits + diff;
    const digits = [];
    for (let i = 0; i < totalDigits; i++) {
      digits.push((start_d + i) % 10);
    }
    return digits;
  }

  function renderStaticReels() {
    dom.reelStrips.forEach((strip, idx) => {
      strip.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'reel-digit';
      div.textContent = currentReelDigits[idx];
      strip.appendChild(div);
      strip.style.transform = 'translate3d(0, 0, 0)';
    });
    dom.reelSlots.forEach(slot => {
      slot.classList.remove('is-spinning');
      slot.classList.remove('is-locked');
    });
  }

  // =========================================================================
  // 9. Mechanical Deceleration Physics Model
  // =========================================================================
  function calculateReelPosition(t, t_spin, t_decel, D_total) {
    const denom = t_spin + (1.0 / 3.0) * t_decel;
    const v0 = D_total / denom;
    const t_total = t_spin + t_decel;

    if (t <= 0) return 0;
    if (t <= t_spin) return v0 * t;
    if (t < t_total) {
      const tau = (t - t_spin) / t_decel;
      const d_decel = v0 * t_decel * (tau - Math.pow(tau, 2) + Math.pow(tau, 3) / 3.0);
      return v0 * t_spin + d_decel;
    }

    const settleElapsed = t - t_total;
    if (settleElapsed < 0.18) {
      const s = settleElapsed / 0.18;
      const bounce = Math.sin(s * Math.PI) * 4.0 * (1 - s);
      return D_total + bounce;
    }

    return D_total;
  }

  // =========================================================================
  // 10. Core Draw Animation Workflow
  // =========================================================================
  function startDraw() {
    if (isSpinning) return;
    audio.init();
    isSpinning = true;

    // Pick unique winning token from Series 1111 - 1360
    const winningToken = generateWinningToken();
    const tokenStr = formatToken(winningToken);
    const targetDigits = tokenStr.split('').map(Number);

    // Transition view: Hide showcase, reveal unified wheel stage
    dom.showcaseView.style.display = 'none';
    dom.wheelView.style.display = 'flex';

    // Hide celebration layers during active spin
    dom.winnerHeaderGroup.style.display = 'none';
    dom.winnerFlankLeft.style.display = 'none';
    dom.winnerFlankRight.style.display = 'none';
    dom.winnerLaurelBadge.style.display = 'none';
    dom.btnSpinWheel.disabled = true;

    requestAnimationFrame(() => {
      const reelConfigs = [
        { minDigits: 36, t_spin: 1.6, t_decel: 1.6 },
        { minDigits: 52, t_spin: 2.6, t_decel: 1.9 },
        { minDigits: 70, t_spin: 3.7, t_decel: 2.2 },
        { minDigits: 92, t_spin: 5.0, t_decel: 2.8 }
      ];

      // Populate reel strips
      const reels = targetDigits.map((targetDigit, i) => {
        const startDigit = currentReelDigits[i] !== undefined ? currentReelDigits[i] : 1;
        const cfg = reelConfigs[i];
        const digitsSequence = generateStripSequence(startDigit, targetDigit, cfg.minDigits);
        const totalTime = cfg.t_spin + cfg.t_decel;

        const strip = dom.reelStrips[i];
        strip.innerHTML = '';
        const fragment = document.createDocumentFragment();
        digitsSequence.forEach(d => {
          const div = document.createElement('div');
          div.className = 'reel-digit';
          div.textContent = d;
          fragment.appendChild(div);
        });
        strip.appendChild(fragment);
        strip.style.transform = 'translate3d(0, 0, 0)';

        const reelSlot = dom.reelSlots[i];
        reelSlot.classList.remove('is-locked');
        reelSlot.classList.add('is-spinning');

        return {
          index: i,
          strip,
          slot: reelSlot,
          targetDigit,
          digitsSequence,
          totalDistance: 0,
          digitHeight: 0,
          t_spin: cfg.t_spin,
          t_decel: cfg.t_decel,
          totalTime,
          lastPassedDigit: -1,
          isLocked: false
        };
      });

      // Measure exact rendered digit height directly from DOM element
      const firstDigitElem = reels[0].strip.querySelector('.reel-digit');
      const measuredHeight = firstDigitElem && firstDigitElem.getBoundingClientRect().height > 0
        ? firstDigitElem.getBoundingClientRect().height
        : (dom.reelSlots[0].clientHeight || 168);

      reels.forEach(r => {
        r.digitHeight = measuredHeight;
        r.totalDistance = (r.digitsSequence.length - 1) * measuredHeight;
      });

      const startTime = performance.now();

      function animationLoop(now) {
        const elapsedSec = (now - startTime) / 1000;
        let allLocked = true;

        for (let i = 0; i < 4; i++) {
          const r = reels[i];
          if (!r.isLocked) {
            const currentY = calculateReelPosition(elapsedSec, r.t_spin, r.t_decel, r.totalDistance);
            r.strip.style.transform = `translate3d(0, -${currentY.toFixed(1)}px, 0)`;

            const currentPassed = Math.floor(currentY / r.digitHeight);
            if (currentPassed > r.lastPassedDigit) {
              r.lastPassedDigit = currentPassed;
              audio.playTick();
            }

            if (elapsedSec >= r.totalTime + 0.18) {
              r.isLocked = true;
              // Clean lock: swap strip to exact single winning digit at 0 offset
              r.strip.innerHTML = `<div class="reel-digit">${r.targetDigit}</div>`;
              r.strip.style.transform = 'translate3d(0, 0, 0)';
              r.slot.classList.remove('is-spinning');
              r.slot.classList.add('is-locked');
              audio.playReelLock(r.index);
            } else {
              allLocked = false;
            }
          }
        }

        if (!allLocked) {
          masterRafId = requestAnimationFrame(animationLoop);
        } else {
          currentReelDigits = [...targetDigits];
          renderStaticReels();

          setTimeout(() => {
            completeDraw(winningToken, tokenStr);
          }, 650);
        }
      }

      masterRafId = requestAnimationFrame(animationLoop);
    });
  }

  // Complete draw and show winner celebration around the SAME cylinder
  function completeDraw(winningToken, tokenStr) {
    isSpinning = false;
    const currentPrize = PRIZES[currentRound];

    // Record winner in history
    const record = {
      round: currentRound + 1,
      prize: currentPrize,
      token: winningToken,
      formattedToken: tokenStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    winnersHistory.push(record);
    saveState();

    restoreWinnerViewUI(record);
    audio.playFanfare();
    confetti.start(160);
  }

  // Restore or display winner UI around cylinder without altering state
  function restoreWinnerViewUI(record) {
    const prize = (record && record.prize) || PRIZES[currentRound] || PRIZES[0];

    // Populate flanking prizes and award plaque details
    if (dom.winnerFlankImgLeft) dom.winnerFlankImgLeft.src = prize.image;
    if (dom.winnerFlankImgRight) dom.winnerFlankImgRight.src = prize.image;
    updateAwardPlaqueText();

    // Reveal winner elements around the existing cylinder
    dom.winnerHeaderGroup.style.display = 'flex';
    dom.winnerFlankLeft.style.display = 'flex';
    dom.winnerFlankRight.style.display = 'flex';
    dom.winnerLaurelBadge.style.display = 'inline-flex';

    // Update Bottom Buttons
    dom.btnSpinWheel.style.display = 'none';
    if (currentRound < 3) {
      dom.btnNextDraw.style.display = 'inline-flex';
      updateActionButtonsText();
    } else {
      dom.btnNextDraw.style.display = 'none';
      dom.btnFinalSummary.style.display = 'inline-flex';
      if (dom.viewWinnersBtnText) {
        dom.viewWinnersBtnText.textContent = I18N[currentLang].viewAllWinners;
      }
    }

    updateNavigationStatus();
    renderWinnersDrawer();
  }

  function updateAwardPlaqueText() {
    const currentPrize = PRIZES[currentRound];
    if (!currentPrize) return;
    if (dom.winnerLaurelBadgeTag) {
      dom.winnerLaurelBadgeTag.textContent = getLocalized(currentPrize.badge);
    }
    if (dom.winnerLaurelTitle) {
      dom.winnerLaurelTitle.textContent = getLocalized(currentPrize.name);
    }
  }

  function updateActionButtonsText() {
    const t = I18N[currentLang];
    if (dom.spinBtnText) {
      dom.spinBtnText.textContent = t.spinWheel;
    }
    if (dom.nextDrawBtnText) {
      dom.nextDrawBtnText.textContent = t.claimNextDraw(currentRound + 2);
    }
    if (dom.viewWinnersBtnText) {
      dom.viewWinnersBtnText.textContent = t.viewAllWinners;
    }
  }

  // Move to next draw (Draw 2, Draw 3, Draw 4)
  function nextDraw() {
    if (currentRound < 3) {
      currentRound++;
      saveState();

      confetti.stop();
      dom.wheelView.style.display = 'none';
      dom.winnerHeaderGroup.style.display = 'none';
      dom.winnerFlankLeft.style.display = 'none';
      dom.winnerFlankRight.style.display = 'none';
      dom.winnerLaurelBadge.style.display = 'none';
      dom.btnNextDraw.style.display = 'none';

      setupShowcaseForCurrentRound();
      renderStaticReels();

      dom.showcaseView.style.display = 'flex';
      dom.btnSpinWheel.style.display = 'inline-block';
      dom.btnSpinWheel.disabled = false;

      updateNavigationStatus();
    } else {
      showFinalSummary();
    }
  }

  // Update showcase view with current prize details
  function setupShowcaseForCurrentRound() {
    const prize = PRIZES[currentRound];
    if (!prize) return;
    dom.showcasePrizeImg.src = prize.image;
    dom.showcasePrizeBadge.textContent = getLocalized(prize.badge);
    dom.showcasePrizeTitle.textContent = getLocalized(prize.name);
    dom.showcasePrizeSubtitle.textContent = getLocalized(prize.subtitle);
  }

  // Update top navigation bar
  function updateNavigationStatus() {
    const t = I18N[currentLang];
    if (dom.navRoundText) {
      dom.navRoundText.textContent = t.drawOf(currentRound + 1, 4);
    }
    if (dom.drawerBtnBadge) {
      dom.drawerBtnBadge.textContent = t.winnersCount(winnersHistory.length, 4);
    }
  }

  // =========================================================================
  // 11. Winners Drawer & Finale Modals
  // =========================================================================
  function renderWinnersDrawer() {
    const t = I18N[currentLang];
    dom.drawerWinnersList.innerHTML = '';

    PRIZES.forEach((prize, idx) => {
      const winner = winnersHistory.find(w => w.round === idx + 1);
      const card = document.createElement('div');
      card.className = `winner-card ${winner ? 'won' : ''}`;

      card.innerHTML = `
        <div class="winner-card-thumb">
          <img src="${prize.image}" alt="${getLocalized(prize.name)}" />
        </div>
        <div class="winner-card-info">
          <div class="winner-card-round">${t.drawOf(idx + 1, 4)} • ${getLocalized(prize.badge)}</div>
          <div class="winner-card-title">${getLocalized(prize.name)}</div>
          ${
            winner
              ? `<div class="winner-card-token">${t.drawerTokenLabel} #${winner.formattedToken}</div>`
              : `<div class="winner-card-status-pending">${t.drawerAwaiting}</div>`
          }
        </div>
      `;
      dom.drawerWinnersList.appendChild(card);
    });
  }

  function toggleDrawer(open) {
    if (open) {
      renderWinnersDrawer();
      dom.winnersDrawer.classList.add('active');
      dom.drawerBackdrop.classList.add('active');
    } else {
      dom.winnersDrawer.classList.remove('active');
      dom.drawerBackdrop.classList.remove('active');
    }
  }

  function showFinalSummary() {
    const t = I18N[currentLang];
    dom.finaleGrid.innerHTML = '';

    PRIZES.forEach((prize, idx) => {
      const winner = winnersHistory.find(w => w.round === idx + 1);
      const item = document.createElement('div');
      item.className = 'finale-winner-item';

      item.innerHTML = `
        <div class="finale-item-badge">${t.drawOf(idx + 1, 4)} • ${getLocalized(prize.badge)}</div>
        <div class="finale-thumb">
          <img src="${prize.image}" alt="${getLocalized(prize.name)}" />
        </div>
        <div class="finale-item-title">${getLocalized(prize.name)}</div>
        <div class="finale-item-token">🎟️ #${winner ? winner.formattedToken : '----'}</div>
      `;
      dom.finaleGrid.appendChild(item);
    });

    dom.finaleModal.classList.add('active');
    confetti.start(100);
  }

  function copyWinnersList() {
    const t = I18N[currentLang];
    if (winnersHistory.length === 0) {
      alert(t.noWinnersYet);
      return;
    }

    let text = t.copyReportHeader;
    winnersHistory.forEach(w => {
      text += `• ${t.drawOf(w.round, 4)}: ${getLocalized(w.prize.name)}\n  ${t.drawerTokenLabel} #${w.formattedToken} (${w.time})\n\n`;
    });
    text += t.copyReportFooter;

    navigator.clipboard.writeText(text).then(() => {
      const originalText = dom.btnCopyWinners.textContent;
      dom.btnCopyWinners.textContent = t.copySuccess;
      setTimeout(() => {
        dom.btnCopyWinners.textContent = originalText;
      }, 2500);
    }).catch(() => {
      alert(text);
    });
  }

  function resetSession() {
    const t = I18N[currentLang];
    const confirmReset = confirm(t.resetConfirm);
    if (!confirmReset) return;

    if (masterRafId) {
      cancelAnimationFrame(masterRafId);
      masterRafId = null;
    }

    localStorage.removeItem(STORAGE_KEY);
    currentRound = 0;
    drawnTokens.clear();
    winnersHistory = [];
    isSpinning = false;
    currentReelDigits = [1, 1, 1, 1];
    confetti.stop();

    dom.finaleModal.classList.remove('active');
    toggleDrawer(false);

    dom.wheelView.style.display = 'none';
    dom.winnerHeaderGroup.style.display = 'none';
    dom.winnerFlankLeft.style.display = 'none';
    dom.winnerFlankRight.style.display = 'none';
    dom.winnerLaurelBadge.style.display = 'none';
    dom.btnNextDraw.style.display = 'none';
    dom.btnFinalSummary.style.display = 'none';

    setupShowcaseForCurrentRound();
    renderStaticReels();

    dom.showcaseView.style.display = 'flex';
    dom.btnSpinWheel.style.display = 'inline-block';
    dom.btnSpinWheel.disabled = false;

    // Reset curtains to closed state for a fresh opening ceremony
    closeCurtains();

    updateNavigationStatus();
    updateActionButtonsText();
    renderWinnersDrawer();
  }

  // =========================================================================
  // 12. Complete Bilingual Language Switching
  // =========================================================================
  function applyLanguage() {
    const t = I18N[currentLang];

    // Curtain elements
    if (dom.curtainEyebrow) dom.curtainEyebrow.textContent = t.curtainEyebrow;
    if (dom.titleWordPrize) dom.titleWordPrize.textContent = t.curtainTitleW1;
    if (dom.titleWordDraw) dom.titleWordDraw.textContent = t.curtainTitleW2;
    if (dom.curtainSubtitle) dom.curtainSubtitle.textContent = t.curtainSubtitle;
    if (dom.btnOpenCurtainsText) dom.btnOpenCurtainsText.textContent = t.curtainButton;
    if (dom.curtainHintText) dom.curtainHintText.textContent = t.curtainHint;
    if (dom.curtainLangText) dom.curtainLangText.textContent = t.curtainLangBtn;
    if (dom.curtainSeriesText) dom.curtainSeriesText.textContent = t.seriesLabel;

    // Top HUD language pill indicators
    if (dom.langOptPt) dom.langOptPt.classList.toggle('active', currentLang === 'pt');
    if (dom.langOptEn) dom.langOptEn.classList.toggle('active', currentLang === 'en');

    // Showcase View
    if (dom.showcaseWelcomeText) dom.showcaseWelcomeText.textContent = t.welcomeTitle;
    if (dom.seriesLabelText) dom.seriesLabelText.textContent = t.seriesLabel;

    // Winner View
    if (dom.winnerCongratsText) dom.winnerCongratsText.textContent = t.congrats;
    if (dom.winnerYouAreText) dom.winnerYouAreText.textContent = t.youAreWinner;

    // Drawer & Modals
    if (dom.drawerTitleText) dom.drawerTitleText.textContent = t.drawerTitle;
    if (dom.btnCopyWinners) dom.btnCopyWinners.textContent = t.copyWinners;
    if (dom.btnResetSession) dom.btnResetSession.textContent = t.resetSession;
    if (dom.finaleTitleText) dom.finaleTitleText.textContent = t.summaryTitle;
    if (dom.finaleSubtitleText) dom.finaleSubtitleText.textContent = t.summarySubtitle;
    if (dom.btnFinaleClose) dom.btnFinaleClose.textContent = t.closeSummary;
    if (dom.btnFinaleRestart) dom.btnFinaleRestart.textContent = t.startNewLottery;

    // Sub-components
    updateSoundButton();
    updateFullscreenButton();
    updateNavigationStatus();
    updateActionButtonsText();
    setupShowcaseForCurrentRound();
    updateAwardPlaqueText();
    renderWinnersDrawer();

    if (dom.finaleModal && dom.finaleModal.classList.contains('active')) {
      showFinalSummary();
    }
  }

  function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    saveState();
    applyLanguage();
  }

  // =========================================================================
  // 13. State Persistence (LocalStorage)
  // =========================================================================
  function saveState() {
    try {
      const payload = {
        currentLang,
        currentRound,
        drawnTokens: Array.from(drawnTokens),
        winnersHistory,
        soundEnabled,
        currentReelDigits
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.currentLang && I18N[data.currentLang]) {
        currentLang = data.currentLang;
      }
      if (Array.isArray(data.drawnTokens)) {
        drawnTokens = new Set(data.drawnTokens);
      }
      if (Array.isArray(data.winnersHistory)) {
        winnersHistory = data.winnersHistory;
      }
      if (Array.isArray(data.currentReelDigits) && data.currentReelDigits.length === 4) {
        currentReelDigits = data.currentReelDigits;
      }
      if (typeof data.soundEnabled === 'boolean') {
        soundEnabled = data.soundEnabled;
      }

      if (winnersHistory.length >= 4) {
        currentRound = 3;
        const lastWinner = winnersHistory[3];
        currentReelDigits = lastWinner.formattedToken.split('').map(Number);
        dom.showcaseView.style.display = 'none';
        dom.wheelView.style.display = 'flex';
        renderStaticReels();
        restoreWinnerViewUI(lastWinner);
      } else if (winnersHistory.length > 0) {
        currentRound = winnersHistory.length;
        setupShowcaseForCurrentRound();
        renderStaticReels();
      }
    } catch (e) {}
  }

  // =========================================================================
  // 14. Sound & Fullscreen Controls
  // =========================================================================
  function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundButton();
    saveState();
  }

  function updateSoundButton() {
    const t = I18N[currentLang];
    dom.soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    dom.soundText.textContent = soundEnabled ? t.soundOn : t.soundMuted;
  }

  function updateFullscreenButton() {
    const t = I18N[currentLang];
    if (document.fullscreenElement) {
      dom.fullscreenIcon.textContent = '🗗';
      if (dom.fullscreenText) dom.fullscreenText.textContent = t.exitFullScreen;
    } else {
      dom.fullscreenIcon.textContent = '⛶';
      if (dom.fullscreenText) dom.fullscreenText.textContent = t.fullScreen;
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    setTimeout(updateFullscreenButton, 100);
  }

  // =========================================================================
  // 15. Event Listeners & Bootstrap
  // =========================================================================
  function attachEvents() {
    // Curtain open actions
    if (dom.btnOpenCurtains) {
      dom.btnOpenCurtains.addEventListener('click', openCurtains);
    }
    if (dom.btnCurtainLang) {
      dom.btnCurtainLang.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLanguage();
      });
    }

    // Stage action buttons
    dom.btnSpinWheel.addEventListener('click', startDraw);
    dom.btnNextDraw.addEventListener('click', nextDraw);
    dom.btnFinalSummary.addEventListener('click', showFinalSummary);

    // Top HUD buttons
    dom.btnSound.addEventListener('click', toggleSound);
    dom.btnFullscreen.addEventListener('click', toggleFullscreen);
    if (dom.btnLang) dom.btnLang.addEventListener('click', toggleLanguage);

    // Drawer buttons
    dom.btnOpenDrawer.addEventListener('click', () => toggleDrawer(true));
    dom.btnCloseDrawer.addEventListener('click', () => toggleDrawer(false));
    dom.drawerBackdrop.addEventListener('click', () => toggleDrawer(false));
    dom.btnCopyWinners.addEventListener('click', copyWinnersList);
    dom.btnResetSession.addEventListener('click', resetSession);

    // Finale modal buttons
    dom.btnFinaleClose.addEventListener('click', () => {
      dom.finaleModal.classList.remove('active');
    });
    dom.btnFinaleRestart.addEventListener('click', resetSession);

    function toggleTopNav() {
      if (dom.topNavHud) {
        dom.topNavHud.classList.toggle('hud-hidden');
      }
    }

    document.addEventListener('fullscreenchange', updateFullscreenButton);

    window.addEventListener('resize', () => {
      if (!isSpinning) {
        renderStaticReels();
      }
    });

    window.addEventListener('keydown', e => {
      // Space key handling
      if (e.code === 'Space') {
        if (!curtainsOpened) {
          e.preventDefault();
          openCurtains();
          return;
        }
        if (!isSpinning && dom.showcaseView.style.display !== 'none') {
          e.preventDefault();
          startDraw();
        }
      }
      if (e.code === 'Enter' && !curtainsOpened) {
        e.preventDefault();
        openCurtains();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleTopNav();
      }
      if (e.key === 'l' || e.key === 'L') {
        toggleLanguage();
      }
      if (e.code === 'Escape') {
        toggleDrawer(false);
        dom.finaleModal.classList.remove('active');
      }
    });
  }

  function init() {
    loadState();
    renderStaticReels();
    applyLanguage();
    attachEvents();

    // Curtains always remain closed on load until explicitly opened by user click or Space/Enter
    curtainsOpened = false;
    if (dom.stageCurtains) {
      dom.stageCurtains.classList.remove('curtains-opened');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
