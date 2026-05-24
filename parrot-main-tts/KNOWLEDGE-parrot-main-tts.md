# KNOWLEDGE — parrot-main-tts

Generated: 2026-05-24 (scan of local repository at c:\Users\euan\Downloads\handy-parrot\parrot-main-tts)

---

## Summary

Parrot is an open-source, cross-platform desktop text-to-speech application that runs entirely offline. It is implemented as a Tauri application: a React + TypeScript frontend and a Rust backend (Tauri). The backend uses `tts-rs` (Kokoro voice model) to synthesize speech locally (model ~115 MB), provides an overlay UI for playback, and supports shortcuts to speak selected text from any app.

## Quick facts

- Repository path: `c:\Users\euan\Downloads\handy-parrot\parrot-main-tts`
- Frontend: React + TypeScript + Tailwind
- Bundler: Vite
- Backend: Rust (Tauri)
- Node package name (package.json): `parrot-app`, version `2026.2.4`
- Rust crate name (src-tauri/Cargo.toml): `parrot`, version `26.2.4`
- License: MIT
- Primary author/maintainer: Rishi Khare (`rishiskhare`), repository references: `https://github.com/rishiskhare/parrot`

## How to run (developer quick reference)

Scripts (from `package.json`):

- `dev` — start Vite dev server
- `build` — `tsc && vite build`
- `preview` — vite preview
- `tauri` — `tauri` (Tauri CLI)
- `lint`, `lint:fix` — eslint on `src`
- `format`, `format:check` — prettier + `cargo fmt`
- `test:playwright` — run Playwright tests
- `check:translations` — `bun scripts/check-translations.ts`

Notes from `src-tauri/tauri.conf.json`:
- `beforeDevCommand`: `bun run dev`
- `devUrl`: `http://localhost:1420`
- `beforeBuildCommand`: `bun run build`
- `frontendDist`: `../dist`

Typical dev flow similar to Handy: ensure JS deps (the repo references `bun`), start the dev server and run Tauri dev.

## Top-level files & important config

- `package.json`, `tsconfig.json`, `vite.config.ts` — front-end config and scripts
- `README.md` — product overview (features, models, install)
- `src/` — React app source, overlay UI, components and i18n
- `src-tauri/` — Rust backend; `Cargo.toml` and `src/` rust sources
- `tauri.conf.json` — Tauri packaging options, updater config
- `nix/`, `flake.nix` — Nix build configs

## Frontend (src/) overview

- `src/overlay/` — overlay that appears during speaking (`SpeakingOverlay.tsx`)
- `src/stores/` — `modelStore.ts` and `settingsStore.ts`
- `src/components/` — settings, onboarding, icons and shared UI components
- `src/i18n/` — translations (many locales are present)
- `src/bindings.ts` — generated types when specta exports are enabled during debug builds

## Backend (src-tauri/) overview

Major responsibilities:
- Local TTS synthesis using `tts-rs` (Kokoro model)
- Model management: downloading, selecting, preloading and unloading TTS models
- Audio playback and device management (cpal/rodio)
- Tray integration, overlay window, and global shortcuts
- Managers include `TTSManager`, `ModelManager`, and `HistoryManager`

Key Rust modules found under `src-tauri/src`:
- `managers/tts.rs` — TTS model lifecycle, preloading, streaming playback
- `lib.rs` / `main.rs` — tauri app wiring and run() implementation
- `audio_toolkit/` — shared audio helpers and resampling
- `text_normalization.rs` — helpers for cleaning / normalizing text for synthesis
- `commands/*` — tauri-invokable commands (models, audio, history, etc.)

Additional implementation details:
- Parrot bundles or references `espeak-ng` artifacts for phoneme/data support in Kokoro params (helper code in `lib.rs` to resolve bundled espeak paths)
- The TTS pipeline supports streaming playback so audio can begin before synthesis completes

## Dependencies (high level)

Frontend highlights (from `package.json`):
- React, Vite, TypeScript, Tailwind
- i18next, zustand, zod, sonner (notifications)
- Playwright for tests

Rust highlights (from `src-tauri/Cargo.toml`):
- `tauri` 2.x and `tauri-plugin-*`
- `tts-rs` with the `kokoro` feature (local TTS support)
- `cpal`, `rodio` for audio playback
- `rusqlite` for history storage
- `tokio`, `reqwest`, etc.

## Tests

- Playwright E2E tests are present and `package.json` includes a `test:playwright` script.

## Packaging & updater

- `tauri.conf.json` contains bundling options, resources and icons, and the updater endpoint pointing at GitHub releases for `parrot`.
- The `parrot` Cargo manifest includes release/build settings (LTO, panic=abort in release) and platform-specific dependencies (Windows features, GTK/Wayland flags for Linux).

## Notable runtime / developer notes (from README)

- Parrot downloads a Kokoro model (~115 MB) on first run; the model runs offline afterwards.
- Parrot supports 9 languages and many voices (voice-list embedded in README).
- Global shortcuts and Wayland compatibility notes are documented; the repo mentions `wtype`/`xdotool`/`dotool` guidance like Handy.

## File counts & scan metrics (local)

- Frontend `src/` files scanned: ~118 files
- Rust `src-tauri/src/` files scanned: ~37 files

## Suggested next steps for maintainers or new contributors

- Read `README.md` for product-specific behavior (model download, voice lists, keyboard shortcuts)
- For native dev, confirm Rust toolchain and Tauri prerequisites; check `BUILD.md` if present in the repo root
- Run the Playwright tests to validate overlay and speaking flows

---

This file was generated by an automated local repository scan. It highlights the architecture, main runtime responsibilities, important files and commands, and pointers for onboarding and development.
