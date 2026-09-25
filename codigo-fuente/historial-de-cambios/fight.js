/* ---------- pelea ---------- */
const GROUND=178,GRAV=720;
const ATK={
  scratch:{start:.07,active:.1,rec:.16,range:36,dy:26,dmg:7,kb:90},
  jscratch:{start:.04,active:.22,rec:.08,range:38,dy:52,dmg:11,kb:120},
  bite:{start:.2,active:.08,rec:.32,range:25,dy:20,dmg:19,kb:150}
};
let F=null;
const FSPR={};
function whiteOf(img){const c=document.createElement('canvas');c.width=16;c.height=16;const g=c.getContext('2d');g.drawImage(img,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#ffffff';g.fillRect(0,0,16,16);return c;}
function fightSprites(key){
  if(FSPR[key])return FSPR[key];
  const p=PALS[key],mk=rows=>buildSprite(zRows(rows),p);
  const JUMP=SIDE.slice();JUMP[13]="...Db......Db...";JUMP[14]="................";
  const SCR=SIDE.slice();SCR[8]="..t.....cDbbll.G";SCR[9]="..tHHHHHHcglbbbG";SCR[10]="...bbsbbsbbl...G";SCR[13]="..bD............";SCR[14]=".bD.............";
  const BITE=SIDE.slice();BITE[7]="..t......bbbbbGG";BITE[8]="..t.....cDbbbpp.";BITE[9]="..tHHHHHHcgbbGG.";
  const HURT=SIDE.slice();HURT[6]=".t.......Hbbddb.";
  const s={idle:[mk(SIDE),mk(SIDE_B)],jump:mk(JUMP),scratch:mk(SCR),bite:mk(BITE),hurt:mk(HURT)};
  s.white=whiteOf(s.hurt);
  return FSPR[key]=s;
}
function fighter(key,x,face,hp){return{key,x,y:0,vx:0,vy:0,face,hp,max:hp,trail:hp,atk:null,hurt:0,anim:Math.random(),cd:0,think:.9,plan:'wait'};}
function startFight(c){
  snapCat(c);
  for(const k in keys)keys[k]=false;
  const hp=Math.round(60+c.def.hp*10+LI*12);
  const others=cats.filter(o=>o!==c&&o.state!=='gone').map(o=>o.key);
  const pool=['manchita','copito','tigre','humo','luna','rulo'];
  while(others.length<8)others.push(pool[Math.floor(Math.random()*pool.length)]);
  shuffle(others);
  F={cat:c,phase:'intro',phaseT:0,time:45,shake:0,flash:0,fx:[],cheers:[],fatHit:false,
    p:fighter('carbon',92,1,100),e:fighter(c.key,228,-1,hp),
    ai:{react:Math.max(.14,.62-LI*.11-(c.def.angry?.07:0)),aggr:.3+LI*.1+(c.def.angry?.1:0),bite:.08+LI*.05,dmg:.7+LI*.13,jump:.12+LI*.05},
    crowd:others.slice(0,8).map((k,i)=>({key:k,x:26+i*38+(Math.random()*8-4),seed:Math.random()*4})),
    in:{jump:false,scratch:false,bite:false}};
  state='fight';musicMode='fight';lastHint='';
  hint.innerHTML='<b>PELEA</b><span>← → moverte · ↑ saltar · ESPACIO rasguño (en el aire: salto con rasguño) · X mordida, solo pegado al rival</span>';
  SFX.vs();
}
function fcheer(){const m=F.crowd[Math.floor(Math.random()*F.crowd.length)];F.cheers.push({x:m.x,y:112,t:1.1,text:['¡Dale!','¡Miau!','¡Pelea!','¡Uuuh!','¡Vamos!','¡Fiu fiu!'][Math.floor(Math.random()*6)]});}
function sparks(x,y,n,cols){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=40+Math.random()*90;F.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,t:.35+Math.random()*.3,col:cols[i%cols.length]});}}
function fightHit(a,o,A,mul,type){
  const dmg=Math.round(A.dmg*mul*(.9+Math.random()*.2));
  o.hp=Math.max(0,o.hp-dmg);o.hurt=.3;o.atk=null;o.vx=a.face*A.kb;if(o.y>0)o.vy=Math.max(o.vy,90);
  F.shake=type==='bite'?.7:.35;
  const hx=o.x-a.face*8,hy=GROUND-o.y-26;
  sparks(hx,hy,type==='bite'?16:10,type==='bite'?['#ffffff','#ff5c9d','#ffd23f']:['#ffffff','#ffd23f']);
  F.cheers.push({x:hx,y:hy-14,t:.8,text:type==='bite'?'¡ÑAM! -'+dmg:type==='jscratch'?'¡ZAS! -'+dmg:'-'+dmg,big:true});
  (type==='bite'?SFX.bite:SFX.hit)();
  if(Math.random()<.6)fcheer();
}
function fighterStep(fi,o,dt,c,mul){
  fi.anim+=dt;fi.cd=Math.max(0,fi.cd-dt);
  if(fi.hurt>0){fi.hurt-=dt;fi.vx*=Math.pow(.02,dt);}
  else if(fi.atk){
    const A=ATK[fi.atk.type];fi.atk.t+=dt;
    if(fi.atk.type==='bite'&&fi.atk.t<A.start)fi.vx=fi.face*70;else if(fi.y===0)fi.vx*=.7;
    if(!fi.atk.hit&&fi.atk.t>=A.start&&fi.atk.t<=A.start+A.active){
      const dx=(o.x-fi.x)*fi.face;
      if(dx>0&&dx<=A.range&&Math.abs(fi.y-o.y)<=A.dy&&o.hurt<=0&&o.hp>0){fi.atk.hit=true;fightHit(fi,o,A,mul,fi.atk.type);}
    }
    if(fi.atk&&fi.atk.t>=A.start+A.active+A.rec)fi.atk=null;
  }else{
    const mv=(c.right?1:0)-(c.left?1:0);fi.vx=mv*82;
    if(fi.y===0)fi.face=o.x>fi.x?1:-1;
    if(c.jump&&fi.y===0){fi.vy=255;SFX.jump();}
    if(c.scratch&&fi.cd<=0){fi.atk={type:fi.y>0?'jscratch':'scratch',t:0,hit:false};fi.cd=.12;SFX.swish();}
    else if(c.bite&&fi.cd<=0&&fi.y===0){fi.atk={type:'bite',t:0,hit:false};fi.cd=.2;SFX.swish();}
  }
  if(fi.y>0||fi.vy!==0){fi.vy-=GRAV*dt;fi.y+=fi.vy*dt;if(fi.y<=0){fi.y=0;fi.vy=0;if(fi.atk&&fi.atk.type==='jscratch')fi.atk=null;}}
  fi.x=Math.max(22,Math.min(298,fi.x+fi.vx*dt));
}
function aiCtrl(dt){
  const e=F.e,p=F.p,ai=F.ai,c={left:false,right:false,jump:false,scratch:false,bite:false};
  const d=Math.abs(p.x-e.x),to=p.x>e.x?'right':'left',away=to==='right'?'left':'right';
  e.think-=dt;
  if(e.think<=0){
    e.think=ai.react*(.7+Math.random()*.6);
    const r=Math.random();
    if(p.atk&&d<42&&Math.random()<.15+LI*.09)e.plan=Math.random()<.5?'jump':'back';
    else if(d<27&&r<ai.bite)e.plan='bite';
    else if(d<38&&r<ai.aggr+ai.bite)e.plan='scratch';
    else if(d<38&&r<ai.aggr+ai.bite+.25)e.plan='back';
    else if(d>=38&&r<ai.jump)e.plan='jumpatk';
    else e.plan=d>=34?'approach':'wait';
  }
  switch(e.plan){
    case 'approach':c[to]=true;break;
    case 'back':c[away]=true;break;
    case 'scratch':c.scratch=true;e.plan='wait';break;
    case 'bite':c[to]=true;if(d<26){c.bite=true;e.plan='wait';}break;
    case 'jump':c.jump=true;e.plan='wait';break;
    case 'jumpatk':c.jump=true;c[to]=true;e.plan='airatk';break;
    case 'airatk':c[to]=true;if(e.y>24&&d<44){c.scratch=true;e.plan='wait';}if(e.y===0&&e.vy===0&&e.anim>0)e.plan='wait';break;
  }
  return c;
}
function updateFight(dt){
  const f=F;f.phaseT+=dt;f.shake=Math.max(0,f.shake-dt*2.5);f.flash=Math.max(0,f.flash-dt*2.2);
  [f.p,f.e].forEach(x=>{x.trail+=(x.hp-x.trail)*Math.min(1,dt*2.2);});
  f.fx.forEach(p=>{p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=260*dt;});f.fx=f.fx.filter(p=>p.t>0);
  f.cheers.forEach(p=>{p.t-=dt;p.y-=14*dt;});f.cheers=f.cheers.filter(p=>p.t>0);
  if(Math.random()<dt*(f.phase==='fatality'?6:1.2))fcheer();
  const pc={left:keys.left,right:keys.right,jump:f.in.jump,scratch:f.in.scratch,bite:f.in.bite};
  f.in={jump:false,scratch:false,bite:false};
  const none={};
  switch(f.phase){
    case 'intro':if(f.phaseT>2.1){f.phase='ready';f.phaseT=0;SFX.bell();}break;
    case 'ready':fighterStep(f.p,f.e,dt,none,1);fighterStep(f.e,f.p,dt,none,1);if(f.phaseT>1.1){f.phase='fight';f.phaseT=0;}break;
    case 'fight':
      f.time-=dt;
      fighterStep(f.p,f.e,dt,pc,1);fighterStep(f.e,f.p,dt,aiCtrl(dt),f.ai.dmg);
      {const dx=f.e.x-f.p.x;if(Math.abs(dx)<24&&Math.abs(f.e.y-f.p.y)<20){const push=(24-Math.abs(dx))/2*(dx>=0?1:-1);f.p.x=Math.max(22,Math.min(298,f.p.x-push));f.e.x=Math.max(22,Math.min(298,f.e.x+push));}}
      if(f.e.hp<=0){toFinish();}
      else if(f.p.hp<=0){f.phase='lose';f.phaseT=0;SFX.lose();}
      else if(f.time<=0){if(f.p.hp/f.p.max>=f.e.hp/f.e.max){f.e.hp=0;toFinish();}else{f.phase='lose';f.phaseT=0;SFX.lose();}}
      break;
    case 'finish':
      f.p.y=Math.max(0,f.p.y);fighterStep(f.p,f.e,dt,{left:pc.left,right:pc.right},1);
      if(pc.scratch||pc.bite){f.phase='fatality';f.phaseT=0;f.p.face=f.e.x>f.p.x?1:-1;SFX.power();}
      else if(f.phaseT>3.5){f.phase='ko';f.phaseT=0;}
      break;
    case 'fatality':{
      const t=f.phaseT,p=f.p,e=f.e;
      if(t>.4&&t<.75){p.x+=((e.x-p.face*26)-p.x)*Math.min(1,dt*14);p.atk={type:'scratch',t:.1,hit:true};}
      if(!f.fatHit&&t>=.75){f.fatHit=true;f.flash=1;f.shake=1.3;SFX.fatality();e.fly={vx:p.face*230,vy:330,rot:0};e.dizzy=false;sparks(e.x,GROUND-e.y-26,40,['#ffffff','#ff5c9d','#ffd23f','#5fe0b0']);if(ACC[e.key]&&ACC[e.key].includes('hat'))f.hatFly={x:e.x,y:GROUND-46,vx:-p.face*60,vy:-160,r:0};}
      if(e.fly){e.fly.vy-=GRAV*.6*dt;e.x+=e.fly.vx*dt;e.y+=e.fly.vy*dt;e.fly.rot+=dt*14*p.face;}
      if(f.hatFly){const h=f.hatFly;h.vy+=400*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.r+=dt*8;if(h.y>GROUND-6){h.y=GROUND-6;h.vy*=-.3;h.vx*=.6;}}
      if(t>1.1)p.atk=null;
      if(t>3.6)exitFight(true,true);
      break;}
    case 'ko':if(f.phaseT>1.9)exitFight(true,false);break;
    case 'lose':if(f.phaseT>2.3)exitFight(false,false);break;
  }
}
function toFinish(){const f=F;f.phase='finish';f.phaseT=0;f.e.hp=0;f.e.atk=null;f.e.hurt=0;f.e.dizzy=true;f.e.vx=0;f.p.atk=null;SFX.ko();
  hint.innerHTML='<b>ESPACIO</b><span>¡Rematalo! Apretá ESPACIO para el golpe final.</span>';}
