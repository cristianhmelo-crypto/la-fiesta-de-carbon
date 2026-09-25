import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(base, '..', 'fiesta-carbon.html')
s = io.open(p, encoding='utf-8').read()
if 'window.__dbg=' in s:
    i = s.index('window.__dbg='); j = s.index('/*DBG*/\n') + len('/*DBG*/\n'); s = s[:i] + s[j:]
assert '__dbg' not in s
io.open(p, 'w', encoding='utf-8', newline='').write(s)
a = s.index('<script>') + 8; b = s.rindex('</script>')
io.open('C:/Users/OLAS/AppData/Local/Temp/claude/D--WEB-PARA-MAMA-BEACH-Y-EVENTOS-CASA-FABRIC/5045cdf8-395f-4afa-88b4-3ec25ed0b3e7/scratchpad/chk.js', 'w', encoding='utf-8').write(s[a:b])
k = s.index('</style>') + len('</style>')
play = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + s[:k] + '\n</head>\n<body>\n' + s[k:] + '\n</body>\n</html>\n'
io.open(os.path.join(base, '..', '..', 'JUGAR - La Fiesta de Carbon.html'), 'w', encoding='utf-8', newline='').write(play)
if len(sys.argv) > 2:
    n = os.path.join(base, '..', '..', 'NOTAS-PARA-CLAUDE.md'); t = io.open(n, encoding='utf-8').read()
    old, new = sys.argv[1], sys.argv[2]
    if old in t: t = t.replace(old, new)
    io.open(n, 'w', encoding='utf-8', newline='').write(t)
print('ok')
