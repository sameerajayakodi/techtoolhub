// Builds techtoolhub-compat-test.docx. Run from a folder with `npm i docx@9.15.2`:
//   node make-docx.mjs <out.docx> <logo.png>
import fs from 'fs'
import {
  AlignmentType, Bookmark, BorderStyle, CommentRangeEnd, CommentRangeStart, CommentReference,
  DeletedTextRun, Document, ExternalHyperlink, Footer, FootnoteReferenceRun, Header,
  HeadingLevel, HighlightColor, HorizontalPositionRelativeFrom, ImageRun, InsertedTextRun,
  InternalHyperlink, LevelFormat, Math as OMath, MathFraction, MathRun, MathSuperScript,
  Packer, PageBreak, PageNumber, PageOrientation, Paragraph, SectionType, ShadingType, Table,
  TableCell, TableOfContents, TableRow, TextRun, TextWrappingType, VerticalAlign,
  VerticalPositionRelativeFrom, WidthType,
} from 'docx'

const OUT = process.argv[2]
const logo = fs.readFileSync(process.argv[3])
const DATE = '2026-11-05T09:00:00Z'
const AUTHOR = 'TechToolHub'

const code = (c, title) =>
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(`${c} · ${title}`)] })
const check = (text) =>
  new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text: 'What to check: ', bold: true, color: '4F46E5' }), new TextRun(text)],
  })
const p = (...children) =>
  new Paragraph({ spacing: { after: 120 }, children: children.map((c) => (typeof c === 'string' ? new TextRun(c) : c)) })

const cell = (text, opts = {}) =>
  new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: opts.bold, color: opts.color })] })],
    shading: opts.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: opts.fill } : undefined,
    columnSpan: opts.columnSpan,
    rowSpan: opts.rowSpan,
    verticalAlign: VerticalAlign.CENTER,
  })

const intro = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('TechToolHub Office compatibility test: Word document')] }),
  p('This file was made to test how well other office suites open Microsoft Word (.docx) files. Each section below tests one feature and is labelled with a code (D1, D2…) that matches the checklist. Open the file, go through each section, and compare what you see with the "What to check" note.'),
  p('Source and results: https://www.techtoolhub.online'),
  code('D1', 'Table of contents'),
  check('A table of contents appears below, listing D1 to D15 with page numbers. Some apps ask you to update fields first; if it stays empty after updating, mark it as a fail.'),
  new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-2' }),
  new Paragraph({ children: [new PageBreak()] }),
]

