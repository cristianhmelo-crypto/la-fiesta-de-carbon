/* ---------- el humano, la llegada y el escape ---------- */
let H=null,CINE=null,eproj=[],camShake=0,doorOpen=0,escapeT=0;
const THROWN=['lata','espina','queso','salchicha','carton','pollo','lana','globo'];
function drawHuman(h){
  const x=Math.round(h.x),y=Math.round(h.y),pose=h.pose||'walk',step=pose==='walk'&&h.moving?(Math.floor(clock*6)%2):0;
  const skin='#f1c9a0',skinD='#d9a57a',hair='#3a2414',shirt='#4f8a67',shirtD='#3c6e51',jean='#3b5bb0',jeanD='#2c4590',shoe='#2a2233',o='#140c1e';
  const R=[];const r=(a,b,w,hh,c)=>R.push([x+a,y+b,w,hh,c]);
  r(-9,-6-step,7,5,shoe);r(2,-6+step-(step?1:0),7,5,shoe);
  r(-8,-21-step,6,16,jean);r(2,-21+step-(step?1:0),6,16,jean);r(-3,-21,1,14,jeanD);r(2,-21,1,14,jeanD);
  r(-10,-24,20,3,'#5a3a22');r(-1,-24,2,3,'#d9a441');
  r(-11,-38,22,15,shirt);r(7,-38,4,15,shirtD);r(-4,-38,8,3,'#6fb088');r(-3,-35,1,6,shirtD);
  if(pose==='shock'){r(-15,-52,4,15,shirt);r(11,-52,4,15,shirtD);r(-15,-55,4,4,skin);r(11,-55,4,4,skin);}
  else if(pose==='broom'||pose==='sweep'){r(-14,-37,4,11,shirt);r(10,-37,4,11,shirtD);r(-14,-27,4,4,skin);r(10,-27,4,4,skin);}
  else if(pose==='tired'){r(-13,-34,4,12,shirt);r(9,-34,4,12,shirtD);r(-13,-23,4,3,skin);r(9,-23,4,3,skin);}
  else{r(-14,-37,4,12+step,shirt);r(10,-37,4,12+(1-step),shirtD);r(-14,-25+step,4,3,skin);r(10,-25+(1-step),4,3,skin);}
  r(-2,-40,4,3,skinD);
  const hy=pose==='tired'?2:0;
  r(-8,-53+hy,16,14,skin);r(5,-53+hy,3,14,skinD);r(-9,-56+hy,18,6,hair);r(-9,-51+hy,2,6,hair);r(7,-51+hy,2,5,hair);r(-6,-57+hy,10,2,hair);
  R.forEach(([a,b,w,hh])=>P(ctx,a-1,b-1,w+2,hh+2,o));
  R.forEach(([a,b,w,hh,c])=>P(ctx,a,b,w,hh,c));
  if(pose==='shock'){P(ctx,x-6,y-49,5,5,'#ffffff');P(ctx,x+1,y-49,5,5,'#ffffff');P(ctx,x-4,y-47,1,1,o);P(ctx,x+3,y-47,1,1,o);P(ctx,x-2,y-43,4,4,'#6a1a2a');P(ctx,x-1,y-42,2,1,'#ff7a9a');P(ctx,x-7,y-52,4,1,hair);P(ctx,x+3,y-52,4,1,hair);}
  else if(pose==='tired'){P(ctx,x-5,y-45,3,1,o);P(ctx,x+2,y-45,3,1,o);P(ctx,x-2,y-40,4,1,o);P(ctx,x+6,y-48,1,2,'#9fd8ff');P(ctx,x+6,y-46,2,2,'#9fd8ff');}
  else{const angry=pose==='sweep'||pose==='broom';P(ctx,x-5,y-47,2,3,o);P(ctx,x+3,y-47,2,3,o);if(angry){P(ctx,x-6,y-50,4,1,o);P(ctx,x+2,y-49,1,1,o);P(ctx,x+3,y-50,3,1,o);}P(ctx,x-2,y-42,4,1,o);}
  if(pose==='broom'||pose==='sweep'){
    const ang=pose==='sweep'?h.sweepAng:(h.face>0?.5:-.5)+Math.sin(clock*4)*.05;
    ctx.save();ctx.translate(x+(h.face>0?12:-12),y-25);ctx.rotate(ang);
    P(ctx,-1,-14,3,30,'#8a5a2a');P(ctx,0,-14,1,30,'#b07a48');
    P(ctx,-6,16,15,4,'#c9953e');P(ctx,-7,20,17,7,'#e0c070');for(let i=0;i<6;i++)P(ctx,-6+i*3,21,1,6,'#b09040');
    ctx.restore();
  }
}
function drawDoorOpen(){
  if(!doorOpen||!doorT)return;const X=doorT[0]*T,Y=doorT[1]*T,k=Math.min(1,doorOpen);
  P(ctx,X+2,Y,12,16,'#0c0816');P(ctx,X+2,Y+12,12,4,'#2a2233');
  ctx.globalAlpha=.9;P(ctx,X+2,Y,Math.round(12*(1-k))+2,16,'#7a4524');ctx.globalAlpha=1;
  P(ctx,X+13,Y-Math.round(10*k),3,Math.round(10*k)+2,'#7a4524');
}
function startArrival(){
  state='cine';for(const k in keys)keys[k]=false;timeLeft=0;
  CINE={type:'arrival',t:0,flags:{}};
  H={x:doorT[0]*T+8,y:ROWS*T+50,pose:'walk',face:1,moving:true};
  $('#hint').innerHTML='<b>¡UY!</b><span>Se escuchan unas llaves en la puerta...</span>';lastHint='';
}
function startEnding(){
  state='cine';for(const k in keys)keys[k]=false;eproj=[];
  CINE={type:'ending',t:0,flags:{},rep0:rep};
  H.pose='tired';H.moving=false;
  $('#hint').innerHTML='<b>FIN</b><span>Silencio en la casa...</span>';lastHint='';
}
function cineFocus(){
  if(!CINE)return null;
  if(CINE.type==='arrival')return[doorT[0]*T+8,(doorT[1]-2)*T];
  return[H.x,H.y-20];
}
function updateCine(dt){
  const c=CINE;c.t+=dt;const t=c.t,F1=n=>{if(c.flags[n])return false;c.flags[n]=true;return true;};
  if(c.type==='arrival'){
    if(t>.2&&F1('k1'))tone(2400,.06,'triangle',.05);if(t>.38&&F1('k2'))tone(2700,.05,'triangle',.05);if(t>.55&&F1('k3')){tone(2200,.07,'triangle',.05);noise(.08,.05,0,4000);}
    if(t>1&&F1('door')){tone(180,.8,'sawtooth',.04,-60);noise(.4,.03,0,600);}
    if(t>1)doorOpen=Math.min(1,doorOpen+dt*2.5);
    if(t>1.2&&t<2.4){const ty=(doorT[1]-1.2)*T+13;H.y+=(ty-H.y)*Math.min(1,dt*3);H.moving=true;if(Math.floor(t*6)!==Math.floor((t-dt)*6))tone(90,.05,'sine',.08);}
    if(t>2.4&&F1('shock')){H.pose='shock';H.moving=false;camShake=.5;SFX.lose();tone(400,.6,'sawtooth',.06,500);
      cats.forEach(k=>{if(k.state!=='gone'){k.state=k.state==='boxed'?'boxed':'wander';k.scared=1.5;k.wait=9;k.moving=false;snapCat(k);}});}
    cats.forEach(k=>{if(k.scared>0)k.scared-=dt;});
    if(t>5.2&&F1('go')){startEscapeFromArrival();}
  }else{
    if(t>2&&t<4.5){rep=Math.max(0,c.rep0*(1-(t-2)/2.5));}
    if(t>4.5&&F1('card'))escapeCard();
  }
}
function drawCineOverlay(){
  const c=CINE;if(!c)return;const t=c.t;
  ctx.setTransform(S,0,0,S,0,0);
  const bh=Math.round(20*Math.min(1,t*3));P(ctx,0,0,COLS*T,bh,'#000');P(ctx,0,ROWS*T-bh,COLS*T,bh,'#000');
  if(c.type==='arrival'){
    if(t>.25&&t<1.6){ctx.globalAlpha=Math.min(1,(1.6-t)*3);fText('clic... clic...',160,14,6,'#f4ead5');ctx.globalAlpha=1;}
    if(t>2.5&&t<5){const k=Math.min(1,(t-2.5)*4);ctx.globalAlpha=k;P(ctx,40,34,240,26,'#ffffff');P(ctx,40,34,240,2,'#000');P(ctx,40,58,240,2,'#000');P(ctx,40,34,2,26,'#000');P(ctx,278,34,2,26,'#000');
      fText('¡¿QUÉ PASÓ ACÁ?!',160,52,11,'#ff5c9d','#1b1530');ctx.globalAlpha=1;}
    if(t>3.6){const k=Math.min(1,(t-3.6)/.2),sc=1+(1-k)*1.5;ctx.save();ctx.translate(160,ROWS*T-26);ctx.scale(sc,sc);fText('¡LLEGÓ TU HUMANO!',0,4,12,'#ffd23f');ctx.restore();}
    if(t>4.7){ctx.globalAlpha=Math.min(1,(t-4.7)*2);P(ctx,0,0,COLS*T,ROWS*T,'#000');ctx.globalAlpha=1;}
  }else{
    if(t>.6){ctx.globalAlpha=Math.min(1,(t-.6)*2);fText('SOBREVIVISTE',160,40,14,'#5fe0b0');ctx.globalAlpha=1;}
    if(t>2){ctx.globalAlpha=Math.min(1,(t-2)*2);fText('...pero el barrio se enteró de todo.',160,ROWS*T-26,6,'#f4ead5');fText('PRESTIGIO: '+Math.round(rep),160,ROWS*T-12,8,rep>40?'#ffd23f':'#ff5c9d');ctx.globalAlpha=1;}
  }
}
/* ---------- nivel de escape ---------- */
function escapeInit(){
  musicMode='fight';doorOpen=1;eproj=[];escapeT=0;
  if(!H)H={};Object.assign(H,{x:doorT[0]*T+8,y:(doorT[1]-2)*T+13,pose:'broom',face:1,moving:false,cd:3,warn:0,sweep:0,sweepAng:0,zone:null});
  player.hp=3;player.inv=1.5;player.jumpT=0;player.jumpCd=0;player.held=null;player.busy=null;
  const alive=cats.filter(c=>c.state!=='gone');
  alive.forEach((c,i)=>{c.state='panic';c.moving=false;c.exitAt=4+i*(lv.time-10)/Math.max(1,alive.length)+Math.random()*3;c.throwT=1.5+Math.random()*3;c.warnThrow=false;c.scared=0;c.wait=0;});
}
function startEscapeFromArrival(){
  LI=6;lv=LEVELS[6];progress.unlocked=Math.max(progress.unlocked,7);saveProgress();
  timeLeft=lv.time;CINE=null;H.pose='broom';
  state='intro';hLevel.textContent='NIVEL 7 · '+lv.name.toUpperCase();
  show(`<div class="card">
    <p class="eyebrow">NIVEL 7 DE ${LEVELS.length}</p>
    <h2>${lv.name}</h2>
    <p>${lv.story}</p>
    <p class="tip">${lv.tip}</p>
    <p class="facts">Aguantá ${fmt(lv.time)} · 3 vidas · ESPACIO: saltar</p>
    <div class="row"><button class="btn" data-act="escbegin">¡A esquivar!</button></div>
  </div>`);
}
function hitPlayer(dx,dy){
  const p=player;if(p.inv>0)return;
  p.hp--;p.inv=1.4;camShake=.4;SFX.hurt();say(p.x,p.y-24,p.hp>0?'¡Auch!':'¡NOOO!','#ff5c9d');puff(p.x,p.y-6,'#ffffff',8);
  const n=Math.hypot(dx,dy)||1;for(let i=0;i<10;i++){const nx=p.x+dx/n*1.2,ny=p.y+dy/n*1.2;if(!blockedForPlayer(Math.floor(nx/T),Math.floor((ny-2)/T))){p.x=nx;p.y=ny;}}
  if(p.hp<=0){state='lose';SFX.lose();setTimeout(loseEscape,600);}
}
function throwFrom(c){
  const aim=Math.random()<.6,sp=95+Math.random()*50+LI*4;let ax,ay;
  if(aim){ax=player.x-c.x+(Math.random()-.5)*20;ay=(player.y-6)-(c.y-6)+(Math.random()-.5)*20;}else{const a=Math.random()*Math.PI*2;ax=Math.cos(a);ay=Math.sin(a);}
  const n=Math.hypot(ax,ay)||1;
  eproj.push({x:c.x,y:c.y-6,vx:ax/n*sp,vy:ay/n*sp,type:THROWN[Math.floor(Math.random()*THROWN.length)],t:0,rot:0});
  SFX.swish();
}
function updateEscape(dt){
  escapeT+=dt;timeLeft-=dt;
  if(timeLeft<=0){timeLeft=0;cats.forEach(c=>{if(c.state!=='gone')c.state='gone';});startEnding();return;}
  const p=player;
  p.inv=Math.max(0,p.inv-dt);p.jumpT=Math.max(0,p.jumpT-dt);p.jumpCd=Math.max(0,p.jumpCd-dt);
  updatePlayer(dt);
  /* humano con escoba */
  const dx=p.x-H.x,dy=p.y-H.y,d=Math.hypot(dx,dy)||1;H.face=dx>=0?1:-1;
  if(H.sweep>0){H.sweep-=dt;H.pose='sweep';H.sweepAng=(H.face>0?1:-1)*(-1.2+(1-H.sweep/.28)*2.6);
    if(!H.hitDone){const z=H.zone;if(p.x>z.x&&p.x<z.x+z.w&&p.y-4>z.y&&p.y-4<z.y+z.h){H.hitDone=true;hitPlayer(z.dx,z.dy);}
      cats.forEach(c=>{if(c.state==='panic'&&c.x>z.x&&c.x<z.x+z.w&&c.y>z.y&&c.y<z.y+z.h&&Math.random()<.05)say(c.x,c.y-20,'¡MIAU!','#ffd23f');});}
    if(H.sweep<=0){H.zone=null;H.cd=2.6-Math.min(1,escapeT/40);}}
  else if(H.warn>0){H.warn-=dt;H.pose='broom';if(H.warn<=0){H.sweep=.28;H.hitDone=false;SFX.swish();noise(.2,.08,0,900);}}
  else{
    H.cd-=dt;H.pose='broom';
    const sp=24+escapeT*.35,mx=dx/d*sp*dt,my=dy/d*sp*dt,hb=(x,y)=>blockedForPlayer(Math.floor((x-6)/T),Math.floor((y-2)/T))||blockedForPlayer(Math.floor((x+6)/T),Math.floor((y-2)/T));
    if(d>20){if(!hb(H.x+mx,H.y))H.x+=mx;if(!hb(H.x,H.y+my))H.y+=my;H.moving=true;}else H.moving=false;
    if(H.cd<=0&&d<80){H.warn=.75;const ux=Math.abs(dx)>Math.abs(dy)?Math.sign(dx):0,uy=ux?0:Math.sign(dy);
      const w=ux?50:34,hh=ux?26:40,cx=H.x+ux*30,cy=H.y-10+uy*30;H.zone={x:cx-w/2,y:cy-hh/2,w,h:hh,dx:ux||dx,dy:uy||dy};tone(300,.3,'square',.04,-100);}
  }
  /* objetos voladores */
  eproj.forEach(o=>{o.t+=dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.rot+=dt*12;
    if(SOLID.has(tileAt(Math.floor(o.x/T),Math.floor(o.y/T)))&&o.t>.08){o.dead=true;puff(o.x,o.y,'#c9c2dd',5);}
    if(!o.dead&&p.jumpT<=0&&Math.hypot(o.x-p.x,o.y-(p.y-6))<9){o.dead=true;hitPlayer(o.vx,o.vy);}
    if(o.t>3)o.dead=true;});
  eproj=eproj.filter(o=>!o.dead);
  /* gatos en pánico */
  cats.forEach(c=>{
    if(c.state!=='panic')return;
    if(escapeT>=c.exitAt){c.state='leaving';c.path=null;return;}
    c.throwT-=dt;c.warnThrow=c.throwT<.45;
    if(c.throwT<=0){throwFrom(c);c.throwT=Math.max(1.4,3.4-escapeT*.03)+Math.random()*2.2;}
  });
  camShake=Math.max(0,camShake-dt);
}
function jumpEscape(){const p=player;if(p.jumpCd>0||p.jumpT>0)return;p.jumpT=.45;p.jumpCd=.75;SFX.jump();}
function escapeCard(){
  state='win';SFX.win();
  progress.stars[6]=Math.max(progress.stars[6]||0,player.hp>=3?3:player.hp===2?2:1);saveProgress();
  show(`<div class="card">
    <p class="eyebrow">NIVEL 7 SUPERADO</p>
    <h2>Carbón perdió todo su prestigio</h2>
    <div class="stars">${'★'.repeat(progress.stars[6])}<span class="off">${'★'.repeat(3-progress.stars[6])}</span></div>
    <p>Sobreviviste a la escoba, pero todo el barrio vio a los invitados salir corriendo. Ya nadie habla del gato más popular: ahora sos el gato de la fiesta del desastre.</p>
    <p class="tip"><b>Próximamente: LA MEGA FIESTA.</b> Recuperá tu prestigio con la fiesta más grande que vio el barrio.</p>
    <div class="row"><button class="btn ghost" data-act="retry">Repetir</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}
function loseEscape(){
  show(`<div class="card">
    <p class="eyebrow">TE ATRAPARON</p>
    <h2>Tu humano te agarró de la nuca</h2>
    <p>Directo a la cucha y sin cena. Los gatos del barrio se escaparon sin vos.</p>
    <p class="tip">Saltá con ESPACIO cuando veas un «!» sobre un gato: lo que tira pasa por abajo. A la escoba la esquivás moviéndote fuera de la zona roja.</p>
    <div class="row"><button class="btn" data-act="retry">Intentar de nuevo</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}