function exitFight(win,fatal){
  const c=F.cat;F=null;state='play';musicMode='house';lastHint='';camSnap=true;
  if(win){c.state='fleeing';c.path=null;c.hp=0;c.moving=false;stats.fight++;if(fatal)stats.fatal++;say(c.x,c.y-20,fatal?'¡Nunca más!':'¡Me voy!','#ffd23f');SFX.meow();}
  else{c.hp=c.def.hp;player.stun=1.2;timeLeft=Math.max(1,timeLeft-8);say(player.x,player.y-24,'¡Perdiste! -8 s','#ff5c9d');}
  grabFocus();
}
/* dibujo de la pelea */
function fText(txt,x,y,size,col,out='#000'){ctx.font=size+'px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle=out;for(const [a,b] of [[-1,0],[1,0],[0,-1],[0,1],[1,1],[2,2]])ctx.fillText(txt,x+a*size/8,y+b*size/8);ctx.fillStyle=col;ctx.fillText(txt,x,y);ctx.textAlign='left';}
function drawFighter(fi){
  const s=fightSprites(fi.key),flip=fi.face<0,x=Math.round(fi.x-24),y=Math.round(GROUND-fi.y-46);
  const sh=Math.max(.3,1-fi.y/120);ctx.globalAlpha=.45;P(ctx,Math.round(fi.x-14*sh),GROUND-1,Math.round(28*sh),3,'#000');ctx.globalAlpha=1;
  const ko=(F.phase==='lose'&&fi===F.p&&F.phaseT>.2)||(F.phase==='ko'&&fi===F.e);
  if(fi.fly||ko){
    ctx.save();ctx.translate(fi.x,ko?GROUND-12:GROUND-fi.y-24);ctx.rotate(fi.fly?fi.fly.rot:-Math.PI/2*fi.face);
    if(!fi.face||fi.face>0)ctx.drawImage(s.hurt,-24,-24,48,48);else{ctx.scale(-1,1);ctx.drawImage(s.hurt,-24,-24,48,48);}
    ctx.restore();return;
  }
  let img;
  if(fi.hurt>0||fi.dizzy)img=s.hurt;
  else if(fi.atk)img=fi.atk.type==='bite'?s.bite:s.scratch;
  else if(fi.y>0)img=s.jump;
  else img=s.idle[Math.abs(fi.vx)>5?Math.floor(fi.anim*8)%2:Math.floor(fi.anim*2)%2];
  const wob=fi.dizzy?Math.round(Math.sin(clock*9)*2):0;
  const bob=(!fi.atk&&fi.y===0&&Math.abs(fi.vx)<5)?Math.round(Math.sin(fi.anim*5))*1:0;
  const dx=x+wob,dy=y+bob;
  if(flip){ctx.save();ctx.translate(dx+48,dy);ctx.scale(-1,1);ctx.drawImage(img,0,0,48,48);if(fi.hurt>.18){ctx.drawImage(s.white,0,0,48,48);}ctx.restore();}
  else{ctx.drawImage(img,dx,dy,48,48);if(fi.hurt>.18)ctx.drawImage(s.white,dx,dy,48,48);}
  if(!(F.phase==='fatality'&&fi===F.e&&F.fatHit))drawAcc(ctx,fi.key,'side',dx,dy,3,flip,clock);
  if(fi.atk&&(fi.atk.type==='scratch'||fi.atk.type==='jscratch')&&fi.atk.t>ATK[fi.atk.type].start*.5){
    const ax=fi.x+fi.face*26,ay=GROUND-fi.y-30;ctx.globalAlpha=.85;
    for(let i=0;i<3;i++)for(let k=0;k<7;k++)P(ctx,Math.round(ax+fi.face*(k*2-4)),Math.round(ay-8+i*6+k*2),2,1,i===1?'#ffd23f':'#ffffff');
    ctx.globalAlpha=1;
  }
  if(fi.dizzy)for(let i=0;i<3;i++){const a=clock*5+i*2.1;P(ctx,Math.round(fi.x+Math.cos(a)*14),Math.round(y-2+Math.sin(a)*4),3,3,'#ffd23f');}
}
function hpBar(x,y,w,fi,right,name){
  P(ctx,x-2,y-2,w+4,11,'#000');P(ctx,x,y,w,7,'#3a1020');
  const r=Math.max(0,fi.hp/fi.max),tr=Math.max(0,fi.trail/fi.max),col=r>.5?'#ffd23f':r>.25?'#ff9a3c':'#ff3b5c';
  const seg=(ratio,c)=>{const ww=Math.round(w*ratio);P(ctx,right?x+w-ww:x,y,ww,7,c);};
  seg(tr,'#ffffff');seg(r,col);P(ctx,x,y,w,1,'rgba(255,255,255,.3)');P(ctx,x,y+6,w,1,'rgba(0,0,0,.35)');
  ctx.font='6px "Press Start 2P"';ctx.textAlign=right?'right':'left';ctx.fillStyle='#000';ctx.fillText(name,(right?x+w:x)+1,y+18);ctx.fillStyle='#f4ead5';ctx.fillText(name,right?x+w:x,y+17);ctx.textAlign='left';
}
function renderFight(){
  const f=F,t=f.phaseT;
  let sx=0,sy=0;if(f.shake>0){sx=(Math.random()-.5)*f.shake*6;sy=(Math.random()-.5)*f.shake*6;}
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#07040f';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.setTransform(S,0,0,S,Math.round(sx*S),Math.round(sy*S));ctx.imageSmoothingEnabled=false;
  if(f.phase==='intro'){renderVS(t);return;}
  const bg=ctx.createLinearGradient(0,0,0,208);bg.addColorStop(0,'#06030d');bg.addColorStop(.62,'#1b0f36');bg.addColorStop(1,'#0c071d');ctx.fillStyle=bg;ctx.fillRect(-10,-10,340,228);
  for(let y=24;y<150;y+=8)for(let x=((y/8)%2)*8-8;x<320;x+=16)P(ctx,x,y,15,7,'rgba(70,45,120,.16)');
  const on=Math.sin(clock*23)>-.92;
  ctx.font='12px "Press Start 2P"';ctx.textAlign='center';ctx.shadowColor='#ff5c9d';ctx.shadowBlur=on?14*S:0;ctx.fillStyle=on?'#ffb0d0':'#4a2440';ctx.fillText('FIESTA',160,60);
  ctx.font='6px "Press Start 2P"';ctx.shadowColor='#5fe0b0';ctx.shadowBlur=8*S;ctx.fillStyle='#c8ffec';ctx.fillText('DEL BARRIO',160,73);ctx.shadowBlur=0;ctx.textAlign='left';
  for(let x=0;x<320;x+=12){const yy=Math.round(30+Math.sin((x%48)/48*Math.PI)*5),i=x/12;P(ctx,x,yy,12,1,'#1b1530');P(ctx,x+5,yy+1,2,2,garlandOn(i)?GARL[i%5]:'#3a2f5f');}
  P(ctx,159,0,1,9,'#6b6680');
  for(let dy=-8;dy<=8;dy++)for(let dx=-8;dx<=8;dx++){if(dx*dx+dy*dy>64)continue;P(ctx,160+dx,18+dy,1,1,((Math.floor((dx+8)/2)+Math.floor((dy+8)/2)+Math.floor(clock*6))&1)?'#d8dce8':'#7c8298');}
  P(ctx,156,13,2,2,'#ffffff');
  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){
    const ox=60+i*100,ang=Math.sin(clock*.7+i*2.1)*.55,tx=ox+Math.sin(ang)*190,col=['255,92,157','95,224,176','111,179,255'][i];
    const gr=ctx.createLinearGradient(ox,0,tx,GROUND);gr.addColorStop(0,`rgba(${col},.32)`);gr.addColorStop(1,`rgba(${col},.05)`);ctx.fillStyle=gr;
    ctx.beginPath();ctx.moveTo(ox-3,-4);ctx.lineTo(ox+3,-4);ctx.lineTo(tx+34,GROUND+4);ctx.lineTo(tx-34,GROUND+4);ctx.closePath();ctx.fill();
    const g2=ctx.createRadialGradient(tx,GROUND+2,0,tx,GROUND+2,40);g2.addColorStop(0,`rgba(${col},.35)`);g2.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g2;ctx.fillRect(tx-40,GROUND-20,80,44);
  }
  for(let i=0;i<46;i++){const a=i*2.39+clock*.55,rr=30+(i*37%150),x=160+Math.cos(a)*rr,y=18+Math.abs(Math.sin(a))*(20+(i*53%130));ctx.globalAlpha=.4+.4*Math.sin(clock*3+i);P(ctx,Math.round(x),Math.round(y),i%3?1:2,1,i%4?'#ffffff':GARL[i%5]);}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  const hype=f.phase==='fatality'||f.phase==='ko'?2:1;
  f.crowd.forEach((m,i)=>{
    const beat=Math.floor(clock*2.4*hype+m.seed*3),sp=darkSpr(m.key)[beat%2],flip=(beat>>1)%2===0,x=Math.round(m.x-16),y=Math.round(150-32+(beat%2?-2:0)-(i%2)*4);
    if(flip){ctx.save();ctx.translate(x+32,y);ctx.scale(-1,1);ctx.drawImage(sp,0,0,32,32);ctx.restore();}else ctx.drawImage(sp,x,y,32,32);
    ctx.globalAlpha=.55;drawAcc(ctx,m.key,'front',x,y,2,flip,clock+m.seed);ctx.globalAlpha=1;
  });
  P(ctx,0,150,320,58,'#140c28');
  for(let y=150;y<208;y+=8)for(let x=((y-150)/8%2)*16;x<320;x+=32)P(ctx,x,y,16,8,'#1c1236');
  P(ctx,0,150,320,1,'#ff5c9d');P(ctx,0,151,320,1,'rgba(255,92,157,.35)');
  if(f.phase==='fatality'){ctx.globalAlpha=Math.min(.72,t*1.8);P(ctx,-10,-10,340,228,'#000');ctx.globalAlpha=1;}
  drawFighter(f.e);drawFighter(f.p);
  if(f.hatFly){const h=f.hatFly,c=HATC[f.e.key]||['#ff5c9d','#ffd23f'];ctx.save();ctx.translate(h.x,h.y);ctx.rotate(h.r);P(ctx,-3,-6,6,3,c[0]);P(ctx,-5,-3,10,3,c[1]);P(ctx,-7,0,14,3,c[0]);P(ctx,-1,-9,3,3,'#ffffff');ctx.restore();}
  if(f.phase==='fatality'&&t>.7&&t<1.9){
    const k=Math.min(1,(t-.7)*5),a=t<1.5?1:1-(t-1.5)/.4;ctx.globalAlpha=Math.max(0,a);
    for(let i=0;i<3;i++){const x0=f.e.x-50+i*18,y0=40,len=150*k;ctx.lineCap='square';
      ctx.strokeStyle='#ff5c9d';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+len*.45,y0+len);ctx.stroke();
      ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+len*.45,y0+len);ctx.stroke();}
    ctx.globalAlpha=1;
  }
  f.fx.forEach(p=>{ctx.globalAlpha=Math.min(1,p.t*3);P(ctx,Math.round(p.x),Math.round(p.y),2,2,p.col);});ctx.globalAlpha=1;
  f.cheers.forEach(c=>{ctx.globalAlpha=Math.min(1,c.t*2);ctx.font=(c.big?7:5)+'px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#000';ctx.fillText(c.text,Math.round(c.x)+1,Math.round(c.y)+1);ctx.fillStyle=c.big?'#ffd23f':'#f4ead5';ctx.fillText(c.text,Math.round(c.x),Math.round(c.y));});
  ctx.globalAlpha=1;ctx.textAlign='left';
  hpBar(10,8,120,f.p,false,'CARBÓN');hpBar(190,8,120,f.e,true,TYPES[f.cat.key].name.toUpperCase());
  P(ctx,146,4,28,16,'#000');P(ctx,147,5,26,14,'#241a44');fText(String(Math.max(0,Math.ceil(f.time))),160,17,8,f.time<10?'#ff5c9d':'#f4ead5');
  ctx.font='5px "Press Start 2P"';ctx.textAlign='right';ctx.fillStyle='#a99cc9';ctx.fillText('RIVAL NIVEL',290,34);ctx.textAlign='left';
  for(let i=0;i<5;i++)P(ctx,292+i*5-0,29,4,4,i<=LI?'#ff5c9d':'#3a2f5f');
  if(f.phase==='ready')fText(f.phaseT<.55?'¿LISTOS?':'¡PELEA!',160,104,16,'#ffd23f');
  if(f.phase==='finish'){const b=Math.sin(clock*10)>0;fText('¡REMATALO!',160,92,14,b?'#ff5c9d':'#ffd23f');fText('ESPACIO',160,112,8,'#f4ead5');}
  if(f.phase==='fatality'&&t>1){const sc=1+Math.max(0,.4-(t-1))*2;fText('¡FATALITY',160,78,Math.round(14*sc),'#ff5c9d');fText('GATUNO!',160,100,Math.round(14*sc),'#ff5c9d');if(t>1.5)fText('GARRA SUPREMA DE CARBÓN',160,120,6,'#ffd23f');}
  if(f.phase==='ko')fText('K.O.',160,100,22,'#ffd23f');
  if(f.phase==='lose'){fText('K.O.',160,92,22,'#ff5c9d');if(f.phaseT>.8)fText('CARBÓN PERDIÓ LA PELEA',160,116,6,'#f4ead5');}
  if(f.phase==='fight'&&f.phaseT<3.5){ctx.globalAlpha=Math.min(1,(3.5-f.phaseT));fText('ESPACIO rasguño · ↑ salto · X mordida',160,200,5,'#f4ead5');ctx.globalAlpha=1;}
  if(f.flash>0){ctx.globalAlpha=f.flash;P(ctx,-10,-10,340,228,'#ffffff');ctx.globalAlpha=1;}
}
function renderVS(t){
  const k=Math.min(1,t*3.2);
  ctx.fillStyle='#3a0d2a';ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(178,-10);ctx.lineTo(142,218);ctx.lineTo(-10,218);ctx.fill();
  ctx.fillStyle='#0d1f4a';ctx.beginPath();ctx.moveTo(178,-10);ctx.lineTo(330,-10);ctx.lineTo(330,218);ctx.lineTo(142,218);ctx.fill();
  for(let i=0;i<14;i++){const y=((i*18+clock*90)%240)-20;P(ctx,0,Math.round(y),150,2,'rgba(255,92,157,.25)');P(ctx,170,Math.round(230-y),160,2,'rgba(111,179,255,.25)');}
  ctx.strokeStyle='#ffd23f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(178,-10);ctx.lineTo(142,218);ctx.stroke();
  const lx=Math.round(-90+k*112),rx=Math.round(330-k*132);
  ctx.drawImage(SPR.carbon.angry[0],lx,40,96,96);
  ctx.save();ctx.translate(rx+96,40);ctx.scale(-1,1);ctx.drawImage(SPR[F.e.key][TYPES[F.e.key].angry?'angry':'normal'][0],0,0,96,96);drawAcc(ctx,F.e.key,'front',0,0,6,false,0);ctx.restore();
  fText('CARBÓN',lx+48,156,9,'#ffd23f');fText(TYPES[F.e.key].name.toUpperCase(),rx+48,156,9,'#6fb3ff');
  if(t>.35){const sc=t<.55?1+(.55-t)*6:1;fText('VS',160,112,Math.round(26*sc),'#ffd23f','#7a1030');}
  if(t>.8){ctx.font='6px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#f4ead5';ctx.fillText('DIFICULTAD',160,180);ctx.textAlign='left';for(let i=0;i<5;i++)P(ctx,140+i*9,186,7,7,i<=LI?'#ff5c9d':'#3a2f5f');}
}

