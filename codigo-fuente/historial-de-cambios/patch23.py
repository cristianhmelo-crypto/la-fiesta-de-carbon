import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(base, '..', 'fiesta-carbon.html')
s = io.open(p, encoding='utf-8').read()
def rep(a, b):
    global s
    n = s.count(a)
    if n != 1:
        print('ANCHOR', n, a[:80]); sys.exit(1)
    s = s.replace(a, b)

rep("function renderStory(){", r"""const PXC=document.createElement('canvas');PXC.width=480;PXC.height=312;const pxg=PXC.getContext('2d',{willReadFrequently:true});
function pixelize(){const im=pxg.getImageData(0,0,480,312),d=im.data,st=17;for(let y=0,p=0;y<312;y++)for(let x=0;x<480;x++,p+=4){const q=(BAYER[((y&3)<<2)|(x&3)]/16-.5)*st;d[p]=Math.round((d[p]+q)/st)*st;d[p+1]=Math.round((d[p+1]+q)/st)*st;d[p+2]=Math.round((d[p+2]+q)/st)*st;d[p+3]=255;}pxg.putImageData(im,0,0);}
function drawBubbleP(x,y,text){
  ctx.font='8px "Press Start 2P"';const w=Math.max(18,Math.ceil(ctx.measureText(text).width)+14),h=17,X=Math.round(Math.min(476-w,Math.max(4,x-w/2))),Y=Math.round(y-h);
  P(ctx,X-1,Y+1,w+2,h-2,'#140c1e');P(ctx,X,Y,w,h,'#140c1e');P(ctx,X+1,Y+1,w-2,h-2,'#fffaf0');P(ctx,X+1,Y+h-4,w-2,3,'#e8dcc8');
  const bx=Math.round(Math.min(X+w-6,Math.max(X+6,x)));P(ctx,bx-3,Y+h-1,7,2,'#fffaf0');P(ctx,bx-2,Y+h+1,5,2,'#fffaf0');P(ctx,bx-1,Y+h+3,3,1,'#fffaf0');P(ctx,bx-4,Y+h-1,1,3,'#140c1e');P(ctx,bx+4,Y+h-1,1,3,'#140c1e');P(ctx,bx-3,Y+h+1,1,2,'#140c1e');P(ctx,bx+3,Y+h+1,1,2,'#140c1e');P(ctx,bx-2,Y+h+3,1,1,'#140c1e');P(ctx,bx+2,Y+h+3,1,1,'#140c1e');
  ctx.fillStyle='#2a1d3a';ctx.textAlign='center';ctx.fillText(text,X+w/2,Y+12);ctx.textAlign='left';
}
function renderStory(){""")
rep("  const Z=ST,cm=Z.cam,g=ctx,t=clock;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=true;g.fillStyle='#000';g.fillRect(0,0,cv.width,cv.height);\n  const sx=cv.width/VW;g.setTransform(sx*cm.z,0,0,sx*cm.z,sx*(480-cm.x*cm.z),sx*(312-cm.y*cm.z));",
    "  const Z=ST,cm=Z.cam,g=pxg,t=clock,sx=.5;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=true;g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle='#000';g.fillRect(0,0,480,312);\n  g.setTransform(sx*cm.z,0,0,sx*cm.z,sx*(480-cm.x*cm.z),sx*(312-cm.y*cm.z));")
rep("  Z.bubs.forEach(b=>{const a=sActor(b.k);if(!a||a.a<=0)return;drawBubble(g,a.x+a.face*10,VG-256-a.y+(a.pose==='sad'?14:0),b.text);});\n  g.setTransform(sx,0,0,sx,0,0);",
    "  const bubL=[];Z.bubs.forEach(b=>{const a=sActor(b.k);if(!a||a.a<=0)return;bubL.push([(a.x+a.face*10-cm.x)*cm.z*.5+240,(VG-240-a.y+(a.pose==='sad'?14:0)-cm.y)*cm.z*.5+156,b.text]);});\n  g.setTransform(1,0,0,1,0,0);const vg0=g.createRadialGradient(240,156,140,240,156,330);vg0.addColorStop(0,'rgba(10,6,30,0)');vg0.addColorStop(1,'rgba(10,6,30,.5)');g.fillStyle=vg0;g.fillRect(0,0,480,312);pixelize();\n  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,cv.width,cv.height);ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(PXC,0,0);bubL.forEach(([x,y,tx])=>drawBubbleP(x,y,tx));")
i0 = s.index("  if(Z.cap&&Z.step===0){g.globalAlpha")
i1 = s.index("  g.imageSmoothingEnabled=false;\n}\n", i0) + len("  g.imageSmoothingEnabled=false;\n}\n")
s = s[:i0] + r"""  if(Z.cap&&Z.step===0){ctx.globalAlpha=Math.max(0,Math.min(1,Z.t*1.5,(3.8-Z.t)*2));P(ctx,0,33,480,22,'rgba(10,6,24,.65)');fText(Z.cap,240,48,8,'#f4ead5');ctx.globalAlpha=1;}
  if(party){const tt=Z.t;
    if(tt>.9){const k=Math.min(1,(tt-.9)/.35),sc=1+(1-k)*1.2;ctx.save();ctx.translate(280,72);ctx.scale(sc,sc);ctx.globalAlpha=k;fText('LA FIESTA',0,0,24,'#ffd23f');fText('DE CARBÓN',0,33,24,'#ff5c9d');ctx.restore();ctx.globalAlpha=1;}
    if(tt>3.4){ctx.globalAlpha=Math.min(1,(tt-3.4)*2);P(ctx,0,131,480,22,'rgba(10,6,24,.65)');fText('Unas horas más tarde...',240,146,8,'#f4ead5');ctx.globalAlpha=1;}}
  P(ctx,0,0,480,15,'#000');P(ctx,0,307,480,5,'#000');
  const fo=Math.max(Z.fade,party&&Z.t>5.5?Math.min(1,Z.t-5.5):0);if(fo>0){ctx.globalAlpha=fo;P(ctx,0,0,480,312,'#000');ctx.globalAlpha=1;}
}
""" + s[i1:]
if 'window.__dbg=' not in s:
    s = s.replace("showTitle();\n(document.fonts", "showTitle();\nwindow.__dbg={st:()=>state,S:()=>ST,ev:c=>eval(c)};/*DBG*/\n(document.fonts", 1)
io.open(p, 'w', encoding='utf-8', newline='').write(s)
x = s.index('<script>') + 8; y = s.rindex('</script>')
io.open('C:/Users/OLAS/AppData/Local/Temp/claude/D--WEB-PARA-MAMA-BEACH-Y-EVENTOS-CASA-FABRIC/5045cdf8-395f-4afa-88b4-3ec25ed0b3e7/scratchpad/chk.js', 'w', encoding='utf-8').write(s[x:y])
print('OK')
