# Office compatibility test: checklist

The data behind the "Office file compatibility test" article (draft: `data/blog/office-file-compatibility-test.mdx`). Every result must come from Sameera's own testing: nothing here may be filled in from research or guesses.

## Test files

Public downloads in `public/downloads/office-compat-test/`, live at `https://www.techtoolhub.online/downloads/office-compat-test/`:

| File                           | Codes  | What's in it                                                                                                                                    |
| ------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `techtoolhub-compat-test.docx` | D1–D15 | Word: TOC, styles, fonts, lists, tables, images, header/footer, footnote, comment, tracked changes, links, equation, columns, landscape section |
| `techtoolhub-compat-test.xlsx` | X1–X14 | Excel: formulas (incl. XLOOKUP), dates, number formats, conditional formatting, validation, charts, named range, table, note, link              |
| `techtoolhub-compat-test.pptx` | P1–P10 | PowerPoint: layouts, bullets, image, native chart, table, shapes, transitions, notes, link, fonts                                               |

Each section in the files is labelled with its code and has a "What to check" note. The generators are in `docs/compat-test/generators/` (built 2026-11-05).

Not included, because the generator libraries can't create them reliably: Excel pivot tables, dynamic-array formulas (FILTER, UNIQUE), macros, PowerPoint animations and SmartArt. If you want them, make one test file in Microsoft 365 for the web and add codes for it.

## Apps to test

Use the free version of each, on the same Windows PC, latest version on the test date. Record the exact version (Help → About).

| Column in results.csv | App                                  | How to open the files                                                                           |
| --------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `ms365_web`           | Microsoft 365 for the web (baseline) | Upload to OneDrive, open in Word/Excel/PowerPoint online                                        |
| `onlyoffice`          | ONLYOFFICE Desktop Editors           | Open each file                                                                                  |
| `libreoffice`         | LibreOffice (Writer, Calc, Impress)  | Open each file                                                                                  |
| `google`              | Google Docs, Sheets, Slides          | Upload to Drive, open **without converting** (Office editing mode). Note if you had to convert. |
| `wps`                 | WPS Office (free)                    | Open each file                                                                                  |
| `freeoffice`          | SoftMaker FreeOffice                 | Open each file                                                                                  |

Do the baseline first. If something is wrong in Microsoft 365 for the web too, it's a problem with the test file, not the app: note it and skip that code for everyone.

## How to score

For every code, put one of these in `results.csv`:

- **Pass**: looks and works the same as the baseline.
- **Partial**: content is there but something is off (font substituted, layout shifted, feature shows but can't be edited, needed a manual update).
- **Fail**: missing, broken, or wrong value.
- **N/A**: the app can't have the feature at all (say why in notes).

Write a short note for every Partial and Fail (what exactly was wrong). That note becomes the article's evidence.

Then do a **round trip** for each app: save the .docx from that app under a new name, open the saved copy in Microsoft 365 for the web, and note in `roundtrip_notes` what changed. Many suites open files well but damage them on save.

## Screenshots

- One overview screenshot per app per file (18 total), showing the app's own window.
- One screenshot for every Partial and Fail.
- Name them `<app>-<code>.png`, for example `libreoffice-D11.png` or `google-overview-xlsx.png`.
- Save them in `C:\Users\samee\Documents\tech-review-portal\compat-screenshots\` (ignored by git). Claude will crop, compress and move the ones the article uses.

## Per-code checks

### Word (.docx)

| Code | Feature              | Pass when                                                                      |
| ---- | -------------------- | ------------------------------------------------------------------------------ |
| D1   | Table of contents    | Lists D1–D15 with correct page numbers (after updating fields if the app asks) |
| D2   | Heading styles       | Heading 2/3/4 keep their sizes and appear in the navigation pane               |
| D3   | Character formatting | All 12 effects show (bold to 20 pt)                                            |
| D4   | Microsoft fonts      | Calibri, Cambria, Consolas show, or close substitutes with similar line length |
| D5   | Lists                | Bullets, numbering 1–3 with a) b) sub-items                                    |
| D6   | Table                | Merged header across 4 columns, 2-row merge, shading, borders                  |
| D7   | Image wrapping       | Text flows around the logo's right side                                        |
| D8   | Header and footer    | Header text and "Page X of Y" correct on every page                            |
| D9   | Footnote             | Superscript 1 and footnote text at the page bottom                             |
| D10  | Comment              | Comment visible with author "TechToolHub"                                      |
| D11  | Tracked changes      | Insertion and deletion shown; accept-all gives the expected sentence           |
| D12  | Hyperlinks           | External link opens the site; internal link jumps to D15                       |
| D13  | Equation             | Editable a/b + x²                                                              |
| D14  | Two columns          | Section flows in two columns                                                   |
| D15  | Landscape section    | That page is landscape; header/footer continue                                 |

### Excel (.xlsx)

Compare each formula result on the **Formulas** sheet with its **Expected** column.

| Code | Feature                          | Pass when                                                             |
| ---- | -------------------------------- | --------------------------------------------------------------------- |
| X1   | AVERAGE, IF                      | Results match Expected                                                |
| X2   | XLOOKUP, VLOOKUP                 | Both match (XLOOKUP is the one older apps miss)                       |
| X3   | SUMIFS, COUNTIFS                 | Match                                                                 |
| X4   | Date functions                   | Weekday and day count match                                           |
| X5   | Number formats                   | Dates, $ currency and % display correctly                             |
| X6   | Conditional formatting           | Colour scale, data bars, traffic-light icons, bold red above 50       |
| X7   | Data validation                  | F3 has a North/South/East/West drop-down and rejects other text       |
| X8   | Charts                           | Column, line and pie charts show and can be edited                    |
| X9   | Named range                      | `SUM(TotalRevenue)` matches                                           |
| X10  | Merged cells, wrap, frozen panes | Merged box wraps text; header rows stay visible on Sales and Formulas |
| X11  | Cross-sheet reference            | `SUM(Sales!F2:F9)` matches                                            |
| X12  | Excel table                      | Banded table style; structured references `SalesTable[Units]` work    |
| X13  | Cell note                        | Note on F14 visible                                                   |
| X14  | Hyperlink cell                   | F18 opens the site                                                    |

### PowerPoint (.pptx)

Check P7 and P8 in slideshow / presenter mode.

| Code | Feature               | Pass when                                                        |
| ---- | --------------------- | ---------------------------------------------------------------- |
| P1   | Title layout          | Title and subtitle in layout placeholders                        |
| P2   | Multi-level bullets   | Three indent levels                                              |
| P3   | Two-column with image | Text left, logo right, no overlap                                |
| P4   | Native chart          | Chart shows and its data can be edited                           |
| P5   | Table                 | Styled header, banded rows, merged cells in the last row         |
| P6   | Shapes                | Gradient, arrow connector attached, grouped shapes move together |
| P7   | Transitions           | Fade and Push play in slideshow                                  |
| P8   | Speaker notes         | Notes visible on slides 1, 2 and 9                               |
| P9   | Hyperlink             | Link opens the site                                              |
| P10  | Fonts                 | Calibri, Cambria, Consolas or close substitutes                  |
