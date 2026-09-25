/* ---------- caras para las charlas ---------- */
const COAT={carbon:'solid',copito:'solid',pelusa:'solid',sombra:'solid',nieve:'solid',tigre:'tabby',humo:'tabby',bigotes:'tabby',mostaza:'tabby',canela:'tabby',garra:'tabby',manchita:'calico',lola:'calico',luna:'points',rulo:'tuxedo',oreo:'tuxedo',pirata:'tuxedo',nube:'patch',chispa:'patch'};
const DARKCATS=new Set(['carbon','rulo','sombra','oreo']);
function facePat(coat,part,x,y){
  if(part==='muzzle')return coat==='points'?'s':'l';
  const chest=part==='torso'&&Math.abs(x-20)<6;
  switch(coat){
    case 'tabby':
      if(part==='head'){if(y>=10&&y<=17&&(x===16||x===20||x===24))return's';if((x<=10||x>=30)&&y>19&&y%3===0)return's';}
      if(part==='torso')return chest?'l':(y%3===0?'s':'b');
      return'b';
    case 'calico':
      if(part==='head'&&x<18&&y<24)return's';
      if(part==='ear'&&x>20)return'z';
      if(part==='torso')return x<14?'z':chest?'l':'b';
      return'b';
    case 'points':
      if(part==='ear')return's';
      if(part==='head')return Math.hypot(x-20,(y-26)*1.2)<9?'s':'b';
      return chest?'l':'b';
    case 'tuxedo':
      if(part==='head'&&y>=23&&Math.abs(x-20)<7)return'l';
      if(part==='head'&&y>=14&&Math.abs(x-20)<=1)return'l';
      if(part==='torso'&&Math.abs(x-20)<8)return'l';
      return'b';
    case 'patch':
      if(part==='head'&&(y<15||(x>25&&y<23)))return'z';
      if(part==='ear')return'z';
      return chest?'l':'b';
    default:return chest?'l':'b';
  }
}
const MOODS={
  neutral:{eye:'normal',mouth:'w'},
  educado:{eye:'normal',brow:'soft',mouth:'smile',blush:1},
  happy:{eye:'happy',mouth:'smile',blush:1},
  perdido:{eye:'up',brow:'confused',mouth:'o',sweat:1},
  hambriento:{eye:'wide',mouth:'tongue'},
  fiestero:{eye:'happy',mouth:'big',blush:1,confetti:1},
  dormilon:{eye:'closed',mouth:'sleepy',zzz:1},
  agresivo:{eye:'narrow',brow:'angry',mouth:'fangs'},
  angry:{eye:'narrow',brow:'angry',mouth:'fangs'},
  okupa:{eye:'half',brow:'smug',mouth:'smirk'},
  retador:{eye:'fierce',brow:'angry',mouth:'grin'}
};
function buildFace(key,moodName){
  const W=40,H=40,pal=PALS[key],coat=COAT[key]||'solid',M=MOODS[moodName]||MOODS.neutral,buf=new Array(W*H).fill(null);
  const famOf=k=>(key==='carbon'&&k==='b')?[pal.H,pal.b,pal.D,'#0c0812']:fam(pal[k]||pal.b);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=W||y>=H)return;buf[y*W+x]=c;};
  const shadeIdx=(nx,ny)=>{const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny)),d=nx*LV[0]+ny*LV[1]+nz*LV[2];return d>.72?0:d>.28?1:d>-.12?2:3;};
  function ell(cx,cy,rx,ry,part,o={}){for(let y=Math.floor(cy-ry-1);y<=cy+ry+1;y++)for(let x=Math.floor(cx-rx-1);x<=cx+rx+1;x++){const sx=(x+.5-cx)/rx,sy=(y+.5-cy)/ry;if(sx*sx+sy*sy<=1){const f=famOf(o.key||facePat(coat,part,x,y));put(x,y,f[Math.min(3,shadeIdx(sx,sy)+(o.dark?1:0))]);}}}
  function tri(A,B,C,colFn){const s=(p1,p2,p3)=>(p1[0]-p3[0])*(p2[1]-p3[1])-(p2[0]-p3[0])*(p1[1]-p3[1]);
    for(let y=Math.floor(Math.min(A[1],B[1],C[1]));y<=Math.max(A[1],B[1],C[1]);y++)for(let x=Math.floor(Math.min(A[0],B[0],C[0]));x<=Math.max(A[0],B[0],C[0]);x++){const P0=[x+.5,y+.5],d1=s(P0,A,B),d2=s(P0,B,C),d3=s(P0,C,A);if(!((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0)))put(x,y,colFn(x,y));}}
  const line=(x0,y0,x1,y1,c)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)put(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c);};
  const eyeLine=DARKCATS.has(key)?pal.d:famOf('b')[3],dark='#2a0f1f',tongue='#ff7a9a';
  const drop=(M.brow==='angry')?4:M.eye==='closed'?2:0;
  /* orejas */
  const earCol=(x,y,side)=>famOf(facePat(coat,'ear',x,y))[side<0?1:2];
  tri([5,18],[15,11],[4-(drop?2:0),2+drop],(x,y)=>earCol(x,y,-1));
  tri([35,18],[25,11],[36+(drop?2:0),2+drop],(x,y)=>earCol(x,y,1));
  tri([8,15],[13,12],[7-(drop?1:0),6+drop],()=>pal.i);tri([32,15],[27,12],[33+(drop?1:0),6+drop],()=>tint(pal.i,-.15));
  /* pecho, cabeza y cachetes */
  ell(20,42,15,8,'torso');
  ell(20,22,14,11.5,'head');
  ell(8,27,5,4,'head');ell(32,27,5,4,'head');
  const hf=famOf(facePat(coat,'head',4,28));put(3,27,hf[1]);put(4,29,hf[2]);put(36,27,hf[2]);put(35,29,hf[2]);put(2,26,hf[1]);put(37,26,hf[2]);
  /* hocico y nariz */
  ell(17.2,28,3.6,2.7,'muzzle');ell(22.8,28,3.6,2.7,'muzzle');ell(20,30.5,2.6,1.8,'muzzle');
  put(19,25,tint(pal.n,.35));put(20,25,pal.n);put(21,25,pal.n);put(20,26,pal.n);put(20,27,eyeLine);
  /* ojos */
  const eye=(cx,cy,st)=>{
    if(st==='happy'){[[-3,1],[-2,0],[-1,-1],[0,-1],[1,0],[2,1]].forEach(([a,b])=>put(cx+a,cy+b,eyeLine));return;}
    if(st==='closed'){for(let a=-3;a<=2;a++)put(cx+a,cy+1,eyeLine);put(cx-3,cy+2,eyeLine);put(cx+2,cy+2,eyeLine);return;}
    for(let y=cy-4;y<=cy+4;y++)for(let x=cx-4;x<=cx+4;x++){const d=((x+.5-cx)/3.3)**2+((y+.5-cy)/3.5)**2;if(d<=1)put(x,y,y>cy?tint(pal.e,-.22):pal.e);else if(d<=1.45&&y<=cy)put(x,y,eyeLine);}
    const pu=st==='up'?-1:0;
    if(st==='wide'){for(let y=cy-2;y<=cy+1;y++)for(let x=cx-2;x<=cx+1;x++)put(x,y+pu,pal.p);put(cx-2,cy-2,'#fff');put(cx-1,cy-2,'#fff');put(cx+1,cy+1,'#fff');}
    else if(st==='fierce'||st==='narrow'){for(let y=cy-2;y<=cy+2;y++)put(cx,y,pal.p);put(cx-2,cy-2,'#fff');}
    else{for(let y=cy-2;y<=cy+2;y++){put(cx-1,y+pu,pal.p);put(cx,y+pu,pal.p);}put(cx-2,cy-2+pu,'#fff');put(cx-2,cy-1+pu,'#fff');put(cx+1,cy+1+pu,tint(pal.e,.4));}
    if(st==='narrow'){for(let y=cy-4;y<=cy-1;y++)for(let x=cx-4;x<=cx+4;x++){const d=((x+.5-cx)/3.3)**2+((y+.5-cy)/3.5)**2;if(d<=1.45)put(x,y,famOf('b')[2]);}for(let x=cx-3;x<=cx+3;x++)put(x,cy-1,eyeLine);}
    if(st==='half'){for(let y=cy-4;y<=cy-1;y++)for(let x=cx-4;x<=cx+4;x++){const d=((x+.5-cx)/3.3)**2+((y+.5-cy)/3.5)**2;if(d<=1.45)put(x,y,famOf(facePat(coat,'head',x,y))[2]);}for(let x=cx-3;x<=cx+3;x++)put(x,cy,eyeLine);}
  };
  eye(13,21,M.eye);eye(27,21,M.eye);
  /* cejas */
  if(M.brow==='angry'){line(9,14,16,17,eyeLine);line(9,15,15,17,eyeLine);line(31,14,24,17,eyeLine);line(31,15,25,17,eyeLine);}
  if(M.brow==='confused'){line(9,14,16,13,eyeLine);line(24,16,31,15,eyeLine);}
  if(M.brow==='smug'){line(9,16,16,16,eyeLine);line(24,14,31,13,eyeLine);}
  if(M.brow==='soft'){line(10,15,15,14,eyeLine);line(25,14,30,15,eyeLine);}
  /* boca */
  const w=()=>{[[17,28],[18,29],[19,29],[20,28],[21,29],[22,29],[23,28]].forEach(([a,b])=>put(a,b,eyeLine));};
  switch(M.mouth){
    case 'w':w();break;
    case 'smile':for(let x=18;x<=22;x++){put(x,29,dark);put(x,30,x===18||x===22?eyeLine:dark);}put(19,30,tongue);put(20,30,tongue);put(21,30,tongue);put(17,28,eyeLine);put(23,28,eyeLine);break;
    case 'big':for(let y=28;y<=32;y++)for(let x=16;x<=24;x++){if(y===32&&(x<18||x>22))continue;put(x,y,dark);}for(let x=17;x<=23;x++)put(x,28,'#ffffff');for(let x=18;x<=22;x++)put(x,31,tongue);break;
    case 'o':put(19,30,dark);put(20,30,dark);put(21,30,dark);put(19,31,dark);put(21,31,dark);put(20,31,tongue);break;
    case 'tongue':w();put(21,30,tongue);put(22,30,tongue);put(21,31,tongue);put(22,31,tongue);put(22,32,tint(tongue,-.2));put(24,32,'#9fd8ff');put(24,33,'#cfeeff');break;
    case 'sleepy':put(19,30,eyeLine);put(20,30,eyeLine);put(21,30,eyeLine);break;
    case 'fangs':for(let y=28;y<=31;y++)for(let x=16;x<=24;x++)put(x,y,dark);put(17,28,'#fff');put(17,29,'#fff');put(23,28,'#fff');put(23,29,'#fff');put(18,31,'#fff');put(22,31,'#fff');for(let x=18;x<=22;x++)put(x,30,tongue);break;
    case 'smirk':line(17,29,23,27,eyeLine);put(22,28,'#fff');break;
    case 'grin':for(let x=16;x<=24;x++){put(x,28,'#ffffff');put(x,30,'#ffffff');put(x,29,x%2?eyeLine:'#e8e6ff');}put(16,29,eyeLine);put(24,29,eyeLine);break;
  }
  if(M.blush){['#ff9ec4'].forEach(c=>{put(8,27,c);put(9,27,c);put(10,28,c);put(30,28,c);put(31,27,c);put(32,27,c);});}
  /* accesorios */
  const acc=ACC[key]||[];
  if(acc.includes('scar')){line(25,14,29,27,'#e07a8a');line(26,14,30,27,tint('#e07a8a',-.2));}
  if(acc.includes('patch')){for(let y=16;y<=26;y++)for(let x=22;x<=32;x++){if(((x+.5-27)/4.4)**2+((y+.5-21)/4.2)**2<=1)put(x,y,'#141018');}line(5,13,24,17,'#141018');line(30,17,36,13,'#141018');put(25,18,'#3a3448');}
  if(acc.includes('glasses')||acc.includes('pinkglasses')){
    const pk=acc.includes('pinkglasses'),fr=pk?'#ff5c9d':'#0e0b16',ln=pk?'#ff9ec4':'#231f36',hl=pk?'#ffffff':'#6fb3ff';
    for(const cx of [13,27])for(let y=17;y<=25;y++)for(let x=cx-5;x<=cx+5;x++){const edge=y===17||y===25||x===cx-5||x===cx+5;put(x,y,edge?fr:ln);}
    line(18,19,22,19,fr);put(10,19,hl);put(11,19,hl);put(24,19,hl);put(25,19,hl);put(10,20,hl);
  }
  if(acc.includes('bowtie')){for(let y=34;y<=38;y++){for(let x=14;x<=18;x++)if(Math.abs(y-36)<=Math.abs(x-18)+1)put(x,y,'#e2344f');for(let x=22;x<=26;x++)if(Math.abs(y-36)<=Math.abs(x-22)+1)put(x,y,'#e2344f');}for(let y=35;y<=37;y++)for(let x=19;x<=21;x++)put(x,y,'#ff8aa0');}
  if(pal.c){for(let x=8;x<=32;x++){if(buf[34*W+x]){put(x,34,pal.c);put(x,35,tint(pal.c,-.3));}}for(let y=36;y<=38;y++)for(let x=19;x<=21;x++)put(x,y,y===36?'#fff6c0':pal.g);}
  if(acc.includes('hat')){const [c1,c2]=HATC[key]||['#ff5c9d','#ffd23f'];for(let r=0;r<11;r++){const wdt=Math.round(2+r*1.05),y=1+r,x0=Math.round(21-wdt/2+(10-r)*.25);for(let i=0;i<wdt;i++)put(x0+i,y,(Math.floor(r/2)%2?c2:c1));put(x0,y,tint(r%4<2?c1:c2,.35));}put(22,0,'#fff');put(23,0,'#fff');put(22,1,'#fff');}
  if(acc.includes('bottle')){for(let y=29;y<=39;y++)for(let x=31;x<=35;x++)put(x,y,y<=30?'#4f9bd9':y===34||y===35?'#4f9bd9':'#f4f4f8');put(32,32,'#ffffff');}
  /* contorno */
  const out=buf.slice();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(buf[y*W+x])continue;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b;if(X>=0&&Y>=0&&X<W&&Y<H&&buf[Y*W+X]){out[y*W+x]=pal.o;break;}}}
  const put2=(x,y,c)=>{if(x>=0&&y>=0&&x<W&&y<H&&!out[y*W+x])out[y*W+x]=c;};
  if(M.sweat){put2(34,11,'#cfeeff');put2(33,12,'#9fd8ff');put2(34,12,'#cfeeff');put2(35,12,'#9fd8ff');put2(33,13,'#9fd8ff');put2(34,13,'#9fd8ff');put2(35,13,'#6fb3ff');put2(34,14,'#6fb3ff');}
  if(M.zzz){[[31,2],[32,2],[33,2],[32,3],[31,4],[32,4],[33,4],[35,6],[36,6],[36,7],[35,8],[36,8]].forEach(([a,b])=>put2(a,b,'#cfe3ff'));}
  if(M.confetti){[[2,3],[6,8],[36,4],[33,9],[3,12],[37,15],[1,20],[38,24]].forEach(([a,b],i)=>put2(a,b,GARL[i%5]));}
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),img=g.createImageData(W,H);
  out.forEach((col,i)=>{if(!col)return;const [r,gg,b]=hx2(col);img.data[i*4]=r;img.data[i*4+1]=gg;img.data[i*4+2]=b;img.data[i*4+3]=255;});
  g.putImageData(img,0,0);return c;
}
const FACES={};
function faceURL(key,mood){const k=key+'|'+mood;return FACES[k]||(FACES[k]=buildFace(key,mood).toDataURL());}
