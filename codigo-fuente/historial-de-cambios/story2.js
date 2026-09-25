/* ---------- cinemática inicial: la historia ---------- */
let ST=null,SBG=null;
const SW=480,SH=312,GS=262;

/* ---- gatos de la cinemática, dibujados en alta ---- */
const HDC={};
function hdPose(name){
  const D={hx:0,hy:0,np:[62,77],fp:[37,77],nf:[57,99],ff:[42,99],eyes:'open',mouth:'smile',blush:0,tail:0,lean:0,ears:0,by:0};
  const P0={
    stand0:{},stand1:{hy:1,by:1,np:[62,78],fp:[37,78]},
    talk:{np:[68,62],mouth:'open'},
    laugh:{eyes:'happy',mouth:'open',np:[57,75],fp:[43,75],hy:-1,blush:1,tail:1},
    laugh2:{eyes:'happy',mouth:'grin',np:[57,76],fp:[43,76],hy:1,by:1,blush:1,tail:-1},
    point:{eyes:'happy',mouth:'grin',np:[84,56],blush:1},
    angry:{eyes:'angry',mouth:'open',np:[66,60],fp:[44,60],lean:2,tail:2},
    sad:{eyes:'sad',mouth:'frown',hy:4,by:1,np:[58,83],fp:[43,83],ears:1,tail:-2},
    surprise:{eyes:'wide',mouth:'o',np:[68,52],fp:[32,54],hy:-2,tail:2},
    cheer:{eyes:'happy',mouth:'open',np:[70,22],fp:[30,24],hy:-2,blush:1,tail:2},
    jump:{eyes:'happy',mouth:'open',np:[70,22],fp:[30,24],hy:-2,nf:[62,92],ff:[40,90],blush:1,tail:2},
    walk0:{nf:[64,99],ff:[38,99],np:[56,77],fp:[43,75]},
    walk1:{nf:[51,99],ff:[46,99],np:[66,75],fp:[33,77],hy:1,by:1},
    swalk0:{nf:[62,99],ff:[40,99],eyes:'sad',mouth:'frown',hy:4,by:1,np:[58,83],fp:[43,83],ears:1,tail:-2},
    swalk1:{nf:[52,99],ff:[46,99],eyes:'sad',mouth:'frown',hy:5,by:2,np:[58,83],fp:[43,83],ears:1,tail:-2},
    run0:{nf:[70,97],ff:[32,95],np:[72,64],fp:[30,70],lean:4,eyes:'happy',mouth:'open',tail:2},
    run1:{nf:[48,99],ff:[54,94],np:[46,70],fp:[64,64],lean:4,hy:1,by:1,eyes:'happy',mouth:'open',tail:-1}
  };
  return Object.assign(D,P0[name]||{});
}
const HATHD={humo:['#5fe0b0','#6fb3ff'],tigre:['#c77dff','#ffd23f'],carbon:['#ffd23f','#ff5c9d']};
function catHD(key,poseName,hat){
  const id=key+'|'+poseName+'|'+(hat?1:0);if(HDC[id])return HDC[id];
  const W=100,H=106,p=hdPose(poseName),pal=PALS[key],coat=COAT[key]||'solid',buf=new Array(W*H).fill(null);
  const ramp=k=>(key==='carbon'&&k==='b')?[pal.H,pal.b,pal.D,'#0c0812']:fam(pal[k]||pal.b);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H)buf[y*W+x]=c;};
  const tone=(nx,ny,x,y,bias)=>{const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny)),d=nx*LV[0]+ny*LV[1]+nz*LV[2];const t=(.95-d)*2.1+(bias||0)+(BAYER[((y&3)<<2)|(x&3)]/16-.5)*.8;return Math.max(0,Math.min(3,Math.round(t)));};
  const L=p.lean,hx=53+p.hx+L,hy=38+p.hy,by=p.by;
  const pat=(part,x,y)=>{
    if(part==='muzzle')return coat==='points'?'s':coat==='solid'?'b':'l';
    if(part==='chest')return 'l';
    if(coat==='tabby'){
      if(part==='head'){if(y<hy-5&&y>hy-17&&Math.abs(((x-hx+1)%6+6)%6-2)<1.1)return 's';if(y>hy-1&&y<hy+5&&((y+40)%4<2)&&Math.abs(x-hx)>12)return 's';return 'b';}
      if(part==='ear')return 'b';
      return Math.sin(y*.62+x*.2+(part==='tail'?x*.6:0))>.42?'s':'b';
    }
    if(coat==='calico'){const n=rh(Math.floor(x/9)+3,Math.floor(y/8));return n<.33?'s':(n>.76&&pal.z?'z':'b');}
    if(coat==='patch'){const n=rh(Math.floor(x/10)+7,Math.floor(y/9)+1);return n<.3||(part==='ear'&&x>hx)?'s':'b';}
    if(coat==='tuxedo')return part==='paw'||part==='foot'?'l':'b';
    if(coat==='points')return part==='ear'||part==='tail'||part==='paw'||part==='foot'?'s':'b';
    return 'b';
  };
  const ell=(cx,cy,rx,ry,part,bias,force)=>{for(let y=Math.floor(cy-ry-1);y<=Math.ceil(cy+ry+1);y++)for(let x=Math.floor(cx-rx-1);x<=Math.ceil(cx+rx+1);x++){const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;if(nx*nx+ny*ny<=1)put(x,y,ramp(force||pat(part,x,y))[tone(nx,ny,x,y,bias)]);}};
  const cap=(a,b,r0,r1,part,bias)=>{const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1]))*2+1;for(let i=0;i<=n;i++){const t=i/n;ell(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,r0+(r1-r0)*t,r0+(r1-r0)*t,part,bias);}};
  const tri=(A,B,C,col)=>{const s=(p1,p2,p3)=>(p1[0]-p3[0])*(p2[1]-p3[1])-(p2[0]-p3[0])*(p1[1]-p3[1]);for(let y=Math.floor(Math.min(A[1],B[1],C[1]));y<=Math.max(A[1],B[1],C[1]);y++)for(let x=Math.floor(Math.min(A[0],B[0],C[0]));x<=Math.max(A[0],B[0],C[0]);x++){const P0=[x+.5,y+.5],d1=s(P0,A,B),d2=s(P0,B,C),d3=s(P0,C,A);if(!((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0)))put(x,y,col(x,y));}};
  const lid=DARKCATS.has(key)?'#0a0610':tint(ramp('b')[3],-.35);
  /* cola */
  const t0=[42,87+by],t1=[18,82-p.tail*3],t2=p.tail<-1?[14,96]:[20,58-p.tail*6];
  for(let i=0;i<=28;i++){const t=i/28,u=1-t,x=u*u*t0[0]+2*u*t*t1[0]+t*t*t2[0],y=u*u*t0[1]+2*u*t*t1[1]+t*t*t2[1];ell(x,y,4.4-t*1.2,4.4-t*1.2,'tail',t<.2?1:0);}
  /* pierna y brazo de atrás */
  cap([44,85+by],p.ff,5,3.8,'leg',1);ell(p.ff[0]-1,p.ff[1]-1.5,6,3.2,'foot',1);
  cap([43+L*.6,62+by],p.fp,4,3.3,'arm',1);ell(p.fp[0],p.fp[1],4.3,3.9,'paw',1);
  /* cuerpo */
  ell(51+L*.6,66+by,12.5,11.5,'torso');ell(50+L*.3,79+by,14.5,12.2,'torso');
  if(coat!=='solid'&&coat!=='points')ell(56+L*.6,69+by,6.5,10,'chest',0,'l');
  else ell(55+L*.6,68+by,5,8,'chest',-.4,'b');
  /* pierna de adelante */
  cap([57,86+by],p.nf,5.6,4.1,'leg');ell(p.nf[0]+1.5,p.nf[1]-1.5,7,3.6,'foot');
  for(const dx of [2,5])put(p.nf[0]+dx,p.nf[1]-1,ramp(pat('foot',p.nf[0],p.nf[1]))[3]);
  /* orejas */
  const sadE=p.ears;
  const EF=[[hx-15,hy-7],[hx-4,hy-13],sadE?[hx-27,hy-13]:[hx-18,hy-28]],EN=[[hx+4,hy-14],[hx+16,hy-7],sadE?[hx+28,hy-14]:[hx+18,hy-29]];
  const shrink=(T,k)=>{const cx=(T[0][0]+T[1][0]+T[2][0])/3,cy=(T[0][1]+T[1][1]+T[2][1])/3;return T.map(([x,y])=>[cx+(x-cx)*k,cy+(y-cy)*k+1.5]);};
  tri(...EF,(x,y)=>ramp(pat('ear',x,y))[2]);tri(...EN,(x,y)=>ramp(pat('ear',x,y))[(x+y)%5===0?0:1]);
  const iF=shrink(EF,.55),iN=shrink(EN,.58);tri(...iF,()=>tint(pal.i,-.25));tri(...iN,(x,y)=>y<iN[2][1]+5?tint(pal.i,.25):pal.i);
  /* cabeza */
  ell(hx,hy,19,16.5,'head');
  tri([hx-17,hy+1],[hx-24,hy+8],[hx-12,hy+12],(x,y)=>ramp(pat('head',x,y))[2]);
  tri([hx+17,hy+1],[hx+24,hy+8],[hx+12,hy+12],(x,y)=>ramp(pat('head',x,y))[1]);
  ell(hx+5,hy+9,8.6,5.8,'muzzle',-.3);
  /* ojos */
  const eye=(ex,ey,rx,ry,far)=>{
    const E=p.eyes,inner=far?1:-1;
    if(E==='happy'){for(let dx=-rx;dx<=rx;dx+=.5){const yy=ey+1-(1-(dx/rx)**2)*ry*.6;put(ex+dx,yy,lid);put(ex+dx,yy+1,lid);}return;}
    const rY=E==='wide'?ry+1:ry;
    for(let y=Math.floor(ey-rY);y<=Math.ceil(ey+rY);y++)for(let x=Math.floor(ex-rx);x<=Math.ceil(ex+rx);x++){const nx=(x+.5-ex)/rx,ny=(y+.5-ey)/rY;if(nx*nx+ny*ny>1)continue;const v=(y+.5-(ey-rY))/(2*rY);put(x,y,v<.32?tint(pal.e,-.35):v>.72?tint(pal.e,.4):pal.e);}
    if(E==='wide'){ell(ex+(far?0:.5),ey+.5,1.7,1.9,'x',0,'p');}
    else{for(let y=Math.floor(ey-rY*.72);y<=Math.ceil(ey+rY*.72);y++)for(let x=Math.floor(ex-rx*.45);x<=Math.ceil(ex+rx*.45+1);x++){const nx=(x+.5-ex-(far?.3:.8))/(rx*.42),ny=(y+.5-ey-.4)/(rY*.72);if(nx*nx+ny*ny<=1)put(x,y,pal.p);}}
    put(ex-rx*.4,ey-rY*.5,'#ffffff');put(ex-rx*.4+1,ey-rY*.5,'#ffffff');put(ex-rx*.4,ey-rY*.5+1,'#ffffff');put(ex-rx*.4+1,ey-rY*.5+1,'#ffffff');put(ex+rx*.35,ey+rY*.4,'#ffffff');
    if(E==='sad'||E==='angry'){for(let y=Math.floor(ey-rY);y<=Math.ceil(ey+rY);y++)for(let x=Math.floor(ex-rx);x<=Math.ceil(ex+rx);x++){const nx=(x+.5-ex)/rx,ny=(y+.5-ey)/rY;if(nx*nx+ny*ny>1)continue;const dx=(x-ex)/rx*inner;const lim=E==='sad'?ey-rY*.1-dx*rY*.4:ey-rY*.2+dx*rY*.45;if(y<lim)put(x,y,ramp(pat('head',x,y))[1]);else if(y<lim+1)put(x,y,lid);}}
    else for(let dx=-rx;dx<=rx;dx+=.5){const yy=ey-rY*Math.sqrt(Math.max(0,1-(dx/rx)**2));put(ex+dx,yy,lid);if(dx*inner<-rx*.3)put(ex+dx,yy-1,lid);}
  };
  eye(hx-6,hy-1,3.8,5.2,true);eye(hx+10,hy-1,4.6,6,false);
  if(p.blush){ell(hx+15,hy+6,2.6,1.4,'x',0,'i');ell(hx-12,hy+6,1.8,1.2,'x',0,'i');}
  /* nariz y boca */
  const mx=hx+5,my=hy+10;
  tri([mx-2.6,my-5.5],[mx+2.6,my-5.5],[mx,my-2.5],()=>pal.n);put(mx-1,my-5,tint(pal.n,.5));put(mx,my-2,lid);
  const M=p.mouth,dark='#3a1624',teeth='#fffaf2';
  if(M==='smile')[[-4,0],[-3,1],[-2,1],[-1,1],[0,0],[1,1],[2,1],[3,1],[4,0]].forEach(([a,b])=>put(mx+a,my-1+b,lid));
  if(M==='frown')[[-3,2],[-2,1],[-1,1],[0,1],[1,1],[2,1],[3,2]].forEach(([a,b])=>put(mx+a,my+b,lid));
  if(M==='o'){ell(mx,my+1.5,2.2,2.7,'x',0,'p');put(mx,my+2,dark);}
  if(M==='open'||M==='grin'){
    const rx=M==='grin'?5.4:4.3,ry=M==='grin'?2.8:3.7,cy=my+(M==='grin'?1:2);
    for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(mx-rx);x<=Math.ceil(mx+rx);x++){const nx=(x+.5-mx)/rx,ny=(y+.5-cy)/ry;const r=nx*nx+ny*ny;if(r>1.15)continue;if(r>.8){put(x,y,lid);continue;}
      if(M==='grin')put(x,y,Math.abs(y+.5-cy)<.6?'#d8cfc8':teeth);else put(x,y,y<cy-ry*.35?teeth:ny>.35&&Math.abs(nx)<.55?'#e8889a':dark);}
    if(M==='open'){put(mx-2,cy,teeth);put(mx+2,cy,teeth);}
  }
  /* brazo de adelante */
  cap([59+L,62+by],p.np,4.4,3.6,'arm');ell(p.np[0],p.np[1],4.8,4.3,'paw');
  put(p.np[0]+2,p.np[1]+2,ramp(pat('paw',p.np[0],p.np[1]))[3]);put(p.np[0]-1,p.np[1]+3,ramp(pat('paw',p.np[0],p.np[1]))[3]);
  /* accesorios */
  if(key==='carbon'){for(let x=hx-10;x<=hx+12;x++)for(const dy of [16,17]){const y=hy+dy+Math.round((x-hx)*.08);if(buf[y*W+x])put(x,y,dy===16?pal.c:tint(pal.c,-.3));}ell(hx+3,hy+20,2.6,2.6,'x',0,'g');put(hx+2,hy+19,'#fff6c0');put(hx+3,hy+21,tint(pal.g,-.4));}
  if(key==='humo'&&!hat){for(const [gx,gr] of [[hx-5,3.8],[hx+10,4.6]])for(let y=hy-14;y<=hy-9;y++)for(let x=Math.floor(gx-gr);x<=gx+gr;x++){const nx=(x+.5-gx)/gr,ny=(y+.5-(hy-11.5))/2.8;if(nx*nx+ny*ny<=1)put(x,y,ny<-.3?'#3a3450':'#141018');}for(let x=hx-1;x<=hx+5;x++)put(x,hy-12,'#141018');put(hx+7,hy-13,'#9fd8ff');put(hx-7,hy-13,'#9fd8ff');}
  if(hat){const [c1,c2]=HATHD[key]||HATC[key]||['#ff5c9d','#ffd23f'],b0=[hx-5,hy-14],b1=[hx+12,hy-15],tp=[hx+7,hy-40];
    tri(b0,b1,tp,(x,y)=>{const band=Math.floor((y-tp[1])/5)%2,lit=x<(b0[0]+tp[0])/2+ (y-tp[1])*.1;return tint(band?c2:c1,lit?.25:-.1);});
    ell(tp[0],tp[1],3,3,'x',0,'w');put(tp[0]-1,tp[1]-1,'#ffffff');}
  /* contorno de color y luz de borde */
  const OC={},oc=c=>OC[c]||(OC[c]=tint(c,-.62));
  const out=buf.slice();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(buf[y*W+x])continue;let nb=null;for(const [a,b] of [[0,1],[1,0],[-1,0],[0,-1]]){const X=x+a,Y=y+b;if(X>=0&&Y>=0&&X<W&&Y<H&&buf[Y*W+X]){nb=buf[Y*W+X];break;}}if(nb)out[y*W+x]=DARKCATS.has(key)?'#06040a':oc(nb);}
  if(DARKCATS.has(key)){const rim=key==='carbon'?'#8676e0':'#9a9ab8';for(let y=1;y<H;y++)for(let x=1;x<W;x++){const i=y*W+x;if(buf[i]&&(!buf[i-1]||!buf[i-W]))out[i]=rim;}}
  const wc=DARKCATS.has(key)?'#cfc6e6':'#fffaf0';
  const wl=(x0,y0,x1,y1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);if(x>=0&&y>=0&&x<W&&y<H)out[y*W+x]=wc;}};
  wl(hx+13,hy+8,hx+26,hy+5);wl(hx+13,hy+10,hx+27,hy+10);wl(hx+13,hy+12,hx+25,hy+15);wl(hx-4,hy+9,hx-16,hy+6);wl(hx-4,hy+11,hx-17,hy+12);
  return HDC[id]=pxCanvas(W,H,out);
}