const body = [
  code('D2', 'Heading styles'),
  check('The three lines below use the built-in Heading 2, Heading 3 and Heading 4 styles, each smaller than the last, and show up as headings in the app\'s navigation pane.'),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Heading 2 example')] }),
  new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun('Heading 3 example')] }),
  new Paragraph({ heading: HeadingLevel.HEADING_4, children: [new TextRun('Heading 4 example')] }),

  code('D3', 'Character formatting'),
  check('Each word looks the way it describes itself.'),
  p(
    new TextRun({ text: 'Bold', bold: true }), ', ',
    new TextRun({ text: 'italic', italics: true }), ', ',
    new TextRun({ text: 'underline', underline: {} }), ', ',
    new TextRun({ text: 'double underline', underline: { type: 'double' } }), ', ',
    new TextRun({ text: 'strikethrough', strike: true }), ', ',
    new TextRun({ text: 'yellow highlight', highlight: HighlightColor.YELLOW }), ', ',
    new TextRun({ text: 'red text', color: 'C00000' }), ', ',
    new TextRun({ text: 'SMALL CAPS', smallCaps: true }), ', H', new TextRun({ text: '2', subScript: true }), 'O, x',
    new TextRun({ text: '2', superScript: true }), ', ',
    new TextRun({ text: '8 pt', size: 16 }), ', ', new TextRun({ text: '20 pt', size: 40 }), '.'
  ),

  code('D4', 'Microsoft fonts'),
  check('The first line is in Calibri, the second in Cambria, the third in Consolas. If the app doesn\'t have a font it substitutes another; note whether the line length and look stay close to the original.'),
  p(new TextRun({ text: 'Calibri: The quick brown fox jumps over the lazy dog 0123456789', font: 'Calibri', size: 24 })),
  p(new TextRun({ text: 'Cambria: The quick brown fox jumps over the lazy dog 0123456789', font: 'Cambria', size: 24 })),
  p(new TextRun({ text: 'Consolas: The quick brown fox jumps over the lazy dog 0123456789', font: 'Consolas', size: 24 })),

  code('D5', 'Bulleted, numbered and multi-level lists'),
  check('Bullets, then a numbered list 1–3 where item 2 has sub-items a and b, indented under it.'),
  new Paragraph({ text: 'First bullet', bullet: { level: 0 } }),
  new Paragraph({ text: 'Second bullet', bullet: { level: 0 } }),
  new Paragraph({ text: 'Numbered item 1', numbering: { reference: 'num', level: 0 } }),
  new Paragraph({ text: 'Numbered item 2', numbering: { reference: 'num', level: 0 } }),
  new Paragraph({ text: 'Sub-item a', numbering: { reference: 'num', level: 1 } }),
  new Paragraph({ text: 'Sub-item b', numbering: { reference: 'num', level: 1 } }),
  new Paragraph({ text: 'Numbered item 3', numbering: { reference: 'num', level: 0 } }),

  code('D6', 'Table with merged cells and shading'),
  check('A 4-column table: the purple header row spans all columns, "Group A" spans two rows, cells are shaded as labelled, and all borders are visible.'),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, children: [cell('Header merged across 4 columns', { bold: true, color: 'FFFFFF', fill: '4F46E5', columnSpan: 4 })] }),
      new TableRow({ children: [cell('Group A (2 rows)', { rowSpan: 2, fill: 'E0E7FF' }), cell('A1'), cell('A2'), cell('Grey cell', { fill: 'D9D9D9' })] }),
      new TableRow({ children: [cell('B1'), cell('B2'), cell('Yellow cell', { fill: 'FFF2CC' })] }),
      new TableRow({ children: [cell('C0'), cell('C1 + C2 merged', { columnSpan: 2 }), cell('C3')] }),
    ],
  }),

  code('D7', 'Image with text wrapping'),
  check('The square logo sits at the left with this paragraph text flowing around its right side, not above or below it.'),
  new Paragraph({
    children: [
      new ImageRun({
        type: 'png',
        data: logo,
        transformation: { width: 96, height: 96 },
        altText: { title: 'TechToolHub logo', description: 'Test image for text wrapping', name: 'logo' },
        floating: {
          horizontalPosition: { relative: HorizontalPositionRelativeFrom.COLUMN, offset: 0 },
          verticalPosition: { relative: VerticalPositionRelativeFrom.PARAGRAPH, offset: 0 },
          wrap: { type: TextWrappingType.SQUARE },
          margins: { right: 114300, bottom: 114300 },
        },
      }),
      new TextRun('This paragraph should wrap around the image on the left. '.repeat(8)),
    ],
  }),

  code('D8', 'Header and footer with page numbers'),
  check('Every page has the header "TechToolHub compatibility test (header)" and a footer reading "Page X of Y" with correct numbers.'),

  code('D9', 'Footnote'),
  check('A small superscript 1 follows this sentence, and the footnote text appears at the bottom of the page.'),
  p('Footnotes are common in reports and papers.', new FootnoteReferenceRun(1)),

  code('D10', 'Comment'),
  check('The highlighted sentence has a comment from "TechToolHub" saying "Test comment: is this visible?".'),
  new Paragraph({
    children: [
      new CommentRangeStart(0),
      new TextRun('This sentence has a comment attached.'),
      new CommentRangeEnd(0),
      new TextRun({ children: [new CommentReference(0)] }),
    ],
  }),

  code('D11', 'Tracked changes'),
  check('Track changes shows the word "quickly" as an insertion and "slowly" as a deletion by "TechToolHub". Accepting all changes should leave: "The reviewer quickly approved the draft."'),
  new Paragraph({
    children: [
      new TextRun('The reviewer '),
      new DeletedTextRun({ text: 'slowly', id: 1, author: AUTHOR, date: DATE }),
      new InsertedTextRun({ text: 'quickly', id: 2, author: AUTHOR, date: DATE }),
      new TextRun(' approved the draft.'),
    ],
  }),

  code('D12', 'Hyperlinks'),
  check('The first link opens techtoolhub.online; the second jumps to the D15 section in this document.'),
  new Paragraph({
    children: [
      new ExternalHyperlink({ link: 'https://www.techtoolhub.online', children: [new TextRun({ text: 'External link to TechToolHub', style: 'Hyperlink' })] }),
      new TextRun(' · '),
      new InternalHyperlink({ anchor: 'd15', children: [new TextRun({ text: 'Internal link to D15', style: 'Hyperlink' })] }),
    ],
  }),

  code('D13', 'Equation'),
  check('An editable equation showing a over b, plus x squared. If it appears as plain text or an image, mark it partial.'),
  new Paragraph({
    children: [
      new OMath({
        children: [
          new MathFraction({ numerator: [new MathRun('a')], denominator: [new MathRun('b')] }),
          new MathRun('+'),
          new MathSuperScript({ children: [new MathRun('x')], superScript: [new MathRun('2')] }),
        ],
      }),
    ],
  }),
]

const twoCol = [
  code('D14', 'Two-column section'),
  check('This section is set in two newspaper-style columns; the text continues from the bottom of the left column to the top of the right one.'),
  ...Array.from({ length: 6 }, (_, i) =>
    p(`Column paragraph ${i + 1}. ` + 'Office suites need to keep section-level layout such as columns when they open a Word file. '.repeat(3))
  ),
]

const landscape = [
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new Bookmark({ id: 'd15', children: [new TextRun('D15 · Landscape page (section break)')] })],
  }),
  check('This page is landscape while the pages before it are portrait. The header and footer continue.'),
  p('End of the test document.'),
]

const header = new Header({
  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'TechToolHub compatibility test (header)', color: '666666', size: 18 })] })],
})
const footer = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 18 })],
    }),
  ],
})
const hf = { headers: { default: header }, footers: { default: footer } }

const doc = new Document({
  creator: AUTHOR,
  title: 'TechToolHub Office compatibility test: Word document',
  description: 'Feature test file for comparing how office suites open .docx files',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
  },
  numbering: {
    config: [
      {
        reference: 'num',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.START, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.LOWER_LETTER, text: '%2)', alignment: AlignmentType.START, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ],
      },
    ],
  },
  comments: {
    children: [{ id: 0, author: AUTHOR, initials: 'TTH', date: new Date(DATE), children: [new Paragraph({ children: [new TextRun('Test comment: is this visible?')] })] }],
  },
  footnotes: { 1: { children: [new Paragraph('This is footnote 1, used to test footnote support.')] } },
  sections: [
    { ...hf, children: [...intro, ...body] },
    { ...hf, properties: { type: SectionType.NEXT_PAGE, column: { count: 2, space: 708 } }, children: twoCol },
    { ...hf, properties: { type: SectionType.NEXT_PAGE, page: { size: { orientation: PageOrientation.LANDSCAPE } } }, children: landscape },
  ],
})

fs.writeFileSync(OUT, await Packer.toBuffer(doc))
console.log('wrote', OUT)
