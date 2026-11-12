# LONGHAND — daily-puzzle editorial and QA gate

**Scope:** web development branch `improvement/longhand-daily`. This document does not authorise merging or deployment.

## Product contract

- Exactly seven letters per guess; all accepted guesses come from the fixed embedded `VALID` set.
- Duplicate letters are scored by **exact matches first**, then remaining occurrences assigned left to right. Extra copies are absent.
- The canonical daily sequence begins **12 August 2026 = No. 1**, with a **local-calendar-date** boundary at midnight. DST changes do not skip or duplicate a numbered puzzle.
- Keep the **1,245 existing answers in exactly the existing order** and retain the 33,552-word accepted-guess corpus. Current ordered-answer fingerprint: **FNV-1a `a050d5e6`** over the newline-joined answer words. A changed fingerprint blocks release unless approved with parity checked on Android.
- An already-started daily game retains its saved answer, rows, hard-mode flag and accepted guesses after reload; a queued midnight change must not silently replace that game.
- A newly started Practice game may only draw from **already published** daily puzzles; an existing Practice save may be continued. Practice never counts towards daily statistics.
- Existing storage keys (`lh.daily`, `lh.practice`, `lh.stats`, `lh.settings`, `lh.seen`, `lh.seenhelp`) remain valid. New detailed history uses the optional `lh.history` key.
- "Win run" means consecutive **played** puzzles won; missing a calendar day does not reset it. A loss does. This is an explicit, non-punitive product choice.

## Reproducible seven-day sequence

Open a copy of the development branch's `index.html?test` in a browser. The built-in test page checks the following dates **without displaying the answer words**.

| Day | Local calendar date | Puzzle number |
|---|---|---|
| 1 | 12 Aug 2026 | 1 |
| 2 | 13 Aug 2026 | 2 |
| 3 | 14 Aug 2026 | 3 |
| 4 | 15 Aug 2026 | 4 |
| 5 | 16 Aug 2026 | 5 |
| 6 | 17 Aug 2026 | 6 |
| 7 | 18 Aug 2026 | 7 |

On each date, verify the puzzle number advances by exactly one; the same number yields the same seven-letter solution; different numbers yield distinct words in this window; and a reload resumes the same accepted guesses. Test a 23:59 → 00:00 transition with a **new** game and separately with an **unfinished** game: a new game advances, while an unfinished one stays pinned until completed. The automated suite also checks 29 March 2026 and 25 October 2026 UK DST calendar changes, the 31 December / 1 January boundary, answer-list fingerprint, and the Practice eligibility cutoff.

**Duplicate-letter reference cases** (first word is the guess, second is the answer; `E` exact, `P` present elsewhere, `.` absent):

| Guess / answer | Expected |
|---|---|
| BALLADS / BALLOON | `EEEE...` |
| TESTERS / LETTERS | `PE.EEEE` |
| DRESSED / ADDRESS | `PPPPP.P` |
| SEASIDE / SUCCESS | `EP.P...` |
| STATUTE / TATTOOS | `PPPE.P.` |
| MARGATE / GRAMMAR | `PPPPP..` |
| SUNRISE / REISSUE | `PP.PPPE` |

## Editorial word selection and exceptions

The accepted-guess dictionary is **not** an editorial answer list. A word being accepted as a guess does not justify making it a daily solution.

For each future candidate, an editor must assess: (1) recognisability by a general UK-English audience; (2) ordinary spelling, including fair UK/US variants; (3) unambiguous seven-letter form; (4) duplicate-letter difficulty; (5) avoidance of bare inflections, obscure jargon, proper nouns, offensive slurs and region-specific traps; and (6) fairness against recently scheduled words.

Use the following severity levels:

- **Green:** Common word, familiar sense, reasonable chance of recognition; suitable without an exception.
- **Amber:** Reasonably solvable but uncommon, variant-sensitive or repeated-letter-heavy; requires a second human reviewer and an explicit reason.
- **Red:** Proper name, trivial grammatical inflection, extremely obscure or contentious answer; do not schedule without a documented product exception.

Maintain an **unpublished editorial exceptions register** with puzzle number, category, reason, reviewer, review date and approval decision. Do not put future answer words into PR descriptions, screenshots or public documentation. Review at least the next 14 unpublished dates before release, then recheck before each extension. Existing published dates and an active day's saved answer must never be silently replaced. An answer schedule change requires explicit owner approval and Android parity checking.

## Automated checks executed on this branch

- **42/42 built-in JavaScript checks passed** in a controlled runtime: exact/partial/missing marks, duplicates, hard-mode deductions, seven-day dates, DST boundaries, dictionary validity, saved cursor and frozen answer fingerprint.
- **14/14 state/recovery simulations passed**: interrupted reveal, idempotent result counting, day rollover, frozen active answer, saved hard-mode setting, Practice cutoff and win-run semantics.
- The tests cover game logic and state. They do **not** establish actual browser rendering, screen-reader speech quality, Android parity, or complete device coverage.

## Manual acceptance checks still required

| Area | Checks | Status |
|---|---|---|
| Mobile portrait | iOS Safari + Android Chrome, virtual keyboard and touch, 320px width, short viewport | Not yet run |
| Desktop | Chrome/Edge/Firefox, keyboard typing, cursor editing, Enter/Backspace and Tab focus | Not yet run |
| Screen reader | VoiceOver and NVDA/TalkBack: tile labels, live result feedback, modal focus return and dialog trap | Not yet run |
| Motion and colour | OS reduced motion; dark/light; hue-independent tick/dot recognition; sunlight readability | Not yet run |
| Persistence | Mid-reveal refresh, local storage disabled/full, clock rollback, restore an existing live user's saved data | Simulated, browser run still required |
| Offline | Open the single file with networking disabled; confirm no remote font, script or data requests | Source-checked, browser run still required |
| Android parity | Confirm schedule and scoring against the separate Android repository | Blocked: Android repository not accessible in this session |

## Explicit design limitation

This is a self-contained **fully offline public HTML file** containing the whole future answer sequence. Therefore it is **not possible to cryptographically prevent** technically motivated users from inspecting future solutions. The safe, compatible mitigation here is to avoid showing future answers in normal UI/Practice; genuine embargo enforcement would require an online daily-delivery architecture and an approved change to the offline contract.

**Release decision:** do not merge or deploy until owner approval, Android parity review, editorial sign-off and the manual accessibility/browser checks above.