/* ---- escenario ---- */
function storyBG(){
  if(SBG)return SBG;const c=document.createElement('canvas');c.width=SW;c.height=SH;const g=c.getContext('2d');
  let sd=5;const r=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646;};
  const img=g.createImageData(SW,236),d=img.data;
  const stops=[[0,[22,16,60]],[.42,[70,38,112]],[.7,[186,90,138]],[.86,[255,146,118]],[1,[255,200,142]]];
  for(let y=0;y<236;y++)for(let x=0;x<SW;x++){let t=y/236+(BAYER[((y&3)<<2)|(x&3)]/16-.5)*.035;t=Math.max(0,Math.min(1,t));let i=0;while(i<stops.length-2&&t>stops[i+1][0])i++;const [t0,c0]=stops[i],[t1,c1]=stops[i+1],k=(t-t0)/(t1-t0),p=(y*SW+x)*4;for(let j=0;j<3;j++)d[p+j]=Math.round((c0[j]+(c1[j]-c0[j])*k)/4)*4;d[p+3]=255;}
  g.putImageData(img,0,0);
  for(let i=0;i<70;i++){const x=Math.floor(r()*SW),y=Math.floor(r()*100);P(g,x,y,1,1,r()<.3?'#ffffff':'#bdb6f0');}
  for(let y=-32;y<=32;y++)for(let x=-32;x<=32;x++){const dd=Math.sqrt(x*x+y*y)+(BAYER[((y&3)<<2)|(x&3)]/16-.5)*2;if(dd<=32)P(g,380+x,214+y,1,1,dd<18?'#fff2c4':dd<26?'#ffdc9a':'#ffc080');}
  const cloud=(cx,cy,w,h)=>{for(let k=0;k<7;k++){const ex=cx-w/2+k*w/6+(r()-.5)*8,ey=cy+(r()-.5)*h*.4,rx=w*.16+r()*w*.08,ry=h*.5+r()*h*.3;for(let y=Math.floor(ey-ry);y<=ey+ry;y++)for(let x=Math.floor(ex-rx);x<=ex+rx;x++){const nx=(x-ex)/rx,ny=(y-ey)/ry;if(nx*nx+ny*ny>1)continue;const v=ny+(BAYER[((y&3)<<2)|(x&3)]/16-.5)*.5;P(g,x,y,1,1,v>.35?'#ffb48c':v>-.2?'#d0708e':'#8e4c8e');}}};
  cloud(120,70,110,12);cloud(300,50,130,10);cloud(420,104,90,9);cloud(210,120,80,8);
  for(let x=0;x<SW;){const w=10+Math.floor(r()*26),h=30+Math.floor(r()*44);P(g,x,236-h,w,h,'#52306a');for(let wy=236-h+4;wy<232;wy+=5)for(let wx=x+2;wx<x+w-2;wx+=4)if(r()<.25)P(g,wx,wy,2,2,'#e8a86a');x+=w+1;}
  for(let x=170;x<SW;){const w=40+Math.floor(r()*30),h=34+Math.floor(r()*26),y0=236-h;
    P(g,x,y0,w,h,'#3c2152');g.fillStyle='#2e1842';g.beginPath();g.moveTo(x-5,y0+1);g.lineTo(x+w/2,y0-16-r()*8);g.lineTo(x+w+5,y0+1);g.closePath();g.fill();
    if(r()<.6){const cx=x+Math.floor(r()*(w-12))+4;P(g,cx,y0-14,6,12,'#2e1842');}
    for(let wy=y0+6;wy<230;wy+=12)for(let wx=x+5;wx<x+w-10;wx+=13)if(r()<.55){P(g,wx,wy,8,8,'#1e1030');P(g,wx+1,wy+1,6,6,r()<.7?'#ffc870':'#ff9e8a');P(g,wx+4,wy+1,1,6,'#1e1030');}
    x+=w+6+Math.floor(r()*10);}
  const tree=(tx,ty,R)=>{for(let k=0;k<9;k++){const ex=tx+(r()-.5)*R*1.3,ey=ty+(r()-.5)*R*.9,rr=R*.45+r()*R*.25;for(let y=Math.floor(ey-rr);y<=ey+rr;y++)for(let x=Math.floor(ex-rr);x<=ex+rr;x++){const nx=(x-ex)/rr,ny=(y-ey)/rr;if(nx*nx+ny*ny>1)continue;const v=nx*-.5+ny*-.7+(BAYER[((y&3)<<2)|(x&3)]/16-.5)*.6;P(g,x,y,1,1,v>.35?'#4f7f5a':v>-.1?'#355e45':'#223e30');}}P(g,tx-3,ty+R*.5,7,236-ty,'#2a1a14');};
  tree(300,176,40);tree(360,168,34);tree(236,188,26);
  for(let x=180;x<SW;x++)for(let y=204;y<236;y++){const v=Math.sin(x*.7)*2+Math.sin(x*.23)*3;if(y>210+v)P(g,x,y,1,1,((x+y)&3)===0?'#3f6e4c':(BAYER[((y&3)<<2)|(x&3)]>8?'#2c5238':'#335c40'));}
  P(g,0,236,SW,26,'#2f4a3a');for(let i=0;i<260;i++){const x=Math.floor(r()*SW),y=236+Math.floor(r()*24);P(g,x,y,1,2,r()<.5?'#4a7a55':'#24402f');}
  for(let fx=190;fx<SW;fx+=11){g.fillStyle='#f2ead8';g.beginPath();g.moveTo(fx,220);g.lineTo(fx+3.5,214);g.lineTo(fx+7,220);g.lineTo(fx+7,262);g.lineTo(fx,262);g.closePath();g.fill();P(g,fx+5,220,2,42,'#cbbfa8');P(g,fx,220,1,42,'#fffaf0');P(g,fx+7,222,4,40,'rgba(20,10,40,.35)');}
  for(const ry of [228,248]){P(g,186,ry,SW-186,4,'#e6dcc6');P(g,186,ry+3,SW-186,1,'#a89880');}
  P(g,449,90,6,172,'#2a2233');P(g,450,90,2,172,'#4a3f5a');P(g,444,256,16,6,'#2a2233');P(g,446,252,12,4,'#3a3048');
  P(g,440,72,24,4,'#2a2233');P(g,443,76,18,14,'#2a2233');P(g,445,77,14,11,'#ffe8b0');P(g,451,77,2,11,'#2a2233');P(g,445,82,14,1,'#2a2233');P(g,446,68,12,4,'#3a3048');P(g,450,64,4,4,'#2a2233');
  for(let y=118;y<262;y+=5){P(g,4,y,166,5,'#e6c49a');P(g,4,y,166,1,'#f6dcb8');P(g,4,y+4,166,1,'#c69c70');}
  P(g,158,118,12,144,'rgba(60,20,40,.18)');P(g,0,112,6,150,'#f4ead5');P(g,168,112,6,150,'#e0d4bc');P(g,1,112,1,150,'#ffffff');
  P(g,122,46,22,56,'#9a4a3a');for(let y=48;y<102;y+=4){P(g,122,y,22,1,'#6a2e24');for(let x=122+((y/4)%2?0:5);x<144;x+=10)P(g,x,y,1,4,'#6a2e24');}P(g,118,42,30,6,'#5a2a24');P(g,118,42,30,1,'#8a4a3a');
  g.fillStyle='#8e2a40';g.beginPath();g.moveTo(-16,122);g.lineTo(88,30);g.lineTo(192,122);g.closePath();g.fill();
  for(let y=36;y<120;y+=6){const half=(y-30)/92*104;const x0=Math.ceil(88-half),x1=Math.floor(88+half);for(let x=x0+((y/6)%2?0:5);x<x1;x+=10){const sh=rh(x,y);P(g,x,y,9,5,sh<.3?'#9c3248':sh>.8?'#b84a60':'#a83a50');P(g,x,y,9,1,'#c85a6e');P(g,x+9,y,1,6,'#5e1a2c');}P(g,x0,y+5,x1-x0,1,'#5e1a2c');}
  g.fillStyle='#c85a70';g.beginPath();g.moveTo(-16,122);g.lineTo(88,30);g.lineTo(90,34);g.lineTo(-13,124);g.closePath();g.fill();
  P(g,-16,120,208,6,'#5a1a28');P(g,-16,120,208,1,'#7a2a3a');P(g,-16,126,208,3,'#8a8a9e');P(g,-16,126,208,1,'#b0b0c4');
  P(g,122,46,22,1,'#b86a5a');
  P(g,66,176,44,86,'#f4ead5');P(g,70,180,36,82,'#6a3a22');for(let x=70;x<106;x+=6)P(g,x,180,1,82,'#5a2e18');P(g,70,180,36,2,'#8a5230');
  P(g,75,186,26,20,'#3a2012');P(g,100,222,4,4,'#e0b030');P(g,100,222,2,2,'#fff0a0');P(g,82,166,12,8,'#e8dcc0');P(g,83,167,10,6,'#6a4a2a');
  P(g,58,258,60,4,'#a89eb8');P(g,58,258,60,1,'#d0c8e0');P(g,64,254,48,4,'#b8b0c8');P(g,64,254,48,1,'#dcd6e8');
  for(const wx of [14,114]){P(g,wx-4,142,56,58,'#f4ead5');P(g,wx,146,48,50,'#1e1430');P(g,wx-14,144,9,54,'#34607a');P(g,wx+53,144,9,54,'#34607a');for(let y=148;y<196;y+=4){P(g,wx-13,y,7,1,'#264a60');P(g,wx+54,y,7,1,'#264a60');}
    P(g,wx-6,200,60,5,'#f4ead5');P(g,wx-6,204,60,1,'#b8a888');P(g,wx-4,205,56,9,'#7a4524');P(g,wx-4,205,56,2,'#9a5c33');
    for(let i=0;i<14;i++){const fx=wx-2+i*4,fy=200-Math.floor(r()*4);P(g,fx,fy+2,2,4,'#3f7a55');P(g,fx,fy,3,3,GARL[i%5]);P(g,fx+1,fy+1,1,1,'#fff6d0');}}
  const bush=(bx,by,R,fl)=>{for(let k=0;k<6;k++){const ex=bx+(r()-.5)*R*1.4,ey=by+(r()-.5)*R*.5,rr=R*.5+r()*R*.3;for(let y=Math.floor(ey-rr);y<=Math.min(261,ey+rr);y++)for(let x=Math.floor(ex-rr);x<=ex+rr;x++){const nx=(x-ex)/rr,ny=(y-ey)/rr;if(nx*nx+ny*ny>1)continue;const v=-nx*.5-ny*.7+(BAYER[((y&3)<<2)|(x&3)]/16-.5)*.6;P(g,x,y,1,1,v>.35?'#5a9a64':v>-.1?'#3d7050':'#284a36');}}for(let i=0;i<fl;i++)P(g,Math.round(bx+(r()-.5)*R*1.6),Math.round(by-R*.3+r()*R*.6),2,2,['#ff9ec4','#fff6d0','#ffd23f'][i%3]);};
  bush(16,252,16,8);bush(44,256,10,4);bush(146,254,13,6);bush(172,256,11,3);
  P(g,184,226,4,36,'#5a3a22');P(g,176,214,20,14,'#3a5aa8');P(g,176,214,20,2,'#5a7ac8');P(g,176,226,20,2,'#2a4088');P(g,194,216,3,6,'#e2344f');
  const pv=g.createImageData(SW,50),pd=pv.data;
  for(let y=0;y<50;y++)for(let x=0;x<SW;x++){const row=Math.floor(y/13),off=row%2?12:0,jx=(x+off)%24,jy=y%13;let col=[146,138,164];const h=rh(Math.floor((x+off)/24),row);col=col.map(v=>v+(h-.5)*14);
    if(y>=38){col=y<42?[184,176,200]:y<44?[104,96,128]:[58,52,72];if(y>=44&&(x+y)%7===0)col=[70,64,86];}
    else{if(jx===0||jy===0)col=[104,96,126];else if(jy===1)col=col.map(v=>v+16);if(rh(x,y)<.02)col=[112,104,134];if((jx===0||jy===0)&&rh(x*3,y)<.08)col=[74,120,84];}
    const p=(y*SW+x)*4;for(let j=0;j<3;j++)pd[p+j]=col[j];pd[p+3]=255;}
  g.putImageData(pv,0,262);
  return SBG=c;
}

