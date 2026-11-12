# CLAUDE.md - Longhand (web)

Instructions for AI assistants working in this repository.

## What this is

The web version of Longhand, Shaun's published daily seven-letter word deduction puzzle (one a day). The Android version lives in the `LONGHAND` repo.

- Live: https://connex222.github.io/LONGHAND-WEB/ (GitHub Pages, updates automatically from `main`)
- Audience: Daily puzzle players on phones.

## Architecture

- **One self-contained file: `index.html`.** All CSS, JavaScript, fonts and artwork live inside it.
- State is saved in browser `localStorage` under `lh.daily`, `lh.practice`, `lh.stats`, `lh.settings`, `lh.seen` and `lh.seenhelp`. New optional `lh.history` stores recent results. **Do not rename or clear an existing key without a migration.** The legacy `_lh` storage-probe name was not a progress key; do not overwrite it.

## Hard rules

- **Fully offline.** No network requests: no CDNs, no fonts or images from the internet, no analytics, no `fetch`.
- **Fonts are embedded** as base64 `woff2` in the `<style id="embedded-fonts">` block at the top of `index.html` (Fontsource, latin subset, variable, SIL Open Font License). Never link to Google Fonts or any other font service.
- **No external dependencies.** Everything stays inside `index.html`.
- Readable in direct sunlight and in the dark (provide both light and dark themes with strong contrast).
- Works one-handed on a phone in portrait, and safe to interrupt at any moment without losing progress.
- Free to use. Do not add adverts, tracking or sign-ups.

## Project notes

- Keep the puzzle rules and daily puzzle sequence identical to the Android version. Verify Android parity before approving any sequence change.
- The fixed answer sequence begins on 12 August 2026 (puzzle No. 1). Existing ordering is protected by the in-app test fingerprint.
- Newly started Practice games must not expose today's or future daily answer. The entire dictionary remains embedded for offline use; source inspection can still expose future solutions.
- See `QA-AND-EDITORIAL.md` for the seven-day test procedure, word-selection review, compatibility checklist and manual release gates.

## Working with Shaun (the owner)

- Shaun is not a programmer. Explain every step in plain English, in order, and assume no prior knowledge.
- Always return the complete `index.html`, never partial snippets or "..." placeholders.
- Use UK English.
- Before saying a change is finished, check that the file still opens with no errors in the browser console.
- Never force-push, rewrite history or rename the repository.
