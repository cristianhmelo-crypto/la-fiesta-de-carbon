/* ---------- cinemática inicial: la historia (ilustración en alta) ---------- */
let ST=null,SKYC=null,FGC=null;
const VW=960,VH=624,VG=524;
function vE(g,x,y,rx,ry,rot){g.beginPath();g.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot||0,0,Math.PI*2);}
function vRad(g,x,y,rx,ry,base,lt,dk){const r=Math.max(rx,ry),gr=g.createRadialGradient(x-rx*.35,y-ry*.45,r*.06,x,y,r*1.12);gr.addColorStop(0,tint(base,lt==null?.3:lt));gr.addColorStop(.55,base);gr.addColorStop(1,tint(base,dk==null?-.34:dk));return gr;}
function vLin(g,x0,y0,x1,y1,stops){const gr=g.createLinearGradient(x0,y0,x1,y1);stops.forEach(([t,c])=>gr.addColorStop(t,c));return gr;}
function vPoly(g,pts){g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();}
let VSEED=11;const vr=()=>{VSEED=(VSEED*16807)%2147483647;return(VSEED-1)/2147483646;};

/* ---- gatos ilustrados ---- */
const CVP={};
function cvp(key){
  if(CVP[key])return CVP[key];const p=PALS[key],dark=DARKCATS.has(key),b=key==='carbon'?'#2e2446':p.b;
  return CVP[key]={b,s:p.s||b,z:p.z||p.s||b,l:key==='carbon'?'#3a3058':(p.l||tint(b,.45)),i:p.i,e:p.e,pu:'#150f22',n:p.n,line:dark?'#07050d':tint(b,-.64),rim:key==='carbon'?'#8a7ae6':dark?'#a0a0c4':null,wh:dark?'rgba(215,205,240,.85)':'rgba(255,252,245,.95)',coat:COAT[key]||'solid'};
}
const VPOSE={
  stand:{aN:.22,aF:-.18,hT:0,hY:0,lean:0,ear:0,tail:1,eyes:'open',mouth:'smile',blush:0},
  talk:{aN:1.2,mouth:'smile'},
  laugh:{aN:.8,aF:.6,hT:-.13,hY:-3,eyes:'happy',mouth:'open',blush:1,bounce:1},
  point:{aN:1.62,eyes:'happy',mouth:'grin',blush:1,hT:-.05},
  angry:{aN:2.25,aF:2.05,lean:8,eyes:'angry',mouth:'open',tail:1.25,shake:1},
  sad:{aN:.04,aF:-.04,hT:.2,hY:10,ear:1,tail:-1,eyes:'sad',mouth:'frown',lean:-3},
  surprise:{aN:2.5,aF:2.3,hY:-6,eyes:'wide',mouth:'o',tail:1.35},
  cheer:{aN:2.95,aF:2.9,hY:-5,eyes:'happy',mouth:'open',blush:1,tail:1.3,bounce:1}
};
function poseOf(n){return Object.assign({},VPOSE.stand,VPOSE[n]||{});}
const clamp01=v=>Math.max(0,Math.min(1,v));
function drawCatV(g,a){
  const C=cvp(a.key),P=a.cur,T=poseOf(a.pose),t=clock+a.seed,walking=a.walking&&a.delay<=0,ph=a.phase;
  let legN=0,legF=0,bob=0,sw=0;
  if(walking){const amp=a.run?.8:.42;legN=Math.sin(ph)*amp;legF=-Math.sin(ph)*amp;bob=Math.abs(Math.sin(ph))*(a.run?6:3);sw=-Math.sin(ph)*(a.run?.9:.35);}
  if(a.y>0){legN=.75;legF=-.55;}
  const br=walking?0:Math.sin(t*2.3)*1.6,bn=T.bounce&&!walking&&a.y<=0?Math.abs(Math.sin(t*9))*4:0;
  const lean=P.lean+(a.run?10:0),B=bob+bn;
  const sad=a.sadWalk||a.pose==='sad';
  g.save();g.globalAlpha=.35*a.a;vE(g,a.x,VG+3,46-Math.min(20,a.y*.15),9);g.fillStyle='#120820';g.fill();g.restore();
  g.save();g.globalAlpha=a.a;g.translate(a.x+(T.shake?Math.sin(t*55)*1.6:0),VG-a.y);if(a.face<0)g.scale(-1,1);
  g.lineJoin='round';g.lineCap='round';
  const far=tint(C.b,-.2),farL=tint(C.l,-.18);
  const pawC=(C.coat==='tuxedo')?C.l:(C.coat==='points')?C.s:C.b,pawF=tint(pawC,-.2);
  /* cola */
  const tU=clamp01((P.tail+1)/2),tb=[-24,-48-B],tip=[-62-(1-tU)*22+Math.sin(t*2.3)*9,-8-tU*122-(P.tail>1?(P.tail-1)*40:0)],tc=[-86+tU*10,-58-tU*20];
  const tailPath=()=>{g.beginPath();g.moveTo(tb[0],tb[1]);g.quadraticCurveTo(tc[0],tc[1],tip[0],tip[1]);};
  tailPath();g.strokeStyle=C.line;g.lineWidth=20;g.stroke();tailPath();g.strokeStyle=C.b;g.lineWidth=14;g.stroke();
  const bz=u=>[(1-u)*(1-u)*tb[0]+2*(1-u)*u*tc[0]+u*u*tip[0],(1-u)*(1-u)*tb[1]+2*(1-u)*u*tc[1]+u*u*tip[1]];
  if(C.coat==='tabby'){g.strokeStyle=C.s;g.lineWidth=5;for(const u of [.45,.62,.8]){const [x,y]=bz(u),[x2,y2]=bz(u+.02),ang=Math.atan2(y2-y,x2-x)+Math.PI/2;g.beginPath();g.moveTo(x-Math.cos(ang)*6,y-Math.sin(ang)*6);g.lineTo(x+Math.cos(ang)*6,y+Math.sin(ang)*6);g.stroke();}}
  if(C.coat==='points'||C.coat==='tabby'){tailPath();g.save();g.clip&&0;g.restore();const [x,y]=bz(.93);vE(g,x,y,7,7);g.fillStyle=C.coat==='points'?C.s:tint(C.b,-.2);g.fill();}
  if(C.rim){g.strokeStyle=C.rim;g.lineWidth=2;g.beginPath();const [x1,y1]=bz(.35);g.moveTo(x1-6,y1);g.quadraticCurveTo(tc[0]-6,tc[1],tip[0]-6,tip[1]);g.stroke();}
  /* patas de atrás */
  const limb=(x0,y0,x1,y1,w,c)=>{g.strokeStyle=C.line;g.lineWidth=w+6;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();};
  const leg=(hx,hy,a,c,pc)=>{const fx=hx+Math.sin(a)*34,fy=Math.min(-7,hy+Math.cos(a)*34);limb(hx,hy,fx,fy-2,17,c);vE(g,fx+6,fy,15,8.5);g.fillStyle=C.line;g.fill();vE(g,fx+6,fy,12.5,6.5);g.fillStyle=pc;g.fill();g.strokeStyle=tint(pc,-.35);g.lineWidth=1.6;g.beginPath();g.moveTo(fx+12,fy-3);g.lineTo(fx+12,fy+2);g.moveTo(fx+16,fy-3);g.lineTo(fx+16,fy+2);g.stroke();};
  const arm=(sx,sy,a,c,pc,w)=>{const ex=sx+Math.sin(a)*40,ey=sy+Math.cos(a)*40;limb(sx,sy,ex,ey,w,c);vE(g,ex,ey,9.5,8.5);g.fillStyle=C.line;g.fill();vE(g,ex,ey,7.5,6.5);g.fillStyle=pc;g.fill();vE(g,ex-2,ey-2,3,2.5);g.fillStyle=tint(pc,.25);g.fill();};
  leg(-12,-42-B,legF,far,pawF);
  arm(-12+lean*.6,-98-B+br*.3,P.aF+sw*-1,far,pawF,15);
  /* cuerpo */
  const bodyPath=()=>{g.beginPath();g.ellipse(4+lean*.5,-86-B+br*.2,26,30,0,0,Math.PI*2);g.moveTo(32,-54-B);g.ellipse(0,-54-B,32,27,0,0,Math.PI*2);};
  g.save();g.strokeStyle=C.line;g.lineWidth=6;bodyPath();g.stroke();g.fillStyle=vRad(g,4,-78-B,34,44,C.b);bodyPath();g.fill();
  bodyPath();g.clip();
  if(C.coat==='tabby'){g.strokeStyle=C.s;g.lineWidth=6.5;for(let i=0;i<5;i++){const y=-104+i*14-B;g.beginPath();g.moveTo(-34,y+6);g.quadraticCurveTo(-8,y-4,6+lean*.4,y+2);g.stroke();}}
  if(C.coat==='calico'){vE(g,-20,-92-B,20,16,.3);g.fillStyle=C.s;g.fill();vE(g,-14,-44-B,16,12);g.fillStyle=C.z;g.fill();}
  if(C.coat==='patch'){vE(g,-22,-70-B,20,24,.2);g.fillStyle=C.s;g.fill();}
  const chest=(C.coat==='solid'||C.coat==='points')?tint(C.b,C.coat==='solid'&&DARKCATS.has(a.key)?.12:.14):C.l;
  g.beginPath();g.ellipse(16+lean*.6,-80-B+br*.2,13,25,-.08,0,Math.PI*2);g.fillStyle=vRad(g,16,-84-B,13,25,chest,.25,-.12);g.fill();
  g.fillStyle=chest;for(let i=0;i<3;i++){g.beginPath();g.moveTo(8+i*7+lean*.6,-58-B);g.lineTo(12+i*7+lean*.6,-50-B);g.lineTo(16+i*7+lean*.6,-58-B);g.fill();}
  g.restore();
  if(C.rim){g.strokeStyle=C.rim;g.lineWidth=2.5;g.beginPath();g.ellipse(4+lean*.5,-86-B,24,28,0,Math.PI*1.05,Math.PI*1.5);g.stroke();g.beginPath();g.ellipse(0,-54-B,30,25,0,Math.PI*.95,Math.PI*1.2);g.stroke();}
  leg(12,-42-B,legN,C.b,pawC);
  /* collar */
  const hx=14+lean,hy=-146-B+P.hY+br*.4;
  if(a.key==='carbon'){g.strokeStyle='#8a1a2a';g.lineWidth=8;g.beginPath();g.ellipse(hx-6,hy+38,24,7,.05,.1,Math.PI-.1);g.stroke();g.strokeStyle=PALS.carbon.c;g.lineWidth=5;g.stroke();vE(g,hx+2,hy+47,7,7);g.fillStyle=vRad(g,hx+2,hy+47,7,7,'#ffcf3a',.45,-.35);g.fill();g.strokeStyle='#6a4a10';g.lineWidth=1.5;g.stroke();g.beginPath();g.moveTo(hx-1,hy+49);g.lineTo(hx+5,hy+49);g.stroke();}
  /* cabeza */
  g.save();g.translate(hx,hy+30);g.rotate(P.hT);g.translate(-hx,-hy-30);
  const ear=(A,Bp,Tp,rot,inner,farSide)=>{const mx=(A[0]+Bp[0])/2,my=(A[1]+Bp[1])/2,c=Math.cos(rot),s=Math.sin(rot),T2=[mx+(Tp[0]-mx)*c-(Tp[1]-my)*s,my+(Tp[0]-mx)*s+(Tp[1]-my)*c];
    vPoly(g,[A,Bp,T2]);g.strokeStyle=C.line;g.lineWidth=6;g.stroke();g.fillStyle=vRad(g,T2[0],T2[1]+20,22,34,farSide?far:(C.coat==='points'?C.s:C.b));g.fill();
    const cx=(A[0]+Bp[0]+T2[0])/3,cy=(A[1]+Bp[1]+T2[1])/3,sh=p=>[cx+(p[0]-cx)*.55,cy+(p[1]-cy)*.55+5];vPoly(g,[sh(A),sh(Bp),sh(T2)]);g.fillStyle=vLin(g,0,T2[1],0,my,[[0,tint(inner,farSide?-.2:.2)],[1,tint(inner,farSide?-.35:-.1)]]);g.fill();
    g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.3;g.beginPath();const b0=sh(A),b1=sh(Bp);g.moveTo((b0[0]+b1[0])/2,(b0[1]+b1[1])/2);g.lineTo(cx+(T2[0]-cx)*.3,cy+(T2[1]-cy)*.3+6);g.stroke();
    if(C.rim&&farSide===false){g.strokeStyle=C.rim;g.lineWidth=2;g.beginPath();g.moveTo(A[0]+2,A[1]);g.lineTo(T2[0],T2[1]+4);g.stroke();}};
  ear([hx-40,hy-14],[hx-12,hy-36],[hx-46,hy-82],-P.ear*1,C.i,true);
  ear([hx+12,hy-38],[hx+41,hy-12],[hx+48,hy-84],P.ear*1,C.i,false);
  const headPath=()=>{g.beginPath();g.ellipse(hx,hy,47,39,0,0,Math.PI*2);g.moveTo(hx-40,hy+4);g.lineTo(hx-56,hy+16);g.lineTo(hx-36,hy+24);g.moveTo(hx+40,hy+4);g.lineTo(hx+57,hy+16);g.lineTo(hx+36,hy+26);};
  g.strokeStyle=C.line;g.lineWidth=6;headPath();g.stroke();g.fillStyle=vRad(g,hx,hy,47,39,C.b);headPath();g.fill();
  g.save();headPath();g.clip();
  if(C.coat==='tabby'){g.strokeStyle=C.s;g.lineWidth=5;for(let i=0;i<3;i++){g.beginPath();g.moveTo(hx-9+i*10,hy-38);g.lineTo(hx-7+i*9,hy-22);g.stroke();}for(let i=0;i<2;i++){g.beginPath();g.moveTo(hx+56,hy+2+i*8);g.quadraticCurveTo(hx+46,hy+i*8,hx+38,hy+4+i*8);g.stroke();g.beginPath();g.moveTo(hx-56,hy+2+i*8);g.quadraticCurveTo(hx-48,hy+i*8,hx-40,hy+4+i*8);g.stroke();}}
  if(C.coat==='calico'){vE(g,hx-30,hy-18,28,24,.3);g.fillStyle=C.s;g.fill();vE(g,hx+34,hy-26,16,13);g.fillStyle=C.z;g.fill();}
  if(C.coat==='patch'){vE(g,hx+30,hy-18,24,22,-.2);g.fillStyle=C.s;g.fill();}
  if(C.coat==='points'){const pg=g.createRadialGradient(hx+10,hy+14,4,hx+10,hy+14,40);pg.addColorStop(0,C.s);pg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=pg;g.fillRect(hx-50,hy-40,100,80);}
  const shade=g.createRadialGradient(hx-16,hy-18,6,hx,hy,56);shade.addColorStop(0,'rgba(255,245,230,.16)');shade.addColorStop(.6,'rgba(0,0,0,0)');shade.addColorStop(1,'rgba(20,8,40,.28)');g.fillStyle=shade;g.fillRect(hx-60,hy-50,120,100);
  g.restore();
  if(C.rim){g.strokeStyle=C.rim;g.lineWidth=2.5;g.beginPath();g.ellipse(hx,hy,45,37,0,Math.PI*1.02,Math.PI*1.6);g.stroke();}
  const muz=(C.coat==='solid')?tint(C.b,DARKCATS.has(a.key)?.1:.14):C.coat==='points'?C.s:C.l;
  vE(g,hx+12,hy+17,21,14);g.fillStyle=vRad(g,hx+12,hy+17,21,14,muz,.25,-.12);g.fill();
  if(P.blush>.05){for(const [bx,by,r] of [[hx+36,hy+11,10],[hx-18,hy+11,7]]){const bg=g.createRadialGradient(bx,by,1,bx,by,r);bg.addColorStop(0,'rgba(255,120,160,'+(.55*P.blush)+')');bg.addColorStop(1,'rgba(255,120,160,0)');g.fillStyle=bg;g.fillRect(bx-r,by-r,r*2,r*2);}}
  /* ojos */
  const eyes=T.eyes,bl=a.blink;
  const eye=(ex,ey,rx,ry,near)=>{
    if(eyes==='happy'){g.strokeStyle=C.line;g.lineWidth=4.5;g.beginPath();g.moveTo(ex-rx,ey+4);g.quadraticCurveTo(ex,ey-ry*.95,ex+rx,ey+4);g.stroke();return;}
    const R=eyes==='wide'?1.14:1,erx=rx*R,ery=ry*R;
    vE(g,ex,ey,erx+2.4,ery+2.4);g.fillStyle=C.line;g.fill();
    vE(g,ex,ey,erx,ery);g.fillStyle=vLin(g,0,ey-ery,0,ey+ery,[[0,tint(C.e,-.5)],[.45,C.e],[1,tint(C.e,.55)]]);g.fill();
    vE(g,ex+(near?2.2:1.6),ey+1.5,eyes==='wide'?3.4:erx*.46,eyes==='wide'?3.8:ery*.72);g.fillStyle=C.pu;g.fill();
    g.fillStyle='#ffffff';vE(g,ex-erx*.34,ey-ery*.42,erx*.3,ery*.24);g.fill();vE(g,ex+erx*.34,ey+ery*.4,erx*.13,erx*.13);g.fill();
    const xi=near?ex-erx-3:ex+erx+3,xo=near?ex+erx+3:ex-erx-3,top=ey-ery-2;
    let yi=top+bl*(2*ery+4),yo=yi;
    if(eyes==='sad'){yi=Math.max(yi,ey-ery*.35);yo=Math.max(yo,ey+ery*.05);}
    if(eyes==='angry'){yi=Math.max(yi,ey-ery*.05);yo=Math.max(yo,ey-ery*.6);}
    if(yi>top+.5||yo>top+.5){g.save();vE(g,ex,ey,erx+2.6,ery+2.6);g.clip();vPoly(g,[[xi,top-4],[xo,top-4],[xo,yo],[xi,yi]]);g.fillStyle=tint(C.b,.05);g.fill();g.restore();
      g.strokeStyle=C.line;g.lineWidth=3.6;g.beginPath();g.moveTo(xi,yi);g.lineTo(xo,yo);g.stroke();}
    else{g.strokeStyle=C.line;g.lineWidth=3.6;g.beginPath();g.ellipse(ex,ey,erx+1,ery+1,0,Math.PI*1.1,Math.PI*1.9);g.stroke();}
    g.strokeStyle=C.line;g.lineWidth=2.6;g.beginPath();g.moveTo(xo,yo+(yo>top+.5?0:ery*.3));g.lineTo(xo+(near?6:-5),yo-4+(yo>top+.5?0:ery*.3));g.stroke();
  };
  eye(hx-12,hy-4,10,14,false);eye(hx+24,hy-4,12,15.5,true);
  /* nariz y boca */
  const nx=hx+12,ny=hy+9;vPoly(g,[[nx-7,ny-2],[nx+7,ny-2],[nx,ny+5]]);g.fillStyle=C.n;g.fill();g.strokeStyle=tint(C.n,-.45);g.lineWidth=1.6;g.stroke();vE(g,nx-2,ny-.5,2.4,1.3);g.fillStyle='rgba(255,255,255,.7)';g.fill();
  let M=T.mouth;if(a.speaking&&M!=='open'&&M!=='grin')M=a.flap>.5?'open':'smile';
  const mx=nx,my=ny+7,dark='#43182a',line=C.line;g.lineWidth=2.8;g.strokeStyle=line;
  if(M==='smile'){g.beginPath();g.moveTo(mx,my-3);g.lineTo(mx,my+1);g.moveTo(mx,my+1);g.quadraticCurveTo(mx-5,my+7,mx-11,my+2);g.moveTo(mx,my+1);g.quadraticCurveTo(mx+5,my+7,mx+11,my+2);g.stroke();}
  else if(M==='frown'){g.beginPath();g.moveTo(mx,my-3);g.lineTo(mx,my+1);g.moveTo(mx-9,my+8);g.quadraticCurveTo(mx,my+1,mx+9,my+8);g.stroke();}
  else if(M==='o'){vE(g,mx,my+6,5.5,6.5);g.fillStyle=dark;g.fill();g.stroke();}
  else if(M==='grin'){g.beginPath();g.moveTo(mx-13,my);g.quadraticCurveTo(mx,my+4,mx+13,my);g.quadraticCurveTo(mx,my+17,mx-13,my);g.closePath();g.fillStyle='#fffaf2';g.fill();g.strokeStyle='#d8cdc6';g.lineWidth=1.4;g.beginPath();g.moveTo(mx-10,my+5);g.quadraticCurveTo(mx,my+7,mx+10,my+5);g.stroke();g.strokeStyle=line;g.lineWidth=2.8;g.beginPath();g.moveTo(mx-13,my);g.quadraticCurveTo(mx,my+4,mx+13,my);g.quadraticCurveTo(mx,my+17,mx-13,my);g.stroke();}
  else{const h=a.speaking?8+a.flap*10:18;const mp=()=>{g.beginPath();g.moveTo(mx-11,my);g.quadraticCurveTo(mx,my+3,mx+11,my);g.quadraticCurveTo(mx+10,my+h,mx,my+h+1);g.quadraticCurveTo(mx-10,my+h,mx-11,my);g.closePath();};
    mp();g.fillStyle=dark;g.fill();g.save();mp();g.clip();g.fillStyle='#fffaf2';g.fillRect(mx-12,my-2,24,6);vPoly(g,[[mx-8,my+3],[mx-5,my+3],[mx-6.5,my+7]]);g.fill();vPoly(g,[[mx+5,my+3],[mx+8,my+3],[mx+6.5,my+7]]);g.fill();vE(g,mx+1,my+h,7,5);g.fillStyle='#ee8fa4';g.fill();g.restore();mp();g.strokeStyle=line;g.stroke();}
  g.strokeStyle=C.wh;g.lineWidth=1.5;g.beginPath();
  for(const [y0,y1,x1] of [[14,8,74],[18,19,76],[22,31,72]]){g.moveTo(hx+32,hy+y0);g.quadraticCurveTo(hx+52,hy+y0-1,hx+x1,hy+y1);}
  for(const [y0,y1,x1] of [[16,9,-44],[20,22,-46]]){g.moveTo(hx-8,hy+y0);g.quadraticCurveTo(hx-26,hy+y0-1,hx+x1,hy+y1);}
  g.stroke();
  /* accesorios */
  if(a.key==='humo'&&!a.hat){for(const [gx,gy,w,h2] of [[hx-24,hy-40,20,11],[hx+2,hy-42,24,12]]){g.beginPath();g.roundRect?g.roundRect(gx,gy,w,h2,5):g.rect(gx,gy,w,h2);g.fillStyle='#16121e';g.fill();g.strokeStyle='#000';g.lineWidth=2;g.stroke();g.strokeStyle='rgba(160,210,255,.7)';g.lineWidth=1.6;g.beginPath();g.moveTo(gx+4,gy+3);g.lineTo(gx+9,gy+3);g.stroke();}g.strokeStyle='#16121e';g.lineWidth=3;g.beginPath();g.moveTo(hx-4,hy-36);g.lineTo(hx+2,hy-37);g.stroke();}
  if(a.hat){const [c1,c2]=({humo:['#5fe0b0','#6fb3ff'],tigre:['#c77dff','#ffd23f']})[a.key]||HATC[a.key]||['#ff5c9d','#ffd23f'];
    const b0=[hx-12,hy-34],b1=[hx+24,hy-40],tp=[hx+18,hy-100];g.save();vPoly(g,[b0,b1,tp]);g.clip();g.fillStyle=c1;g.fillRect(hx-20,hy-110,60,80);g.strokeStyle=c2;g.lineWidth=7;for(let i=0;i<5;i++){g.beginPath();g.moveTo(hx-20,hy-44-i*14);g.lineTo(hx+40,hy-54-i*14);g.stroke();}
    g.fillStyle=vLin(g,hx-12,0,hx+24,0,[[0,'rgba(255,255,255,.3)'],[.6,'rgba(0,0,0,0)'],[1,'rgba(20,8,40,.3)']]);g.fillRect(hx-20,hy-110,60,80);g.restore();
    vPoly(g,[b0,b1,tp]);g.strokeStyle=C.line;g.lineWidth=3;g.stroke();vE(g,tp[0],tp[1],7,7);g.fillStyle=vRad(g,tp[0],tp[1],7,7,'#fff4d0');g.fill();g.stroke();}
  g.restore();
  /* brazo de adelante */
  arm(18+lean*.6,-98-B+br*.3,P.aN+sw+(a.speaking&&a.pose!=='angry'&&a.pose!=='cheer'?Math.sin(t*6)*.25:0),C.b,pawC,17);
  if(C.rim){const ex=18+lean*.6+Math.sin(P.aN)*40,ey=-98-B+Math.cos(P.aN)*40;g.strokeStyle=C.rim;g.lineWidth=2;g.beginPath();g.moveTo(18+lean*.6-6,-98-B);g.lineTo(ex-6,ey-2);g.stroke();}
  g.restore();
}

