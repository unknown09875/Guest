# WBPSC Clerkship Study Hub (Advt. No. 12/2024)

An **unofficial** study site for the WBPSC Clerkship Examination 2024 (Advertisement No. 12/2024, detailed advertisement dated 06.10.2026).
It is plain HTML, CSS and JavaScript: no build step, no backend, no accounts, and no network calls.

The official notice at <https://psc.wb.gov.in> always overrides anything on this site.

## Open it

- Double-click `index.html`. It works from `file://`.
- Or serve the folder: `python3 -m http.server 8000` (run inside `wbpsc-clerkship/`), then open <http://localhost:8000>.

## What is inside

| Page | What it does |
| --- | --- |
| Dashboard | Official dates, a countdown to Part-I (your own assumed date), application-deadline countdown, action checklist, progress |
| Syllabus | Exam pattern, official syllabus wording, chapter ticks, qualifying marks, eligibility, exam-day rules |
| Notes | 40 chapters: Arithmetic (13), English (14), General Studies (7), Part-II (6). Chapters marked **extra** are commonly asked but not in the official line |
| Practice | English and GS question bank (original MCQs with explanations). Arithmetic questions are generated fresh, with the answer computed in code |
| Mock test | 100 questions (English 30, GS 40, Arithmetic 30), 90 minutes, +1 right, −0.25 wrong, 0 blank, auto-submit at 00:00, saved history, section tests |
| Part-II writing | Report, précis and translation guides. Group A English; Group B Bengali and Hindi in depth, with general guidance for Urdu, Nepali and Santali |
| Typing | English (target 20 wpm) and Bengali (target 10 wpm): net WPM, gross WPM and accuracy, with live colouring |
| Study planner | A weekly plan from today to your exam date, with ticks saved in the browser |
| Current affairs | Your own log (add, filter, delete, download as text), plus official sources to check |
| Resources | Official links, negative-marking calculator, identity and exam-day rules |

## Folder layout

```
index.html                    the single page the browser loads
assets/css/style.css          layout and components
assets/css/fonts.css          local @font-face rules for Bengali and Devanagari
assets/fonts/                 bundled Noto Sans Bengali and Devanagari subsets (SIL OFL 1.1, see the licence file)
assets/js/arith.js            arithmetic question generator (13 topics)
assets/js/app.js              router, pages, timers and saved state (localStorage)
assets/js/data/exam.js        official facts, subjects, chapter catalogue
assets/js/data/notes-*.js     chapter notes (arithmetic, English, GS, Part-II)
assets/js/data/bank-util.js   helper that shuffles the options of hand-written questions
assets/js/data/q-english.js   English question bank
assets/js/data/q-gs.js        General Studies question bank
assets/js/data/writing.js     Part-II prompts, model answers and typing passages
tests/check-data.js           data and generator checks (no dependencies)
```

Run the checks with `node tests/check-data.js` from this folder. They confirm that every chapter has notes, that every question has four distinct options, an explanation and a valid answer, and that the arithmetic generator is consistent.

## When the official notice changes

Update `assets/js/data/exam.js` first: the dates, fee, age, qualifying percentages, and the links. The notes and the question banks do not depend on the dates.

## Limits (please read)

- **Unofficial.** Not made by or affiliated with the West Bengal Public Service Commission.
- **Not read:** the 7 October 2026 notice on the official site (edit option for OBC sub-category and UR category details). Its file name suggests the edit window may have been extended. Check it on psc.wb.gov.in before you rely on the 28 Oct – 1 Nov dates.
- **Assumptions, not official:** the exam date (1 Dec 2026 is a placeholder), the section test times (proportional to the 90-minute test), and the study plan.
- **Original content only:** the questions are written for this site and are not copied from past papers. Difficulty is approximate.
- **Static facts:** General Studies facts (schemes, awards, dates) are older facts. Check current developments on official sites such as PIB and the West Bengal government portal.
- **Part-II model answers** are for practice only. Do not copy them.
- **No cut-off:** the notice does not publish a Part-I cut-off, so a mock score is not a prediction of selection.
- **Your data stays in this browser.** Progress, mock results and typing scores are stored in localStorage. Clearing site data erases them.
- **Fonts:** Bengali and Hindi text uses the bundled fonts, so it shows on devices without Indic fonts.
- **Bengali typing:** switch your keyboard to Bengali (Unicode) before the typing test. The accuracy check compares characters.
