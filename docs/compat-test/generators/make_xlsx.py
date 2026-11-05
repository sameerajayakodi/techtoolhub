"""Builds the TechToolHub Excel compatibility test workbook (codes X1-X14).

Run: python make_xlsx.py <out.xlsx>  (needs openpyxl 3.1)
"""
import sys
from datetime import date

from openpyxl import Workbook
from openpyxl.chart import BarChart, LineChart, PieChart, Reference
from openpyxl.comments import Comment
from openpyxl.formatting.rule import ColorScaleRule, DataBarRule, IconSetRule, CellIsRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.table import Table, TableStyleInfo

OUT = sys.argv[1]
PURPLE = PatternFill('solid', fgColor='4F46E5')
LIGHT = PatternFill('solid', fgColor='E0E7FF')
WHITE_BOLD = Font(bold=True, color='FFFFFF')
BOLD = Font(bold=True)
thin = Side(style='thin', color='999999')
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)

wb = Workbook()

# ---------- Read me ----------
ws = wb.active
ws.title = 'Read me'
ws['A1'] = 'TechToolHub Office compatibility test: Excel workbook'
ws['A1'].font = Font(bold=True, size=16)
ws['A3'] = ('Each sheet tests features labelled with a code (X1, X2...) that matches the checklist. '
            'Formula rows show the value Excel gives in the "Expected" column: compare it with the '
            'result the app calculates.')
ws['A3'].alignment = Alignment(wrap_text=True, vertical='top')
ws.merge_cells('A3:F6')
ws['A8'] = 'Source and results'
ws['B8'] = 'https://www.techtoolhub.online'
ws['B8'].hyperlink = 'https://www.techtoolhub.online'
ws['B8'].style = 'Hyperlink'
ws.column_dimensions['A'].width = 22
for col in 'BCDEF':
    ws.column_dimensions[col].width = 16

# ---------- Data (X1-X5, X9, X12) ----------
data = wb.create_sheet('Sales')
rows = [
    ('Date', 'Region', 'Product', 'Units', 'Price', 'Revenue'),
    (date(2026, 1, 15), 'North', 'Laptop', 4, 899.0),
    (date(2026, 1, 28), 'South', 'Monitor', 10, 189.5),
    (date(2026, 2, 3), 'North', 'Monitor', 6, 189.5),
    (date(2026, 2, 17), 'East', 'Laptop', 3, 899.0),
    (date(2026, 3, 2), 'South', 'Keyboard', 25, 49.99),
    (date(2026, 3, 19), 'East', 'Keyboard', 12, 49.99),
    (date(2026, 4, 8), 'North', 'Laptop', 5, 899.0),
    (date(2026, 4, 22), 'West', 'Monitor', 8, 189.5),
]
for r, row in enumerate(rows, start=1):
    for c, v in enumerate(row, start=1):
        data.cell(row=r, column=c, value=v)
    if r > 1:
        data.cell(row=r, column=6, value=f'=D{r}*E{r}')
        data.cell(row=r, column=1).number_format = 'yyyy-mm-dd'
        data.cell(row=r, column=5).number_format = '$#,##0.00'
        data.cell(row=r, column=6).number_format = '$#,##0.00'
last = len(rows)
table = Table(displayName='SalesTable', ref=f'A1:F{last}')
table.tableStyleInfo = TableStyleInfo(name='TableStyleMedium2', showRowStripes=True)
data.add_table(table)
for col, w in zip('ABCDEF', (12, 10, 12, 8, 10, 12)):
    data.column_dimensions[col].width = w
data.freeze_panes = 'A2'

revenue = [r[3] * r[4] for r in rows[1:]]
units = [r[3] for r in rows[1:]]
wb.defined_names['TotalRevenue'] = DefinedName('TotalRevenue', attr_text=f"Sales!$F$2:$F${last}")

