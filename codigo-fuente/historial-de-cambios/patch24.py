import io, os, sys, re
base = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(base, '..', 'fiesta-carbon.html')
s = io.open(p, encoding='utf-8').read()
def rep(a, b):
    global s
    n = s.count(a)
    if n != 1:
        print('ANCHOR', n, a[:80]); sys.exit(1)
    s = s.replace(a, b)
rep("  const Z=ST,cm=Z.cam,g=pxg,t=clock,sx=.5;", "  const Z=ST,cm=Z.cam,g=pxg,t=clock,sx=.5;Z.odd=!Z.odd;if(Z.odd||!Z.drawn){Z.drawn=1;")
i0 = s.index("  const bubL=[];Z.bubs.forEach(")
i1 = s.index("\n", i0)
bubline = s[i0:i1]
s = s[:i0] + s[i1+1:]
rep("g.fillStyle=vg0;g.fillRect(0,0,480,312);pixelize();", "g.fillStyle=vg0;g.fillRect(0,0,480,312);pixelize();}\n" + bubline + "\n ")
rep("  if(party){const tt=Z.t;\n    if(tt>.9){const k=Math.min(1,(tt-.9)/.35),sc=1+(1-k)*1.2;ctx.save();ctx.translate(280,72);", "  if(Z.party){const tt=Z.t;\n    if(tt>.9){const k=Math.min(1,(tt-.9)/.35),sc=1+(1-k)*1.2;ctx.save();ctx.translate(280,72);")
rep("const fo=Math.max(Z.fade,party&&Z.t>5.5?Math.min(1,Z.t-5.5):0);if(fo>0){ctx.globalAlpha=fo;P(ctx,0,0,480,312,'#000');", "const fo=Math.max(Z.fade,Z.party&&Z.t>5.5?Math.min(1,Z.t-5.5):0);if(fo>0){ctx.globalAlpha=fo;P(ctx,0,0,480,312,'#000');")
io.open(p, 'w', encoding='utf-8', newline='').write(s)
x = s.index('<script>') + 8; y = s.rindex('</script>')
io.open('C:/Users/OLAS/AppData/Local/Temp/claude/D--WEB-PARA-MAMA-BEACH-Y-EVENTOS-CASA-FABRIC/5045cdf8-395f-4afa-88b4-3ec25ed0b3e7/scratchpad/chk.js', 'w', encoding='utf-8').write(s[x:y])
print('OK')
