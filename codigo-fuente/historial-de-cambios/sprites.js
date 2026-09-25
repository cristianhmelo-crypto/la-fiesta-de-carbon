const FRONT=[
"................",
"...b......b.....",
"...Hb....bD.....",
"...HiHssbiD.....",
"..HHHHssbbbD....",
"..HbGebbGebD....",
"..HbepbbepbD....",
".wbbblnnlbbDw...",
"...bbllllbD.....",
"....ccggcc......",
"...HsbllbsD...t.",
"..HHbbllbbDD.t..",
"..HsbbllbbsD.t..",
"..bbbbbbbbDDt...",
"...bb....bD.....",
"................"];
const FRONT_B=FRONT.slice();
FRONT_B[10]="...HsbllbsD..t..";FRONT_B[12]="..HsbbllbbsD..t.";FRONT_B[14]="....bb..bD......";
const SIDE=[
"................",
"................",
"................",
"..........b..b..",
"..........Hi.iD.",
".t.......HHHHHb.",
".t.......Hbbepb.",
"..t......bbbbbln",
"..t.....cDbbll..",
"..tHHHHHHcgl....",
"...bbsbbsbbl....",
"...bbbbbbbbbD...",
"...DDllllllDD...",
"..bD......bD....",
".bD........bD...",
"................"];
const SIDE_B=SIDE.slice();
SIDE_B[5]="t........HHHHHb.";SIDE_B[13]="....bD...bD.....";SIDE_B[14]="....bD...bD.....";
const BACK=[
"................",
"...b......b.....",
"...HD....HD.....",
"...HbbssbbD.....",
"..HHbbssbbbD....",
"..HbbbssbbbD....",
"..HbbbbbbbbD....",
".wbbbbbbbbbDw...",
"...bbbbbbbD.....",
"....cccccc......",
"...HbsbbsbD.....",
"..HHbbsbbbbD....",
"..HbsbbbsbbD....",
"..bbbbDDbbDD....",
"...bb.DD.bD.....",
"......D........."];
const BACK_B=BACK.slice();
BACK_B[14]="....bDD.bD......";BACK_B[15]=".......D........";
function variant(rows,m){
  const r=rows.slice();
  if(m==='sleep'){r[5]="..HbbbbbbbbD....";r[6]="..HbddbbddbD....";}
  if(m==='happy'){r[5]="..HbddbbddbD....";r[6]="..HdbbddbbdD....";}
  if(m==='angry'){r[4]="..HHddssddbD....";}
  return r;
}
function hx(h){h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function tint(h,t){const c=hx(h),to=t<0?[18,12,38]:[255,246,225],a=Math.abs(t);return'#'+c.map((v,i)=>Math.max(0,Math.min(255,Math.round(v+(to[i]-v)*a))).toString(16).padStart(2,'0')).join('');}
for(const k in PALS){const p=PALS[k];p.H=p.H||tint(p.b,.3);p.D=p.D||tint(p.b,-.3);p.o=p.o||tint(p.b,-.8);p.z=p.z||p.s;p.G=p.G||'#ffffff';}
function addOutline(c,col){
  const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data;
  const o=document.createElement('canvas');o.width=w;o.height=h;const g=o.getContext('2d');g.fillStyle=col;
  const a=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&d[(y*w+x)*4+3]>128;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++) if(!a(x,y)&&(a(x-1,y)||a(x+1,y)||a(x,y-1)||a(x,y+1))) g.fillRect(x,y,1,1);
  g.drawImage(c,0,0);return o;
}
function buildSprite(rows,pal,outline=true){
  const c=document.createElement('canvas');c.width=16;c.height=16;const g=c.getContext('2d');
  for(let y=0;y<rows.length;y++)for(let x=0;x<16;x++){const ch=rows[y][x];if(ch==='.'||ch==='w')continue;g.fillStyle=pal[ch]||pal.b;g.fillRect(x,y,1,1);}
  const o=outline?addOutline(c,pal.o):c;const og=o.getContext('2d');
  for(let y=0;y<rows.length;y++)for(let x=0;x<16;x++) if(rows[y][x]==='w'){og.fillStyle=pal.w;og.fillRect(x,y,1,1);}
  return o;
}
const zRows=rows=>rows.map((r,y)=>y>=9?r.replace(/s/g,'z'):r);
const SPR={};
for(const k in PALS){
  const p=PALS[k],s={};
  for(const m of ['normal','sleep','happy','angry'])s[m]=[buildSprite(zRows(variant(FRONT,m)),p),buildSprite(zRows(variant(FRONT_B,m)),p)];
  s.side=[buildSprite(zRows(SIDE),p),buildSprite(zRows(SIDE_B),p)];
  s.back=[buildSprite(zRows(BACK),p),buildSprite(zRows(BACK_B),p)];
  SPR[k]=s;
}

