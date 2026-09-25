import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(base, '..', 'fiesta-carbon.html')
s = io.open(p, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    if n != c:
        print('ANCHOR', n, a[:90]); sys.exit(1)
    s = s.replace(a, b)
rep("const PXC=document.createElement('canvas');PXC.width=480;PXC.height=312;", "const PXC=document.createElement('canvas');PXC.width=320;PXC.height=208;")
rep("function pixelize(){const im=pxg.getImageData(0,0,480,312),d=im.data,st=17;for(let y=0,p=0;y<312;y++)for(let x=0;x<480;x++,p+=4)", "function pixelize(){const im=pxg.getImageData(0,0,320,208),d=im.data,st=17;for(let y=0,p=0;y<208;y++)for(let x=0;x<320;x++,p+=4)")
rep("  ctx.font='8px \"Press Start 2P\"';const w=Math.max(18,Math.ceil(ctx.measureText(text).width)+14),h=17,X=Math.round(Math.min(476-w,Math.max(4,x-w/2))),Y=Math.round(y-h);",
    "  ctx.font='6px \"Press Start 2P\"';const w=Math.max(14,Math.ceil(ctx.measureText(text).width)+10),h=13,X=Math.round(Math.min(316-w,Math.max(4,x-w/2))),Y=Math.round(y-h);")
rep("ctx.fillStyle='#2a1d3a';ctx.textAlign='center';ctx.fillText(text,X+w/2,Y+12);ctx.textAlign='left';\n}\nfunction renderStory(){", "ctx.fillStyle='#2a1d3a';ctx.textAlign='center';ctx.fillText(text,X+w/2,Y+9);ctx.textAlign='left';\n}\nfunction renderStory(){")
rep("const Z=ST,cm=Z.cam,g=pxg,t=clock,sx=.5;", "const Z=ST,cm=Z.cam,g=pxg,t=clock,sx=1/3;")
rep("g.fillStyle='#000';g.fillRect(0,0,480,312);\n", "g.fillStyle='#000';g.fillRect(0,0,320,208);\n")
rep("const vg0=g.createRadialGradient(240,156,140,240,156,330);vg0.addColorStop(0,'rgba(10,6,30,0)');vg0.addColorStop(1,'rgba(10,6,30,.5)');g.fillStyle=vg0;g.fillRect(0,0,480,312);",
    "const vg0=g.createRadialGradient(160,104,95,160,104,220);vg0.addColorStop(0,'rgba(10,6,30,0)');vg0.addColorStop(1,'rgba(10,6,30,.5)');g.fillStyle=vg0;g.fillRect(0,0,320,208);")
rep("bubL.push([(a.x+a.face*10-cm.x)*cm.z*.5+240,(VG-240-a.y+(a.pose==='sad'?14:0)-cm.y)*cm.z*.5+156,b.text]);", "bubL.push([(a.x+a.face*10-cm.x)*cm.z/3+160,(VG-240-a.y+(a.pose==='sad'?14:0)-cm.y)*cm.z/3+104,b.text]);")
rep("ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(PXC,0,0);", "ctx.setTransform(3,0,0,3,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(PXC,0,0);")
rep("P(ctx,0,33,480,22,'rgba(10,6,24,.65)');fText(Z.cap,240,48,8,'#f4ead5');", "P(ctx,0,22,320,15,'rgba(10,6,24,.65)');fText(Z.cap,160,32,6,'#f4ead5');")
rep("ctx.translate(280,72);ctx.scale(sc,sc);ctx.globalAlpha=k;fText('LA FIESTA',0,0,24,'#ffd23f');fText('DE CARBÓN',0,33,24,'#ff5c9d');", "ctx.translate(186,46);ctx.scale(sc,sc);ctx.globalAlpha=k;fText('LA FIESTA',0,0,16,'#ffd23f');fText('DE CARBÓN',0,22,16,'#ff5c9d');")
rep("P(ctx,0,131,480,22,'rgba(10,6,24,.65)');fText('Unas horas más tarde...',240,146,8,'#f4ead5');", "P(ctx,0,86,320,15,'rgba(10,6,24,.65)');fText('Unas horas más tarde...',160,96,6,'#f4ead5');")
rep("  P(ctx,0,0,480,15,'#000');P(ctx,0,307,480,5,'#000');", "  P(ctx,0,0,320,10,'#000');P(ctx,0,204,320,4,'#000');")
rep("if(fo>0){ctx.globalAlpha=fo;P(ctx,0,0,480,312,'#000');", "if(fo>0){ctx.globalAlpha=fo;P(ctx,0,0,320,208,'#000');")
io.open(p, 'w', encoding='utf-8', newline='').write(s)
x = s.index('<script>') + 8; y = s.rindex('</script>')
io.open('C:/Users/OLAS/AppData/Local/Temp/claude/D--WEB-PARA-MAMA-BEACH-Y-EVENTOS-CASA-FABRIC/5045cdf8-395f-4afa-88b4-3ec25ed0b3e7/scratchpad/chk.js', 'w', encoding='utf-8').write(s[x:y])
print('OK')