# ---------- Formulas ----------
f = wb.create_sheet('Formulas')
f.append(['Code', 'Feature', 'Formula', 'Result (calculated by the app)', 'Expected'])
for c in f[1]:
    c.font = WHITE_BOLD
    c.fill = PURPLE


def money(v):
    return f'${v:,.2f}'


north_laptop = sum(r[3] for r in rows[1:] if r[1] == 'North' and r[2] == 'Laptop')
keyboard_rev = sum(r[3] * r[4] for r in rows[1:] if r[2] == 'Keyboard')
tests = [
    ('X11', 'SUM from another sheet', f"=SUM(Sales!F2:F{last})", money(sum(revenue)), '$#,##0.00'),
    ('X1', 'AVERAGE', f"=AVERAGE(Sales!D2:D{last})", f'{sum(units) / len(units):.3f}', '0.000'),
    ('X1', 'IF', '=IF(D2>1000,"High","Low")', 'High', None),
    ('X2', 'XLOOKUP (newer function)', f'=_xlfn.XLOOKUP("Keyboard",Sales!C2:C{last},Sales!E2:E{last})', '$49.99', '$#,##0.00'),
    ('X2', 'VLOOKUP (classic)', f'=VLOOKUP("Monitor",Sales!C2:E{last},3,FALSE)', '$189.50', '$#,##0.00'),
    ('X3', 'SUMIFS', f'=SUMIFS(Sales!D2:D{last},Sales!B2:B{last},"North",Sales!C2:C{last},"Laptop")', str(north_laptop), None),
    ('X3', 'COUNTIFS', f'=COUNTIFS(Sales!B2:B{last},"South")', '2', None),
    ('X4', 'Weekday of a date (English locale)', '=TEXT(DATE(2026,11,5),"dddd")', date(2026, 11, 5).strftime('%A'), None),
    ('X4', 'Days between dates', '=DATEDIF(DATE(2026,1,1),DATE(2026,11,5),"d")', str((date(2026, 11, 5) - date(2026, 1, 1)).days), None),
    ('X5', 'Number format: percentage', '=0.1234', '12.34%', '0.00%'),
    ('X9', 'Named range', '=SUM(TotalRevenue)', money(sum(revenue)), '$#,##0.00'),
    ('X12', 'Structured table reference', '=SUM(SalesTable[Units])', str(sum(units)), None),
    ('X12', 'SUMIF on table column', '=SUMIF(SalesTable[Product],"Keyboard",SalesTable[Revenue])', money(keyboard_rev), '$#,##0.00'),
]
for i, (code, feat, formula, expected, fmt) in enumerate(tests, start=2):
    f.cell(row=i, column=1, value=code)
    f.cell(row=i, column=2, value=feat)
    # Shown as text so testers can read it (without the file-format prefix Excel adds)
    f.cell(row=i, column=3, value=formula.replace('_xlfn.', ''))
    f.cell(row=i, column=3).data_type = 's'
    res = f.cell(row=i, column=4, value=formula)
    if fmt:
        res.number_format = fmt
    f.cell(row=i, column=5, value=expected)
for col, w in zip('ABCDE', (7, 28, 62, 30, 14)):
    f.column_dimensions[col].width = w
f.freeze_panes = 'A2'

# ---------- Formatting ----------
fm = wb.create_sheet('Formatting')
fm['A1'] = 'X6 · Conditional formatting: colour scale (red→green), data bars and icon sets'
fm['A1'].font = BOLD
for i, v in enumerate([5, 15, 25, 35, 45, 55, 65, 75, 85, 95], start=3):
    fm.cell(row=i, column=1, value=v)
    fm.cell(row=i, column=2, value=v)
    fm.cell(row=i, column=3, value=v)
    fm.cell(row=i, column=4, value=v)
