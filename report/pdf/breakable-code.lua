-- Let long inline code (file paths, identifiers) wrap inside narrow table cells.
-- LaTeX cannot break inside \texttt, so long paths overflowed into the next column.
local escapes = {
  ['\\'] = '\\textbackslash{}', ['{'] = '\\{', ['}'] = '\\}', ['$'] = '\\$',
  ['&'] = '\\&', ['#'] = '\\#', ['^'] = '\\textasciicircum{}', ['_'] = '\\_',
  ['~'] = '\\textasciitilde{}', ['%'] = '\\%',
}

function Code(el)
  if not FORMAT:match('latex') then return nil end
  local text = el.text:gsub('[\\{}$&#^_~%%]', escapes)
  text = text:gsub('([/%.%-])', '%1\\allowbreak{}')
  text = text:gsub('\\_', '\\_\\allowbreak{}')
  return pandoc.RawInline('latex', '\\texttt{' .. text .. '}')
end