/* ---- guion ---- */
function sActor(k){return ST.actors.find(a=>a.key===k);}
function sBub(k,text,dur){ST.bubs=ST.bubs.filter(b=>b.k!==k);ST.bubs.push({k,text,t:dur||1.6});}
function confettiBurst(x,y,n){for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,s=80+Math.random()*160;ST.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:2.6+Math.random(),col:GARL[i%5],rot:Math.random()*6,kind:'c'});}}
const FRIENDS=['humo','manchita','tigre','chispa'];
const SSTEPS=[
  {dur:3.6,enter:S=>{S.cap='Una tarde cualquiera, en el barrio de Carbón...';FRIENDS.forEach(k=>sActor(k).pose='laugh');}},
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
  {dur:4.8,enter:S=>{[['humo',392,0],['manchita',436,.25],['tigre',480,.5],['chispa',524,.7]].forEach(([k,x,d])=>{const a=sActor(k);a.tx=x;a.spd=34;a.delay=d;a.sadWalk=true;});
      [523,440,392,330].forEach((f,i)=>tone(f,.35,'triangle',.04,0,.3+i*.35));},
    upd:(S,dt,t)=>{if(t>.8)sActor('carbon').pose='sad';if(t>2&&!S.f1){S.f1=1;sBub('carbon','...',2.4);}}},
  {dur:1.3,enter:S=>{const c=sActor('carbon');c.vy=190;c.pose='surprise';sBub('carbon','!',1);SFX.meow();},
    upd:(S,dt,t)=>{if(t>.5&&!S.f2){S.f2=1;const c=sActor('carbon');c.tx=214;c.spd=130;c.run=true;}}},
  {talk:[
    {who:'carbon',mood:'perdido',text:'¡Esperen! ¡Mentira, chicos! ¡Era una broma!',set:{carbon:'surprise'}},
    {who:'carbon',mood:'fiestero',text:'¿Por qué no hacemos una fiesta en mi casa? ¡¿AHORA?!',set:{carbon:'cheer'}}
  ]},
  {dur:3.8,enter:S=>{FRIENDS.forEach(k=>{const a=sActor(k);a.tx=a.x;a.face=-1;a.pose='surprise';a.sadWalk=false;sBub(k,'!',.9);});tone(1200,.1,'square',.04);},
    upd:(S,dt,t)=>{
      if(t>.9&&!S.f3){S.f3=1;SFX.win();noise(.3,.06,0,2000);S.actors.forEach((a,i)=>{a.vy=210+i*10;a.pose='cheer';if(a.key!=='carbon')a.hat=true;});confettiBurst(340,170,90);sBub('humo','¡FIESTAAA!',1.9);}
      if(t>1.9&&!S.f4){S.f4=1;[['humo',270],['manchita',322],['tigre',374],['chispa',426]].forEach(([k,x],i)=>{const a=sActor(k);a.tx=x;a.spd=110;a.run=true;a.delay=i*.12;a.faceAfter=-1;});}
    }},
  {talk:[
    {who:'cat',k:'chispa',mood:'fiestero',text:'¡Yo llevo la música!',set:{chispa:'cheer',humo:'laugh',manchita:'laugh',tigre:'laugh',carbon:'laugh'}},
    {who:'cat',k:'tigre',mood:'hambriento',text:'¡Yo llevo el pollo! ...Y el queso. Y las salchichas.',set:{tigre:'point'}},
    {who:'cat',k:'manchita',mood:'happy',text:'¡Y yo le aviso a todo el barrio!',set:{manchita:'point'}},
    {who:'carbon',mood:'perdido',text:'Eh... a todo el barrio no, ¿eh? Mi humano vuelve a las ocho...',set:{carbon:'surprise'}},
    {who:'cat',k:'humo',mood:'fiestero',text:'¡Demasiado tarde! ¡A la casa de Carbón!',set:{humo:'cheer',manchita:'cheer',tigre:'cheer',chispa:'cheer'}}
  ]},
  {dur:8,enter:S=>{tone(300,.4,'sawtooth',.03,-100);},
    upd:(S,dt,t)=>{
      S.door=Math.min(1,Math.max(0,(t-.2)*2));if(t>7)S.door=Math.max(0,1-(t-7)*3);
      if(t>.5&&!S.f5){S.f5=1;FRIENDS.forEach((k,i)=>{const a=sActor(k);a.tx=88;a.spd=200;a.run=true;a.delay=i*.25;a.enter=true;});}
      if(t>2.8&&!S.f6){S.f6=1;const c=sActor('carbon');c.tx=128;c.spd=110;c.run=true;c.faceAfter=1;}
      if(t>3.9&&!S.f7){S.f7=1;const c=sActor('carbon');c.pose='sad';sBub('carbon','Esto va a terminar mal...',2.1);}
      if(t>6.1&&!S.f8){S.f8=1;const c=sActor('carbon');c.tx=88;c.spd=80;c.run=false;c.enter=true;}
      if(t>7.2&&!S.f9){S.f9=1;noise(.15,.08,0,500);tone(90,.15,'square',.06);}
    }},
  {dur:6.6,enter:S=>{S.party=1;S.cap=null;},
    upd:(S,dt,t)=>{
      const beat=Math.floor(t/.42);if(beat!==S.lastBeat){S.lastBeat=beat;tone(100,.12,'sine',.12,-60);if(beat%2)noise(.06,.03,0,5000);tone(mtof([45,48,52,50][Math.floor(beat/2)%4]),.3,'triangle',.05);if(Math.random()<.7)S.fx.push({x:133,y:40,vx:(Math.random()-.5)*12,vy:-22,t:2.2,col:GARL[beat%5],kind:'n',ph:Math.random()*6});}
      if(t>1&&!S.fa){S.fa=1;SFX.win();}
    }}
];
function startStory(){
  initAudio();hide();state='story';loadLevel(0);hLevel.textContent='PRÓLOGO · UNA TARDE EN EL BARRIO';
  ST={step:-1,t:0,T:0,actors:[['carbon',150,1],['humo',238,-1],['manchita',294,-1],['tigre',350,-1],['chispa',406,-1]].map(([key,x,face])=>({key,x,tx:x,face,pose:'stand',hat:false,a:1,y:0,vy:0,anim:Math.random(),delay:0,spd:40})),fx:[],bubs:[],smoke:[],door:0,party:0,fade:1,cap:null,warm:[],lastCur:null};
  ST.actors.forEach(a=>['stand0','stand1','laugh','laugh2'].forEach(p=>catHD(a.key,p,false)));
  const poses=['talk','point','surprise','sad','walk0','walk1','swalk0','swalk1','cheer','jump','run0','run1'];
  ST.actors.forEach(a=>{poses.forEach(p=>ST.warm.push([a.key,p,false]));if(a.key!=='carbon')['cheer','jump','run0','run1','laugh','laugh2','point','stand0','stand1','talk','surprise'].forEach(p=>ST.warm.push([a.key,p,true]));});
  ST.warm.push(['carbon','angry',false]);
  hint.innerHTML='<b>ESPACIO</b><span>Seguir · <b>ESC</b> o tocá acá para saltear la intro</span>';lastHint='x';
  grabFocus();nextStory();
}
function nextStory(){
  const Z=ST;if(!Z)return;Z.step++;Z.t=0;
  if(Z.step>=SSTEPS.length){endStory();return;}
  const st=SSTEPS[Z.step];if(st.enter)st.enter(Z);
  if(st.talk)danceTalk(st.talk,()=>nextStory());
}
function endStory(){if(!ST)return;if(D)closeTalk();ST=null;lastHint='';setHint(null);showIntro(0);}
function updateStory(dt){
  const Z=ST;if(!Z)return;Z.t+=dt;Z.T+=dt;
  for(let i=0;i<2&&Z.warm.length;i++){const [k,p,h]=Z.warm.shift();catHD(k,p,h);}
  Z.fade=Math.max(0,Z.fade-dt*.8);
  if(D&&D.cur&&D.cur!==Z.lastCur){Z.lastCur=D.cur;if(D.cur.set)for(const k in D.cur.set){const a=sActor(k);if(a)a.pose=D.cur.set[k];}}
  const spk=D&&D.cur?(D.cur.who==='carbon'?'carbon':D.cur.as&&D.cur.as.key):null;
  Z.actors.forEach(a=>{
    a.anim+=dt;a.speaking=a.key===spk&&D.typed<D.cur.text.length;
    if(a.delay>0){a.delay-=dt;}
    else if(Math.abs(a.tx-a.x)>1.5){const d=Math.sign(a.tx-a.x);a.x+=d*Math.min(Math.abs(a.tx-a.x),a.spd*dt);a.face=d;a.walking=true;}
    else if(a.walking){a.walking=false;a.run=false;if(a.faceAfter){a.face=a.faceAfter;a.faceAfter=0;}}
    if(a.y>0||a.vy>0){a.vy-=640*dt;a.y+=a.vy*dt;if(a.y<=0){a.y=0;a.vy=0;}}
    if(a.enter&&a.x<106)a.a=Math.max(0,a.a-dt*3.5);
  });
  Z.bubs.forEach(b=>b.t-=dt);Z.bubs=Z.bubs.filter(b=>b.t>0);
  Z.fx.forEach(p=>{p.t-=dt;if(p.kind==='c'){p.vy+=150*dt;p.vx*=.99;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=dt*8;if(p.y>290){p.y=290;p.vy=0;p.vx*=.8;}}else{p.x+=Math.sin(p.t*4+p.ph)*.5+p.vx*dt;p.y+=p.vy*dt;}});Z.fx=Z.fx.filter(p=>p.t>0);
  if(Math.random()<dt*1.4)Z.smoke.push({x:133+(Math.random()-.5)*4,y:40,t:0,r:3+Math.random()*2});
  Z.smoke.forEach(s=>{s.t+=dt;s.y-=10*dt;s.x+=6*dt+Math.sin(s.t*2)*3*dt;s.r+=2.2*dt;});Z.smoke=Z.smoke.filter(s=>s.t<4);
  if(Math.random()<dt*2.5)noise(.02,.006,0,7000);
  const st=SSTEPS[Z.step];if(!st)return;
  if(st.upd)st.upd(Z,dt,Z.t);
  if(!st.talk&&st.dur&&Z.t>=st.dur)nextStory();
}
function drawActor(a){
  if(a.a<=0)return;let pose=a.pose;
  if(a.walking&&a.delay<=0)pose=(a.run?'run':a.sadWalk?'swalk':'walk')+(Math.floor(a.anim*(a.run?10:5))%2);
  else if(a.y>0)pose='jump';
  else{
    if(pose==='stand')pose='stand'+(Math.floor(clock*1.6+a.x*.1)%2);
    if(pose==='laugh'&&Math.floor(clock*6+a.x*.1)%2)pose='laugh2';
    if(a.speaking&&Math.floor(clock*9)%2)pose={stand0:'talk',stand1:'talk',laugh:'laugh2',point:'laugh2'}[pose]||pose;
  }
  const img=catHD(a.key,pose,a.hat),shk=pose==='angry'?Math.round(Math.sin(clock*50)):0;
  ctx.globalAlpha=.35*a.a;for(let i=0;i<3;i++)P(ctx,Math.round(a.x-22+i*3),GS-3+i,44-i*6,1,'#140a20');ctx.globalAlpha=a.a;
  const X=Math.round(a.x)+shk,Y=Math.round(GS-100-a.y);
  if(a.face<0){ctx.save();ctx.translate(X+50,Y);ctx.scale(-1,1);ctx.drawImage(img,0,0);ctx.restore();}else ctx.drawImage(img,X-50,Y);
  ctx.globalAlpha=1;
}
function drawBubble(x,y,text){
  ctx.font='8px "Press Start 2P"';const w=Math.max(18,Math.ceil(ctx.measureText(text).width)+14),h=17,X=Math.round(Math.min(SW-4-w,Math.max(4,x-w/2))),Y=Math.round(y-h);
  P(ctx,X-1,Y+1,w+2,h-2,'#140c1e');P(ctx,X,Y,w,h,'#140c1e');P(ctx,X+1,Y+1,w-2,h-2,'#fffaf0');P(ctx,X+1,Y+h-4,w-2,3,'#e8dcc8');
  P(ctx,Math.round(x)-3,Y+h-1,7,2,'#fffaf0');P(ctx,Math.round(x)-2,Y+h+1,5,2,'#fffaf0');P(ctx,Math.round(x)-1,Y+h+3,3,1,'#fffaf0');P(ctx,Math.round(x)-4,Y+h-1,1,3,'#140c1e');P(ctx,Math.round(x)+4,Y+h-1,1,3,'#140c1e');
  ctx.fillStyle='#2a1d3a';ctx.textAlign='center';ctx.fillText(text,X+w/2,Y+12);ctx.textAlign='left';
}
function renderStory(){
  const Z=ST;ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(storyBG(),0,0);
  for(let i=0;i<18;i++){const x=(i*97+13)%SW,y=(i*29)%96+4;ctx.globalAlpha=Math.max(0,.3+.6*Math.sin(clock*2.2+i*1.3));P(ctx,x,y,1,1,'#ffffff');if(i%5===0){P(ctx,x-1,y,3,1,'rgba(255,255,255,.4)');P(ctx,x,y-1,1,3,'rgba(255,255,255,.4)');}}ctx.globalAlpha=1;
  const party=Z.party,beat=Math.floor(Z.t/.42);
  [[0,14],[1,114]].forEach(([wi,wx])=>{
    const col=party?GARL[(beat+wi*2)%5]:'#ffc46a',hi=party?tint(col,.35):'#ffe4a8';
    P(ctx,wx,146,48,50,col);for(let y=0;y<50;y++){const k=Math.abs(y-25)/25;if(k<.7)P(ctx,wx+8,146+y,32,1,hi);}
    if(party){(wi?['manchita','tigre']:['humo','chispa']).forEach((k,j)=>{const img=darkSpr(k)[(beat+j)%2];ctx.drawImage(img,wx+4+j*20,164-((beat+j)%2)*3,24,24);});}
    else{P(ctx,wx,146,8,50,'#c0507e');P(ctx,wx+2,146,1,50,'#e07aa4');P(ctx,wx+40,146,8,50,'#c0507e');P(ctx,wx+45,146,1,50,'#8a2a5a');P(ctx,wx+6,160,3,3,'#f0cf7a');P(ctx,wx+39,160,3,3,'#f0cf7a');}
    P(ctx,wx+23,146,3,50,'#f4ead5');P(ctx,wx,169,48,3,'#f4ead5');P(ctx,wx+24,146,1,50,'#c8bca4');
  });
  P(ctx,75,186,26,20,party?GARL[beat%5]:'#ffcf80');P(ctx,87,186,2,20,'#3a2012');P(ctx,75,195,26,2,'#3a2012');
  if(Z.door>0){P(ctx,70,180,36,82,'#1a1026');const g=ctx.createLinearGradient(0,180,0,262);g.addColorStop(0,'#ffe8c0');g.addColorStop(1,'#ff9e6a');ctx.globalAlpha=Z.door;ctx.fillStyle=g;ctx.fillRect(73,183,30,79);ctx.globalAlpha=1;
    const w=Math.round(36*(1-Z.door*.8));P(ctx,70,180,w,82,'#6a3a22');for(let x=70;x<70+w;x+=6)P(ctx,x,180,1,82,'#5a2e18');P(ctx,70+w-2,180,2,82,'#3a1a0c');}
  P(ctx,113,190,8,3,'#2a2233');P(ctx,112,193,10,12,'#2a2233');P(ctx,114,195,6,8,'#fff0b8');P(ctx,113,205,8,2,'#2a2233');
  ctx.fillStyle='rgba(210,215,235,.35)';Z.smoke.forEach(s=>{ctx.globalAlpha=Math.max(0,.45-s.t*.11);ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;
  ctx.globalCompositeOperation='lighter';
  glow(ctx,380,214,120,'255,140,90',.28);
  glow(ctx,452,84,60,'255,230,160',.6);
  const cg=ctx.createLinearGradient(0,90,0,300);cg.addColorStop(0,'rgba(255,230,160,.2)');cg.addColorStop(1,'rgba(255,230,160,.05)');ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(444,90);ctx.lineTo(460,90);ctx.lineTo(500,296);ctx.lineTo(400,296);ctx.closePath();ctx.fill();
  glow(ctx,452,284,54,'255,220,150',.3);
  glow(ctx,117,198,36,'255,200,120',.55);
  [[38,0],[138,1]].forEach(([x,wi])=>glow(ctx,x,171,54,party?GARL_RGB[(beat+wi*2)%5]:'255,190,110',party?.6:.4));
  glow(ctx,88,196,26,'255,190,120',.3);
  if(Z.door>0){glow(ctx,88,236,64,'255,190,120',.55*Z.door);ctx.fillStyle='rgba(255,190,120,'+(.2*Z.door)+')';ctx.beginPath();ctx.moveTo(70,262);ctx.lineTo(106,262);ctx.lineTo(128,300);ctx.lineTo(48,300);ctx.closePath();ctx.fill();}
  for(let i=0;i<10;i++){const x=200+((i*67+clock*7*(i%3+1))%270),y=210+Math.sin(clock*1.3+i)*20,a=Math.max(0,Math.sin(clock*2+i*1.7));glow(ctx,x,y,6,'200,255,120',.6*a);P(ctx,Math.round(x),Math.round(y),1,1,'rgba(230,255,170,'+a+')');}
  ctx.globalCompositeOperation='source-over';
  [...Z.actors].sort((a,b)=>(a.enter?0:1)-(b.enter?0:1)).forEach(drawActor);
  Z.fx.forEach(p=>{ctx.globalAlpha=Math.min(1,p.t*2);const x=Math.round(p.x),y=Math.round(p.y);if(p.kind==='c')P(ctx,x,y,Math.round(Math.abs(Math.cos(p.rot))*3+1),2,p.col);else{P(ctx,x+3,y,1,6,p.col);P(ctx,x,y+4,3,3,p.col);P(ctx,x+4,y,3,1,p.col);}});ctx.globalAlpha=1;
  Z.bubs.forEach(b=>{const a=sActor(b.k);if(!a||a.a<=0)return;drawBubble(a.x+a.face*6,GS-108-a.y,b.text);});
  if(Z.cap&&Z.step===0){ctx.globalAlpha=Math.max(0,Math.min(1,Z.t*1.5,(3.6-Z.t)*2));P(ctx,0,30,SW,22,'rgba(10,6,24,.6)');fText(Z.cap,SW/2,45,8,'#f4ead5');ctx.globalAlpha=1;}
  if(party){const t=Z.t;
    if(t>.9){const k=Math.min(1,(t-.9)/.35),sc=1+(1-k)*1.2;ctx.save();ctx.translate(262,64);ctx.scale(sc,sc);ctx.globalAlpha=k;fText('LA FIESTA',0,0,24,'#ffd23f');fText('DE CARBÓN',0,32,24,'#ff5c9d');ctx.restore();ctx.globalAlpha=1;}
    if(t>3.4){ctx.globalAlpha=Math.min(1,(t-3.4)*2);P(ctx,0,116,SW,22,'rgba(10,6,24,.6)');fText('Unas horas más tarde...',SW/2,131,8,'#f4ead5');ctx.globalAlpha=1;}}
  P(ctx,0,0,SW,18,'#000');P(ctx,0,SH-6,SW,6,'#000');
  const vg=ctx.createRadialGradient(SW/2,SH/2,140,SW/2,SH/2,330);vg.addColorStop(0,'rgba(10,6,30,0)');vg.addColorStop(1,'rgba(10,6,30,.5)');ctx.fillStyle=vg;ctx.fillRect(0,0,SW,SH);
  const fo=Math.max(Z.fade,party&&Z.t>5.5?Math.min(1,Z.t-5.5):0);if(fo>0){ctx.globalAlpha=fo;P(ctx,0,0,SW,SH,'#000');ctx.globalAlpha=1;}
}

