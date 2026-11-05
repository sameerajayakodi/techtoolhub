"""Builds the TechToolHub PowerPoint compatibility test deck (codes P1-P10).

Run: python make_pptx.py <out.pptx> <logo.png>  (needs python-pptx 1.0 and lxml)
"""
import sys
import copy

from lxml import etree
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

OUT, LOGO = sys.argv[1], sys.argv[2]
PURPLE = RGBColor(0x4F, 0x46, 0xE5)
CYAN = RGBColor(0x06, 0xB6, 0xD4)
GREY = RGBColor(0x55, 0x55, 0x55)

prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
L_TITLE, L_CONTENT, L_TWO, L_ONLY = (prs.slide_layouts[i] for i in (0, 1, 3, 5))


def check(slide, text, top=Inches(6.55)):
    box = slide.shapes.add_textbox(Inches(0.6), top, Inches(12.1), Inches(0.7))
    tf = box.text_frame
    tf.word_wrap = True
    r1 = tf.paragraphs[0].add_run()
    r1.text = 'What to check: '
    r1.font.bold = True
    r1.font.color.rgb = PURPLE
    r1.font.size = Pt(14)
    r2 = tf.paragraphs[0].add_run()
    r2.text = text
    r2.font.size = Pt(14)
    r2.font.color.rgb = GREY


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def transition(slide, xml):
    """Adds a slide transition (python-pptx has no API for it)."""
    el = etree.fromstring(f'<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med">{xml}</p:transition>')
    sld = slide._element
    anchor = sld.find(qn('p:clrMapOvr'))
    if anchor is None:
        anchor = sld.find(qn('p:cSld'))
    anchor.addnext(el)


# P1 title slide
s = prs.slides.add_slide(L_TITLE)
s.shapes.title.text = 'P1 · TechToolHub compatibility test'
s.placeholders[1].text = 'Title slide layout and theme fonts. Each slide tests one feature (P1–P10).\nSource and results: www.techtoolhub.online'
check(s, 'The title is large and centred with the subtitle below it, using the theme layout (not loose text boxes).')
notes(s, 'P8 speaker notes test: these notes belong to slide 1.')

# P2 bullets
s = prs.slides.add_slide(L_CONTENT)
s.shapes.title.text = 'P2 · Multi-level bullets'
tf = s.placeholders[1].text_frame
items = [('Level 1 bullet', 0), ('Level 2 bullet', 1), ('Level 3 bullet', 2), ('Back to level 1', 0), ('Another level 2', 1)]
tf.text = items[0][0]
for text, lvl in items[1:]:
    para = tf.add_paragraph()
    para.text = text
    para.level = lvl
check(s, 'Five bullets with three indent levels; deeper levels are indented further and use smaller text.')
notes(s, 'P8 speaker notes test: slide 2.')

# P3 two content with image
s = prs.slides.add_slide(L_TWO)
s.shapes.title.text = 'P3 · Two-column layout with an image'
s.placeholders[1].text = 'Text in the left placeholder.\nThe logo image fills the right column.'
right = s.placeholders[2]
left, top, width = right.left, right.top, right.width
right._element.getparent().remove(right._element)
size = min(width, Inches(3.2))
s.shapes.add_picture(LOGO, left + (width - size) // 2, top, size, size)
check(s, 'Text on the left, the square logo on the right, neither overlapping.')

# P4 native chart
s = prs.slides.add_slide(L_ONLY)
s.shapes.title.text = 'P4 · Native, editable chart'
cd = CategoryChartData()
cd.categories = ['Jan', 'Feb', 'Mar', 'Apr']
cd.add_series('Laptops', (4, 3, 0, 5))
cd.add_series('Monitors', (10, 6, 0, 8))
chart = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.2), Inches(1.6), Inches(10.9), Inches(4.8), cd).chart
chart.has_legend = True
chart.legend.position = XL_LEGEND_POSITION.BOTTOM
chart.legend.include_in_layout = False
chart.has_title = True
chart.chart_title.text_frame.text = 'Units by month'
check(s, 'A clustered column chart with two series and a legend. Double-clicking it lets you edit the data (not just a picture).')

