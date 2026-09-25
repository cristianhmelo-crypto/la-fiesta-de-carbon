import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(base, '..', 'fiesta-carbon.html')
s = io.open(p, encoding='utf-8').read()
new = io.open(os.path.join(base, 'story2.js'), encoding='utf-8').read()
a = s.index('/* ---------- cinemática inicial: la historia ---------- */')
b = s.index('/* ---------- pantallas ---------- */')
s = s[:a] + new + '\n' + s[b:]
old = "if(M==='open'){for(let y=hy+3;y<=hy+6;y++)for(let x=hx+5;x<=hx+9;x++)put(x,y,dark);put(hx+5,hy+3,'#fff');put(hx+9,hy+3,'#fff');put(hx+6,hy+6,'#fff');put(hx+8,hy+6,'#fff');put(hx+7,hy+5,'#ff7a9a');put(hx+6,hy+5,'#ff7a9a');}"
assert s.count(old) == 1
s = s.replace(old, "if(M==='open'){for(let y=hy+3;y<=hy+6;y++)for(let x=hx+5;x<=hx+9;x++)put(x,y,dark);for(let x=hx+5;x<=hx+9;x++)put(x,hy+3,'#fffaf2');put(hx+5,hy+4,'#fffaf2');put(hx+9,hy+4,'#fffaf2');put(hx+7,hy+6,'#d98a9a');}")
if 'window.__dbg=' not in s:
    s = s.replace("showTitle();\n(document.fonts", "showTitle();\nwindow.__dbg={st:()=>state,S:()=>ST,ev:c=>eval(c)};/*DBG*/\n(document.fonts", 1)
io.open(p, 'w', encoding='utf-8', newline='').write(s)
x = s.index('<script>') + 8; y = s.rindex('</script>')
io.open('C:/Users/OLAS/AppData/Local/Temp/claude/D--WEB-PARA-MAMA-BEACH-Y-EVENTOS-CASA-FABRIC/5045cdf8-395f-4afa-88b4-3ec25ed0b3e7/scratchpad/chk.js', 'w', encoding='utf-8').write(s[x:y])
print('OK')