/* ---- escenario ---- */
function skyLayer(){
  if(SKYC)return SKYC;const c=document.createElement('canvas');c.width=VW;c.height=VH;const g=c.getContext('2d');VSEED=11;
  g.fillStyle=vLin(g,0,0,0,480,[[0,'#140e40'],[.36,'#3c2272'],[.6,'#94468a'],[.76,'#ec8878'],[.9,'#ffbe88'],[1,'#ffd8a0']]);g.fillRect(0,0,VW,480);
  for(let i=0;i<150;i++){const x=vr()*VW,y=vr()*220,r=vr()<.1?1.4:.8;g.globalAlpha=.3+vr()*.7*(1-y/260);g.fillStyle=vr()<.3?'#ffffff':'#c8c0ff';g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}g.globalAlpha=1;
  let sg=g.createRadialGradient(770,448,0,770,448,300);sg.addColorStop(0,'rgba(255,220,160,.55)');sg.addColorStop(1,'rgba(255,160,120,0)');g.fillStyle=sg;g.fillRect(400,150,560,330);
  sg=g.createRadialGradient(770,448,0,770,448,62);sg.addColorStop(0,'#fff6d8');sg.addColorStop(.7,'#ffd890');sg.addColorStop(1,'#ffb070');g.fillStyle=sg;g.beginPath();g.arc(770,448,62,0,Math.PI*2);g.fill();
  const hills=(y0,amp,col,seed)=>{g.beginPath();g.moveTo(0,480);for(let x=0;x<=VW;x+=12)g.lineTo(x,y0-Math.sin(x*.006+seed)*amp-Math.sin(x*.017+seed*2)*amp*.4);g.lineTo(VW,480);g.closePath();g.fillStyle=col;g.fill();};
  hills(410,22,'#6a3a7e',1);hills(432,16,'#57306e',3);
  for(let x=0;x<VW;){const w=18+vr()*40,h=40+vr()*70;g.fillStyle=vLin(g,0,470-h,0,470,[[0,'#50306e'],[1,'#6a4080']]);g.fillRect(x,470-h,w,h);for(let wy=470-h+6;wy<464;wy+=9)for(let wx=x+4;wx<x+w-4;wx+=7)if(vr()<.28){g.fillStyle=vr()<.7?'rgba(255,200,120,.85)':'rgba(255,150,140,.8)';g.fillRect(wx,wy,3,4);}x+=w+2;}
  g.fillStyle=vLin(g,0,380,0,480,[[0,'rgba(255,170,140,0)'],[1,'rgba(255,170,140,.35)']]);g.fillRect(0,380,VW,100);
  for(let x=340;x<VW;){const w=90+vr()*60,h=80+vr()*50,y0=480-h;const wall=vLin(g,x,0,x+w,0,[[0,'#4a2a64'],[1,'#3a2052']]);g.fillStyle=wall;g.fillRect(x,y0,w,h);
    vPoly(g,[[x-10,y0+2],[x+w/2,y0-34-vr()*14],[x+w+10,y0+2]]);g.fillStyle='#2c1840';g.fill();
    if(vr()<.6){g.fillStyle='#2c1840';g.fillRect(x+w*.7,y0-40,12,26);}
    for(let wy=y0+14;wy<470;wy+=26)for(let wx=x+12;wx<x+w-24;wx+=30)if(vr()<.6){g.fillStyle='#1c0e2c';g.fillRect(wx-2,wy-2,18,18);const wg=g.createLinearGradient(0,wy,0,wy+14);wg.addColorStop(0,'#ffd890');wg.addColorStop(1,'#ff9e6a');g.fillStyle=wg;g.fillRect(wx,wy,14,14);g.fillStyle='#1c0e2c';g.fillRect(wx+6,wy,2,14);}
    x+=w+14+vr()*20;}
  return SKYC=c;
}
function drawTreeV(g,x,y,R,seed,t){
  g.save();g.translate(x,y);
  g.fillStyle=vLin(g,-8,0,10,0,[[0,'#4a3020'],[1,'#26160c']]);vPoly(g,[[-9,0],[9,0],[6,-R*1.1],[-5,-R*1.1]]);g.fill();
  g.rotate(Math.sin(t*.7+seed)*.012);
  VSEED=Math.floor(seed*1000)+7;const bl=[];for(let i=0;i<14;i++)bl.push([(vr()-.5)*R*1.5,-R*1.25-(vr()-.3)*R*.9,R*(.36+vr()*.26)]);
  bl.sort((a,b)=>a[1]-b[1]);
  for(const [bx,by,r] of bl){const gr=g.createRadialGradient(bx-r*.4,by-r*.45,r*.1,bx,by,r*1.05);gr.addColorStop(0,'#77a86c');gr.addColorStop(.5,'#3e6e4c');gr.addColorStop(1,'#1d3528');g.fillStyle=gr;g.beginPath();g.arc(bx,by,r,0,Math.PI*2);g.fill();}
  g.fillStyle='rgba(170,220,140,.35)';for(let i=0;i<30;i++){const [bx,by,r]=bl[i%bl.length];g.beginPath();g.ellipse(bx-r*.3+(vr()-.5)*r,by-r*.4+(vr()-.5)*r*.6,2.2,1.4,vr()*3,0,Math.PI*2);g.fill();}
  g.restore();
}
function fgLayer(){
  if(FGC)return FGC;const K=2,c=document.createElement('canvas');c.width=VW*K;c.height=VH*K;const g=c.getContext('2d');g.scale(K,K);VSEED=29;
  g.fillStyle=vLin(g,0,440,0,524,[[0,'#2c4a38'],[1,'#3a5e44']]);g.fillRect(360,440,600,84);
  for(let i=0;i<500;i++){const x=360+vr()*600,y=446+vr()*78;g.strokeStyle=vr()<.5?'#4f8a5c':'#24402f';g.lineWidth=1.2;g.beginPath();g.moveTo(x,y);g.lineTo(x+(vr()-.5)*3,y-4-vr()*4);g.stroke();}
  for(let x=392;x<VW;x+=22){g.fillStyle='rgba(20,10,40,.3)';vPoly(g,[[x+16,432],[x+22,430],[x+22,524],[x+16,524]]);g.fill();
    vPoly(g,[[x,432],[x+8,420],[x+16,432],[x+16,524],[x,524]]);g.fillStyle=vLin(g,x,0,x+16,0,[[0,'#fffaf0'],[.6,'#efe6d4'],[1,'#c9bca4']]);g.fill();g.strokeStyle='#8a7a66';g.lineWidth=1.4;g.stroke();}
  for(const ry of [452,494]){g.fillStyle=vLin(g,0,ry,0,ry+9,[[0,'#f6eee0'],[1,'#b8aa92']]);g.fillRect(384,ry,576,9);g.fillStyle='rgba(20,10,40,.25)';g.fillRect(384,ry+9,576,3);}
  /* casa */
  for(let y=236;y<512;y+=12){g.fillStyle=vLin(g,0,y,0,y+12,[[0,'#f8e0bc'],[.3,'#ecca9e'],[1,'#d8b084']]);g.fillRect(8,y,334,12);g.fillStyle='#b48a5c';g.fillRect(8,y+10.5,334,1.5);}
  g.fillStyle=vLin(g,280,0,342,0,[[0,'rgba(60,20,50,0)'],[1,'rgba(60,20,50,.28)']]);g.fillRect(280,236,62,276);
  for(const [x0,w] of [[0,16],[336,16]]){g.fillStyle=vLin(g,x0,0,x0+w,0,[[0,'#fffaf0'],[1,'#d6ccb8']]);g.fillRect(x0,230,w,284);}
  g.fillStyle=vLin(g,0,508,0,524,[[0,'#aea4bc'],[1,'#7e7494']]);g.fillRect(0,508,352,16);
  g.fillStyle=vLin(g,0,236,0,268,[[0,'rgba(40,10,40,.45)'],[1,'rgba(40,10,40,0)']]);g.fillRect(8,236,334,32);
  g.fillStyle='#8a4234';g.fillRect(244,86,46,120);for(let y=88;y<206;y+=9){g.fillStyle='#6a2e24';g.fillRect(244,y,46,1.5);for(let x=244+((y/9)%2?0:11);x<290;x+=22)g.fillRect(x,y,1.5,9);}
  g.fillStyle=vLin(g,244,0,290,0,[[0,'rgba(255,200,160,.18)'],[1,'rgba(40,10,30,.3)']]);g.fillRect(244,86,46,120);
  g.fillStyle='#4e2420';g.fillRect(236,76,62,12);g.fillStyle='#7a3a30';g.fillRect(236,76,62,3);
  vPoly(g,[[-34,248],[176,52],[386,248]]);g.fillStyle=vLin(g,0,52,0,248,[[0,'#c24c62'],[1,'#8a2a40']]);g.fill();
  g.save();vPoly(g,[[-34,248],[176,52],[386,248]]);g.clip();
  for(let y=68,row=0;y<250;y+=14,row++){for(let x=-40+(row%2?11:0);x<400;x+=22){const sh=rh(x,y);g.fillStyle=sh<.3?'#a2364e':sh>.8?'#c65a70':'#b24258';g.beginPath();g.moveTo(x,y-14);g.lineTo(x+22,y-14);g.lineTo(x+22,y-2);g.quadraticCurveTo(x+11,y+4,x,y-2);g.closePath();g.fill();g.strokeStyle='#6e1e32';g.lineWidth=1.3;g.stroke();g.strokeStyle='rgba(255,210,210,.3)';g.beginPath();g.moveTo(x+2,y-13);g.lineTo(x+20,y-13);g.stroke();}}
  g.fillStyle=vLin(g,0,0,VW,0,[[0,'rgba(255,190,150,.12)'],[.5,'rgba(0,0,0,0)'],[1,'rgba(30,5,30,.25)']]);g.fillRect(-40,50,440,200);
  g.restore();
  for(const s of [-1,1]){g.strokeStyle='#f4ead5';g.lineWidth=11;g.beginPath();g.moveTo(176,50);g.lineTo(176+s*214,252);g.stroke();g.strokeStyle='#b8aa92';g.lineWidth=2;g.beginPath();g.moveTo(176+s*4,58);g.lineTo(176+s*214,258);g.stroke();}
  g.fillStyle=vLin(g,0,246,0,258,[[0,'#9a9ab0'],[1,'#6a6a84']]);g.fillRect(-38,248,428,8);
  for(const wx of [28,228]){
    g.fillStyle=vLin(g,0,0,0,1,[[0,'#35627e'],[1,'#35627e']]);for(const sx of [wx-22,wx+98]){g.fillStyle=vLin(g,sx,0,sx+20,0,[[0,'#3e7090'],[1,'#274c64']]);g.fillRect(sx,288,20,108);g.fillStyle='#1e3c50';for(let y=294;y<392;y+=7)g.fillRect(sx+3,y,14,2);g.strokeStyle='#16303e';g.lineWidth=1.5;g.strokeRect(sx,288,20,108);}
    g.save();g.beginPath();g.rect(wx-8,284,112,116);g.rect(wx+4,296,88,92);g.clip('evenodd');g.fillStyle=vLin(g,0,284,0,400,[[0,'#fffaf0'],[1,'#d8ccb4']]);g.fillRect(wx-8,284,112,116);g.restore();
    g.strokeStyle='#b8aa92';g.lineWidth=1.5;g.strokeRect(wx+4,296,88,92);
    g.fillStyle=vLin(g,0,398,0,410,[[0,'#fffaf0'],[1,'#c8bca4']]);g.fillRect(wx-14,398,124,10);
    g.fillStyle=vLin(g,0,408,0,428,[[0,'#8a5230'],[1,'#5a3018']]);g.fillRect(wx-10,408,116,20);
    for(let i=0;i<22;i++){const fx=wx-6+i*5.2,fy=402-vr()*10;g.strokeStyle='#3f7a55';g.lineWidth=1.6;g.beginPath();g.moveTo(fx,408);g.lineTo(fx+(vr()-.5)*4,fy+4);g.stroke();g.fillStyle=['#ff7aa8','#fff0c0','#ffd23f','#c77dff','#ff9e6a'][i%5];g.beginPath();g.arc(fx,fy,3,0,Math.PI*2);g.fill();g.fillStyle='rgba(255,255,255,.6)';g.fillRect(fx-1,fy-1,1.5,1.5);}
    g.clearRect(wx+4,296,88,92);
    g.fillStyle='#fffaf0';g.fillRect(wx+46,296,4,92);g.fillRect(wx+4,340,88,4);
  }
  g.save();g.beginPath();g.rect(130,346,92,178);g.rect(142,358,68,166);g.clip('evenodd');g.fillStyle=vLin(g,130,0,222,0,[[0,'#fffaf0'],[1,'#d0c4ac']]);g.fillRect(130,346,92,178);g.restore();
  g.clearRect(142,358,68,152);
  for(const [x,y,w,h] of [[118,512,116,12],[126,500,100,12]]){g.fillStyle=vLin(g,0,y,0,y+h,[[0,'#cfc8dc'],[1,'#8e86a4']]);g.fillRect(x,y,w,h);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(x,y,w,1.5);}
  const bush=(bx,by,R,n)=>{for(let i=0;i<n;i++){const x=bx+(vr()-.5)*R*1.6,y=by-vr()*R*.7,r=R*(.35+vr()*.3);const gr=g.createRadialGradient(x-r*.4,y-r*.4,1,x,y,r);gr.addColorStop(0,'#6aa66c');gr.addColorStop(.6,'#3a6c48');gr.addColorStop(1,'#1f3a2a');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}for(let i=0;i<n*2;i++){g.fillStyle=['#ff9ec4','#fff4d0','#ffd23f'][i%3];g.beginPath();g.arc(bx+(vr()-.5)*R*1.6,by-vr()*R*1.1,2.4,0,Math.PI*2);g.fill();}};
  bush(30,516,34,9);bush(90,520,22,6);bush(292,516,28,8);bush(344,520,24,6);
  g.fillStyle=vLin(g,364,0,376,0,[[0,'#7a5030'],[1,'#4a2e18']]);g.fillRect(366,450,10,74);
  g.beginPath();g.roundRect?g.roundRect(348,424,46,30,[14,14,3,3]):g.rect(348,424,46,30);g.fillStyle=vLin(g,0,424,0,454,[[0,'#5a82d8'],[1,'#2e4c98']]);g.fill();g.strokeStyle='#1c2e64';g.lineWidth=2;g.stroke();
  g.fillStyle='#e2344f';g.fillRect(390,414,4,22);g.fillRect(390,414,12,8);g.fillStyle='#fff';g.font='bold 12px "Pixelify Sans"';g.fillText('7',366,446);
  g.fillStyle=vLin(g,896,0,910,0,[[0,'#4a4060'],[.5,'#2a2233'],[1,'#141018']]);g.fillRect(896,176,12,348);g.fillStyle='#2a2233';g.fillRect(886,510,32,14);g.fillRect(890,500,24,12);
  g.strokeStyle='#2a2233';g.lineWidth=5;g.beginPath();g.moveTo(902,180);g.quadraticCurveTo(902,150,880,150);g.stroke();
  g.fillStyle='#2a2233';vPoly(g,[[862,152],[898,152],[892,142],[868,142]]);g.fill();g.fillRect(864,152,32,4);g.clearRect(866,156,28,24);g.fillRect(864,178,32,5);g.fillRect(878,156,2,24);
  const pv=g.createImageData?null:null;
  for(let y=524,row=0;y<600;y+=26,row++)for(let x=-(row%2)*24;x<VW;x+=48){const h=rh(x,y);g.fillStyle=vLin(g,0,y,0,y+26,[[0,tint('#9a92b0',(h-.5)*.12)],[1,tint('#827aa0',(h-.5)*.12)]]);g.fillRect(x+1.5,y+1.5,45,23);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x+1.5,y+1.5,45,2);
    if(h<.15){g.strokeStyle='#5e567a';g.lineWidth=1;g.beginPath();g.moveTo(x+10,y+4);g.lineTo(x+18,y+12);g.lineTo(x+14,y+20);g.stroke();}
    if(h>.8){g.strokeStyle='#4f8a5c';g.lineWidth=1.3;for(let k=0;k<4;k++){g.beginPath();g.moveTo(x+k*3,y+1);g.lineTo(x+k*3+1,y-5);g.stroke();}}}
  g.fillStyle='#5e567a';for(let y=524;y<600;y+=26)g.fillRect(0,y,VW,1.5);
  g.fillStyle=vLin(g,0,600,0,612,[[0,'#d4cce4'],[1,'#8a82a4']]);g.fillRect(0,600,VW,12);g.fillStyle='#3a3448';g.fillRect(0,612,VW,12);
  return FGC=c;
}
function vCloud(g,x,y,w,s){VSEED=Math.floor(s*997)+3;const bl=[];for(let i=0;i<8;i++)bl.push([x-w/2+i*w/7+(vr()-.5)*14,y+(vr()-.5)*10,w*.12+vr()*w*.08]);
  for(const [bx,by,r] of bl){const gr=g.createLinearGradient(0,by-r,0,by+r);gr.addColorStop(0,'rgba(150,80,150,.9)');gr.addColorStop(.55,'rgba(214,112,146,.92)');gr.addColorStop(1,'rgba(255,184,140,.95)');g.fillStyle=gr;g.beginPath();g.ellipse(bx,by,r*1.4,r*.8,0,0,Math.PI*2);g.fill();}}

