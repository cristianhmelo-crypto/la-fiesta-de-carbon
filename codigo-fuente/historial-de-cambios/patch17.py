import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
master = os.path.join(base, '..', 'fiesta-carbon.html')
s = io.open(master, encoding='utf-8').read()

def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n != count:
        print('ANCHOR COUNT', n, 'expected', count, '::', old[:90]); sys.exit(1)
    s = s.replace(old, new)

# ---- gorrito del gato dormido: en el mundo, con perspectiva real ----
i0 = s.index("    if(o.hat&&!o.hit){")
i1 = s.index("\n", i0)
s = s[:i0] + """    if(o.hat&&!o.hit){const hx=o.x+.5,C=h=>litc(h,L3,rz);
      rq([[hx-.02,.01,rz-.08],[hx-.02,.24,rz-.08],[hx+.3,.07,rz-.02]],C(o.hat));
      rq([[hx+.08,.03,rz-.07],[hx+.08,.19,rz-.07],[hx+.14,.16,rz-.06],[hx+.14,.05,rz-.06]],C('#ffd23f'));
      rq([[hx+.19,.04,rz-.05],[hx+.19,.14,rz-.05],[hx+.23,.12,rz-.04],[hx+.23,.05,rz-.04]],C('#ffd23f'));
      const pp=rproj(hx+.31,.07,rz-.02),pr=.045*pp[2];if(pr>=.6){ctx.fillStyle=C('#ffffff');ctx.beginPath();ctx.arc(pp[0],pp[1],pr,0,Math.PI*2);ctx.fill();}}""" + s[i1:]
rep("if(!o.hit){for(let i=0;i<2;i++){const zz=(clock*.7+o.z+i*.5)%1;", "if(!o.hit&&rz<11){for(let i=0;i<2;i++){const zz=(clock*.7+o.z+i*.5)%1;")
rep("function warnMark(x,y,rz){const p=rproj(x,y,rz),s=Math.max(6,Math.min(12,Math.round(p[2]*.2)))",
    "function warnMark(x,y,rz){if(rz>9)return;const p=rproj(x,y,rz),s=Math.max(4,Math.min(12,Math.round(p[2]*.2)))")

# ---- patas de Carbón: nuevo diseño visto desde arriba ----
i0 = s.index("const PAWC={};")
i1 = s.index("const LT=document.createElement('canvas')")
s = s[:i0] + r'''let PAWC=null;
function pawImg(){
  if(PAWC)return PAWC;
  const W=62,H=96,pal=PALS.carbon,F4=[pal.H,pal.b,pal.D,'#0c0812'],buf=new Array(W*H).fill(null);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H)buf[y*W+x]=c;};
  const ell=(cx,cy,rx,ry,cols,bias)=>{for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;if(nx*nx+ny*ny<=1)put(x,y,cols[Math.max(0,Math.min(3,shd(nx,ny)+(bias||0)))]);}};
  for(let t=0;t<=1;t+=.02){const y=96-t*52,x=33-t*3,r=14.5-t*3;ell(x,y,r,5,F4,t<.3?1:0);}
  ell(31,34,19,15,F4);
  const toes=[[15,22,6.5,6],[24,15,6.5,6.5],[36,15,6.5,6.5],[46,22,6.5,6]];
  toes.forEach(([x,y,rx,ry])=>ell(x,y,rx,ry,F4));
  toes.forEach(([x,y],i)=>{if(i===3)return;const nx=(toes[i+1][0]+x)/2,ny=(toes[i+1][1]+y)/2;for(let k=0;k<6;k++)put(nx+(i===1?0:(i===0?1:-1))*k*.3,ny+2+k,'#0c0812');});
  toes.forEach(([x,y])=>{put(x-2,y-3,pal.H);put(x-1,y-4,pal.H);put(x-3,y-2,'#4a3f7a');});
  for(let i=0;i<70;i++){const x=Math.floor(rh(i,21)*W),y=34+Math.floor(rh(i,33)*60),c=buf[y*W+x];if(c===F4[1]||c===F4[2]){put(x,y,c===F4[1]?pal.H:F4[1]);put(x,y+1,c===F4[1]?pal.H:F4[1]);}}
  for(let i=0;i<16;i++){const x=10+Math.floor(rh(i,5)*40),y=24+Math.floor(rh(i,8)*20),c=buf[y*W+x];if(c)put(x,y,F4[0]);}
  const out=outlineBuf(buf,W,H,'#06040a','#8676e0');
  return PAWC=pxCanvas(W,H,out);
}
let HANDC=null;
function handImg(){
  if(HANDC)return HANDC;
  const W=78,H=130,sk=fam('#f1c9a0'),sl=fam('#4f8a67'),nail=['#fff4f0','#f6d6d0','#e2b0a8','#c08a84'],buf=new Array(W*H).fill(null);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H)buf[y*W+x]=c;};
  const ell=(cx,cy,rx,ry,cols,bias)=>{for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;if(nx*nx+ny*ny<=1)put(x,y,cols[Math.max(0,Math.min(3,shd(nx,ny)+(bias||0)))]);}};
  const limb=(x0,y0,x1,y1,r0,r1,cols,bias)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0));for(let i=0;i<=n;i++){const t=i/n;ell(x0+(x1-x0)*t,y0+(y1-y0)*t,r0+(r1-r0)*t,r0+(r1-r0)*t,cols,bias);}};
  limb(40,134,42,92,20,17,sl);
  for(let x=24;x<60;x++){put(x,96,sl[3]);put(x,97,sl[2]);}for(const [a,b] of [[30,110],[48,118],[36,124]])for(let k=0;k<6;k++)put(a+k*.4,b+k,sl[3]);
  limb(42,90,42,76,12,12.5,sk,1);
  ell(43,62,19,17,sk);
  const fing=[[29,50,22,20,5.2,3.6],[38,46,33,10,5.4,3.9],[47,46,46,11,5.3,3.8],[55,51,58,22,4.8,3.4]];
  fing.forEach(([x0,y0,x1,y1,r0,r1])=>limb(x0,y0,x1,y1,r0,r1,sk));
  fing.forEach(([x0,y0,x1,y1])=>{ell(x0,y0+1,4,3,[sk[0],sk[0],sk[1],sk[1]]);const mx=x0+(x1-x0)*.55,my=y0+(y1-y0)*.55;for(let k=-2;k<=2;k++)put(mx+k,my,sk[2]);ell(x1+(x0-x1)*.08,y1+(y0-y1)*.08+1,2.6,3,nail);});
  limb(24,70,12,50,6.2,4.6,sk);ell(12.5,51,2.8,3.2,nail);for(let k=-2;k<=1;k++)put(17+k,60+k,sk[2]);
  for(const [a,b,c,d] of [[38,72,33,54],[44,72,42,52],[50,72,50,52]])for(let t=0;t<=1;t+=.08)put(a+(c-a)*t,b+(d-b)*t,sk[1]===buf[Math.round(b+(d-b)*t)*W+Math.round(a+(c-a)*t)]?sk[0]:sk[1]);
  const out=outlineBuf(buf,W,H,'#140c1e',null);
  return HANDC=pxCanvas(W,H,out);
}
''' + s[i1:]

