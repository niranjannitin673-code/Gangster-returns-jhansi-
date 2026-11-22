# Gangster Returns: Jhansi

**Hero:** Robin  
**Prototype:** Android-first browser game using Three.js + Vite + Capacitor.

> This is a first playable foundation, not a finished GTA-scale game. The current build contains a procedural city block, a placeholder third-person hero, one arcade-style car, touch controls, and a basic HUD.

## Run in GitHub Codespaces

1. Create a GitHub repository named `gangster-returns-jhansi`.
2. Upload the contents of this ZIP to the repository root (keep `.github` visible).
3. Open the repository in Codespaces.
4. In the terminal run:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

5. Open the forwarded port 5173 preview.

## Build Android APK with GitHub Actions

1. Push the project to the `main` branch.
2. Open **Actions** → **Build Android APK**.
3. Select **Run workflow** if it has not started automatically.
4. When the run succeeds, open its run page → **Artifacts** → download `gangster-returns-jhansi-debug-apk`.

The artifact is a **debug APK for testing**, not a Play Store release. A release build needs signing credentials stored as GitHub Actions secrets and a release workflow.

## Controls

- Left virtual stick: move / steer
- Jump: jump on foot
- Enter: enter a nearby car
- Gas / Brake: drive
- Keyboard fallback: WASD, Shift to sprint, Space to jump, E to enter/exit

## Current prototype limitations

- Placeholder character and car geometry; no licensed art assets included.
- City is procedural and intentionally compact for mobile performance.
- Vehicle handling is arcade-style, not a full suspension/tyre simulation.
- No combat, police, NPC schedules, missions, save system, voice acting, or final soundtrack yet.
- 60 FPS cannot be guaranteed across Android devices; profile on target phones and add quality tiers.

## Planned milestones

1. Stable mobile vertical slice: movement, camera, car, touch controls.
2. Jhansi district map: old-city/Laxmi Darwaza market zone, Jhansi Fort skyline, Rani Mahal area, railway/freight belt, civic/park belt, and outer countryside. The map is fictionalized and compressed for mobile play.
3. Story missions adapted from the user's 29-scene screenplay.
4. NPCs, traffic, wanted system, combat and mission progression.
5. Optimization, device testing, signed release APK/AAB.

## Story adaptation note

**Setting decision locked:** the entire campaign is relocated to Jhansi. There is no Mumbai prologue. See `docs/story-bible.md` for the Jhansi relocation guide, landmark anchors, and adaptation guardrails. The screenplay's 29-scene order and moral arc remain the source of the campaign.
