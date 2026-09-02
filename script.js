/**
 * Mega Lottery Draw - Interactive Stage Controller
 * Unified Single-Cylinder Stage with Exact Pixel Physics Deceleration
 * Matching starting.png, token wheel.png, and winner ui.png
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Prizes Configuration (4 Rounds)
  // =========================================================================
  const PRIZES = [
    {
      id: 1,
      name: 'Samsung 65" 4K UHD Smart TV',
      badge: 'GRAND PRIZE',
      subtitle: 'Crystal 4K Display • HDR 10+ • Dynamic Color • Smart Hub',
      image: 'image/tv.png',
      icon: '📺'
    },
    {
      id: 2,
      name: 'Samsung EcoBubble 8kg Washing Machine',
      badge: 'PREMIUM PRIZE',
      subtitle: 'AI Control • EcoBubble™ • Hygiene Steam Drum • Digital Inverter',
      image: 'image/washing machine.png',
      icon: '🧺'
    },
    {
      id: 3,
      name: '1.5 Ton Inverter Air Conditioner',
      badge: 'LUXURY PRIZE',
      subtitle: 'Dual Inverter Compressor • 5-Star Energy • Fast Turbo Cooling',
      image: 'image/ac.png',
      icon: '❄️'
    },
    {
      id: 4,
      name: 'LG ThinQ Smart Double-Door Refrigerator',
      badge: 'MEGA PRIZE',
      subtitle: 'Smart Inverter • Multi Air Flow • Door Cooling+™ • Frost Free',
      image: 'image/fridge.png',
      icon: '🧊'
    }
  ];

  // =========================================================================
  // 2. State & Storage
  // =========================================================================
  const STORAGE_KEY = 'lottery_system_state_v3';
  let soundEnabled = true;
  let currentRound = 0; // 0 = Draw 1, 1 = Draw 2, 2 = Draw 3, 3 = Draw 4
  let drawnTokens = new Set();
  let winnersHistory = []; // array of { round, prize, token, formattedToken, time }
  let isSpinning = false;
  let masterRafId = null;
  let currentReelDigits = [0, 0, 0, 0]; // Currently displayed digits on reels

  // =========================================================================
  // 3. Ultra-Fast Web Audio Synthesizer (Zero Lag, Pre-Buffered Audio)
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

    // Pre-generate a crisp 20ms mechanical noise click buffer (zero CPU allocation during spin)
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

    // Rapid mechanical click
    playTick() {
      if (!soundEnabled || !this.ctx || !this.clickBuffer) return;
      const now = performance.now();
      if (now - this.lastTickTime < 38) return; // Strict throttle prevents audio overload
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

    // Heavy mechanical latch sound when each reel locks in (ascending pitch)
    playReelLock(index) {
      if (!soundEnabled || !this.ctx) return;
      try {
        const baseFreqs = [146.83, 196.00, 246.94, 329.63]; // D3, G3, B3, E4
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

    // Triumphant Fanfare when winner is revealed
    playFanfare() {
      if (!soundEnabled || !this.ctx) return;
      try {
        const chords = [
          { f: 261.63, t: 0.0, d: 0.15 }, // C4
          { f: 329.63, t: 0.12, d: 0.15 }, // E4
          { f: 392.00, t: 0.24, d: 0.18 }, // G4
          { f: 523.25, t: 0.36, d: 0.45 }, // C5
          { f: 659.25, t: 0.50, d: 0.45 }, // E5
          { f: 783.99, t: 0.65, d: 0.90 }  // G5
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
  // 4. Confetti Engine (Canvas Particle Physics)
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

    start(burstCount = 140) {
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
  // 5. DOM References
  // =========================================================================
  const dom = {
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

    // Stage Views
    showcaseView: document.getElementById('showcase-view'),
    wheelView: document.getElementById('wheel-view'),

    // Showcase Elements
    showcasePrizeImg: document.getElementById('showcase-prize-img'),
    showcasePrizeBadge: document.getElementById('showcase-prize-badge'),
    showcasePrizeTitle: document.getElementById('showcase-prize-title'),
    showcasePrizeSubtitle: document.getElementById('showcase-prize-subtitle'),

    // Winner Elements (Inside unified wheel stage)
    winnerHeaderGroup: document.getElementById('winner-header-group'),
    winnerFlankLeft: document.getElementById('winner-flank-left'),
    winnerFlankRight: document.getElementById('winner-flank-right'),
    winnerFlankImgLeft: document.getElementById('winner-flank-img-left'),
    winnerFlankImgRight: document.getElementById('winner-flank-img-right'),
    winnerLaurelBadge: document.getElementById('winner-laurel-badge'),
    winnerLaurelBadgeTag: document.getElementById('winner-laurel-badge-tag'),
    winnerLaurelTitle: document.getElementById('winner-laurel-title'),

    // Roller Reels (The authoritative single cylinder)
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
    btnNextDraw: document.getElementById('btn-next-draw'),
    btnFinalSummary: document.getElementById('btn-final-summary'),

    // Drawer Elements
    drawerBackdrop: document.getElementById('drawer-backdrop'),
    winnersDrawer: document.getElementById('winners-drawer'),
    btnCloseDrawer: document.getElementById('btn-close-drawer'),
    drawerWinnersList: document.getElementById('drawer-winners-list'),
    btnCopyWinners: document.getElementById('btn-copy-winners'),
    btnResetSession: document.getElementById('btn-reset-session'),

    // Finale Modal Elements
    finaleModal: document.getElementById('finale-modal'),
    finaleGrid: document.getElementById('finale-grid'),
    btnFinaleClose: document.getElementById('btn-finale-close'),
    btnFinaleRestart: document.getElementById('btn-finale-restart')
  };

  // =========================================================================
  // 6. Token Generation & Strip Builder
  // =========================================================================

  // Generate unique token from 1 to 9999
  function generateWinningToken() {
    if (drawnTokens.size >= 9999) {
      alert('All tokens from 1 to 9999 have already won!');
      return 1;
    }
    let candidate;
    do {
      candidate = Math.floor(Math.random() * 9999) + 1;
    } while (drawnTokens.has(candidate));

    drawnTokens.add(candidate);
    return candidate;
  }

  function formatToken(num) {
    return String(num).padStart(4, '0');
  }

  // Build sequential drum strip that starts on `start_d` and ends cleanly on `target_d`
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

  // Set up initial reel view displaying currentReelDigits
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
  // 7. Mechanical Deceleration Physics Model
  // =========================================================================
  /**
   * Calculates continuous position with smooth cubic braking:
   * Phase 1: High speed constant spin (0 to t_spin)
   * Phase 2: Deceleration from v0 to 0 with gradual visible digit steps (t_spin to t_total)
   * Phase 3: Subtle tactile spring settle into the notch
   */
  function calculateReelPosition(t, t_spin, t_decel, D_total) {
    const denom = t_spin + (1.0 / 3.0) * t_decel;
    const v0 = D_total / denom;
    const t_total = t_spin + t_decel;

    if (t <= 0) {
      return 0;
    }
    if (t <= t_spin) {
      return v0 * t;
    }
    if (t < t_total) {
      const tau = (t - t_spin) / t_decel;
      // Integral of v0 * (1 - tau)^2 = v0 * t_decel * (tau - tau^2 + (tau^3)/3)
      const d_decel = v0 * t_decel * (tau - Math.pow(tau, 2) + Math.pow(tau, 3) / 3.0);
      return v0 * t_spin + d_decel;
    }

    // Micro-bounce spring settle (180ms after locking)
    const settleElapsed = t - t_total;
    if (settleElapsed < 0.18) {
      const s = settleElapsed / 0.18;
      const bounce = Math.sin(s * Math.PI) * 4.0 * (1 - s);
      return D_total + bounce;
    }

    return D_total;
  }

  // =========================================================================
  // 8. Core Draw Animation Workflow (Unified Single Cylinder)
  // =========================================================================
  function startDraw() {
    if (isSpinning) return;
    audio.init();
    isSpinning = true;

    // Pick winning token (e.g. 8954 -> ['8', '9', '5', '4'])
    const winningToken = generateWinningToken();
    const tokenStr = formatToken(winningToken);
    const targetDigits = tokenStr.split('').map(Number);

    // Transition view: Hide showcase, reveal unified wheel stage
    dom.showcaseView.style.display = 'none';
    dom.wheelView.style.display = 'flex';

    // Hide winner celebration layers while spinning
    dom.winnerHeaderGroup.style.display = 'none';
    dom.winnerFlankLeft.style.display = 'none';
    dom.winnerFlankRight.style.display = 'none';
    dom.winnerLaurelBadge.style.display = 'none';
    dom.btnSpinWheel.disabled = true;

    // Wait 1 animation frame so DOM has completed layout and rendered height is exact
    requestAnimationFrame(() => {
      // Read exact rendered digit height from slot clientHeight
      const slot = dom.reelSlots[0];
      const digitHeight = slot.clientHeight || 168;

      // Reel configs with staggered deceleration:
      // Reel 0 (Thousands): locks at ~3.2s
      // Reel 1 (Hundreds): locks at ~4.5s
      // Reel 2 (Tens): locks at ~5.9s
      // Reel 3 (Ones - THE FINALE!): locks at ~7.8s after slow crawl
      const reelConfigs = [
        { minDigits: 36, t_spin: 1.6, t_decel: 1.6 },
        { minDigits: 52, t_spin: 2.6, t_decel: 1.9 },
        { minDigits: 70, t_spin: 3.7, t_decel: 2.2 },
        { minDigits: 92, t_spin: 5.0, t_decel: 2.8 }
      ];

      const reels = targetDigits.map((targetDigit, i) => {
        const startDigit = currentReelDigits[i];
        const cfg = reelConfigs[i];
        const digitsSequence = generateStripSequence(startDigit, targetDigit, cfg.minDigits);
        const totalDistance = (digitsSequence.length - 1) * digitHeight;
        const totalTime = cfg.t_spin + cfg.t_decel;

        // Populate DOM reel strip
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
          totalDistance,
          t_spin: cfg.t_spin,
          t_decel: cfg.t_decel,
          totalTime,
          lastPassedDigit: -1,
          isLocked: false
        };
      });

      const startTime = performance.now();

      // Unified Master Animation Loop
      function animationLoop(now) {
        const elapsedSec = (now - startTime) / 1000;
        let allLocked = true;

        for (let i = 0; i < 4; i++) {
          const r = reels[i];
          if (!r.isLocked) {
            const currentY = calculateReelPosition(elapsedSec, r.t_spin, r.t_decel, r.totalDistance);
            r.strip.style.transform = `translate3d(0, -${currentY.toFixed(1)}px, 0)`;

            // Play tick when a digit threshold is crossed
            const currentPassed = Math.floor(currentY / digitHeight);
            if (currentPassed > r.lastPassedDigit) {
              r.lastPassedDigit = currentPassed;
              audio.playTick();
            }

            // Check if reel completed
            if (elapsedSec >= r.totalTime + 0.18) {
              r.isLocked = true;
              // Snap with 0.0px error exactly to target distance
              r.strip.style.transform = `translate3d(0, -${r.totalDistance}px, 0)`;
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
          // All 4 reels stopped on the exact target digits!
          currentReelDigits = [...targetDigits];

          // Suspenseful 600ms breath before celebration reveals
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

    // Populate flanking prizes and plaque details
    dom.winnerFlankImgLeft.src = currentPrize.image;
    dom.winnerFlankImgRight.src = currentPrize.image;
    if (dom.winnerLaurelBadgeTag) dom.winnerLaurelBadgeTag.textContent = currentPrize.badge;
    if (dom.winnerLaurelTitle) dom.winnerLaurelTitle.textContent = currentPrize.name;

    // Reveal winner elements around the existing cylinder!
    dom.winnerHeaderGroup.style.display = 'flex';
    dom.winnerFlankLeft.style.display = 'flex';
    dom.winnerFlankRight.style.display = 'flex';
    dom.winnerLaurelBadge.style.display = 'inline-flex';

    // Celebration sounds and confetti
    audio.playFanfare();
    confetti.start(160);

    // Update Bottom Buttons
    dom.btnSpinWheel.style.display = 'none';
    if (currentRound < 3) {
      dom.btnNextDraw.style.display = 'inline-flex';
      dom.btnNextDraw.querySelector('span:first-child').textContent = `CLAIM & NEXT DRAW (${currentRound + 2}/4)`;
    } else {
      dom.btnNextDraw.style.display = 'none';
      dom.btnFinalSummary.style.display = 'inline-flex';
    }

    updateNavigationStatus();
    renderWinnersDrawer();
  }

  // Move to next draw (e.g. Draw 2, Draw 3, Draw 4)
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
    dom.showcasePrizeImg.src = prize.image;
    dom.showcasePrizeBadge.textContent = prize.badge;
    dom.showcasePrizeTitle.textContent = prize.name;
    dom.showcasePrizeSubtitle.textContent = prize.subtitle;
  }

  // Update top navigation bar
  function updateNavigationStatus() {
    const prize = PRIZES[currentRound];
    if (dom.navRoundText) dom.navRoundText.textContent = `DRAW ${currentRound + 1} OF 4`;
    if (dom.navPrizeName) dom.navPrizeName.textContent = prize ? `${prize.icon} ${prize.name}` : 'Draw Completed';
    if (dom.drawerBtnBadge) dom.drawerBtnBadge.textContent = `Winners (${winnersHistory.length}/4)`;
  }

  // =========================================================================
  // 9. Winners Drawer & Finale Modals
  // =========================================================================
  function renderWinnersDrawer() {
    dom.drawerWinnersList.innerHTML = '';

    PRIZES.forEach((prize, idx) => {
      const winner = winnersHistory.find(w => w.round === idx + 1);
      const card = document.createElement('div');
      card.className = `winner-card ${winner ? 'won' : ''}`;

      card.innerHTML = `
        <div class="winner-card-thumb">
          <img src="${prize.image}" alt="${prize.name}" />
        </div>
        <div class="winner-card-info">
          <div class="winner-card-round">DRAW ${idx + 1} • ${prize.badge}</div>
          <div class="winner-card-title">${prize.name}</div>
          ${
            winner
              ? `<div class="winner-card-token">🎟️ TOKEN: #${winner.formattedToken}</div>`
              : `<div class="winner-card-status-pending">Awaiting Draw...</div>`
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
    dom.finaleGrid.innerHTML = '';

    PRIZES.forEach((prize, idx) => {
      const winner = winnersHistory.find(w => w.round === idx + 1);
      const item = document.createElement('div');
      item.className = 'finale-winner-item';

      item.innerHTML = `
        <div class="finale-item-badge">DRAW ${idx + 1} • ${prize.badge}</div>
        <div class="finale-thumb">
          <img src="${prize.image}" alt="${prize.name}" />
        </div>
        <div class="finale-item-title">${prize.name}</div>
        <div class="finale-item-token">🎟️ #${winner ? winner.formattedToken : '----'}</div>
      `;
      dom.finaleGrid.appendChild(item);
    });

    dom.finaleModal.classList.add('active');
    confetti.start(100);
  }

  function copyWinnersList() {
    if (winnersHistory.length === 0) {
      alert('No winners drawn yet!');
      return;
    }

    let text = '🏆 MEGA LOTTERY DRAW WINNERS 🏆\n==============================\n\n';
    winnersHistory.forEach(w => {
      text += `• Draw ${w.round}: ${w.prize.name}\n  Winner Token: #${w.formattedToken} (Time: ${w.time})\n\n`;
    });
    text += 'Congratulations to all winning tokens!';

    navigator.clipboard.writeText(text).then(() => {
      const originalText = dom.btnCopyWinners.textContent;
      dom.btnCopyWinners.textContent = '✅ Copied to Clipboard!';
      setTimeout(() => {
        dom.btnCopyWinners.textContent = originalText;
      }, 2500);
    }).catch(() => {
      alert(text);
    });
  }

  function resetSession() {
    const confirmReset = confirm(
      'Are you sure you want to reset the entire lottery draw session? All current winning tokens will be cleared.'
    );
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
    currentReelDigits = [0, 0, 0, 0];
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

    updateNavigationStatus();
    renderWinnersDrawer();
  }

  // =========================================================================
  // 10. State Persistence (LocalStorage)
  // =========================================================================
  function saveState() {
    try {
      const payload = {
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
        updateSoundButton();
      }

      if (winnersHistory.length >= 4) {
        currentRound = 3;
        const lastWinner = winnersHistory[3];
        currentReelDigits = lastWinner.formattedToken.split('').map(Number);
        dom.showcaseView.style.display = 'none';
        dom.wheelView.style.display = 'flex';
        renderStaticReels();
        completeDraw(lastWinner.token, lastWinner.formattedToken);
      } else if (winnersHistory.length > 0) {
        currentRound = winnersHistory.length;
        setupShowcaseForCurrentRound();
        renderStaticReels();
      }
    } catch (e) {}
  }

  // =========================================================================
  // 11. Sound & Fullscreen Controls
  // =========================================================================
  function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundButton();
    saveState();
  }

  function updateSoundButton() {
    dom.soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    dom.soundText.textContent = soundEnabled ? 'Sound On' : 'Muted';
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      dom.fullscreenIcon.textContent = '🗗';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      dom.fullscreenIcon.textContent = '⛶';
    }
  }

  // =========================================================================
  // 12. Event Listeners & Bootstrap
  // =========================================================================
  function attachEvents() {
    dom.btnSpinWheel.addEventListener('click', startDraw);
    dom.btnNextDraw.addEventListener('click', nextDraw);
    dom.btnFinalSummary.addEventListener('click', showFinalSummary);

    dom.btnSound.addEventListener('click', toggleSound);
    dom.btnFullscreen.addEventListener('click', toggleFullscreen);

    dom.btnOpenDrawer.addEventListener('click', () => toggleDrawer(true));
    dom.btnCloseDrawer.addEventListener('click', () => toggleDrawer(false));
    dom.drawerBackdrop.addEventListener('click', () => toggleDrawer(false));
    dom.btnCopyWinners.addEventListener('click', copyWinnersList);
    dom.btnResetSession.addEventListener('click', resetSession);

    dom.btnFinaleClose.addEventListener('click', () => {
      dom.finaleModal.classList.remove('active');
    });
    dom.btnFinaleRestart.addEventListener('click', resetSession);

    function toggleTopNav() {
      if (dom.topNavHud) {
        dom.topNavHud.classList.toggle('hud-hidden');
      }
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space' && !isSpinning && dom.showcaseView.style.display !== 'none') {
        e.preventDefault();
        startDraw();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleTopNav();
      }
      if (e.code === 'Escape') {
        toggleDrawer(false);
        dom.finaleModal.classList.remove('active');
      }
    });
  }

  function init() {
    renderStaticReels();
    setupShowcaseForCurrentRound();
    updateNavigationStatus();
    renderWinnersDrawer();
    attachEvents();
    loadState();
    updateSoundButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
