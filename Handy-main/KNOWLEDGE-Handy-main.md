# KNOWLEDGE — Handy-main

Generated: 2026-05-24 (scan of local repository at c:\Users\euan\Downloads\handy-parrot\Handy-main)

---

## Summary

Handy is an open-source, cross-platform, privacy-first speech-to-text desktop application implemented as a Tauri app (React + TypeScript frontend, Rust backend). It provides local speech transcription (Whisper, Parakeet, Moonshine, SenseVoice, etc.) with configurable shortcuts, an overlay recorder, model management, history, and extensive settings. The repo bundles both the frontend (Vite + React + Tailwind) and the Rust native backend (audio I/O, model loading, transcription, system integrations).

## Quick facts

- Repository path: `c:\Users\euan\Downloads\handy-parrot\Handy-main`
- Frontend: React + TypeScript + Tailwind
- Bundler: Vite
- Backend: Rust (Tauri)
- App product name (tauri.conf.json): `Handy`, version `0.8.3`
- Node package name (package.json): `handy-app`, version `0.8.3`
- Rust crate name (src-tauri/Cargo.toml): `handy`, version `0.8.3`
- License: MIT (Cargo.toml, tauri.conf.json references `MIT`)
- Primary authors/maintainers: `cjpais` (author noted in Cargo.toml / README)

## How to run (developer quick reference)

Scripts (from `package.json`):

- `dev` — start Vite dev server (vite)
- `build` — `tsc && vite build`
- `preview` — vite preview
- `tauri` — `tauri` (Tauri CLI)
- `lint`, `lint:fix` — eslint on `src`
- `format`, `format:check` — prettier + `cargo fmt` for backend
- `test:playwright` — run Playwright tests
- `check:translations` — `bun scripts/check-translations.ts`
- `postinstall` — `bun scripts/check-nix-deps.ts`

Notes from `src-tauri/tauri.conf.json`:
- `beforeDevCommand`: `bun run dev`
- `devUrl`: `http://localhost:1420` (Vite server port)
- `beforeBuildCommand`: `bun run build`
- `frontendDist`: `../dist`

Typical dev flow:
1. Install JS deps (the tree references `bun` in scripts; the repo includes Nix configs — see `BUILD.md` and `scripts/check-nix-deps.ts`).
2. Run the dev server (e.g. `bun run dev` or `npm run dev` depending on your environment).
3. In a separate terminal run `bun run tauri dev` / `npm run tauri` to start the Tauri process.

For packaging: `tauri.conf.json` is configured to bundle artifacts and create updater artifacts (updater endpoints point to GitHub releases).

## Top-level files & important config

- `package.json` — frontend dependencies, scripts (Vite + Tauri + Playwright + formatting)
- `tsconfig.json` — TS config, path aliases (`@/*`, `@/bindings`)
- `vite.config.ts` — Vite config; multiple entry points (main + overlay), port 1420, ignores `src-tauri` for watch
- `README.md` — user-facing project overview, architecture, known issues
- `BUILD.md` — platform-specific build notes (see repo)
- `src/` — React app source
- `src-tauri/` — native Rust backend (Tauri) with `Cargo.toml` and `src/` Rust sources
- `tauri.conf.json` (under `src-tauri/`) — Tauri packaging options, updater config, signing commands
- `tests/` — Playwright tests (e.g. `tests/app.spec.ts`)
- `nix/`, `flake.nix` — Nix build configs

## Frontend (src/) overview

Key folders:
- `src/components/` — UI components split into `settings`, `ui`, `model-selector`, `onboarding`, `overlay` helpers and icons
- `src/overlay/` — overlay UI used while recording (`RecordingOverlay.tsx`, `index.html` for overlay entry)
- `src/stores/` — Pinched local stores (e.g., `modelStore.ts`, `settingsStore.ts`) used to persist state and interact with the backend
- `src/hooks/` — small React hooks like `useOsType.ts`, `useSettings.ts`
- `src/i18n/` — translations and languages (many locale JSON files present)
- `src/lib/` — utilities, constants, types
- `src/bindings.ts` — generated TypeScript bindings (specta exports) when building in debug mode

Notable frontend files read during the scan:
- `src/main.tsx` — sets platform dataset (via `@tauri-apps/plugin-os`), initializes i18n and model store
- `src/App.tsx` — main application shell (UI + sidebar + settings)
- `src/components/settings/*` — many small components that represent granular settings used by the app

## Backend (src-tauri/) overview