/* ---- guion ---- */
function sActor(k){return ST.actors.find(a=>a.key===k);}
function sBub(k,text,dur){ST.bubs=ST.bubs.filter(b=>b.k!==k);ST.bubs.push({k,text,t:dur||1.6});}
function confettiBurst(x,y,n){for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,s=160+Math.random()*300;ST.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:2.8+Math.random(),col:GARL[i%5],rot:Math.random()*6,kind:'c'});}}
const FRIENDS=['humo','manchita','tigre','chispa'];
const SSTEPS=[
  {dur:3.8,enter:Z=>{Z.cap='Una tarde cualquiera, en el barrio de Carbón...';FRIENDS.forEach(k=>sActor(k).pose='laugh');}},
  {talk:[
    {who:'cat',k:'humo',mood:'retador',text:'¿Ya te vas, Carbón? ¡Si recién está anocheciendo!',set:{humo:'point',manchita:'stand',tigre:'stand',chispa:'stand'}},
    {who:'cat',k:'manchita',mood:'fiestero',text:'Siempre lo mismo. Carbón, el primero en irse de todas las fiestas.',set:{manchita:'laugh',humo:'laugh'}},
    {who:'cat',k:'tigre',mood:'fiestero',text:'¡Carbón, el gato más aburrido del barrio!',set:{tigre:'point'}},
    {who:'cat',k:'chispa',mood:'fiestero',text:'¡A-bu-rri-do! ¡A-bu-rri-do!',set:{chispa:'laugh',tigre:'laugh',humo:'laugh',manchita:'laugh',carbon:'sad'}},
    {who:'carbon',mood:'angry',text:'¡No soy aburrido!',set:{carbon:'angry',humo:'surprise',manchita:'surprise',tigre:'surprise',chispa:'surprise'}},
    {who:'carbon',mood:'angry',text:'Es que cada vez que los invito a casa, ustedes hacen un desastre. ¡Un DESASTRE!'},
    {who:'cat',k:'humo',mood:'okupa',text:'¿Ah, sí? Bueno... entonces nos vamos.',set:{humo:'sad',carbon:'stand'}},
    {who:'cat',k:'manchita',mood:'perdido',text:'Vamos, chicos. Acá no nos quieren.',set:{manchita:'sad',tigre:'sad',chispa:'sad'}}
  ]},
  {dur:5,enter:Z=>{[['humo',790,0],['manchita',880,.25],['tigre',970,.5],['chispa',1060,.7]].forEach(([k,x,d])=>{const a=sActor(k);a.tx=x;a.spd=70;a.delay=d;a.sadWalk=true;});
      [523,440,392,330].forEach((f,i)=>tone(f,.35,'triangle',.04,0,.3+i*.35));},
    upd:(Z,dt,t)=>{if(t>.8)sActor('carbon').pose='sad';if(t>2&&!Z.f1){Z.f1=1;sBub('carbon','...',2.4);}}},
  {dur:1.3,enter:Z=>{const c=sActor('carbon');c.vy=420;c.pose='surprise';sBub('carbon','¡!',1);SFX.meow();},
    upd:(Z,dt,t)=>{if(t>.55&&!Z.f2){Z.f2=1;const c=sActor('carbon');c.tx=430;c.spd=270;c.run=true;}}},
  {talk:[
    {who:'carbon',mood:'perdido',text:'¡Esperen! ¡Mentira, chicos! ¡Era una broma!',set:{carbon:'surprise'}},
    {who:'carbon',mood:'fiestero',text:'¿Por qué no hacemos una fiesta en mi casa? ¡¿AHORA?!',set:{carbon:'cheer'}}
  ]},
  {dur:3.8,enter:Z=>{FRIENDS.forEach(k=>{const a=sActor(k);a.tx=a.x;a.face=-1;a.pose='surprise';a.sadWalk=false;sBub(k,'¡!',.9);});tone(1200,.1,'square',.04);},
    upd:(Z,dt,t)=>{
      if(t>.9&&!Z.f3){Z.f3=1;SFX.win();noise(.3,.06,0,2000);Z.actors.forEach((a,i)=>{a.vy=440+i*20;a.pose='cheer';if(a.key!=='carbon')a.hat=true;});confettiBurst(680,330,110);sBub('humo','¡FIESTAAA!',1.9);}
      if(t>1.9&&!Z.f4){Z.f4=1;[['humo',540],['manchita',644],['tigre',748],['chispa',852]].forEach(([k,x],i)=>{const a=sActor(k);a.tx=x;a.spd=230;a.run=true;a.delay=i*.12;a.faceAfter=-1;});}
    }},
  {talk:[
    {who:'cat',k:'chispa',mood:'fiestero',text:'¡Yo llevo la música!',set:{chispa:'cheer',humo:'laugh',manchita:'laugh',tigre:'laugh',carbon:'laugh'}},
    {who:'cat',k:'tigre',mood:'hambriento',text:'¡Yo llevo el pollo! ...Y el queso. Y las salchichas.',set:{tigre:'point'}},
    {who:'cat',k:'manchita',mood:'happy',text:'¡Y yo le aviso a todo el barrio!',set:{manchita:'point'}},
    {who:'carbon',mood:'perdido',text:'Eh... a todo el barrio no, ¿eh? Mi humano vuelve a las ocho...',set:{carbon:'surprise'}},
    {who:'cat',k:'humo',mood:'fiestero',text:'¡Demasiado tarde! ¡A la casa de Carbón!',set:{humo:'cheer',manchita:'cheer',tigre:'cheer',chispa:'cheer'}}
  ]},
  {dur:8,enter:Z=>{tone(300,.4,'sawtooth',.03,-100);},
    upd:(Z,dt,t)=>{
      Z.door=Math.min(1,Math.max(0,(t-.2)*2));if(t>7)Z.door=Math.max(0,1-(t-7)*3);
      if(t>.5&&!Z.f5){Z.f5=1;FRIENDS.forEach((k,i)=>{const a=sActor(k);a.tx=176;a.spd=400;a.run=true;a.delay=i*.25;a.enter=true;});}
      if(t>2.8&&!Z.f6){Z.f6=1;const c=sActor('carbon');c.tx=262;c.spd=230;c.run=true;c.faceAfter=1;}
      if(t>3.9&&!Z.f7){Z.f7=1;const c=sActor('carbon');c.pose='sad';sBub('carbon','Esto va a terminar mal...',2.1);}
      if(t>6.1&&!Z.f8){Z.f8=1;const c=sActor('carbon');c.tx=176;c.spd=160;c.run=false;c.enter=true;c.pose='stand';}
      if(t>7.2&&!Z.f9){Z.f9=1;noise(.15,.08,0,500);tone(90,.15,'square',.06);}
    }},
  {dur:6.6,enter:Z=>{Z.party=1;Z.cap=null;},
    upd:(Z,dt,t)=>{
      const beat=Math.floor(t/.42);if(beat!==Z.lastBeat){Z.lastBeat=beat;tone(100,.12,'sine',.12,-60);if(beat%2)noise(.06,.03,0,5000);tone(mtof([45,48,52,50][Math.floor(beat/2)%4]),.3,'triangle',.05);if(Math.random()<.7)Z.fx.push({x:267,y:74,vx:(Math.random()-.5)*24,vy:-44,t:2.4,col:GARL[beat%5],kind:'n',ph:Math.random()*6});}
      if(t>1&&!Z.fa){Z.fa=1;SFX.win();}
    }}
];
function newActor(key,x,face){const P=poseOf('stand');return{key,x,tx:x,face,pose:'stand',hat:false,a:1,y:0,vy:0,phase:0,delay:0,spd:80,seed:Math.random()*10,cur:{aN:P.aN,aF:P.aF,hT:0,hY:0,lean:0,ear:0,tail:1,blush:0},blink:0,blinkT:1+Math.random()*3,flap:0};}
function startStory(){
  initAudio();hide();state='story';loadLevel(0);hLevel.textContent='PRÓLOGO · UNA TARDE EN EL BARRIO';
  skyLayer();fgLayer();
  ST={step:-1,t:0,T:0,actors:[['carbon',300,1],['humo',476,-1],['manchita',588,-1],['tigre',700,-1],['chispa',812,-1]].map(([k,x,f])=>newActor(k,x,f)),fx:[],bubs:[],smoke:[],leaves:[],door:0,party:0,fade:1,cap:null,lastCur:null,cam:{x:480,y:312,z:1},
    clouds:[[160,150,220,1],[520,104,260,2],[830,196,180,3],[360,236,160,4],[700,60,200,5]].map(([x,y,w,s])=>({x,y,w,s,v:4+s}))};
  hint.innerHTML='<b>ESPACIO</b><span>Seguir · <b>ESC</b> o tocá acá para saltear la intro</span>';lastHint='x';
  grabFocus();nextStory();
}
function nextStory(){const Z=ST;if(!Z)return;Z.step++;Z.t=0;if(Z.step>=SSTEPS.length){endStory();return;}const st=SSTEPS[Z.step];if(st.enter)st.enter(Z);if(st.talk)danceTalk(st.talk,()=>nextStory());}
function endStory(){if(!ST)return;if(D)closeTalk();ST=null;lastHint='';setHint(null);showIntro(0);}
function updateStory(dt){
  const Z=ST;if(!Z)return;Z.t+=dt;Z.T+=dt;Z.fade=Math.max(0,Z.fade-dt*.8);
  if(D&&D.cur&&D.cur!==Z.lastCur){Z.lastCur=D.cur;if(D.cur.set)for(const k in D.cur.set){const a=sActor(k);if(a)a.pose=D.cur.set[k];}}
  const spk=D&&D.cur?(D.cur.who==='carbon'?'carbon':D.cur.as&&D.cur.as.key):null;
  Z.actors.forEach(a=>{
    a.speaking=a.key===spk&&D&&D.cur&&D.typed<D.cur.text.length;a.flap=a.speaking?(Math.sin(Z.T*18)*.5+.5):0;
    if(a.delay>0)a.delay-=dt;
    else if(Math.abs(a.tx-a.x)>2){const d=Math.sign(a.tx-a.x);a.x+=d*Math.min(Math.abs(a.tx-a.x),a.spd*dt);a.face=d;a.walking=true;a.phase+=dt*a.spd/(a.run?22:16);}
    else if(a.walking){a.walking=false;a.run=false;if(a.faceAfter){a.face=a.faceAfter;a.faceAfter=0;}}
    if(a.y>0||a.vy>0){a.vy-=1500*dt;a.y+=a.vy*dt;if(a.y<=0){a.y=0;a.vy=0;}}
    if(a.enter&&a.x<214)a.a=Math.max(0,a.a-dt*3.5);
    const T=poseOf(a.sadWalk?'sad':a.pose),k=Math.min(1,dt*9);for(const p of ['aN','aF','hT','hY','lean','ear','tail','blush'])a.cur[p]+=((T[p]||0)-a.cur[p])*k;
    a.blinkT-=dt;if(a.blinkT<=0){a.blink=Math.min(1,a.blink+dt*14);if(a.blink>=1){a.blinkT=2+Math.random()*3.5;}}else a.blink=Math.max(0,a.blink-dt*10);
  });
  Z.bubs.forEach(b=>b.t-=dt);Z.bubs=Z.bubs.filter(b=>b.t>0);
  Z.fx.forEach(p=>{p.t-=dt;if(p.kind==='c'){p.vy+=320*dt;p.vx*=.99;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=dt*8;if(p.y>580){p.y=580;p.vy=0;p.vx*=.8;}}else{p.x+=Math.sin(p.t*4+p.ph)*1+p.vx*dt;p.y+=p.vy*dt;}});Z.fx=Z.fx.filter(p=>p.t>0);
  if(Math.random()<dt*1.6)Z.smoke.push({x:267+(Math.random()-.5)*8,y:72,t:0,r:7+Math.random()*4});
  Z.smoke.forEach(s=>{s.t+=dt;s.y-=20*dt;s.x+=12*dt+Math.sin(s.t*2)*6*dt;s.r+=5*dt;});Z.smoke=Z.smoke.filter(s=>s.t<4.5);
  if(Math.random()<dt*.8)Z.leaves.push({x:Math.random()*VW,y:-10,vx:20+Math.random()*30,vy:30+Math.random()*20,rot:Math.random()*6,col:['#ffb0c8','#ffd8a0','#8ac07a'][Math.floor(Math.random()*3)],t:0});
  Z.leaves.forEach(l=>{l.t+=dt;l.x+=(l.vx+Math.sin(l.t*2)*20)*dt;l.y+=l.vy*dt;l.rot+=dt*3;});Z.leaves=Z.leaves.filter(l=>l.y<600);
  Z.clouds.forEach(c=>{c.x+=c.v*dt;if(c.x>VW+200)c.x=-200;});
  if(Math.random()<dt*2.5)noise(.02,.006,0,7000);
  {const c=sActor('carbon');let tg={x:480,y:312,z:1};
   if(D&&D.cur){const fr=Z.actors.filter(a=>a.key!=='carbon'&&a.a>0),avg=fr.length?fr.reduce((s2,a)=>s2+a.x,0)/fr.length:c.x,sp=spk&&spk!=='carbon'&&sActor(spk)?sActor(spk).x:avg;tg={x:Math.max(356,Math.min(604,(c.x+sp)/2)),y:405,z:1.35};}
   const k=Math.min(1,dt*2.6);Z.cam.x+=(tg.x-Z.cam.x)*k;Z.cam.y+=(tg.y-Z.cam.y)*k;Z.cam.z+=(tg.z-Z.cam.z)*k;}
  const st=SSTEPS[Z.step];if(!st)return;
  if(st.upd)st.upd(Z,dt,Z.t);
  if(!st.talk&&st.dur&&Z.t>=st.dur)nextStory();
}
function drawBubble(g,x,y,text){
  g.font='600 22px "Pixelify Sans"';const w=Math.max(40,Math.ceil(g.measureText(text).width)+28),h=38,X=Math.min(VW-8-w,Math.max(8,x-w/2)),Y=y-h;
  g.beginPath();g.roundRect?g.roundRect(X,Y,w,h,12):g.rect(X,Y,w,h);g.moveTo(x-8,Y+h);g.lineTo(x,Y+h+12);g.lineTo(x+8,Y+h);
  g.fillStyle='#fffaf0';g.fill();g.strokeStyle='#2a1d3a';g.lineWidth=3;g.stroke();
  g.fillStyle='#2a1d3a';g.textAlign='center';g.fillText(text,X+w/2,Y+26);g.textAlign='left';
}
function renderStory(){
  const Z=ST,cm=Z.cam,g=ctx,t=clock;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=true;g.fillStyle='#000';g.fillRect(0,0,cv.width,cv.height);
  const sx=cv.width/VW;g.setTransform(sx*cm.z,0,0,sx*cm.z,sx*(480-cm.x*cm.z),sx*(312-cm.y*cm.z));
  g.drawImage(skyLayer(),0,0);
  for(let i=0;i<24;i++){const x=(i*397+13)%VW,y=(i*53)%200+10,a=Math.max(0,.3+.7*Math.sin(t*2+i*1.7));g.globalAlpha=a;g.fillStyle='#fff';g.beginPath();g.arc(x,y,1.3,0,Math.PI*2);g.fill();if(i%4===0){g.fillRect(x-4,y-.4,8,.8);g.fillRect(x-.4,y-4,.8,8);}}g.globalAlpha=1;
  Z.clouds.forEach(c=>vCloud(g,c.x,c.y,c.w,c.s));
  drawTreeV(g,640,470,86,1.3,t);drawTreeV(g,770,466,72,2.7,t);drawTreeV(g,520,478,56,3.9,t);
  const party=Z.party,beat=Math.floor(Z.t/.42);
  [[0,28],[1,228]].forEach(([wi,wx])=>{
    const col=party?GARL[(beat+wi*2)%5]:'#ffc46a';g.fillStyle=vLin(g,0,296,0,388,[[0,tint(col,.35)],[.5,col],[1,tint(col,-.2)]]);g.fillRect(wx+4,296,88,92);
    if(party){for(let j=0;j<3;j++){const cx=wx+22+j*26,cy=360-((beat+j)%2)*6;g.fillStyle='rgba(30,14,50,.85)';g.beginPath();g.ellipse(cx,cy,11,10,0,0,Math.PI*2);g.fill();vPoly(g,[[cx-10,cy-4],[cx-6,cy-18],[cx-2,cy-8]]);g.fill();vPoly(g,[[cx+10,cy-4],[cx+6,cy-18],[cx+2,cy-8]]);g.fill();g.fillRect(cx-9,cy+6,18,30);}}
    else{for(const [cx,dir] of [[wx+4,1],[wx+92,-1]]){g.fillStyle=vLin(g,cx,0,cx+dir*22,0,[[0,'#b8406e'],[1,'#e07aa4']]);g.beginPath();g.moveTo(cx,296);g.lineTo(cx+dir*24,296);g.quadraticCurveTo(cx+dir*10,340,cx+dir*16,388);g.lineTo(cx,388);g.closePath();g.fill();}}
    const rg=g.createLinearGradient(wx+4,296,wx+92,388);rg.addColorStop(0,'rgba(255,255,255,.25)');rg.addColorStop(.35,'rgba(255,255,255,0)');g.fillStyle=rg;g.fillRect(wx+4,296,88,92);
  });
  if(Z.door>0){g.fillStyle='#1a1026';g.fillRect(142,358,68,152);g.globalAlpha=Z.door;g.fillStyle=vLin(g,0,358,0,510,[[0,'#ffe8c0'],[1,'#ff9e6a']]);g.fillRect(146,362,60,148);g.globalAlpha=1;}
  {const w=68*(1-Z.door*.82);g.fillStyle=vLin(g,142,0,142+w,0,[[0,'#7e4628'],[1,'#5a2e18']]);g.fillRect(142,358,w,152);g.strokeStyle='#3e1e0e';g.lineWidth=2;g.strokeRect(142,358,w,152);
   if(Z.door<.5){g.fillStyle='#4e2814';for(const [py,ph] of [[434,64]]){g.fillRect(150,py,52,ph);g.fillStyle='#6e3c20';g.fillRect(153,py+3,46,ph-6);}
     g.fillStyle='#3a2010';g.fillRect(152,368,48,50);g.fillStyle=vLin(g,0,370,0,416,[[0,party?GARL[beat%5]:'#ffe0a0'],[1,party?tint(GARL[beat%5],-.2):'#ffb060']]);g.fillRect(155,371,42,44);g.fillStyle='#3a2010';g.fillRect(175,371,2,44);g.fillRect(155,392,42,2);
     const kg=g.createRadialGradient(197,448,1,198,450,6);kg.addColorStop(0,'#fff4b0');kg.addColorStop(1,'#b08010');g.fillStyle=kg;g.beginPath();g.arc(198,450,5,0,Math.PI*2);g.fill();}}
  g.fillStyle='rgba(255,236,190,.95)';g.fillRect(866,156,28,22);
  g.drawImage(fgLayer(),0,0,VW,VH);
  g.fillStyle='#2a2233';g.fillRect(236,372,6,10);g.fillStyle='#2a2233';g.fillRect(230,380,18,26);g.fillStyle=vLin(g,0,384,0,402,[[0,'#fff6c8'],[1,'#ffc870']]);g.fillRect(233,383,12,20);
  g.fillStyle='rgba(215,220,240,.3)';Z.smoke.forEach(s=>{g.globalAlpha=Math.max(0,.5-s.t*.11);const sg=g.createRadialGradient(s.x,s.y,1,s.x,s.y,s.r);sg.addColorStop(0,'rgba(225,225,245,.6)');sg.addColorStop(1,'rgba(225,225,245,0)');g.fillStyle=sg;g.fillRect(s.x-s.r,s.y-s.r,s.r*2,s.r*2);});g.globalAlpha=1;
  g.globalCompositeOperation='lighter';
  const gl=(x,y,r,rgb,a)=>{const gg=g.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,`rgba(${rgb},${a})`);gg.addColorStop(.45,`rgba(${rgb},${a*.45})`);gg.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=gg;g.fillRect(x-r,y-r,r*2,r*2);};
  gl(880,168,120,'255,226,160',.55);
  g.fillStyle=vLin(g,0,176,0,560,[[0,'rgba(255,230,160,.22)'],[1,'rgba(255,230,160,.04)']]);vPoly(g,[[864,178],[896,178],[980,560],[780,560]]);g.fill();
  gl(880,560,110,'255,220,150',.28);
  gl(239,394,70,'255,200,120',.55);
  [[76,0],[276,1]].forEach(([x,wi])=>gl(x,342,110,party?GARL_RGB[(beat+wi*2)%5]:'255,190,110',party?.55:.36));
  gl(176,392,48,'255,200,130',.35);
  if(Z.door>0){gl(176,470,130,'255,190,120',.5*Z.door);g.fillStyle='rgba(255,190,120,'+(.18*Z.door)+')';vPoly(g,[[142,524],[210,524],[256,600],[96,600]]);g.fill();}
  for(let i=0;i<12;i++){const x=400+((i*127+t*14*(i%3+1))%540),y=420+Math.sin(t*1.3+i)*40,a=Math.max(0,Math.sin(t*2+i*1.7));gl(x,y,12,'200,255,120',.7*a);}
  g.globalCompositeOperation='source-over';
  [...Z.actors].sort((a,b)=>(a.enter?0:1)-(b.enter?0:1)).forEach(a=>{if(a.a>0)drawCatV(g,a);});
  Z.leaves.forEach(l=>{g.save();g.translate(l.x,l.y);g.rotate(l.rot);g.fillStyle=l.col;g.beginPath();g.ellipse(0,0,4,2,0,0,Math.PI*2);g.fill();g.restore();});
  Z.fx.forEach(p=>{g.globalAlpha=Math.min(1,p.t*2);if(p.kind==='c'){g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle=p.col;g.fillRect(-4,-2,8*Math.abs(Math.cos(p.rot*1.7))+1,4);g.restore();}else{g.fillStyle=p.col;g.beginPath();g.ellipse(p.x,p.y+10,5,4,-.4,0,Math.PI*2);g.fill();g.fillRect(p.x+3.5,p.y-6,2.4,16);g.fillRect(p.x+3.5,p.y-6,9,3);}});g.globalAlpha=1;
  Z.bubs.forEach(b=>{const a=sActor(b.k);if(!a||a.a<=0)return;drawBubble(g,a.x+a.face*10,VG-256-a.y+(a.pose==='sad'?14:0),b.text);});
  g.setTransform(sx,0,0,sx,0,0);
  if(Z.cap&&Z.step===0){g.globalAlpha=Math.max(0,Math.min(1,Z.t*1.5,(3.8-Z.t)*2));g.fillStyle='rgba(10,6,24,.6)';g.fillRect(0,66,VW,48);g.font='600 26px "Pixelify Sans"';g.textAlign='center';g.fillStyle='#000';g.fillText(Z.cap,VW/2+2,99);g.fillStyle='#f4ead5';g.fillText(Z.cap,VW/2,97);g.textAlign='left';g.globalAlpha=1;}
  if(party){const tt=Z.t;
    if(tt>.9){const k=Math.min(1,(tt-.9)/.35),sc=1+(1-k)*1.2;g.save();g.translate(560,150);g.scale(sc,sc);g.globalAlpha=k;g.textAlign='center';g.font='48px "Press Start 2P"';
      for(const [txt,y,c] of [['LA FIESTA',0,'#ffd23f'],['DE CARBÓN',66,'#ff5c9d']]){g.fillStyle='#1a0e2a';g.fillText(txt,5,y+6);g.lineWidth=8;g.strokeStyle='#1a0e2a';g.strokeText(txt,0,y);g.fillStyle=c;g.fillText(txt,0,y);}
      g.textAlign='left';g.restore();g.globalAlpha=1;}
    if(tt>3.4){g.globalAlpha=Math.min(1,(tt-3.4)*2);g.fillStyle='rgba(10,6,24,.6)';g.fillRect(0,262,VW,48);g.font='600 26px "Pixelify Sans"';g.textAlign='center';g.fillStyle='#f4ead5';g.fillText('Unas horas más tarde...',VW/2,294);g.textAlign='left';g.globalAlpha=1;}}
  g.fillStyle='#000';g.fillRect(0,0,VW,30);g.fillRect(0,VH-10,VW,10);
  const vg=g.createRadialGradient(VW/2,VH/2,280,VW/2,VH/2,660);vg.addColorStop(0,'rgba(10,6,30,0)');vg.addColorStop(1,'rgba(10,6,30,.55)');g.fillStyle=vg;g.fillRect(0,0,VW,VH);
  const fo=Math.max(Z.fade,party&&Z.t>5.5?Math.min(1,Z.t-5.5):0);if(fo>0){g.globalAlpha=fo;g.fillStyle='#000';g.fillRect(0,0,VW,VH);g.globalAlpha=1;}
  g.imageSmoothingEnabled=false;
}

