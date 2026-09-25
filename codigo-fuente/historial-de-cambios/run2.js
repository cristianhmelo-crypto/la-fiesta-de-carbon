/* ---------- la huida: carrera en primera persona ---------- */
let RN=null;
const RF=110,RHOR=78,RW2=1.8,RCH=2.4,RWIN=240;
const RCATS=['manchita','copito','tigre','humo','luna','rulo','bigotes','pelusa','nube','sombra','mostaza','canela','garra','pirata','nieve','chispa','oreo','lola'];
const RACT=['tigre','humo','luna','mostaza','rulo','chispa'];
const rcat=()=>RCATS[Math.floor(Math.random()*RCATS.length)];
function rproj(x,y,rz){const k=RF/rz;return[160+(x-RN.camX)*k,RHOR+(RN.camH-y)*k,k];}
function rq(pts,col){ctx.fillStyle=col;ctx.beginPath();pts.forEach((p,i)=>{const s=rproj(p[0],p[1],p[2]);if(i)ctx.lineTo(s[0],s[1]);else ctx.moveTo(s[0],s[1]);});ctx.closePath();ctx.fill();}
const rh=(x,y)=>{let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295;};

/* ---- texturas del pasillo (16 texeles por unidad) ---- */
const HXC={};const rgb=h=>HXC[h]||(HXC[h]=hx(h));
function mkTex(w,h,fn){const d=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=fn(x,y),i=(y*w+x)*4;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=c[3]?255:0;}return{w,h,d};}
const shadeA=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
function floorTex(){
  const WOODS=[[150,94,52],[138,84,46],[160,102,58],[128,78,44],[146,90,50],[156,98,54]];
  return mkTex(64,128,(tx,tz)=>{
    if(tx>=23&&tx<=40){
      const e=Math.min(tx-23,40-tx),a=tz%16,b=tx-31.5,dd=Math.abs(b)+Math.abs(a-8);
      if(e===0)return rgb('#3e1026');if(e===1)return tz%3===0?rgb('#f0cf7a'):rgb('#c9953e');if(e===2)return rgb('#5e1a38');
      if(Math.abs(dd-6)<.6)return rgb('#e2b35c');if(dd<2.6)return rgb(dd<1.2?'#ffd98a':'#b54a33');
      return (tz>>2)%2?rgb('#7d2346'):rgb('#842649');
    }
    const bx=tx<23?tx:tx+2,board=Math.floor(bx/5),off=Math.floor(rh(board,7)*64),seg=Math.floor((tz+off)/48);
    let c=WOODS[Math.floor(rh(board,seg)*WOODS.length)].slice();
    if(bx%5===0)return[70,40,22];if((tz+off)%48===0)return[78,46,26];
    if(bx%5===1)c=shadeA(c,1.12);if(bx%5===4)c=shadeA(c,.9);
    if(rh(tx*3,Math.floor(tz/5)+board*13)<.18)c=shadeA(c,.86);
    if(rh(tx,tz)<.03)c=shadeA(c,1.18);
    if(rh(board*5,seg)<.3&&Math.abs(tz-((seg*48-off+20)%128+128)%128)<2&&bx%5===2)c=[96,58,32];
    return c;
  });
}
function paintingPix(art,u,v,w,h){
  if(art===0){if(v<h*.55){const t=v/(h*.55);const c=[Math.round(90+t*150),Math.round(60+t*80),Math.round(140-t*40)];const sx=u-w*.62,sy=v-h*.42;if(sx*sx+sy*sy<(w*.13)**2)return[255,214,110];return c;}return v<h*.72?(u+v)%5===0?[62,140,80]:[74,160,92]:[46,110,70];}
  if(art===1){const cx=u-w/2,cy=v-h*.58,r=cx*cx/((w*.3)**2)+cy*cy/((h*.32)**2);if(v<h*.36&&(Math.abs(cx+w*.2)<3-(v-h*.2)*.3&&v>h*.14||Math.abs(cx-w*.2)<3-(v-h*.2)*.3&&v>h*.14))return[34,26,52];if(r<1){if(Math.abs(cy+1)<1.2&&(Math.abs(cx+w*.12)<1.3||Math.abs(cx-w*.12)<1.3))return[255,210,63];return[34,26,52];}return(u+v)%4===0?[60,120,130]:[52,108,120];}
  if(art===2){const cx=u-w*.45,cy=v-h*.5;if(Math.abs(cy)<h*.16-Math.abs(cx)*.25&&Math.abs(cx)<w*.3)return cx<-w*.22&&Math.abs(cy)<1?[20,16,30]:[236,236,244];if(cx>w*.26&&cx<w*.38&&Math.abs(cy)<(cx-w*.26)*.9)return[220,220,236];return v%6<1?[70,120,200]:[56,100,180];}
  const cs=[[255,92,157],[255,210,63],[95,224,176],[111,179,255]];for(let i=0;i<4;i++){const cx=u-(w*(.25+.17*i)),cy=v-(h*(.3+.13*(i%2)*3));if(cx*cx+cy*cy<(3+i)*(3+i))return cs[i];}return[236,226,206];
}
function wallTex(side){
  return mkTex(384,40,(tu,tv)=>{
    const u=(tu+(side>0?192:0))%384,art=side>0?[2,3]:[0,1];
    if(u>=40&&u<72&&tv>=5){const du=u-40;if(du<2||du>29||tv<7)return du===0||tv===5?rgb('#8d5430'):rgb('#5a3319');
      if(tv>=37)return rgb('#3a2010');const inP=(tv>=10&&tv<=20||tv>=23&&tv<=34)&&du>=5&&du<=26;
      if(du===24&&tv>=21&&tv<=22)return[240,200,70,1];
      if(inP){if(du===5||tv===10||tv===23)return rgb('#51290f');if(du===26||tv===20||tv===34)return rgb('#9a5c33');return rgb('#6a3a1e');}
      return(du+tv*3)%11===0?rgb('#7f4a27'):rgb('#7a4524');}
    for(const [u0,a,w] of [[128,art[0],36],[290,art[1],32]]){if(u>=u0&&u<u0+w&&tv>=6&&tv<=21){const du=u-u0,dv=tv-6,fw=w-1,fh=15;
      if(du===0||dv===0)return rgb('#f0cf7a');if(du===fw||dv===fh)return rgb('#6a4814');if(du<3||dv<3||du>fw-3||dv>fh-3)return(du+dv)%3===0?rgb('#e0b050'):rgb('#c9953e');
      return paintingPix(a,du-3,dv-3,w-6,fh-5);}}
    for(const u0 of [100,250]){if(u>=u0&&u<u0+8&&tv>=9&&tv<=18){const du=u-u0,dv=tv-9;
      if(dv<=5){const half=Math.abs(du-3.5);if(half<=2+dv*.35)return dv<2?[255,236,190,1]:[255,206,130,1];}
      if(dv>=6&&du>=3&&du<=4)return rgb('#c9953e');if(dv===8&&du>=1&&du<=6)return rgb('#e0b050');}}
    if(tv===0)return rgb('#2a1d3a');if(tv===1)return rgb('#f0cf7a');if(tv===2)return rgb('#8a6020');
    if(tv<=24){const a=u%16,b=(tv+(Math.floor(u/16)%2)*8)%16,dd=Math.abs(a-8)+Math.abs(b-8);
      if(dd===6||dd===7&&(a+b)%2===0)return rgb('#735893');if(dd<=1)return rgb('#9a80bf');if(dd===3&&(a===8||b===8))return rgb('#6a4f88');
      return a===0?rgb('#553b70'):rgb('#5c4279');}
    if(tv===25)return rgb('#f0c070');if(tv===26)return rgb('#9a6a2a');
    if(tv<=36){const p=u%32;if(tv===27||p===0)return rgb('#7a5a98');if(tv===36||p===31)return rgb('#2e1c40');if(tv===28||p===1||tv===35||p===30)return rgb('#3a2450');
      return(p+tv)%9===0?rgb('#51366a'):rgb('#4a3160');}
    if(tv===37)return rgb('#6a4430');return rgb('#2a1810');
  });
}
function ceilTex(){return mkTex(64,32,(x,z)=>{if(z<5)return z===0?rgb('#3a2c52'):z===4?rgb('#120c1c'):rgb('#1a1226');if(x%8===0)return rgb('#1a1328');return rh(x,z)<.08?rgb('#2a1f3e'):rgb('#241a36');});}
function endTex(door){
  const W=wallTex(-1);
  return mkTex(64,40,(tx,tv)=>{
    if(door){if(tx>=20&&tx<=43&&tv>=8){if(tx<=21||tx>=42||tv<=9)return rgb('#5a3319');if(tx<=26)return rgb('#7a4524');const k=(tv-8)/30;return[255,Math.round(220-k*40),Math.round(170-k*60),1];}}
    else{
      if(tv>=2&&tv<=37&&((tx>=10&&tx<=16)||(tx>=47&&tx<=53))){const f=(tx%3===0)?'#7d2c4a':(tx%3===1)?'#b8497a':'#a33e62';if(tv===20&&(tx===12||tx===51))return rgb('#f0cf7a');return rgb(f);}
      if(tx>=17&&tx<=46&&tv>=4&&tv<=35){const du=tx-17,dv=tv-4;if(du<3||du>26||dv<3||dv>28)return du===0||dv===0?rgb('#fff6e0'):rgb('#d9ccb0');
        if(du===14||du===15||dv===15)return rgb('#e8dcc0');
        const mx=du-20,my=dv-8;if(mx*mx+my*my<=13)return (mx+2)*(mx+2)+(my+1)*(my+1)<3?[230,214,160,1]:[255,241,191,1];
        if(rh(du,dv)<.04)return[255,255,255,1];const k=dv/28;return[Math.round(22+k*52),Math.round(30+k*28),Math.round(74+k*68),1];}
      if(tx>=15&&tx<=48&&tv>=36&&tv<=37)return tv===36?rgb('#fff6e0'):rgb('#b8a888');
    }
    const i=(tv*384+(tx+100))*4;return[W.d[i],W.d[i+1],W.d[i+2]];
  });
}
let TEX=null;
function rtex(){if(!TEX)TEX={floor:floorTex(),wl:wallTex(-1),wr:wallTex(1),ceil:ceilTex(),end:endTex(false),door:endTex(true)};return TEX;}

