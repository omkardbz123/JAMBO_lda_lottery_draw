# 🎰 Mega Lottery Draw System (4 Withdrawals • Tokens 1 - 9999)

A luxury casino/event-grade static interactive lottery draw web application designed to run smoothly on stage projections, big screens, tablets, and desktops.

Live UI recreation built to match the high-end reference mockups with futuristic neon cyan cylindrical reels, golden 3D celebration banners, Web Audio sound effects, and confetti physics.

---

## ✨ Features

- **4 Draw Rounds (Withdrawals)**:
  1. **Draw 1**: Samsung 65" 4K UHD Smart TV (`image/tv.png`)
  2. **Draw 2**: Samsung EcoBubble 8kg Washing Machine (`image/washing machine.png`)
  3. **Draw 3**: 1.5 Ton Inverter Air Conditioner (`image/ac.png`)
  4. **Draw 4**: LG ThinQ Smart Double-Door Refrigerator (`image/fridge.png`)
- **Strict Token Range**: Numbers from **`1` to `9999`** formatted as 4-digit tokens (e.g. `0001` - `9999`).
- **Zero Duplicate Guarantee**: Once a token is drawn, it is mathematically blocked from winning in subsequent rounds.
- **3-Stage Visual Experience**:
  - **State 1 (Standby Showcase)**: Current prize floating with light reflection on the illuminated circular stage and glowing neon cyan **SPIN THE WHEEL** button (matches `starting .png`).
  - **State 2 (Spinning Wheel)**: 3D slot-machine cylinder capsule floating over the stage with 4 independent reels rolling at high speed with mechanical tick sounds and staggered deceleration (matches `token wheel.png`).
  - **State 3 (Winner Celebration)**: Glowing script *"Congratulations!"*, purple ribbon *"YOU ARE THE"*, 3D metallic gold *"WINNER"*, golden laurel wreath prize badge, falling celebratory confetti, and victory fanfare (matches `winner ui.png`).
- **Interactive Audio**: 100% self-contained Web Audio API synthesizer for reel clicks, reel latch notes, and victory fanfares (works offline, no external audio files required).
- **Presentation Controls**:
  - **Full Screen Toggle (⛶)**: Ideal for live events and projector screens.
  - **Mute / Unmute (🔊/🔇)**: Instant sound toggle.
  - **Winners Board (🏆)**: Slide-out drawer tracking completed draws and winning token numbers.
  - **Grand Finale Summary**: Full 4-prize winner showcase with clipboard copy and reset options.
  - **Session Persistence**: Draws saved in browser `localStorage` to guard against accidental reloads.

---

## 🚀 How to Run Locally

Because this is a pure static web application, you can view it directly in any browser:

### Option 1: Direct File
Double-click `index.html` to open it in Chrome, Edge, Firefox, or Safari.

### Option 2: Local HTTP Server (Recommended)
Run with Python:
```bash
python -m http.server 8080
```
Then open your browser to `http://localhost:8080`.

---

## 🌐 How to Deploy on GitHub Pages

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Mega Lottery Draw System"
   ```

2. **Push to your GitHub Repository**:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** &rarr; **Pages** (in the left sidebar).
   - Under **Build and deployment** &gt; **Source**, choose **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/(root)`.
   - Click **Save**.
   - Within 1-2 minutes, your website will be live at:
     `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## 📁 File Structure

```
lottery system/
├── index.html               # Main HTML markup with 3-stage UI structure
├── style.css                # Master CSS with 3D transforms, neon glows, and responsive layout
├── script.js                # Lottery state engine, Web Audio synth, reel tumbler physics, confetti
├── README.md                # Documentation & deployment guide
└── image/
    ├── background.jpg       # Original high-res background stage
    ├── background_opt.jpg   # Web-optimized 4K background for instant loading
    ├── tv.png               # Samsung 65" TV transparent asset
    ├── washing machine.png  # Washing Machine transparent asset
    ├── ac.png               # Inverter AC transparent asset
    ├── fridge.png           # Smart Refrigerator transparent asset
    └── game UI/             # Reference mockups (starting, token wheel, winner ui)
```