# ---- dibujo de las patas en carrera, salto y agachado ----
i0 = s.index("function drawPaws(R){")
i1 = s.index("\n}", i0) + 2
s = s[:i0] + r'''function drawPaws(R){
  const img=pawImg(),W=img.width,H=img.height,run=R.jy===0&&R.slide<=0;
  for(const side of [-1,1]){
    let reach,lift=0;
    if(R.slide>0)reach=-.5;
    else if(R.jy>0){const up=R.vy>0;reach=up?1:.75;lift=up?6:0;}
    else reach=Math.sin(R.ph+(side>0?Math.PI:0))*.5+.5;
    const sc=1-reach*.24,cx=160+side*(58-reach*10+(R.slide>0?14:0)),py=176-reach*30-lift+(R.slide>0?22:0),w=Math.round(W*sc),h=Math.round(H*sc);
    const X=Math.round(cx-w/2),Y=Math.round(py-34*sc);
    ctx.globalAlpha=.35;P(ctx,X+6,Y+Math.round(52*sc),w-12,Math.round(8*sc),'#000');ctx.globalAlpha=1;
    if(side>0){ctx.save();ctx.translate(X+w,Y);ctx.scale(-1,1);ctx.drawImage(img,0,0,w,h);ctx.restore();}else ctx.drawImage(img,X,Y,w,h);
  }
}
''' + s[i1:]

# ---- manos del humano: dorso de la mano, pulgar hacia el centro ----
rep("  if(hand>0){const img=handImg();for(const s of [-1,1]){const hx=s<0?-10+hand*70:330-hand*70,hy=208-hand*80+Math.sin(clock*6+s)*2;\n    ctx.save();ctx.translate(Math.round(hx),Math.round(hy));ctx.rotate(s*-.35);if(s>0)ctx.scale(-1,1);ctx.drawImage(img,-30,-10,60,92);ctx.restore();}}",
    "  if(hand>0){const img=handImg();for(const s of [-1,1]){const hx=s<0?4+hand*62:316-hand*62,hy=236-hand*96+Math.sin(clock*6+s)*2,curl=Math.sin(clock*9)*.04;\n    ctx.save();ctx.translate(Math.round(hx),Math.round(hy));ctx.rotate(-s*(.32+curl));if(s<0)ctx.scale(-1,1);ctx.drawImage(img,-39,-40,78,130);ctx.restore();}}")

io.open(master, 'w', encoding='utf-8', newline='').write(s)
print('OK')
