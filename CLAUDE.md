# CLAUDE.md - Longhand (web)

Instructions for AI assistants working in this repository.

## What this is

The web version of Longhand, Shaun's published daily seven-letter word deduction puzzle (one a day). The Android version lives in the `LONGHAND` repo.

- Live: https://connex222.github.io/LONGHAND-WEB/ (GitHub Pages, updates automatically from `main`)
- Audience: Daily puzzle players on phones.

## Architecture

- **One self-contained file: `index.html`.** All CSS, JavaScript, fonts and artwork live inside it.
- State is saved in the browser's `localStorage`. Saved under the key `_lh`. Never rename an existing key without migrating the old data, or players lose their progress.

## Hard rules

- **Fully offline.** No network requests: no CDNs, no fonts or images from the internet, no analytics, no `fetch`.
- **Known issue:** this web copy loads its fonts from Google Fonts (`fonts.googleapis.com`). That is the only network request and it breaks the offline rule. The fix is to embed the fonts as base64 `woff2` inside `index.html`. Do not add any other network requests.
- **No external dependencies.** Everything stays inside `index.html`.
- Readable in direct sunlight and in the dark (provide both light and dark themes with strong contrast).
- Works one-handed on a phone in portrait, and safe to interrupt at any moment without losing progress.
- Free to use. Do not add adverts, tracking or sign-ups.

## Project notes

- Keep the puzzle rules and daily puzzle sequence identical to the Android version.

## Working with Shaun (the owner)

- Shaun is not a programmer. Explain every step in plain English, in order, and assume no prior knowledge.
- Always return the complete `index.html`, never partial snippets or "..." placeholders.
- Use UK English.
- Before saying a change is finished, check that the file still opens with no errors in the browser console.
- Never force-push, rewrite history or rename the repository.