/* ---- luces ---- */
function rlights(pz,rem,look){
  const L=[],push=(x,y,z,c,i,rad)=>{if(z>-rad&&z<Math.min(25,rem+1))L.push({x,y,z,r:c[0],g:c[1],b:c[2],i,rad,r2:rad*rad});};
  for(const side of [-1,1]){const sh=side>0?192:0;for(const u of [100,250]){const base=((u-sh)%384+384)%384/16+.25;for(let n=Math.floor((pz-base)/24);n<=Math.floor((pz+25-base)/24);n++)push(side*(RW2-.12),1.55,n*24+base-pz,[1,.74,.44],1.35,3.2);}}
  for(let n=Math.ceil(pz/3);n*3<pz+25;n++){const c=GARL_RGB[((n+Math.floor(clock*2))%5+5)%5].split(',').map(v=>v/255);push(0,RCH-.45,n*3-pz,c,.5,2.3);}
  if(look)push(0,1,8.6,[1,.78,.5],2.2,9);
  else if(rem<32)push(0,1.3,rem-.4,[.55,.64,1],1.2+Math.max(0,(20-rem)/14),9);
  return L;
}
function lightAt(L,x,y,z){let r=.2,g=.16,b=.3;for(const l of L){const dz=z-l.z;if(dz>l.rad||dz<-l.rad)continue;const dx=x-l.x,dy=y-l.y,d2=dx*dx+dy*dy+dz*dz;if(d2<l.r2){let a=1-d2/l.r2;a=a*a*l.i;r+=a*l.r;g+=a*l.g;b+=a*l.b;}}return[r,g,b];}

/* ---- motor del pasillo: un rayo por píxel ---- */
const RCV=document.createElement('canvas');RCV.width=320;RCV.height=208;const rcx=RCV.getContext('2d');const RIMG=rcx.createImageData(320,208),RD=RIMG.data;
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],COLRZ=new Float32Array(320);
function rcRender(pz,rem,look,L){
  const R=RN,T0=rtex(),camX=R.camX,camH=R.camH,endT=look?T0.door:T0.end,nL=L.length;
  for(let sx=0;sx<320;sx++){const dx=sx-159.5;COLRZ[sx]=dx<0?(-RW2-camX)*RF/dx:(RW2-camX)*RF/dx;}
  let p=0;
  for(let sy=0;sy<208;sy++){
    const dy=sy-RHOR+.5;
    for(let sx=0;sx<320;sx++,p+=4){
      const dx=sx-159.5,rzw=COLRZ[sx],yw=camH-dy*rzw/RF;let rz,surf,wx,wy;
      if(yw>=0&&yw<=RCH){rz=rzw;surf=dx<0?1:2;wx=dx<0?-RW2:RW2;wy=yw;}
      else if(dy>0){rz=camH*RF/dy;surf=0;wx=camX+dx*rz/RF;wy=0;}
      else{rz=(RCH-camH)*RF/(-dy);surf=3;wx=camX+dx*rz/RF;wy=RCH;}
      if(rz>rem){rz=rem;surf=4;wx=camX+dx*rem/RF;wy=camH-dy*rem/RF;}
      if(rz>24){RD[p]=14;RD[p+1]=9;RD[p+2]=26;RD[p+3]=255;continue;}
      const wz=pz+rz;let t,ti;
      if(surf===0){t=T0.floor;const tx=Math.max(0,Math.min(63,((wx+2)*16)|0)),tz=(((wz*16)|0)%128+128)%128;ti=(tz*64+tx)*4;}
      else if(surf===3){t=T0.ceil;const tx=Math.max(0,Math.min(63,((wx+2)*16)|0)),tz=(((wz*16)|0)%32+32)%32;ti=(tz*64+tx)*4;}
      else if(surf===4){t=endT;const tx=Math.max(0,Math.min(63,((wx+2)*16)|0)),tv=Math.max(0,Math.min(39,((RCH-wy)*16)|0));ti=(tv*64+tx)*4;}
      else{t=surf===1?T0.wl:T0.wr;const tu=(((wz*16)|0)%384+384)%384,tv=Math.max(0,Math.min(39,((RCH-wy)*16)|0));ti=(tv*384+tu)*4;}
      const d=t.d;let r=d[ti],g=d[ti+1],b=d[ti+2];
      let f=rz/21;if(f>1)f=1;f*=f;
      if(d[ti+3]){f*=.4;}
      else{
        let lr=.2,lg=.16,lb=.3;
        for(let i=0;i<nL;i++){const l=L[i],dz=rz-l.z;if(dz>l.rad||dz<-l.rad)continue;const ex=wx-l.x,ey=wy-l.y,d2=ex*ex+ey*ey+dz*dz;if(d2<l.r2){let a=1-d2/l.r2;a=a*a*l.i;lr+=a*l.r;lg+=a*l.g;lb+=a*l.b;}}
        if(surf===0&&rz<rem-.5){const s=1-Math.abs(wx)/RW2;lr+=s*.05;lg+=s*.04;lb+=s*.07;}
        r*=lr;g*=lg;b*=lb;
      }
      const q=(BAYER[((sy&3)<<2)|(sx&3)]/16-.5)*9;
      r=r*(1-f)+14*f+q;g=g*(1-f)+9*f+q;b=b*(1-f)+26*f+q;
      RD[p]=Math.round(r/6)*6;RD[p+1]=Math.round(g/6)*6;RD[p+2]=Math.round(b/6)*6;RD[p+3]=255;
    }
  }
  rcx.putImageData(RIMG,0,0);ctx.drawImage(RCV,0,0);
}