# P5 table
s = prs.slides.add_slide(L_ONLY)
s.shapes.title.text = 'P5 · Table'
rows, cols = 4, 4
tbl = s.shapes.add_table(rows, cols, Inches(1.2), Inches(1.8), Inches(10.9), Inches(3)).table
data = [('Suite', 'Price', 'Platforms', 'Offline'), ('Suite A', 'Free', 'Win, Mac, Linux', 'Yes'), ('Suite B', '$5/mo', 'Web', 'No'), ('Merged cell across two columns', '', 'Mobile', 'Yes')]
for r, row in enumerate(data):
    for c, v in enumerate(row):
        tbl.cell(r, c).text = v
tbl.cell(3, 0).merge(tbl.cell(3, 1))
check(s, 'A 4x4 table with a styled header row and banded rows; the first two cells of the last row are merged.')

# P6 shapes
s = prs.slides.add_slide(L_ONLY)
s.shapes.title.text = 'P6 · Shapes, gradient fill, connector and group'
a = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.2), Inches(3), Inches(1.6))
a.text = 'Gradient fill'
a.fill.gradient()
a.fill.gradient_angle = 0
a.fill.gradient_stops[0].color.rgb = PURPLE
a.fill.gradient_stops[1].color.rgb = CYAN
b = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(8.6), Inches(2.2), Inches(3), Inches(1.6))
b.text = 'Oval'
b.fill.solid()
b.fill.fore_color.rgb = CYAN
conn = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(4.2), Inches(3), Inches(8.6), Inches(3))
conn.begin_connect(a, 3)
conn.end_connect(b, 1)
conn.line.width = Pt(2.5)
conn.line.color.rgb = GREY
tail = conn.line._get_or_add_ln()
tail.append(etree.fromstring('<a:tailEnd xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" type="triangle"/>'))
grp = s.shapes.add_group_shape()
for i, shape in enumerate((MSO_SHAPE.STAR_5_POINT, MSO_SHAPE.HEART, MSO_SHAPE.LIGHTNING_BOLT)):
    sh = grp.shapes.add_shape(shape, Inches(4.6 + i * 1.4), Inches(4.3), Inches(1.1), Inches(1.1))
    sh.fill.solid()
    sh.fill.fore_color.rgb = PURPLE
check(s, 'A purple-to-cyan gradient box joined to the oval by an arrow, plus a star, heart and lightning bolt that move together as one group.')

# P7 transitions
s = prs.slides.add_slide(L_ONLY)
s.shapes.title.text = 'P7 · Slide transition: Fade'
transition(s, '<p:fade/>')
check(s, 'In slideshow mode this slide fades in.', top=Inches(3.2))
s = prs.slides.add_slide(L_ONLY)
s.shapes.title.text = 'P7 · Slide transition: Push'
transition(s, '<p:push dir="u"/>')
check(s, 'In slideshow mode this slide pushes up from the bottom.', top=Inches(3.2))

# P8 notes + P9 hyperlink + P10 fonts
s = prs.slides.add_slide(L_ONLY)
s.shapes.title.text = 'P8–P10 · Notes, hyperlink and fonts'
box = s.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.9), Inches(4))
tf = box.text_frame
tf.word_wrap = True
para = tf.paragraphs[0]
r = para.add_run()
r.text = 'P8: open the speaker notes for this slide; they say "Notes for the last slide".'
r.font.size = Pt(20)
para = tf.add_paragraph()
r = para.add_run()
r.text = 'P9: this link opens TechToolHub'
r.font.size = Pt(20)
r.hyperlink.address = 'https://www.techtoolhub.online'
for font in ('Calibri', 'Cambria', 'Consolas'):
    para = tf.add_paragraph()
    r = para.add_run()
    r.text = f'P10: {font}: The quick brown fox jumps over the lazy dog'
    r.font.name = font
    r.font.size = Pt(22)
check(s, 'Notes text shows in presenter view, the link opens the site, and the three font lines look different (or are substituted with close matches).')
notes(s, 'Notes for the last slide.')

prs.save(OUT)
print('wrote', OUT)