The Rust backend is substantial and manages:
- System integrations: global shortcuts, clipboard, tray, autostart, OS-specific permissions
- Audio I/O and processing (via `cpal`, `rodio`, `rubato`, `vad-rs`, `hound`)
- Model management and inference using `transcribe-rs` (Whisper, Parakeet, Moonshine, SenseVoice, etc.)
- Tauri plugin integrations (store, updater, os, process, fs, global-shortcut, autostart, clipboard-manager)
- Managers (Rust modules) for `AudioRecordingManager`, `ModelManager`, `TranscriptionManager`, `HistoryManager`
- LLM client/POST-processing (`llm_client.rs`) used by the post-processing / API providers

Key Rust files / modules located under `src-tauri/src` (non-exhaustive):
- `lib.rs` — application entrypoints and tauri builder wiring
- `main.rs` — binary entrypoint; calls into `handy_app_lib::run`
- `managers/transcription.rs` — model loading, inference orchestration, idle unloading, accelerator handling, panic recovery
- `audio_toolkit/` — VAD, audio resampling, recorder code, utilities
- `llm_client.rs` — HTTP client used for post-processing via OpenAI-compatible APIs (support for structured schema outputs)
- `overlay.rs` / `utils.rs` / `tray.rs` — window/tray/overlay helpers
- `commands/*` — tauri-invokable commands exposed to the frontend (models, audio, history, etc.)

Important design notes observed in the Rust code:
- TranscriptionManager uses careful concurrency: engines are stored behind a Mutex and panics are caught via `catch_unwind` to avoid poisoning the mutex and bringing the app down. Engines are dropped on panic and reloaded later.
- Model unload policies (idle timeout, immediate unload) are configurable in settings and enforced by an idle-watcher thread.
- Accelerator (GPU) enumeration is pre-warmed on a background thread to avoid UI freezes on first query.
- The app generates TypeScript bindings from Rust types during debug builds using `specta` -> `src/bindings.ts`.

## Dependencies (high level)

Frontend highlights (from `package.json`):
- React 18
- Vite, TypeScript
- Tailwind CSS (v4)
- Zustand (state), Zod (validation)
- i18next + react-i18next (i18n)
- @tauri-apps/api and several Tauri JS plugins
- Playwright for tests

Rust highlights (from `src-tauri/Cargo.toml`):
- `tauri` 2.x and many `tauri-plugin-*` crates
- `transcribe-rs` family (whisper_cpp, parakeet, moonshine, etc.)
- `cpal`, `rodio`, `rdev`, `rubato` for audio and input
- `tokio` for async tasks, `reqwest` for HTTP (used by llm_client)
- `rusqlite` for persistent history
- Platform-specific features/patches (custom tauri-runtime and pinned branches in `[patch.crates-io]`)

## Tests

- Playwright E2E tests are present (`tests/app.spec.ts`) and `package.json` contains `test:playwright`.
- The repo has a `playwright.config.ts` at the root for test configuration.

## Packaging & CI hints

- `tauri.conf.json` is configured for bundling across platforms, includes resources, icons and platform-specific options (macOS entitlements, Windows sign command, Linux deb/rpm/appimage settings).
- The Tauri updater is enabled and points to GitHub releases (auto-update endpoints are set).
- There are Nix artifacts in the repo (`flake.nix`, `nix/`) and the `postinstall` script runs a Nix-dependency check (`scripts/check-nix-deps.ts`).

## Notable runtime / developer notes (from README)

- Whisper models can crash on certain configurations (Windows, Linux) — watch the project's issues for mitigation strategies.
- Linux text input requires external utilities for full functionality on Wayland/X11 (e.g., `wtype`, `xdotool`, `dotool`).
- Some features are gated by system permissions (microphone on macOS/Windows) and there's onboarding that may force-show the main window.

## File counts & scan metrics (local)

- Frontend `src/` files scanned: ~143 files (components, i18n locales, settings components, overlay, stores)
- Rust `src-tauri/src/` files scanned: ~48 files (managers, audio_toolkit, commands, utils, lib & main)

## Suggested next steps for maintainers or new contributors

- Read `BUILD.md` for platform-specific build notes (native toolchains, Nix guidelines).
- Ensure `bun` (or your preferred JS runtime) and Rust toolchain (including Tauri prerequisites) are installed.
- Run the Playwright tests locally (`npm run test:playwright` or `bun run test:playwright`) to validate UI behavior.
- Inspect `src-tauri/src/managers/transcription.rs` for model lifecycle logic when investigating performance or crashes.

---

This file was generated by an automated repository scan. It captures top-level structure, major dependencies, runtime behavior, and pointers to important code locations to help onboard contributors or reviewers.