/* ---- sprites en alta ---- */
function pxCanvas(W,H,buf){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');buf.forEach((col,i)=>{if(!col)return;g.fillStyle=col;g.fillRect(i%W,Math.floor(i/W),1,1);});return c;}
function outlineBuf(buf,W,H,oc,rim){
  const out=buf.slice();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(buf[y*W+x])continue;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b;if(X>=0&&Y>=0&&X<W&&Y<H&&buf[Y*W+X]){out[y*W+x]=oc;break;}}}
  if(rim)for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(!buf[i])continue;if((x-1<0||!buf[i-1])||(y-1<0||!buf[i-W]))out[i]=rim;}
  return out;
}
const shd=(nx,ny)=>{const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny)),d=nx*LV[0]+ny*LV[1]+nz*LV[2];return d>.72?0:d>.28?1:d>-.12?2:3;};
const SLEEPC={};
function sleeperImg(key){
  if(SLEEPC[key])return SLEEPC[key];
  const W=42,H=28,pal=PALS[key],coat=COAT[key]||'solid',buf=new Array(W*H).fill(null);
  const famOf=k=>(key==='carbon'&&k==='b')?[pal.H,pal.b,pal.D,'#0c0812']:fam(pal[k]||pal.b);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H)buf[y*W+x]=c;};
  const pat=(x,y,part)=>{
    if(part==='muzzle')return coat==='points'?'s':'l';
    if(coat==='tabby')return Math.floor((x+y*.4)/3)%2===0?'s':'b';
    if(coat==='calico'||coat==='patch')return rh(Math.floor(x/7),Math.floor(y/6)+3)<.4?'s':(pal.z&&rh(Math.floor(x/6)+9,Math.floor(y/5))<.25?'z':'b');
    if(coat==='tuxedo')return part==='paw'||part==='chest'?'l':'b';
    if(coat==='points')return part==='tail'||part==='ear'||part==='face'?'s':'b';
    return 'b';
  };
  const ell=(cx,cy,rx,ry,part,dark)=>{for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;if(nx*nx+ny*ny<=1)put(x,y,famOf(pat(x,y,part))[Math.min(3,shd(nx,ny)+(dark?1:0))]);}};
  const tri=(A,B,C,col)=>{const s=(p1,p2,p3)=>(p1[0]-p3[0])*(p2[1]-p3[1])-(p2[0]-p3[0])*(p1[1]-p3[1]);for(let y=Math.floor(Math.min(A[1],B[1],C[1]));y<=Math.max(A[1],B[1],C[1]);y++)for(let x=Math.floor(Math.min(A[0],B[0],C[0]));x<=Math.max(A[0],B[0],C[0]);x++){const P0=[x+.5,y+.5],d1=s(P0,A,B),d2=s(P0,B,C),d3=s(P0,C,A);if(!((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0)))put(x,y,col(x,y));}};
  for(let t=0;t<=1;t+=.03){const a=-.5+t*2.5,x=25+Math.cos(a)*16,y=19+Math.sin(a)*6.5;ell(x,y,2.6,2.5,'tail',true);}
  ell(25,18,15,8.5,'body');
  if(coat==='tuxedo'||coat==='calico'||coat==='patch')ell(20,22,8,3,'chest');
  ell(13,24,3.2,2.2,'paw');ell(19,25,3.2,2,'paw');
  tri([5,12],[11,9],[4,3],(x,y)=>famOf(pat(x,y,'ear'))[1]);tri([12,9],[18,12],[17,3],(x,y)=>famOf(pat(x,y,'ear'))[2]);
  tri([6,10],[9,9],[5.5,5.5],()=>pal.i);tri([14,9.5],[16.5,11],[16,5.5],()=>tint(pal.i,-.15));
  ell(11,15,8,6.5,'face');ell(11.5,18.2,3.4,2.2,'muzzle');
  const el=DARKCATS.has(key)?pal.d:famOf('b')[3];
  [[6,15],[7,16],[8,16],[9,15],[13,15],[14,16],[15,16],[16,15]].forEach(([x,y])=>put(x,y,el));
  put(11,17,pal.n);put(12,17,pal.n);put(11,19,el);put(12,19,el);
  const out=outlineBuf(buf,W,H,pal.o,DARKCATS.has(key)?(key==='carbon'?'#6f60c4':'#7c7c9c'):null);
  return SLEEPC[key]=pxCanvas(W,H,out);
}
const PAWC={};
function pawImg(pads){
  if(PAWC[pads])return PAWC[pads];
  const W=48,H=46,pal=PALS.carbon,F4=[pal.H,pal.b,pal.D,'#0c0812'],buf=new Array(W*H).fill(null);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H)buf[y*W+x]=c;};
  const ell=(cx,cy,rx,ry,cols)=>{for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;if(nx*nx+ny*ny<=1)put(x,y,cols[shd(nx,ny)]);}};
  ell(24,40,12,14,F4);ell(24,22,17,12.5,F4);
  for(const [x,y] of [[9,13],[17,8],[31,8],[39,13]])ell(x,y,6,5,F4);
  if(pads){const pk=['#ffc0d0','#f0a0b4','#e0708f','#b04a68'];ell(24,24,8,5.5,pk);for(const [x,y] of [[10,14],[17.5,9.5],[30.5,9.5],[38,14]])ell(x,y,3.2,2.8,pk);}
  for(let i=0;i<40;i++){const x=Math.floor(rh(i,3)*W),y=Math.floor(rh(i,9)*H);if(buf[y*W+x]===F4[1])put(x,y,F4[0]);}
  const out=outlineBuf(buf,W,H,'#06040a','#7f70d8');
  return PAWC[pads]=pxCanvas(W,H,out);
}
let HANDC=null;
function handImg(){
  if(HANDC)return HANDC;
  const W=60,H=92,sk=fam('#f1c9a0'),sl=fam('#4f8a67'),buf=new Array(W*H).fill(null);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H)buf[y*W+x]=c;};
  const ell=(cx,cy,rx,ry,cols)=>{for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;if(nx*nx+ny*ny<=1)put(x,y,cols[shd(nx,ny)]);}};
  const cap=(x,y0,y1,r,cols)=>{for(let y=y0;y<=y1;y+=1)ell(x,y,r,r,cols);};
  ell(30,82,15,20,sl);ell(30,48,17,15,sk);
  cap(15,18,40,4.2,sk);cap(24,10,38,4.4,sk);cap(34,10,38,4.4,sk);cap(43,17,40,4,sk);cap(49,40,52,4.6,sk);
  for(const [x,y] of [[15,17],[24,9],[34,9],[43,16]]){ell(x,y+1,2.6,2.2,['#ffe8e8','#f4c8c8','#dca0a0','#b88080']);}
  for(const y of [26,28])for(const x of [22,32])put(x,y,sk[2]);
  const out=outlineBuf(buf,W,H,'#140c1e',null);
  return HANDC=pxCanvas(W,H,out);
}
const LT=document.createElement('canvas'),ltg=LT.getContext('2d');
function litDraw(img,X,Y,Wd,Hd,flip,L3,rz){
  const f=Math.min(1,rz/21)**2,c=L3.map((v,i)=>Math.round(Math.min(1,v*(1-f)+[.055,.035,.1][i]*f)*255));
  LT.width=img.width;LT.height=img.height;ltg.imageSmoothingEnabled=false;
  ltg.drawImage(img,0,0);ltg.globalCompositeOperation='multiply';ltg.fillStyle=`rgb(${c[0]},${c[1]},${c[2]})`;ltg.fillRect(0,0,LT.width,LT.height);
  ltg.globalCompositeOperation='destination-in';ltg.drawImage(img,0,0);ltg.globalCompositeOperation='source-over';
  if(flip){ctx.save();ctx.translate(X+Wd,Y);ctx.scale(-1,1);ctx.drawImage(LT,0,0,Wd,Hd);ctx.restore();}else ctx.drawImage(LT,X,Y,Wd,Hd);
}
function litc(h,L3,rz){const c=rgb(h),f=Math.min(1,rz/21)**2;return`rgb(${c.map((v,i)=>Math.round(Math.min(255,v*Math.min(1.2,L3[i])*(1-f)+[14,9,26][i]*f))).join(',')})`;}

