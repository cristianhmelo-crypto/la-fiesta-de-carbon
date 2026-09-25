/* ---------- dibujo ---------- */
const ITEM_SPR={};
function itemSpr(t){
  if(!ITEM_SPR[t]){const c=document.createElement('canvas');c.width=16;c.height=16;ITEM_DRAW[t](c.getContext('2d'),0,0);ITEM_SPR[t]=(t==='confeti'||t==='leche')?c:addOutline(c,'#1a1026');}
  return ITEM_SPR[t];
}
function drawCatSprite(key,mood,frame,x,y,face,dir){
  const s=SPR[key],img=dir==='side'?s.side[frame]:dir==='up'?s.back[frame]:s[mood][frame];
  if(face<0){ctx.save();ctx.translate(x+16,y);ctx.scale(-1,1);ctx.drawImage(img,0,0);ctx.restore();}
  else ctx.drawImage(img,x,y);
}
function softShadow(x,y){P(ctx,x+4,y+14,8,2,'rgba(12,6,28,.38)');P(ctx,x+3,y+15,10,1,'rgba(12,6,28,.22)');}
function drawBoxed(c){
  let x=Math.round(c.x-8),y=Math.round(c.y-14);
  if(c.def.escape&&c.boxT>c.def.escape-3)x+=Math.round(Math.sin(clock*40));
  const pal=PALS[c.key];
  P(ctx,x+14,y+9,1,4,pal.t);P(ctx,x+15,y+7,1,3,pal.t);
  ctx.drawImage(itemSpr('caja'),x,y);
  P(ctx,x+4,y+9,8,2,'#3a2412');
  if(Math.sin(clock*2+c.tx)>-.9){P(ctx,x+5,y+9,1,1,pal.e);P(ctx,x+10,y+9,1,1,pal.e);}
  if(c.def.escape){const f=1-c.boxT/c.def.escape;P(ctx,x+2,y+2,12,2,'#000');P(ctx,x+2,y+2,Math.round(12*f),2,'#5aa9ff');}
}
function drawCat(c){
  const x=Math.round(c.x-8),y=Math.round(c.y-14);
  softShadow(x,y);
  const dir=c.state==='sleep'?'down':(c.dir||'down');
  let mood=c.state==='sleep'?'sleep':c.state==='leaving'?'happy':(c.state==='fleeing'||c.def.angry||c.stun>0)?'angry':'normal';
  if(mood==='normal'&&(clock+c.seed)%3.4<.14)mood='sleep';
  const fr=c.moving?(Math.floor(c.anim*7)%2):(Math.floor(c.anim*1.2)%2);
  const bob=c.moving&&fr?-1:0;
  drawCatSprite(c.key,mood,fr,x,y+bob,c.face,dir);
  if(c.state==='sleep'){ctx.font='5px "Press Start 2P"';ctx.fillStyle='#cfe3ff';const z=(clock*.8+c.tx*.3)%1;ctx.globalAlpha=1-z;ctx.fillText('z',x+13,y+1-z*8);ctx.globalAlpha=1;}
  if(c.hp<c.def.hp&&(c.state==='wander')){for(let i=0;i<c.def.hp;i++)P(ctx,x+8-c.def.hp+i*2,y-3,1,2,i<c.hp?'#ff5c9d':'#3a2f5f');}
}
function drawPlayer(){
  const p=player,x=Math.round(p.x-8),y=Math.round(p.y-14);
  const pulse=.45+.3*Math.sin(clock*5);
  ctx.globalAlpha=pulse;P(ctx,x+3,y+14,10,1,'#ffb547');P(ctx,x+2,y+15,12,1,'#ffb547');P(ctx,x+3,y+16,10,1,'#ffb547');ctx.globalAlpha=1;
  softShadow(x,y);
  const dir=(p.busy||p.stun>0)?'down':p.dir;
  const fr=p.moving?(Math.floor(p.anim*8)%2):(Math.floor(clock*1.2)%2);
  let mood=p.stun>0?'sleep':p.swat>0?'angry':'normal';
  if(mood==='normal'&&clock%3.1<.14)mood='sleep';
  drawCatSprite('carbon',mood,fr,x,y+(p.moving&&fr?-1:0),p.face,dir);
  if(p.held)ctx.drawImage(itemSpr(p.held.type),x,y-9);
  if(introT>0){const b=Math.round(Math.sin(clock*8)*2),ay=y-14+b;for(let i=0;i<5;i++)P(ctx,x+3+i,ay+i,11-i*2,1,'#ffb547');P(ctx,x+6,ay-5,5,5,'#ffb547');}
  if(p.swat>0){const sx=p.face>0?x+14:x-4;ctx.fillStyle='#ffffff';for(let i=0;i<3;i++)for(let k=0;k<4;k++)ctx.fillRect(sx+k*(p.face>0?1:-1)+(p.face>0?0:4),y+3+i*3+k,1,1);}
  if(p.stun>0){for(let i=0;i<3;i++){const a=clock*6+i*2.1;P(ctx,Math.round(p.x+Math.cos(a)*6),Math.round(y-2+Math.sin(a)*2),1,1,'#ffd23f');}}
  if(p.busy){P(ctx,x,y-4,16,3,'#000');P(ctx,x+1,y-3,Math.round(14*p.busy.t/p.busy.dur),1,'#5fe0b0');}
}
const GARL=['#ff5c9d','#ffd23f','#5fe0b0','#6fb3ff','#c77dff'],GARL_RGB=['255,92,157','255,210,63','95,224,176','111,179,255','199,125,255'];
function garlandOn(i){return(Math.floor(clock*2)+i)%3!==0;}
function drawGarland(){
  for(let x=4;x<COLS*T-4;x+=10){
    const sag=Math.sin(((x-4)%40)/40*Math.PI)*3,i=Math.floor(x/10),on=garlandOn(i);
    P(ctx,x,Math.round(7+sag),10,1,'#1b1530');
    P(ctx,x+4,Math.round(8+sag),2,2,on?GARL[i%5]:'#3a2f5f');
    if(on)P(ctx,x+4,Math.round(8+sag),1,1,'#ffffff');
  }
}
/* ---------- luz ---------- */
const LC=document.createElement('canvas');LC.width=cv.width;LC.height=cv.height;const lg=LC.getContext('2d');
let lights=[],beams=[],motes=[];
const BEAM_SK=22,BEAM_LEN=50;
function buildLights(){
  lights=[];beams=[];motes=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const ch=map[y][x];
    if(ch==='L')lights.push({x:x*T+8,y:y*T+4,r:70,a:.95,col:'255,190,110',flick:true});
    if(ch==='F')lights.push({x:x*T+8,y:y*T+14,r:14,a:.3,col:'170,220,255'});
  }
  (LAMPS.get(map)||[]).forEach(([tx,ty])=>lights.push({x:tx*T,y:ty*T,r:76,a:.9,col:'255,214,150',flick:true}));
  for(let x=0;x<COLS;x++)if(windowAt(map,x)){beams.push({x:x*T});for(let i=0;i<7;i++)motes.push({b:beams.length-1,t:Math.random(),s:Math.random(),sp:.03+Math.random()*.05,ph:Math.random()*6});}
}
function beamQuads(b){
  const X=b.x,q=[];
  for(const [x0,x1] of [[X+3,X+8],[X+9,X+13]])for(const [t0,t1] of [[0,.47],[.53,1]])
    q.push([[x0+BEAM_SK*t0,11+BEAM_LEN*t0],[x1+BEAM_SK*t0,11+BEAM_LEN*t0],[x1+BEAM_SK*t1,11+BEAM_LEN*t1],[x0+BEAM_SK*t1,11+BEAM_LEN*t1]]);
  return q;
}
function fillBeams(g,rgb,aMul){
  for(const b of beams){
    const gr=g.createLinearGradient(0,11,0,11+BEAM_LEN);
    gr.addColorStop(0,`rgba(${rgb},${.12*aMul})`);gr.addColorStop(.7,`rgba(${rgb},${.5*aMul})`);gr.addColorStop(1,`rgba(${rgb},0)`);
    g.fillStyle=gr;
    for(const q of beamQuads(b)){g.beginPath();g.moveTo(q[0][0],q[0][1]);for(let i=1;i<4;i++)g.lineTo(q[i][0],q[i][1]);g.closePath();g.fill();}
  }
}
function glow(g,x,y,r,rgb,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${rgb},${a})`);gr.addColorStop(.45,`rgba(${rgb},${a*.5})`);gr.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
function dynLights(){
  const L=lights.map(l=>l.flick?{...l,a:l.a*(.94+.06*Math.sin(clock*11+l.x))}:l);
  if(player&&state!=='title'&&state!=='select')L.push({x:player.x,y:player.y-6,r:34,a:.6,col:'190,180,255'});
  for(let x=4;x<COLS*T-4;x+=10){const i=Math.floor(x/10);if(garlandOn(i))L.push({x:x+5,y:9+Math.sin(((x-4)%40)/40*Math.PI)*3,r:11,a:.5,col:GARL_RGB[i%5]});}
  if(state==='play'&&timeLeft<14){const ph=(clock*.28)%1;L.push({x:-90+ph*500,y:34,r:80,a:.85,col:'255,244,214'});}
  return L;
}
function lightPass(k,ox,oy){
  const L=dynLights();
  lg.setTransform(1,0,0,1,0,0);lg.globalCompositeOperation='source-over';lg.clearRect(0,0,LC.width,LC.height);
  lg.fillStyle='rgba(12,9,38,.52)';lg.fillRect(0,0,LC.width,LC.height);
  lg.setTransform(k,0,0,k,ox,oy);lg.globalCompositeOperation='destination-out';
  L.forEach(l=>glow(lg,l.x,l.y,l.r,'0,0,0',l.a));
  fillBeams(lg,'0,0,0',1);
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(LC,0,0);
  ctx.setTransform(k,0,0,k,ox,oy);ctx.globalCompositeOperation='lighter';
  L.forEach(l=>glow(ctx,l.x,l.y,l.r*.8,l.col,l.a*.2));
  fillBeams(ctx,'140,175,255',.32);
  motes.forEach(m=>{const b=beams[m.b];if(!b)return;const x=b.x+4+m.s*9+BEAM_SK*m.t,y=11+BEAM_LEN*m.t+Math.sin(clock*.8+m.ph)*2;
    const a=(.35+.35*Math.sin(clock*2+m.ph))*Math.sin(m.t*Math.PI);ctx.globalAlpha=Math.max(0,a);P(ctx,Math.round(x),Math.round(y),1,1,'#dfe8ff');});
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
}
/* ---------- cámara ---------- */
let zoomNear=true,Z=1,camX=0,camY=0,camSnap=false;
try{zoomNear=localStorage.getItem(SAVE_KEY+'-zoom')!=='lejos';}catch(e){}
function updateCamera(){
  const inGame=state==='play'||state==='pause'||state==='win'||state==='lose';
  const tz=inGame&&zoomNear?5/3:1;
  if(camSnap)Z=tz;
  Z+=(tz-Z)*.12;if(Math.abs(tz-Z)<.01)Z=tz;
  const vw=COLS*T/Z,vh=ROWS*T/Z;
  const fx=inGame?player.x:COLS*T/2,fy=inGame?player.y-6:ROWS*T/2;
  const tx=Math.max(0,Math.min(COLS*T-vw,fx-vw/2)),ty=Math.max(0,Math.min(ROWS*T-vh,fy-vh/2));
  if(camSnap){camX=tx;camY=ty;camSnap=false;}
  camX+=(tx-camX)*.15;camY+=(ty-camY)*.15;
  camX=Math.max(0,Math.min(COLS*T-vw,camX));camY=Math.max(0,Math.min(ROWS*T-vh,camY));
}
function render(){
  if(!bg)return;
  updateCamera();
  const k=S*Z,ox=-Math.round(camX*k),oy=-Math.round(camY*k);
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.setTransform(k,0,0,k,ox,oy);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(bg,0,0);
  drawGarland();
  items.forEach(it=>ctx.drawImage(itemSpr(it.kind==='mess'?it.type:it.kind==='box'?'caja':'pescado'),Math.round(it.x-8),Math.round(it.y-14)));
  const ents=[];
  cats.forEach(c=>{if(c.state==='gone')return;ents.push({y:c.y,d:()=>c.state==='boxed'?drawBoxed(c):drawCat(c)});});
  if(state!=='title'&&state!=='select')ents.push({y:player.y+.1,d:drawPlayer});
  ents.sort((a,b)=>a.y-b.y).forEach(e=>e.d());
  lightPass(k,ox,oy);
  ctx.setTransform(k,0,0,k,ox,oy);
  if(state==='play'&&!player.busy&&player.stun<=0){
    const a=getAction();
    if(a&&a.tx!==undefined){const b=Math.round(Math.sin(clock*6)*1.5);const ax=Math.round(a.tx),ay=Math.round(a.ty-6+b);const c=a.warn?'#ff5c9d':'#ffffff';P(ctx,ax-3,ay,7,1,c);P(ctx,ax-2,ay+1,5,1,c);P(ctx,ax-1,ay+2,3,1,c);P(ctx,ax,ay+3,1,1,c);}
    setHint(a);
  }
  parts.forEach(p=>{ctx.globalAlpha=Math.min(1,p.t*2);P(ctx,Math.round(p.x),Math.round(p.y),1,1,p.col);});ctx.globalAlpha=1;
  ctx.font='6px "Press Start 2P"';ctx.textAlign='center';
  popups.forEach(p=>{ctx.globalAlpha=Math.min(1,p.t*2);ctx.fillStyle='#000';ctx.fillText(p.text,Math.round(p.x)+1,Math.round(p.y)+1);ctx.fillStyle=p.color;ctx.fillText(p.text,Math.round(p.x),Math.round(p.y));});
  ctx.globalAlpha=1;ctx.textAlign='left';
  ctx.setTransform(S,0,0,S,0,0);
  const g=ctx.createRadialGradient(160,104,80,160,104,210);g.addColorStop(0,'rgba(10,6,30,0)');g.addColorStop(1,'rgba(10,6,30,.4)');ctx.fillStyle=g;ctx.fillRect(0,0,COLS*T,ROWS*T);
  if(state==='play'&&timeLeft<12){ctx.fillStyle='rgba(255,60,120,'+(0.06+0.06*Math.sin(clock*8))+')';ctx.fillRect(0,0,COLS*T,ROWS*T);}
}

