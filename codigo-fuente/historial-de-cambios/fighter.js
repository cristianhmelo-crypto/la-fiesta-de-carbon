/* ---------- luchadores en alta definición ---------- */
const FW=52,FH=48,FANCH=21,FSC=2;
const FAMC={};
function fam(hex){return FAMC[hex]||(FAMC[hex]=[tint(hex,.3),hex,tint(hex,-.3),tint(hex,-.56)]);}
const LV=[-.45,-.7,.55];
const MUZ={luna:'s'};
const FPAT={
  carbon:(part,x,y,nx,ny)=>part==='torso'&&nx>.35&&ny>-.5?'l':'b',
  copito:(part,x,y,nx)=>part==='torso'&&nx>.3?'l':'b',
  tigre:(part,x,y,nx,ny,u)=>{
    if(part==='torso'){if(nx>.35&&ny>-.4)return'l';return((y+Math.floor(x*.4))%4===0)?'s':'b';}
    if(part==='head'){if(ny<-.3&&x%3===0)return's';if(nx<-.45&&y%3===0)return's';return'b';}
    if(part==='tail')return(Math.floor(u*7)%2)?'s':'b';
    if(part==='arm'||part==='leg')return(Math.floor(u*5)%2&&u<.8)?'s':'b';
    return'b';},
  manchita:(part,x,y,nx,ny,u)=>{
    if(part==='torso'){if(nx>.25)return'l';if(nx<-.15&&ny<.4)return'z';return'b';}
    if(part==='head')return(nx<-.15&&ny<.25)?'s':'b';
    if(part==='ear')return's';
    if(part==='tail')return'z';
    if(part==='leg'&&u<.45)return'z';
    return'b';},
  luna:(part,x,y,nx,ny,u)=>{
    if(part==='head')return(nx>.05&&ny>-.35)?'s':'b';
    if(part==='ear'||part==='tail'||part==='paw'||part==='foot')return's';
    if((part==='arm'||part==='leg')&&u>.55)return's';
    if(part==='torso'&&nx>.3)return'l';
    return'b';},
  rulo:(part,x,y,nx,ny)=>{
    if(part==='torso'&&nx>-.05&&ny>-.7)return'l';
    if(part==='head'&&nx>.3&&ny>.15)return'l';
    if(part==='paw'||part==='foot')return'l';
    return'b';}
};
FPAT.humo=FPAT.tigre;
const DARKER={};
const darker=c=>DARKER[c]||(DARKER[c]=tint(c,-.38));
function joint(a,b,l1,l2,bend){
  const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,L=l1+l2;
  if(d>=L)return[a[0]+dx*l1/L,a[1]+dy*l1/L];
  const a1=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-a1*a1)),mx=a[0]+dx*a1/d,my=a[1]+dy*a1/d;
  return[mx+(-dy/d)*h*bend,my+(dx/d)*h*bend];
}
function buildFighter(key,p,noHat){
  const pal=PALS[key],pat=FPAT[key]||(()=>'b'),buf=new Array(FW*FH).fill(null);
  const famOf=k=>(key==='carbon'&&k==='b')?[pal.H,pal.b,pal.D,'#0c0812']:fam(pal[k]||pal.b);
  const put=(x,y,c)=>{x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=FW||y>=FH)return;buf[y*FW+x]=c;};
  const shadeIdx=(nx,ny)=>{const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny)),d=nx*LV[0]+ny*LV[1]+nz*LV[2];return d>.72?0:d>.28?1:d>-.12?2:3;};
  const paint=(set,x,y,nx,ny,part,u,dark,fk)=>{if(x<0||y<0||x>=FW||y>=FH)return;const f=famOf(fk||pat(part,x,y,nx,ny,u));buf[y*FW+x]=f[Math.min(3,shadeIdx(nx,ny)+(dark?1:0))];set.add(y*FW+x);};
  function inner(set){const edge=[];set.forEach(i=>{const x=i%FW,y=(i/FW)|0;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X<0||Y<0||X>=FW||Y>=FH)continue;const j=Y*FW+X;if(!set.has(j)&&buf[j]){edge.push(i);break;}}});edge.forEach(i=>buf[i]=darker(buf[i]));}
  function ell(cx,cy,rx,ry,part,o={}){const set=new Set();
    for(let y=Math.floor(cy-ry-2);y<=cy+ry+2;y++)for(let x=Math.floor(cx-rx-4);x<=cx+rx+4;x++){const sx=(x+.5-cx+(o.tilt?(y+.5-cy)*o.tilt:0))/rx,sy=(y+.5-cy)/ry;if(sx*sx+sy*sy<=1)paint(set,x,y,sx,sy,part,o.u||0,o.dark,o.key);}
    if(o.line)inner(set);return set;}
  function cap(a,b,r1,r2,part,o={}){const set=new Set(),R=Math.max(r1,r2),dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy||1,u0=o.u0||0,u1=o.u1===undefined?1:o.u1;
    for(let y=Math.floor(Math.min(a[1],b[1])-R-1);y<=Math.max(a[1],b[1])+R+1;y++)for(let x=Math.floor(Math.min(a[0],b[0])-R-1);x<=Math.max(a[0],b[0])+R+1;x++){
      const px=x+.5,py=y+.5;let t=((px-a[0])*dx+(py-a[1])*dy)/L2;t=Math.max(0,Math.min(1,t));
      const r=r1+(r2-r1)*t,vx=(px-(a[0]+dx*t))/r,vy=(py-(a[1]+dy*t))/r;if(vx*vx+vy*vy<=1)paint(set,x,y,vx,vy,part,u0+(u1-u0)*t,o.dark,o.key);}
    if(o.line)inner(set);return set;}
  function tri(A,B,C,col){const s=(p1,p2,p3)=>(p1[0]-p3[0])*(p2[1]-p3[1])-(p2[0]-p3[0])*(p1[1]-p3[1]);
    for(let y=Math.floor(Math.min(A[1],B[1],C[1]));y<=Math.max(A[1],B[1],C[1]);y++)for(let x=Math.floor(Math.min(A[0],B[0],C[0]));x<=Math.max(A[0],B[0],C[0]);x++){
      const P0=[x+.5,y+.5],d1=s(P0,A,B),d2=s(P0,B,C),d3=s(P0,C,A);if(!((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0)))put(x,y,typeof col==='function'?col(x,y):col);}}
  const tx=p.tx,ty=p.ty,ln=p.lean||0,hx=p.hx,hy=p.hy;
  const sh=[tx+3+ln,ty-7],shF=[tx-2+ln,ty-7],hip=[tx+2,ty+7],hipF=[tx-3,ty+7];
  /* cola */
  const sw=p.tail||0,Q=[[tx-5,ty+6],[tx-13,ty+5],[tx-16,ty-6+sw],[tx-11,ty-14+sw]];
  const bz=t=>{const m=1-t;return[m*m*m*Q[0][0]+3*m*m*t*Q[1][0]+3*m*t*t*Q[2][0]+t*t*t*Q[3][0],m*m*m*Q[0][1]+3*m*m*t*Q[1][1]+3*m*t*t*Q[2][1]+t*t*t*Q[3][1]];};
  for(let i=0;i<9;i++){const a=bz(i/9),b=bz((i+1)/9);cap(a,b,2.7-i*.13,2.6-(i+1)*.13,'tail',{u0:i/9,u1:(i+1)/9,dark:1});}
  /* pierna y brazo de atrás */
  const kF=joint(hipF,p.ff,7,7.5,-1);
  ell(hipF[0],hipF[1]+1,4,4.6,'leg',{dark:1});cap(hipF,kF,3,2.4,'leg',{dark:1,u0:0,u1:.5});cap(kF,[p.ff[0],p.ff[1]-1.5],2.2,1.8,'leg',{dark:1,u0:.5,u1:1});ell(p.ff[0]+1.5,p.ff[1]-1,3,1.7,'foot',{dark:1});
  const eF=joint(shF,p.fp,6,6.5,1);
  cap(shF,eF,2.3,2,'arm',{dark:1,u0:0,u1:.5});cap(eF,p.fp,2,2.1,'arm',{dark:1,u0:.5,u1:1});ell(p.fp[0],p.fp[1],2.7,2.4,'paw',{dark:1});
  /* cuerpo */
  ell(tx,ty,7,9.5,'torso',{tilt:ln/9.5});
  cap([tx+1+ln,ty-6],[hx-1,hy+5],3.7,3.4,'torso');
  /* pierna de adelante */
  const k=joint(hip,p.nf,7,7.5,-1);
  ell(hip[0],hip[1]+1,4.6,5.2,'leg',{line:1});cap(hip,k,3.2,2.5,'leg',{u0:0,u1:.5});cap(k,[p.nf[0],p.nf[1]-1.5],2.3,1.9,'leg',{u0:.5,u1:1,line:1});ell(p.nf[0]+1.5,p.nf[1]-1,3.3,1.8,'foot',{line:1});
  /* cabeza */
  const earF=famOf(pat('ear',0,0,0,0,0)),inI=pal.i;
  tri([hx-8,hy-2],[hx-2,hy-6],[hx-8,hy-12],earF[2]);tri([hx-7,hy-4],[hx-4,hy-6],[hx-7,hy-9],tint(inI,-.2));
  ell(hx,hy,8,6.8,'head');
  tri([hx+1,hy-6],[hx+7,hy-3],[hx+5,hy-13],earF[1]);tri([hx+2,hy-6],[hx+5,hy-5],[hx+4.5,hy-10],inI);
  const hf=famOf(pat('head',hx-6,hy+3,-.8,.4,0));
  ell(hx-6,hy+3,2.6,2.3,'head');put(hx-9,hy+3,hf[1]);put(hx-9,hy+5,hf[2]);put(hx-8,hy+6,hf[2]);put(hx-4,hy+7,hf[2]);
  ell(hx+4.5,hy+2.6,3.2,2.3,'muzzle',{key:MUZ[key]||'l'});
  const eyeLine=(key==='carbon'||key==='rulo')?pal.d:famOf('b')[3];
  put(hx+7,hy+1,pal.n);put(hx+8,hy+1,pal.n);put(hx+7,hy,tint(pal.n,.4));
  const M=p.mouth||'closed',dark='#2a0f1f';
  if(M==='closed'){put(hx+7,hy+2,eyeLine);put(hx+6,hy+3,eyeLine);put(hx+8,hy+3,eyeLine);}
  if(M==='grin'){for(let x=hx+5;x<=hx+8;x++){put(x,hy+3,'#ffffff');put(x,hy+4,eyeLine);}put(hx+5,hy+4,'#ffffff');}
  if(M==='open'){for(let y=hy+3;y<=hy+6;y++)for(let x=hx+5;x<=hx+9;x++)put(x,y,dark);put(hx+5,hy+3,'#fff');put(hx+9,hy+3,'#fff');put(hx+6,hy+6,'#fff');put(hx+8,hy+6,'#fff');put(hx+7,hy+5,'#ff7a9a');put(hx+6,hy+5,'#ff7a9a');}
  if(M==='ouch'){put(hx+6,hy+3,dark);put(hx+7,hy+3,dark);put(hx+6,hy+4,dark);put(hx+7,hy+4,'#ff7a9a');}
  const E=p.eyes||'angry';
  if(E==='angry'){
    for(let y=hy-2;y<=hy;y++){put(hx+2,y,pal.e);put(hx+3,y,pal.p);put(hx+4,y,pal.e);put(hx-4,y,pal.e);put(hx-3,y,pal.p);}
    put(hx+2,hy-2,pal.G);put(hx-4,hy-2,pal.G);put(hx+4,hy-2,eyeLine);
    put(hx+1,hy-4,eyeLine);put(hx+2,hy-4,eyeLine);put(hx+3,hy-3,eyeLine);put(hx+4,hy-3,eyeLine);put(hx+5,hy-3,eyeLine);
    put(hx-5,hy-4,eyeLine);put(hx-4,hy-3,eyeLine);put(hx-3,hy-3,eyeLine);
  }
  if(E==='hurt'){[[2,-2],[3,-1],[2,0],[4,-1]].forEach(([a,b])=>put(hx+a,hy+b,eyeLine));[[-3,-2],[-4,-1],[-3,0]].forEach(([a,b])=>put(hx+a,hy+b,eyeLine));}
  if(E==='dizzy'){for(let y=hy-2;y<=hy;y++)for(let x=hx+2;x<=hx+4;x++)put(x,y,eyeLine);put(hx+3,hy-1,pal.e);for(let y=hy-2;y<=hy;y++){put(hx-4,y,eyeLine);put(hx-3,y,eyeLine);}put(hx-4,hy-1,pal.e);}
  if(E==='glow'){for(let y=hy-2;y<=hy;y++){for(let x=hx+2;x<=hx+4;x++)put(x,y,'#fff6c0');put(hx-4,y,'#fff6c0');put(hx-3,y,'#fff6c0');}put(hx+3,hy-1,'#ffffff');put(hx+1,hy-4,eyeLine);put(hx+2,hy-3,eyeLine);put(hx+3,hy-3,eyeLine);put(hx+4,hy-3,eyeLine);}
  /* brazo de adelante */
  const e=joint(sh,p.np,6,6.5,1);
  cap(sh,e,2.5,2.1,'arm',{u0:0,u1:.5,line:1});cap(e,p.np,2.1,2.2,'arm',{u0:.5,u1:1,line:1});ell(p.np[0],p.np[1],2.9,2.6,'paw',{line:1});
  /* collar y accesorios */
  if(pal.c){for(let x=hx-5;x<=hx+2;x++){const y=Math.round(hy+6+(x-hx)*-.1);if(buf[y*FW+x]){put(x,y,pal.c);put(x,y+1,tint(pal.c,-.3));}}put(hx,hy+8,pal.g);put(hx+1,hy+8,pal.g);put(hx,hy+9,tint(pal.g,-.3));put(hx+1,hy+9,tint(pal.g,-.3));put(hx,hy+8,'#fff6c0');}
  const acc=ACC[key]||[];
  if(acc.includes('bowtie')){[[-1,6],[-1,7],[-1,8],[0,7],[3,6],[3,7],[3,8],[2,7]].forEach(([a,b])=>put(hx+a,hy+b,'#e2344f'));put(hx+1,hy+7,'#ff8aa0');}
  if(acc.includes('hat')&&!noHat){const [c1,c2]=HATC[key]||['#ff5c9d','#ffd23f'];
    for(let r=0;r<9;r++){const w=Math.max(1,Math.round(7-r*.75)),x0=Math.round(hx-1-w/2-r*.35),y=hy-6-r;for(let i=0;i<w;i++)put(x0+i,y,(Math.floor(r/2)%2?c2:c1));put(x0,y,tint(r%4<2?c1:c2,.3));}
    put(Math.round(hx-5),hy-16,'#ffffff');put(Math.round(hx-4),hy-16,'#ffffff');put(Math.round(hx-5),hy-17,'#ffffff');}
  if(acc.includes('glasses')||acc.includes('pinkglasses')){
    const pk=acc.includes('pinkglasses'),fr=pk?'#ff5c9d':'#0e0b16',lens=pk?'#ff9ec4':'#1d1a2e',hl=pk?'#ffffff':'#6fb3ff';
    for(let y=hy-2;y<=hy;y++){for(let x=hx+1;x<=hx+5;x++)put(x,y,(y===hy-2||x===hx+1||x===hx+5)?fr:lens);for(let x=hx-5;x<=hx-3;x++)put(x,y,(y===hy-2||x===hx-5)?fr:lens);}
    put(hx-2,hy-2,fr);put(hx-1,hy-2,fr);put(hx,hy-2,fr);put(hx+2,hy-1,hl);put(hx+3,hy-1,hl);put(hx-4,hy-1,hl);
  }
  /* contorno */
  const out=buf.slice();
  for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){if(buf[y*FW+x])continue;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b;if(X>=0&&Y>=0&&X<FW&&Y<FH&&buf[Y*FW+X]){out[y*FW+x]=pal.o;break;}}}
  const put2=(x,y,c)=>{x=Math.floor(x);y=Math.floor(y);if(x>=0&&y>=0&&x<FW&&y<FH)out[y*FW+x]=c;};
  [[9,2],[10,1],[11,1],[9,3],[10,4],[11,4]].forEach(([a,b])=>put2(hx+a,hy+b,pal.w));
  const claws=(paw,el)=>{const dx=paw[0]-el[0],dy=paw[1]-el[1],d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;for(let k2=-1;k2<=1;k2++){const bx=paw[0]+ux*2.6-uy*k2*1.4,by=paw[1]+uy*2.6+ux*k2*1.4;put2(bx,by,'#ffffff');put2(bx+ux,by+uy,'#e8e6ff');if(k2===0)put2(bx+ux*2,by+uy*2,'#ffffff');}};
  if(p.claws>=1)claws(p.np,e);if(p.claws>=2)claws(p.fp,eF);
  const c=document.createElement('canvas');c.width=FW;c.height=FH;const g=c.getContext('2d'),img=g.createImageData(FW,FH);
  out.forEach((col,i)=>{if(!col)return;const [r,gg,b]=hx2(col);img.data[i*4]=r;img.data[i*4+1]=gg;img.data[i*4+2]=b;img.data[i*4+3]=255;});
  g.putImageData(img,0,0);return c;
}
function hx2(c){if(c[0]==='#')return hx(c);const m=c.match(/\d+/g);return[+m[0],+m[1],+m[2]];}
const FBASE={tx:21,ty:27,lean:0,hx:26,hy:13,np:[33,16],fp:[30,22],nf:[28,46],ff:[14,46],tail:0,eyes:'angry',mouth:'closed',claws:0};
const FPOSE={
  idle0:{},
  idle1:{ty:28,hy:14,np:[33,17],fp:[30,23],tail:2},
  walk0:{nf:[31,46],ff:[13,46],tail:1},
  walk1:{nf:[25,46],ff:[18,46],ty:28,hy:14,tail:-1},
  jump:{nf:[29,40],ff:[16,41],np:[34,11],fp:[30,15],ty:26,hy:12,tail:-3},
  scratch:{tx:23,lean:2,hx:30,hy:14,np:[44,17],fp:[26,25],nf:[31,46],ff:[12,46],claws:1,mouth:'grin',tail:3},
  jscratch:{tx:22,lean:2,hx:29,hy:14,np:[41,28],fp:[37,25],nf:[30,40],ff:[17,41],claws:2,mouth:'grin',tail:-2},
  bite:{tx:24,lean:3,hx:34,hy:17,np:[30,27],fp:[26,28],nf:[31,46],ff:[12,46],mouth:'open',tail:2},
  hurt:{tx:20,lean:-3,hx:19,hy:12,np:[30,6],fp:[10,14],nf:[26,46],ff:[13,46],eyes:'hurt',mouth:'ouch',tail:-4},
  dizzy:{hx:25,hy:14,np:[30,26],fp:[26,28],eyes:'dizzy',mouth:'ouch',tail:3},
  power:{np:[32,3],fp:[18,4],claws:2,eyes:'glow',mouth:'grin',hy:12,tail:-3}
};
const FSPR={};
function whiteOf(img){const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#ffffff';g.fillRect(0,0,c.width,c.height);return c;}
function fightSprites(key){
  if(FSPR[key])return FSPR[key];
  const mk=(n,nh)=>buildFighter(key,Object.assign({},FBASE,FPOSE[n]),nh);
  const s={idle:[mk('idle0'),mk('idle1')],walk:[mk('walk0'),mk('walk1')],jump:mk('jump'),scratch:mk('scratch'),jscratch:mk('jscratch'),bite:mk('bite'),hurt:mk('hurt'),hurtNH:mk('hurt',true),dizzy:mk('dizzy'),power:mk('power')};
  s.white=whiteOf(s.hurt);
  return FSPR[key]=s;
}
function drawFighter(fi){
  const s=fightSprites(fi.key),flip=fi.face<0,w=FW*FSC,h=FH*FSC;
  const sh=Math.max(.3,1-fi.y/140);ctx.globalAlpha=.5;P(ctx,Math.round(fi.x-22*sh),GROUND-2,Math.round(44*sh),4,'#000');ctx.globalAlpha=1;
  const ko=(F.phase==='lose'&&fi===F.p&&F.phaseT>.2)||(F.phase==='ko'&&fi===F.e);
  if(fi.fly||ko){
    ctx.save();ctx.translate(Math.round(fi.x),ko?GROUND-28:Math.round(GROUND-fi.y-48));ctx.rotate(fi.fly?fi.fly.rot:-Math.PI/2*(fi.face||1));if(flip)ctx.scale(-1,1);
    ctx.drawImage(fi.fly?s.hurtNH:s.hurt,-w/2,-h/2,w,h);ctx.restore();return;
  }
  let img;
  if(F.phase==='fatality'&&fi===F.p&&F.phaseT<.45)img=s.power;
  else if(fi.dizzy)img=s.dizzy;
  else if(fi.hurt>0)img=s.hurt;
  else if(fi.atk)img=s[fi.atk.type];
  else if(fi.y>0)img=s.jump;
  else if(Math.abs(fi.vx)>5)img=s.walk[Math.floor(fi.anim*7)%2];
  else img=s.idle[Math.floor(fi.anim*3)%2];
  const wob=fi.dizzy?Math.round(Math.sin(clock*9)*3):0,dy=Math.round(GROUND-fi.y-h+2);
  ctx.save();ctx.translate(Math.round(fi.x)+wob,dy);if(flip)ctx.scale(-1,1);
  ctx.drawImage(img,-FANCH*FSC,0,w,h);if(fi.hurt>.18)ctx.drawImage(s.white,-FANCH*FSC,0,w,h);
  ctx.restore();
  if(img===s.power){ctx.globalCompositeOperation='lighter';const ex=fi.x+fi.face*10,ey=dy+26;const g=ctx.createRadialGradient(ex,ey,0,ex,ey,26);g.addColorStop(0,'rgba(255,230,120,.8)');g.addColorStop(1,'rgba(255,230,120,0)');ctx.fillStyle=g;ctx.fillRect(ex-26,ey-26,52,52);ctx.globalCompositeOperation='source-over';}
  if(fi.atk&&(fi.atk.type==='scratch'||fi.atk.type==='jscratch')&&fi.atk.t>ATK[fi.atk.type].start*.5){
    const ax=fi.x+fi.face*48,ay=GROUND-fi.y-(fi.atk.type==='jscratch'?40:66);ctx.globalAlpha=.85;
    for(let i=0;i<3;i++)for(let k=0;k<8;k++)P(ctx,Math.round(ax+fi.face*(k*2-5)),Math.round(ay-9+i*7+k*2),2,1,i===1?'#ffd23f':'#ffffff');
    ctx.globalAlpha=1;
  }
  if(fi.dizzy)for(let i=0;i<3;i++){const a=clock*5+i*2.1;P(ctx,Math.round(fi.x+fi.face*8+Math.cos(a)*16),Math.round(dy+2+Math.sin(a)*4),3,3,'#ffd23f');}
}