/* ---- partida ---- */
function startRun(){
  state='run';musicMode='fight';for(const k in keys)keys[k]=false;rtex();
  RN={phase:'look',t:0,pz:0,v:7,lane:0,camX:0,camH:1,jy:0,vy:0,slide:0,inv:0,slow:0,close:.3,hits:0,dodged:0,obs:[],runners:[],pops:[],shout:{text:'¡¡CARBÓN!!',t:1.8},shT:3,stepH:.4,ph:0,decoT:.8,tut:{},shake:0,lastStep:0,warm:0,conf:[]};
  const R=RN;let z=18;
  while(z<RWIN-10){
    const p=z/RWIN,pool=p<.15?['sleep','box']:p<.35?['sleep','box','table','chair']:['sleep','box','table','chair','throw','cross','throw'];
    const n=p<.15?1:p<.5?(Math.random()<.35?2:1):(Math.random()<.6?2:1);
    shuffle([-1,0,1]).slice(0,n).forEach((ln,i)=>{
      let type=pool[Math.floor(Math.random()*pool.length)];if(n===2&&i===1&&type==='cross')type='sleep';
      const o={type,x:ln,lane:ln,z:z+(i?Math.random()*.6:0),k:type==='throw'||type==='cross'?RACT[Math.floor(Math.random()*RACT.length)]:rcat(),done:false,hat:Math.random()<.6?GARL[Math.floor(Math.random()*5)]:null};
      if(type==='throw'){o.side=ln===0?(Math.random()<.5?-1:1):-ln;o.x=o.side*1.6;o.item=THROWN[Math.floor(Math.random()*THROWN.length)];}
      if(type==='cross'){o.side=Math.random()<.5?-1:1;o.x=o.side*1.7;}
      R.obs.push(o);
    });
    z+=Math.max(4.4,7.6-p*3.4)+Math.random()*2.4;
  }
  for(let i=0;i<70;i++)R.conf.push({x:(Math.random()-.5)*3.4,y:Math.random()*RCH,z:Math.random()*22,vx:(Math.random()-.5)*.3,vy:-.15-Math.random()*.25,ph:Math.random()*6,col:GARL[i%5]});
  hint.innerHTML='<b>← →</b><span>Cambiar de carril. ↑ o ESPACIO: saltar gatos dormidos y cajas. ↓: agacharse bajo las mesas y lo que vuela.</span>';lastHint='x';
  SFX.vs();tone(400,.6,'sawtooth',.05,300);
}
function runKey(k){
  const R=RN;if(!R||R.phase!=='run')return;
  if(k==='left'&&R.lane>-1){R.lane--;noise(.05,.03,0,4000);}
  if(k==='right'&&R.lane<1){R.lane++;noise(.05,.03,0,4000);}
  if(k==='up'&&R.jy===0&&R.vy===0){R.vy=4.4;R.jy=.001;R.slide=0;SFX.jump();}
  if(k==='down'){if(R.jy>0)R.vy=-7;else if(R.slide<=0){R.slide=.75;noise(.25,.04,0,1400);}}
}
function runHit(o){
  const R=RN;o.hit=true;o.ht=0;R.hits++;R.slow=.9;R.inv=1;R.close=Math.min(1,R.close+.3);R.shake=.4;R.jy=0;R.vy=0;R.slide=0;
  SFX.hurt();noise(.15,.06,0,800);
  R.pops.push({text:o.type==='sleep'||o.type==='cross'?'¡MIAU!':o.type==='table'?'¡PUM!':'¡AUCH!',col:'#ff5c9d',t:.8});
  if(R.close<1)R.shout={text:['¡YA TE AGARRO!','¡VENÍ ACÁ!','¡CARBÓN!'][Math.floor(Math.random()*3)],t:1.2};
}
function updateRun(dt){
  const R=RN;if(!R)return;R.t+=dt;R.shake=Math.max(0,R.shake-dt);
  R.pops.forEach(p=>p.t-=dt);R.pops=R.pops.filter(p=>p.t>0);
  if(R.shout){R.shout.t-=dt;if(R.shout.t<=0)R.shout=null;}
  R.obs.forEach(o=>{if(o.hit)o.ht+=dt;});
  R.conf.forEach(c=>{c.ph+=dt*3;c.x+=(c.vx+Math.sin(c.ph)*.2)*dt;c.y+=c.vy*dt;if(c.y<0)c.y=RCH-.1;if(c.z<R.pz+.3)c.z+=22;});
  if(R.phase==='look'){if(R.warm<RACT.length){fightSprites(RACT[R.warm]);R.warm++;}if(R.t>2.3){R.phase='turn';R.t=0;SFX.swish();}return;}
  if(R.phase==='turn'){if(R.t>.35){R.phase='run';R.t=0;R.pops.push({text:'¡CORRÉ A LA VENTANA!',col:'#ffd23f',t:1.4});}return;}
  if(R.phase==='caught'){if(R.t>1.8&&!R.done){R.done=true;loseRun();}return;}
  if(R.phase==='out'){
    if(R.t>2.6&&R.t<4.8)rep=Math.max(0,R.rep0*(1-(R.t-2.6)/2.2));
    if(R.t>5.6&&!R.done){R.done=true;player.hp=R.hits===0?3:R.hits<=2?2:1;escapeCard();}
    return;
  }
  R.slow=Math.max(0,R.slow-dt);R.inv=Math.max(0,R.inv-dt);R.slide=Math.max(0,R.slide-dt);
  R.v=(7+4.2*Math.min(1,R.pz/RWIN))*(R.slow>0?.55:1);R.pz+=R.v*dt;
  R.camX+=(R.lane-R.camX)*Math.min(1,dt*14);
  if(R.jy>0||R.vy>0){R.vy-=12*dt;R.jy+=R.vy*dt;if(R.jy<=0){R.jy=0;R.vy=0;tone(180,.05,'square',.03);}}
  const th=R.slide>0?.5:1+R.jy;R.camH+=(th-R.camH)*Math.min(1,dt*16);
  R.ph+=dt*R.v*1.3;const st=Math.floor(R.ph/Math.PI);if(R.jy===0&&st!==R.lastStep){R.lastStep=st;noise(.03,.02,0,3000);}
  R.close=Math.max(0,R.close-dt*.025);
  R.stepH-=dt;if(R.stepH<=0){R.stepH=.42;tone(70,.09,'sine',.04+R.close*.14,-20);}
  R.shT-=dt;if(R.shT<=0){R.shT=2.4+Math.random()*3-R.close*1.4;R.shout={text:['¡CARBÓN!','¡VENÍ ACÁ!','¡MI CASA!','¡MIRÁ ESTE LÍO!','¡NO TE ESCAPÁS!'][Math.floor(Math.random()*5)],t:1.1};}
  for(const o of R.obs){
    const rz=o.z-R.pz;if(rz<-2||rz>26)continue;
    if(o.type==='cross'&&rz<7.5&&!o.hit){if(o.vx===undefined){o.vx=-o.side*2.7;tone(700,.08,'triangle',.04,300);}o.x+=o.vx*dt;}
    if(o.type==='throw'&&rz<10&&!o.launched){o.launched=true;o.fly=0;o.spin=0;tone(900,.12,'square',.03,-400);}
    if(o.type==='throw'&&o.launched){o.fly=Math.min(1,o.fly+dt/.7);o.x=o.side*1.6+(o.lane-o.side*1.6)*o.fly;o.spin+=dt*12;}
    if(!o.done&&rz<.4){
      o.done=true;
      if(Math.abs(o.x-R.camX)<.55&&!o.hit){
        const low=o.type==='sleep'||o.type==='box'||o.type==='cross',high=o.type==='table'||o.type==='throw';
        if((low&&R.jy>.3)||(high&&R.slide>0)){R.dodged++;R.pops.push({text:low?'¡HOP!':'¡ZAS!',col:'#5fe0b0',t:.6});}
        else if(R.inv<=0)runHit(o);
      }else if(o.type!=='chair'&&Math.abs(o.x-R.camX)<1.2)R.dodged++;
    }
  }
  R.decoT-=dt;
  if(R.decoT<=0){R.decoT=1.3+Math.random()*2.2;const s=Math.random()<.5?-1:1;R.runners.push({k:rcat(),x:s*1.45,z:R.pz+.5,v:R.v+2.5+Math.random()*2,ph:Math.random()*6,say:Math.random()<.45?['¡Rajemos!','¡Corré, Carbón!','¡Sálvese quien pueda!','¡Miauuu!'][Math.floor(Math.random()*4)]:null});}
  R.runners.forEach(r=>{r.z+=r.v*dt;r.ph+=dt*10;});R.runners=R.runners.filter(r=>r.z-R.pz<23);
  if(R.pz>=RWIN-1.2){R.phase='out';R.t=0;R.rep0=rep;noise(.5,.1,0,3000);tone(1200,.4,'triangle',.05,-600);setTimeout(()=>SFX.win(),300);}
  else if(R.close>=1){R.phase='caught';R.t=0;SFX.lose();R.shout={text:'¡TE TENGO!',t:2};}
}