fm['A2'], fm['B2'], fm['C2'], fm['D2'] = 'Colour scale', 'Data bars', 'Icon set', 'Above 50 = bold red'
fm.conditional_formatting.add('A3:A12', ColorScaleRule(start_type='min', start_color='F8696B', mid_type='percentile', mid_value=50, mid_color='FFEB84', end_type='max', end_color='63BE7B'))
fm.conditional_formatting.add('B3:B12', DataBarRule(start_type='min', end_type='max', color='638EC6'))
fm.conditional_formatting.add('C3:C12', IconSetRule('3TrafficLights1', 'percent', [0, 33, 67]))
fm.conditional_formatting.add('D3:D12', CellIsRule(operator='greaterThan', formula=['50'], font=Font(bold=True, color='C00000')))

fm['F1'] = 'X7 · Data validation: pick a region from the drop-down in F3'
fm['F1'].font = BOLD
fm['F3'] = 'North'
dv = DataValidation(type='list', formula1='"North,South,East,West"', allow_blank=False, showDropDown=False)
dv.error = 'Choose a region from the list'
dv.errorTitle = 'Invalid region'
fm.add_data_validation(dv)
dv.add('F3')
fm['F3'].fill = LIGHT
fm['F3'].border = BOX

fm['F6'] = 'X10 · Merged cells, wrapped text and borders'
fm['F6'].font = BOLD
fm['F8'] = 'These cells (F8:H10) are merged into one box, and this long sentence should wrap inside it, centred.'
fm.merge_cells('F8:H10')
fm['F8'].alignment = Alignment(wrap_text=True, horizontal='center', vertical='center')
for r in range(8, 11):
    for c in range(6, 9):
        fm.cell(row=r, column=c).border = BOX

fm['F13'] = 'X13 · Cell note: hover over F14 to see it'
fm['F13'].font = BOLD
fm['F14'] = 'Has a note'
fm['F14'].comment = Comment('Test note: is this visible?', 'TechToolHub')

fm['F17'] = 'X14 · Hyperlink cell'
fm['F17'].font = BOLD
fm['F18'] = 'Open TechToolHub'
fm['F18'].hyperlink = 'https://www.techtoolhub.online'
fm['F18'].style = 'Hyperlink'
fm['F20'] = 'X10 · Frozen panes: the Sales and Formulas sheets keep their header row visible when scrolling'
for col, w in zip('ABCDEFGH', (14, 14, 14, 20, 4, 22, 22, 22)):
    fm.column_dimensions[col].width = w

# ---------- Charts ----------
ch = wb.create_sheet('Charts')
ch['A1'] = 'X8 · Native charts: column, line and pie, built from the table below. Each should be editable.'
ch['A1'].font = BOLD
months = [('Month', 'Laptops', 'Monitors'), ('Jan', 4, 10), ('Feb', 3, 6), ('Mar', 0, 0), ('Apr', 5, 8)]
for r, row in enumerate(months, start=3):
    for c, v in enumerate(row, start=1):
        ch.cell(row=r, column=c, value=v)
cats = Reference(ch, min_col=1, min_row=4, max_row=7)
vals = Reference(ch, min_col=2, min_row=3, max_col=3, max_row=7)

bar = BarChart()
bar.type = 'col'
bar.title = 'Units by month (column)'
bar.y_axis.title = 'Units'
bar.add_data(vals, titles_from_data=True)
bar.set_categories(cats)
ch.add_chart(bar, 'E3')

line = LineChart()
line.title = 'Units by month (line)'
line.add_data(vals, titles_from_data=True)
line.set_categories(cats)
ch.add_chart(line, 'E19')

pie = PieChart()
pie.title = 'Laptop units by month (pie)'
pie.add_data(Reference(ch, min_col=2, min_row=3, max_row=7), titles_from_data=True)
pie.set_categories(cats)
ch.add_chart(pie, 'N3')

# The file has no cached results, so ask every app to calculate all formulas on open
wb.calculation.fullCalcOnLoad = True
wb.save(OUT)
print('wrote', OUT)