/* ---- dibujo de obstáculos y utilería ---- */
function warnMark(x,y,rz){const p=rproj(x,y,rz),s=Math.max(6,Math.min(12,Math.round(p[2]*.2))),by=Math.round(p[1]-Math.abs(Math.sin(clock*9))*3);P(ctx,Math.round(p[0])-s/2-1,by-s-3,s+2,s+4,'#140c1e');fText('!',Math.round(p[0]),by,s,'#ffd23f');}
function drawTable(x,rz,L3){
  const w=.48,d=.3,top=.78,C=h=>litc(h,L3,rz);
  ctx.globalAlpha*=.5;rq([[x-w,0,rz-d],[x+w,0,rz-d],[x+w,0,rz+d],[x-w,0,rz+d]],'#000');ctx.globalAlpha*=2;
  for(const zz of [rz+d-.05,rz-d+.05])for(const lx of [x-w+.07,x+w-.07]){rq([[lx-.035,0,zz],[lx+.035,0,zz],[lx+.035,top,zz],[lx-.035,top,zz]],C(zz>rz?'#3a2010':'#6a3e20'));rq([[lx-.035,0,zz],[lx-.01,0,zz],[lx-.01,top,zz],[lx-.035,top,zz]],C('#8a5530'));}
  rq([[x-w,top,rz-d],[x+w,top,rz-d],[x+w,top,rz+d],[x-w,top,rz+d]],C('#f4d0dc'));
  const sc=10;for(let i=0;i<sc;i++){const a=x-w+i*(2*w/sc),b=a+2*w/sc;rq([[a,top-.2,rz-d],[b,top-.2,rz-d],[b,top,rz-d],[a,top,rz-d]],C(i%2?'#ff8ab4':'#ff7aa8'));rq([[a,top-.26,rz-d],[(a+b)/2,top-.3,rz-d],[b,top-.26,rz-d],[b,top-.2,rz-d],[a,top-.2,rz-d]],C('#e25a90'));}
  rq([[x-w,top-.02,rz-d],[x+w,top-.02,rz-d],[x+w,top+.01,rz-d],[x-w,top+.01,rz-d]],C('#fff0f6'));
  rq([[x-.16,top,rz],[x+.16,top,rz],[x+.16,top+.2,rz],[x-.16,top+.2,rz]],C('#f6e3c0'));
  rq([[x-.16,top+.08,rz],[x+.16,top+.08,rz],[x+.16,top+.11,rz],[x-.16,top+.11,rz]],C('#c9507c'));
  rq([[x-.17,top+.17,rz],[x+.17,top+.17,rz],[x+.17,top+.22,rz],[x-.17,top+.22,rz]],C('#ffffff'));
  for(const cx of [-.08,0,.08]){rq([[x+cx-.012,top+.22,rz],[x+cx+.012,top+.22,rz],[x+cx+.012,top+.32,rz],[x+cx-.012,top+.32,rz]],'#ffe8f0');const f=rproj(x+cx,top+.35,rz),s=Math.max(1,Math.round(f[2]*.025));P(ctx,Math.round(f[0])-s,Math.round(f[1])-s*2,s*2,s*3,Math.floor(clock*12+cx*40)%2?'#ffd23f':'#ff8a2a');
    ctx.globalCompositeOperation='lighter';glow(ctx,f[0],f[1],Math.max(4,f[2]*.12),'255,190,90',.5*(1-rz/22));ctx.globalCompositeOperation='source-over';}
}
function drawCouch(x,rz,L3){
  const w=.48,d=.3,C=h=>litc(h,L3,rz);
  ctx.globalAlpha*=.5;rq([[x-w,0,rz-d],[x+w,0,rz-d],[x+w,0,rz+d],[x-w,0,rz+d]],'#000');ctx.globalAlpha*=2;
  rq([[x-w,.45,rz+d],[x+w,.45,rz+d],[x+w,1.22,rz+d],[x-w,1.22,rz+d]],C('#4a2f84'));
  for(const s of [-1,1])rq([[x+s*.02,.5,rz+d-.02],[x+s*(w-.14),.5,rz+d-.02],[x+s*(w-.14),1.14,rz+d-.02],[x+s*.02,1.14,rz+d-.02]],C('#5d40a0'));
  rq([[x-w,1.18,rz+d],[x+w,1.18,rz+d],[x+w,1.24,rz+d],[x-w,1.24,rz+d]],C('#8a6dd0'));
  rq([[x-w,.45,rz-d],[x+w,.45,rz-d],[x+w,.45,rz+d],[x-w,.45,rz+d]],C('#7858c2'));
  rq([[x-w,0,rz-d],[x+w,0,rz-d],[x+w,.45,rz-d],[x-w,.45,rz-d]],C('#5a3c98'));
  rq([[x-w,.4,rz-d],[x+w,.4,rz-d],[x+w,.47,rz-d],[x-w,.47,rz-d]],C('#8a6dd0'));
  rq([[x-.01,.05,rz-d],[x+.01,.05,rz-d],[x+.01,.44,rz-d],[x-.01,.44,rz-d]],C('#3e2670'));
  for(const s of [-1,1]){rq([[x+s*w,0,rz-d],[x+s*(w-.13),0,rz-d],[x+s*(w-.13),.72,rz-d],[x+s*w,.72,rz-d]],C('#4a2f84'));rq([[x+s*w,.68,rz-d],[x+s*(w-.13),.68,rz-d],[x+s*(w-.13),.74,rz-d],[x+s*w,.74,rz-d]],C('#9a80df'));}
  rq([[x-.32,.47,rz+d-.08],[x-.06,.47,rz+d-.08],[x-.06,.74,rz+d-.08],[x-.32,.74,rz+d-.08]],C('#ff7aa8'));rq([[x-.3,.62,rz+d-.08],[x-.08,.62,rz+d-.08],[x-.08,.66,rz+d-.08],[x-.3,.66,rz+d-.08]],C('#ffd23f'));
  for(const s of [-1,1])rq([[x+s*.4,0,rz-d],[x+s*.34,0,rz-d],[x+s*.34,-.02,rz-d-.02],[x+s*.4,-.02,rz-d-.02]],C('#2a1810'));
}
function drawBox(x,rz,L3,hy){
  const w=.36,d=.32,h=.62,C=hh=>litc(hh,L3,rz),y=hy;
  ctx.globalAlpha*=.5;rq([[x-w-.05,0,rz-d],[x+w+.05,0,rz-d],[x+w+.05,0,rz+d],[x-w-.05,0,rz+d]],'#000');ctx.globalAlpha*=2;
  rq([[x-w,y+h,rz-d],[x+w,y+h,rz-d],[x+w,y+h,rz+d],[x-w,y+h,rz+d]],C('#8e6130'));
  rq([[x-w,y+h,rz-d],[x-w-.18,y+h+.14,rz-d+.05],[x-w-.18,y+h+.14,rz+d],[x-w,y+h,rz+d]],C('#e0ad6a'));
  rq([[x+w,y+h,rz-d],[x+w+.18,y+h+.14,rz-d+.05],[x+w+.18,y+h+.14,rz+d],[x+w,y+h,rz+d]],C('#c8924f'));
  rq([[x-w,y,rz-d],[x+w,y,rz-d],[x+w,y+h,rz-d],[x-w,y+h,rz-d]],C('#c8924f'));
  rq([[x-w,y+h-.04,rz-d],[x+w,y+h-.04,rz-d],[x+w,y+h,rz-d],[x-w,y+h,rz-d]],C('#e0ad6a'));
  rq([[x-.05,y+.1,rz-d],[x+.05,y+.1,rz-d],[x+.05,y+h,rz-d],[x-.05,y+h,rz-d]],C('#e8cf95'));
  rq([[x-w+.06,y+.14,rz-d],[x-.1,y+.14,rz-d],[x-.1,y+.26,rz-d],[x-w+.06,y+.26,rz-d]],C('#a8743a'));
  rq([[x-w,y,rz-d],[x-w+.03,y,rz-d],[x-w+.03,y+h,rz-d],[x-w,y+h,rz-d]],C('#f0c080'));
  const p=rproj(x+.02,y+h+.02,rz),s=Math.max(1,Math.round(p[2]*.03));for(let i=0;i<5;i++)P(ctx,Math.round(p[0]+(rh(i,x*9)-.5)*p[2]*.5),Math.round(p[1]-rh(i,4)*p[2]*.2),s,s,GARL[i]);
}
function drawObs(o,rz,L){
  const L3=lightAt(L,o.x,.4,rz),fade=Math.max(0,Math.min(1,(22-rz)/5));
  ctx.globalAlpha=fade*(o.hit?Math.max(0,1-o.ht*1.6):1);const hy=o.hit?o.ht*1.4:0;
  const shadow=(x,w)=>{const ga=ctx.globalAlpha,a=rproj(x-w/2,0,rz),b=rproj(x+w/2,0,rz);ctx.globalAlpha=ga*.45;const hh=Math.max(1,Math.round(a[2]*.07));P(ctx,Math.round(a[0]),Math.round(a[1]-hh/2),Math.round(b[0]-a[0]),hh,'#000');ctx.globalAlpha=ga;};
  const sprite=(img,x,y,wUnits,flip,anchorB)=>{const p=rproj(x,y,rz),W=Math.max(1,Math.round(wUnits*p[2])),H=Math.max(1,Math.round(W*img.height/img.width)),X=Math.round(p[0]-W/2),Y=Math.round(p[1]-H+(anchorB||0)*H);litDraw(img,X,Y,W,H,flip,L3,rz);return[X,Y,W,H];};
  if(o.type==='sleep'){shadow(o.x,.9);const q=sprite(sleeperImg(o.k),o.x,hy,1,false);
    if(o.hat&&!o.hit){const hp=rproj(o.x+.42,0,rz),s=Math.max(2,Math.round(hp[2]*.07));ctx.save();ctx.translate(Math.round(hp[0]),Math.round(hp[1]));ctx.rotate(1.2);for(let i=0;i<4;i++)P(ctx,-s*2+i*s*.5,-s*(4-i),s*(4-i),s,i%2?'#ffd23f':o.hat);ctx.restore();}
    if(!o.hit){for(let i=0;i<2;i++){const zz=(clock*.7+o.z+i*.5)%1;ctx.globalAlpha=Math.min(1,(1-zz)*1.5)*fade;fText('z',Math.round(q[0]+q[2]*(.25-i*.05)+zz*q[2]*.15),Math.round(q[1]-zz*q[3]*.9),Math.max(4,Math.round(q[2]*(.14+zz*.1))),'#cfe3ff');}ctx.globalAlpha=fade;}}
  else if(o.type==='box')drawBox(o.x,rz,L3,hy);
  else if(o.type==='cross'){shadow(o.x,.8);const s=fightSprites(o.k),fr=Math.floor(clock*9)%2;sprite(s.crouch[fr],o.x,hy+(fr?.03:0),1.17,(o.vx===undefined?-o.side:o.vx)<0,.04);if(!o.done&&!o.hit)warnMark(o.x,.75,rz);}
  else if(o.type==='throw'){
    const s=fightSprites(o.k),img=o.launched?(o.fly<.35?s.heavy:s.idle[0]):s.idle[Math.floor(clock*6)%2];shadow(o.side*1.5,.6);sprite(img,o.side*1.5,0,1.17,o.side>0,.04);if(!o.launched)warnMark(o.side*1.5,1.15,rz);
    if(o.launched&&!o.hit){shadow(o.x,.3);const p=rproj(o.x,.82,rz),sz=Math.max(2,Math.round(.5*p[2]));ctx.save();ctx.translate(Math.round(p[0]),Math.round(p[1]));ctx.rotate(o.spin);ctx.drawImage(itemSpr(o.item),-sz/2,-sz/2,sz,sz);ctx.restore();
      ctx.globalAlpha*=.35;for(let i=1;i<4;i++){const pp=rproj(o.x-(o.lane-o.side*1.6)*.06*i,.82,rz),ss=Math.max(1,Math.round(sz*(1-i*.2)));P(ctx,Math.round(pp[0]-ss/4),Math.round(pp[1]-ss/4),Math.round(ss/2),Math.round(ss/2),'#ffffff');}ctx.globalAlpha=fade;}
  }
  else if(o.type==='table')drawTable(o.x,rz,L3);
  else if(o.type==='chair')drawCouch(o.x,rz,L3);
  ctx.globalAlpha=1;
}
function drawStrings(pz,rem,list){
  for(let n=Math.ceil(pz/3);n*3<pz+22;n++){
    const rz=n*3-pz;if(rz<.6||rz>=rem)continue;
    list.push({rz,d:()=>{
      const fade=Math.max(0,Math.min(1,(22-rz)/5)),bunt=n%2===1;ctx.globalAlpha=fade;
      let prev=null;
      for(let i=0;i<=16;i++){const t=i/16,x=-RW2+t*2*RW2,y=RCH-.12-Math.sin(t*Math.PI)*.42,p=rproj(x,y,rz);
        if(prev){ctx.strokeStyle='#140c1e';ctx.lineWidth=Math.max(1,p[2]*.012);ctx.beginPath();ctx.moveTo(prev[0],prev[1]);ctx.lineTo(p[0],p[1]);ctx.stroke();}
        if(i%2===1&&i<16){const s=Math.max(1,Math.round(p[2]*(bunt?.1:.035))),ci=(i+n)%5;
          if(bunt){ctx.fillStyle=GARL[ci];ctx.beginPath();ctx.moveTo(p[0]-s,p[1]);ctx.lineTo(p[0]+s,p[1]);ctx.lineTo(p[0],p[1]+s*1.6);ctx.closePath();ctx.fill();}
          else{const on=(i+n+Math.floor(clock*3))%3!==0;P(ctx,Math.round(p[0]-s),Math.round(p[1]),s*2,s*3,on?GARL[ci]:'#3a2f5f');if(on){P(ctx,Math.round(p[0]-s),Math.round(p[1]),Math.max(1,s),Math.max(1,s),'#ffffff');ctx.globalCompositeOperation='lighter';glow(ctx,p[0],p[1]+s,Math.max(4,p[2]*.14),GARL_RGB[ci],.45*fade);ctx.globalCompositeOperation='source-over';}}}
        prev=p;}
      ctx.globalAlpha=1;}});
  }
}
function drawProps(pz,rem,list,L){
  for(let n=Math.ceil(pz/7);n*7<pz+22;n++){
    const rz=n*7+3.5-pz;if(rz<.8||rz>=rem-.5)continue;const side=n%2?1:-1,kind=Math.floor(rh(n,5)*3);
    list.push({rz,d:()=>{
      const fade=Math.max(0,Math.min(1,(22-rz)/5));ctx.globalAlpha=fade;const L3=lightAt(L,side*1.5,.5,rz);
      if(kind===0){const p=rproj(side*1.55,0,rz),W=Math.round(.8*p[2]);litDraw(PLANT_SPR,Math.round(p[0]-W/2),Math.round(p[1]-W),W,W,side>0,L3,rz);}
      else{for(let b=0;b<3;b++){const bx=side*(1.45+b*.1),by=1.25+b*.18+Math.sin(clock*2+n+b)*.04,p=rproj(bx,by,rz),r=Math.max(2,Math.round(p[2]*.13)),col=GARL[(n+b*2)%5];
        const k=rproj(side*1.5,.55,rz);ctx.strokeStyle='rgba(240,230,210,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p[0],p[1]+r);ctx.lineTo(k[0],k[1]);ctx.stroke();
        ctx.fillStyle=litc(col,L3.map(v=>v+.25),rz);ctx.beginPath();ctx.ellipse(p[0],p[1],r*.85,r,0,0,Math.PI*2);ctx.fill();P(ctx,Math.round(p[0]-r*.4),Math.round(p[1]-r*.5),Math.max(1,Math.round(r*.3)),Math.max(1,Math.round(r*.35)),'rgba(255,255,255,.7)');}
        if(kind===2){const p=rproj(side*1.5,0,rz),W=Math.round(.5*p[2]);litDraw(itemSpr('caja'),Math.round(p[0]-W/2),Math.round(p[1]-W),W,W,false,L3,rz);}}
      ctx.globalAlpha=1;}});
  }
}
function drawPaws(R){
  const run=R.jy===0&&R.slide<=0,air=R.jy>0,ly=run?Math.max(0,Math.sin(R.ph))*11:0,ry=run?Math.max(0,Math.sin(R.ph+Math.PI))*11:0;
  const img=pawImg(air),base=air?182:R.slide>0?214:204,W=img.width,H=img.height;
  const lx=104-(R.slide>0?12:0)-(air?6:0),rx=216+(R.slide>0?12:0)+(air?6:0);
  ctx.drawImage(img,Math.round(lx-W/2),Math.round(base-H/2-ly));
  ctx.save();ctx.translate(Math.round(rx+W/2),Math.round(base-H/2-ry));ctx.scale(-1,1);ctx.drawImage(img,0,0);ctx.restore();
}
const HUMC=document.createElement('canvas');HUMC.width=80;HUMC.height=80;const humg=HUMC.getContext('2d');
const HSIL=document.createElement('canvas');HSIL.width=80;HSIL.height=80;const hsg=HSIL.getContext('2d');
function drawHumanSil(x,y,sc){
  humg.clearRect(0,0,80,80);humg.save();humg.translate(40,76);drawHuman({x:0,y:0,pose:'broom',face:1,moving:true},humg);humg.restore();
  const X=Math.round(x-40*sc),Y=Math.round(y-76*sc),W=Math.round(80*sc);
  const tintTo=col=>{hsg.clearRect(0,0,80,80);hsg.globalCompositeOperation='source-over';hsg.drawImage(HUMC,0,0);hsg.globalCompositeOperation='source-in';hsg.fillStyle=col;hsg.fillRect(0,0,80,80);hsg.globalCompositeOperation='source-over';};
  tintTo('#ffc890');const o=Math.max(1,Math.round(sc));for(const [a,b] of [[-o,0],[o,0],[0,-o]])ctx.drawImage(HSIL,X+a,Y+b,W,W);
  tintTo('#1a1026');ctx.drawImage(HSIL,X,Y,W,W);
  ctx.globalAlpha=.22;ctx.drawImage(HUMC,X,Y,W,W);ctx.globalAlpha=1;
  const e=Math.max(1,Math.round(sc*1.5));P(ctx,Math.round(x-4*sc),Math.round(y-47*sc),e,e,'#fff4d0');P(ctx,Math.round(x+3*sc),Math.round(y-47*sc),e,e,'#fff4d0');
}
function renderRun(){
  const R=RN;ctx.setTransform(S,0,0,S,0,0);ctx.imageSmoothingEnabled=false;
  if(R.phase==='out'){renderRunOut();return;}
  if(R.phase==='turn'){
    const k=R.t/.35;ctx.save();ctx.translate(Math.round(-k*320),0);renderRunView(true);ctx.restore();
    ctx.save();ctx.translate(Math.round((1-k)*320),0);renderRunView(false);ctx.restore();
  }else renderRunView(R.phase==='look');
  runHUD();
}
function renderRunView(look){
  const R=RN,sh=R.shake>0?(Math.random()-.5)*R.shake*12:0;
  const cx0=R.camX,ch0=R.camH;if(look){R.camX=0;R.camH=1;}
  ctx.save();ctx.translate(Math.round(sh),Math.round(sh*.5));
  const pz=look?0:R.pz,rem=look?9:RWIN-R.pz,L=rlights(pz,rem,look);
  rcRender(pz,rem,look,L);
  ctx.globalCompositeOperation='lighter';
  L.forEach(l=>{if(l.z<.5||l.z>22)return;const p=rproj(l.x,l.y,l.z),f=1-l.z/22;if(l.i>1.3&&l.rad<4)glow(ctx,p[0],p[1],Math.max(6,p[2]*.35),'255,190,110',.5*f);});
  if(!look&&rem<22){const p=rproj(0,1.25,rem),f=Math.max(0,1-rem/22);glow(ctx,p[0],p[1],Math.max(30,p[2]*2.2),'140,160,255',.35*f);
    const a=rproj(-.9,2.05,rem),b=rproj(.9,.4,rem);ctx.fillStyle=`rgba(120,150,255,${.07*f})`;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],a[1]);ctx.lineTo(b[0]+(b[0]-160)*3,208);ctx.lineTo(a[0]+(a[0]-160)*3,208);ctx.closePath();ctx.fill();}
  ctx.globalCompositeOperation='source-over';
  const list=[];
  if(look){
    const rz=Math.max(1.9,3.8-R.t*.7),p=rproj(0,0,rz),sc=p[2]*1.9/58;
    ctx.globalAlpha=.5;P(ctx,Math.round(p[0]-p[2]*.45),Math.round(p[1]-2),Math.round(p[2]*.9),4,'#000');ctx.globalAlpha=1;
    drawStrings(0,9,list);list.sort((a,b)=>b.rz-a.rz).forEach(e=>e.d());
    drawHumanSil(p[0],p[1],sc);
    [[-1.1,4.6,'humo'],[1.05,5.4,'pelusa']].forEach(([x,z,k])=>{const q=rproj(x,0,z),img=fightSprites(k).hurt,W=Math.round(1.17*q[2]),H=Math.round(W*img.height/img.width);litDraw(img,Math.round(q[0]-W/2),Math.round(q[1]-H-Math.abs(Math.sin(clock*9+x))*q[2]*.2),W,H,x>0,lightAt(L,x,.5,z),z);});
  }else{
    R.obs.forEach(o=>{const rz=o.z-R.pz;if(rz>.45&&rz<22&&rz<rem)list.push({rz,d:()=>drawObs(o,rz,L)});});
    R.runners.forEach(r=>{const rz=r.z-R.pz;if(rz>.6&&rz<22&&rz<rem)list.push({rz,d:()=>{const p=rproj(r.x,Math.abs(Math.sin(r.ph))*.08,rz),s=Math.max(1,Math.round(.7*p[2]));ctx.globalAlpha=Math.max(0,Math.min(1,(22-rz)/5));litDraw(SPR[r.k].back[Math.floor(r.ph)%2],Math.round(p[0]-s/2),Math.round(p[1]-s),s,s,false,lightAt(L,r.x,.4,rz),rz);ctx.globalAlpha=1;if(r.say&&rz<6)fText(r.say,Math.round(p[0]),Math.round(p[1]-s-3),5,'#f4ead5');}});});
    drawStrings(R.pz,rem,list);drawProps(R.pz,rem,list,L);
    list.sort((a,b)=>b.rz-a.rz).forEach(e=>e.d());
    R.conf.forEach(c=>{const rz=c.z-R.pz;if(rz<.5||rz>rem||rz>20)return;const p=rproj(c.x,c.y,rz),s=Math.max(1,Math.round(p[2]*.018));ctx.globalAlpha=Math.min(1,(20-rz)/6)*(.6+.4*Math.sin(c.ph*2));P(ctx,Math.round(p[0]),Math.round(p[1]),s,Math.max(1,Math.round(s*(1+Math.sin(c.ph)))),c.col);});ctx.globalAlpha=1;
    if(R.v>8.5&&R.phase==='run'){ctx.globalAlpha=.1+(R.v-8.5)*.05;for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.floor(clock*12)*.37,r0=150+rh(i,Math.floor(clock*12))*30;P(ctx,Math.round(160+Math.cos(a)*r0),Math.round(RHOR+Math.sin(a)*r0*.7),Math.round(Math.abs(Math.cos(a))*14+1),1,'#ffffff');}ctx.globalAlpha=1;}
    drawPaws(R);
    if(R.inv>0&&Math.floor(clock*14)%2){ctx.globalAlpha=.22;P(ctx,0,0,320,208,'#ff3b5c');ctx.globalAlpha=1;}
  }
  ctx.restore();
  R.camX=cx0;R.camH=ch0;
  const vg=ctx.createRadialGradient(160,104,80,160,104,215);vg.addColorStop(0,'rgba(8,4,20,0)');vg.addColorStop(1,'rgba(8,4,20,.6)');ctx.fillStyle=vg;ctx.fillRect(0,0,320,208);
}
function runHUD(){
  const R=RN;
  if(R.phase==='look'){
    const bh=Math.min(20,R.t*40);P(ctx,0,0,320,bh,'#000');P(ctx,0,208-bh,320,bh,'#000');
    if(R.shout){const s=Math.round(Math.sin(clock*40)*2);fText(R.shout.text,160+s,48,13,'#ff5c9d');}
    if(R.t>.9){ctx.globalAlpha=Math.min(1,(R.t-.9)*3);fText('¡Tu humano agarró la escoba!',160,178,7,'#f4ead5');ctx.globalAlpha=1;}
    return;
  }
  if(R.phase!=='caught'&&R.close>.5){const a=(R.close-.5)*1.3*(.7+.3*Math.sin(clock*8));const g=ctx.createRadialGradient(160,104,60,160,104,200);g.addColorStop(0,'rgba(255,40,80,0)');g.addColorStop(1,'rgba(255,40,80,'+Math.min(.7,a)+')');ctx.fillStyle=g;ctx.fillRect(0,0,320,208);}
  const hand=R.phase==='caught'?Math.min(1,R.t*1.5):Math.max(0,(R.close-.72)/.28);
  if(hand>0){const img=handImg();for(const s of [-1,1]){const hx=s<0?-10+hand*70:330-hand*70,hy=208-hand*80+Math.sin(clock*6+s)*2;
    ctx.save();ctx.translate(Math.round(hx),Math.round(hy));ctx.rotate(s*-.35);if(s>0)ctx.scale(-1,1);ctx.drawImage(img,-30,-10,60,92);ctx.restore();}}
  if(R.phase==='caught'){ctx.globalAlpha=Math.min(.85,R.t*.6);P(ctx,0,0,320,208,'#000');ctx.globalAlpha=1;fText('¡TE AGARRÓ!',160,100,14,'#ff5c9d');return;}
  const prog=Math.min(1,R.pz/RWIN);
  P(ctx,96,3,128,11,'#140c1e');P(ctx,97,4,126,9,'#2a2046');P(ctx,99,7,122,3,'#1a1430');P(ctx,99,7,Math.round(122*prog),3,'#5fe0b0');P(ctx,99,7,Math.round(122*prog),1,'#b0ffe0');
  ctx.drawImage(SPR.carbon.normal[0],Math.round(99+122*prog-6),1,12,12);
  P(ctx,225,2,12,12,'#140c1e');P(ctx,226,3,10,10,'#d9ccb0');P(ctx,227,4,8,8,'#2a3a7a');P(ctx,230,4,1,8,'#d9ccb0');P(ctx,227,7,8,1,'#d9ccb0');P(ctx,232,5,2,2,'#fff1bf');
  fText(Math.max(0,Math.ceil((RWIN-R.pz)/2.4))+' m hasta la ventana',160,23,4,'#f4ead5');
  P(ctx,4,4,76,19,'#140c1e');P(ctx,5,5,74,17,'rgba(42,32,70,.9)');fText('TU HUMANO',42,12,4,'#ff9ec4');P(ctx,9,15,66,4,'#140c1e');P(ctx,10,16,64,2,'#2a2046');P(ctx,10,16,Math.round(64*Math.min(1,R.close)),2,R.close>.7?'#ff3b5c':'#ffb547');
  if(R.shout){const s=Math.round(Math.sin(clock*40)*1.5);ctx.globalAlpha=Math.min(1,R.shout.t*3);fText(R.shout.text,160+s,42,8,'#ff5c9d');ctx.globalAlpha=1;}
  const nx=R.obs.find(o=>!o.done&&o.z-R.pz<8&&o.z-R.pz>1&&Math.abs(o.x-R.lane)<.6&&!R.tut[o.type]);
  if(nx&&R.phase==='run'){const txt={sleep:'↑ ¡SALTÁ AL GATO DORMIDO!',box:'↑ ¡SALTÁ LA CAJA!',table:'↓ ¡AGACHATE BAJO LA MESA!',chair:'← → ¡ESQUIVÁ EL SILLÓN!',throw:'↓ ¡AGACHATE! ¡TE TIRAN COSAS!',cross:'↑ ¡SALTÁ AL GATO QUE CRUZA!'}[nx.type];P(ctx,40,54,240,11,'rgba(10,6,24,.6)');fText(txt,160,62,6,'#ffd23f');if(nx.z-R.pz<1.6)R.tut[nx.type]=true;}
  R.pops.forEach((p,i)=>{if(i<R.pops.length-1)return;ctx.globalAlpha=Math.min(1,p.t*2.5);fText(p.text,160,Math.round(100-(1-p.t)*10),p.text.length>8?9:12,p.col);ctx.globalAlpha=1;});
}
function renderRunOut(){
  const R=RN,t=R.t;ctx.drawImage(danceBG(),0,0);
  for(let i=0;i<12;i++){const x=(i*73+11)%320,y=(i*37)%80+4;ctx.globalAlpha=.4+.5*Math.sin(clock*3+i);P(ctx,x,y,1,1,'#ffffff');}ctx.globalAlpha=1;
  [['manchita',30,-1],['humo',290,1]].forEach(([k,x,f])=>{const img=SPR[k].normal[Math.floor(clock*1.2)%2];if(f<0){ctx.save();ctx.translate(x+16,160);ctx.scale(-1,1);ctx.drawImage(img,0,0,32,32);ctx.restore();}else ctx.drawImage(img,x-16,160,32,32);});
  const s=fightSprites('carbon'),k=Math.min(1,t/1.3),x=40+k*120,y=GROUND_D+(1-k)*70-Math.sin(k*Math.PI)*85,img=k<1?s.jump:s.idle[Math.floor(clock*3)%2],w=FW*1.5,h=FH*1.5;
  ctx.globalAlpha=.45;P(ctx,Math.round(x-18),GROUND_D-2,36,3,'#000');ctx.globalAlpha=1;
  ctx.drawImage(img,Math.round(x-FANCH*1.5),Math.round(y-h+2),w,h);
  if(t<.5){ctx.globalAlpha=1-t*2;P(ctx,0,0,320,208,'#ffffff');ctx.globalAlpha=1;}
  if(t>1.4){ctx.globalAlpha=Math.min(1,(t-1.4)*3);P(ctx,0,26,320,22,'rgba(10,6,24,.6)');fText('¡ESCAPASTE!',160,43,14,'#5fe0b0');ctx.globalAlpha=1;}
  if(t>2.4){ctx.globalAlpha=Math.min(1,(t-2.4)*3);P(ctx,0,52,320,30,'rgba(10,6,24,.6)');fText('...pero todo el barrio vio la fiesta del desastre.',160,64,5,'#f4ead5');fText('PRESTIGIO: '+Math.round(rep),160,77,9,rep>40?'#ffd23f':'#ff5c9d');ctx.globalAlpha=1;}
  if(t>3)fText('¿Ese es Carbón?',46,152,5,'#f4ead5');
  if(t>3.6)fText('¡Qué papelón!',276,152,5,'#f4ead5');
}
function loseRun(){
  state='lose';
  show(`<div class="card">
    <p class="eyebrow">TE ATRAPARON</p>
    <h2>Tu humano te agarró de la nuca</h2>
    <p>Directo a la cucha y sin cena. Los gatos del barrio se escaparon sin vos.</p>
    <p class="tip">← → para cambiar de carril. ↑ o ESPACIO para saltar a los gatos dormidos, las cajas y los gatos que cruzan. ↓ para agacharte debajo de las mesas y de lo que te tiran. Cada choque deja que tu humano se acerque.</p>
    <div class="row"><button class="btn" data-act="retry">Intentar de nuevo</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}

