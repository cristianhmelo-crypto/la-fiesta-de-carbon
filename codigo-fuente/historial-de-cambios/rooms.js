/* ---------- tareas de cada cuarto ---------- */
let bedMade=true,bedPillows=2,tvOn=true,pics=[],flys=[],groupDone={},TILES={},winTiles=[],lampsOff=new Set(),musicLvl=0,MV=1,milkGiven=0,milkNeed=0,loveEnd=false;
function tilesOf(ch){return TILES[ch]||[];}
function pickParty(){const a=lv.partyMess||MESS_KEYS;return a[Math.floor(Math.random()*a.length)];}
function destOf(t){const d=MESS[t].dest;return d==='bin'&&lv&&lv.trash?lv.trash:d;}
function destTiles(d){return d==='fridge'?fridges:d==='bin'?bins:d==='window'?winTiles:d==='bed'?tilesOf('B'):d==='sink'?tilesOf('W'):d==='shelf'?tilesOf('E'):d==='tub'?tilesOf('U'):d==='tv'?tilesOf('V'):[];}
function destWhere(d){return{fridge:'va en la heladera',bin:lv&&lv.bath?'va al cesto':'va al tacho verde',window:'va afuera, por la ventana',bed:'va en la cama',sink:'va en la pileta',shelf:'va en el botiquín',tub:'va en la bañera',tv:'va junto a la tele',cucha:'va en tu cucha'}[d]||'';}
function destPut(d,n){return{fridge:'Guardar '+n+' en la heladera',bin:'Tirar '+n+(lv.bath?' al cesto':' al tacho'),window:'Tirar '+n+' por la ventana',bed:'Poner '+n+' en la cama',sink:'Dejar '+n+' en la pileta',shelf:'Guardar '+n+' en el botiquín',tub:'Poner '+n+' en la bañera',tv:'Dejar '+n+' junto a la tele'}[d];}
function destRange(d){return d==='window'?15:d==='bed'?12:11;}
function wrongDest(dk){
  for(const o of ['fridge','bin','window','sink','shelf','tub','bed','tv']){
    if(o===dk)continue;if(o==='window'&&lv.trash!=='window')continue;if(o==='bed'&&!(lv.chores&&lv.chores.bed))continue;
    const w=nearestTileOf(destTiles(o),o==='window'?12:10);if(w)return w;
  }
  return null;
}
function deliver(t,dk,at){
  stats.cleaned++;markDone(t);const x=at.x*T+8,y=at.y*T;
  if(dk==='fridge'){SFX.fridge();puff(x,y+10,'#cfe8ff',8);}
  else if(dk==='window'){SFX.swish();tone(700,.25,'square',.03,-500,.05);flys.push({type:t,x0:player.x,y0:player.y-12,x1:x,y1:y+4,t:0});say(x,y+22,'¡Afuera!','#5fe0b0');}
  else if(dk==='bed'){bedPillows++;SFX.pick();puff(x,y+8,'#ffffff',8);}
  else if(dk==='tv'){tvOn=true;SFX.fish();tone(1760,.12,'square',.03,0,.1);say(x+8,y-4,'¡Tele encendida!','#ffd23f');}
  else if(dk==='sink'){SFX.clean();tone(1500,.05,'triangle',.04,0,.06);puff(x,y+4,'#bfe3ff',8);}
  else if(dk==='tub'){noise(.2,.04,0,2000);puff(x,y+6,'#ffffff',10);say(x,y,'¡Cuac!','#ffd23f');}
  else if(dk==='shelf'){SFX.fridge();puff(x,y+6,'#dff2ff',8);}
  else{SFX.trash();puff(x,y+4,'#9be7b8',8);}
  if(dk!=='tv'&&dk!=='tub'&&dk!=='window')say(x,y,'+10','#5fe0b0');
}
function groupOf(t){const m=MESS[t];return m.carry?destOf(t):'v:'+m.verb;}
function markDone(t){const g=groupOf(t);groupDone[g]=(groupDone[g]||0)+1;}
function choresDone(){return(lv&&lv.chores&&lv.chores.bed&&bedMade?1:0)+pics.filter(p=>!p.crooked).length;}
function tasksLeft(){
  if(!lv||!items)return 0;
  return items.filter(i=>i.kind==='mess').length+(player&&player.held&&player.held.kind==='mess'?1:0)+hidden.filter(h=>h.chore).length+(bedMade?0:1)+pics.filter(p=>p.crooked).length;
}
function groupLabel(g){
  if(g==='bin')return lv.bath?'Basura al cesto':'Basura al tacho';
  if(g==='tv')return hidden.some(h=>h.chore&&h.type==='control')?'Encontrar el control de la tele (está escondido en algún mueble)':'Llevar el control a la tele';
  return{fridge:'Comida a la heladera',sink:'Platos y vasos a la pileta',window:'Tirar la mugre por la ventana',bed:'Almohadas a la cama',shelf:'Cosas del baño al botiquín',tub:'El patito a la bañera',cucha:'Tu ratón a tu cucha','v:Secar':'Secar los charcos','v:Barrer':'Barrer el confeti','v:Acomodar':'Acomodar las macetas','v:Enrollar':'Enrollar el papel higiénico','v:Limpiar':'Limpiar la espuma'}[g]||g;
}
function choreRows(){
  if(!lv||lv.dance||lv.escape||lv.impossible)return[];
  if(lv.love)return[{label:'Subir la música',done:musicLvl,tot:3},{label:'Apagar las luces',done:lampsOff.size,tot:tilesOf('L').length},{label:'Llevarle leche a cada invitado',done:milkGiven,tot:milkNeed}];
  const G={},add=t=>{const g=groupOf(t);G[g]=(G[g]||0)+1;};
  items.forEach(i=>{if(i.kind==='mess')add(i.type);});if(player&&player.held&&player.held.kind==='mess')add(player.held.type);
  hidden.forEach(h=>{if(h.chore)add(h.type);});
  const rows=[];
  if(lv.chores&&lv.chores.bed)rows.push({label:'Tender la cama',done:bedMade?1:0,tot:1});
  if(pics.length)rows.push({label:'Enderezar los cuadros',done:pics.filter(p=>!p.crooked).length,tot:pics.length});
  [...new Set([...Object.keys(G),...Object.keys(groupDone)])].forEach(g=>{const done=groupDone[g]||0;rows.push({label:groupLabel(g),done,tot:done+(G[g]||0)});});
  return rows;
}
function choreHTML(list){
  choreRows().forEach(r=>{const ok=r.done>=r.tot;list.push(`<span class="q ${ok?'ok':'task'}">${ok?'✓ ':''}${r.label}${r.tot>1?` <b>${r.done}/${r.tot}</b>`:''}</span>`);});
}
function bedBox(){const B=tilesOf('B');if(!B.length)return null;const xs=B.map(b=>b[0]),ys=B.map(b=>b[1]),x0=Math.min(...xs),y0=Math.min(...ys);return{x:x0*T,y:y0*T,w:(Math.max(...xs)-x0+1)*T,h:(Math.max(...ys)-y0+1)*T};}
function initChores(){
  const ch=lv.chores||{};
  bedMade=!ch.bed;bedPillows=ch.bed?0:2;tvOn=!ch.remote;groupDone={};flys=[];lampsOff=new Set();musicLvl=0;milkGiven=0;milkNeed=0;loveEnd=false;DZ=null;
  TILES={};for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const c=map[y][x];(TILES[c]=TILES[c]||[]).push([x,y]);}
  winTiles=[];for(let x=0;x<COLS;x++)if(windowAt(map,x))winTiles.push([x,0]);
  pics=(ch.pics||[]).map((x,i)=>({x,crooked:true,ang:(i%2?1:-1)*(.3+Math.random()*.15),art:i%3}));
  if(ch.remote&&hideGroups.length){const pool=hideGroups.filter(g=>g.ch!=='B'&&g.ch!=='V'),src=pool.length?pool:hideGroups;hidden.push({g:src[Math.floor(Math.random()*src.length)],type:'control',owner:null,chore:true});}
  if(lv.love){
    cats.forEach(c=>{c.pctNeed=0;c.thirsty=c.key!=='perla';});milkNeed=cats.filter(c=>c.thirsty).length;
    const pc=cats.find(c=>c.key==='perla');if(pc){pc.tx=doorT[0]+1;pc.ty=doorT[1]-1;pc.x=pc.tx*T+8;pc.y=pc.ty*T+13;pc.known=true;pc.wait=2;}
  }
}
function nearChore(){
  let best=null;const cand=(d,a)=>{if(!best||d<best.d){a.d=d;best=a;}};
  if(!bedMade){const b=nearestTileOf(tilesOf('B'),12);if(b)cand(b.d,{label:'Tender la cama',tx:b.x*T+8,ty:b.y*T,run:()=>{player.busy={t:0,dur:1.3,fn:()=>{bedMade=true;const bb=bedBox();SFX.win();puff(bb.x+bb.w/2,bb.y+bb.h/2,'#9fb3ff',14);say(bb.x+bb.w/2,bb.y+14,'¡Cama tendida!','#5fe0b0');}};SFX.clean();}});}
  pics.forEach(pc=>{if(!pc.crooked)return;const d=tileDist(pc.x,0);if(d<=14)cand(d,{label:'Enderezar el cuadro',tx:pc.x*T+8,ty:12,run:()=>{player.busy={t:0,dur:.6,fn:()=>{pc.crooked=false;SFX.pick();puff(pc.x*T+8,8,'#ffd23f',6);say(pc.x*T+8,26,'¡Derechito!','#5fe0b0');}};SFX.clean();}});});
  if(lv.love){
    const m=nearestTileOf(tilesOf('M'),12);
    if(m&&musicLvl<3)cand(m.d,{label:'Subir la música (volumen '+(musicLvl+1)+' de 3)',tx:m.x*T+8,ty:m.y*T,run:()=>{musicLvl++;SFX.power();camShake=.25;for(let i=0;i<6;i++)addNote(m.x*T+Math.random()*16,m.y*T-2);say(m.x*T+8,m.y*T-6,['¡Más fuerte!','¡Subila!','¡A TODO VOLUMEN!'][musicLvl-1],'#ff5c9d');}});
    tilesOf('L').forEach(([x,y])=>{if(lampsOff.has(x+','+y))return;const d=tileDist(x,y);if(d<=12)cand(d,{label:'Apagar la lámpara',tx:x*T+8,ty:y*T,run:()=>{lampsOff.add(x+','+y);tone(1800,.03,'square',.04);tone(900,.05,'square',.03,0,.04);say(x*T+8,y*T-4,'¡Clic!','#c77dff');}});});
  }
  return best;
}
function drawPillow(px,py){P(ctx,px,py+1,18,7,'#fbfaff');P(ctx,px+1,py,16,1,'#fbfaff');P(ctx,px,py+7,18,1,'#cfcadf');P(ctx,px+2,py+2,6,2,'#ffffff');P(ctx,px+17,py+2,1,5,'#dcd7ea');P(ctx,px+1,py+8,17,1,'rgba(20,10,40,.25)');}
function drawChores(){
  if(!lv)return;
  if(lv.chores&&lv.chores.bed){const b=bedBox();if(b){
    if(!bedMade){
      const X=b.x,Y=b.y+11,W=b.w,Hh=b.h-11;
      P(ctx,X,Y,W,Hh,'#e6e2f2');for(let i=0;i<6;i++)P(ctx,X+3+i*7,Y+4+(i%3)*7,5,1,'#c9c4dc');
      const lump=(x,y,w,h)=>{P(ctx,X+x,Y+y,w,h,'#4a67c9');P(ctx,X+x+1,Y+y,w-2,1,'#6f8ae3');P(ctx,X+x,Y+y+h-1,w,1,'#2c3f86');P(ctx,X+x+2,Y+y+2,3,1,'#6f8ae3');P(ctx,X+x+w-4,Y+y+3,1,h-5,'#3b55ad');};
      lump(20,14,28,16);lump(6,26,24,14);lump(22,32,26,18);lump(30,6,18,10);
      P(ctx,X+W-1,Y+18,7,26,'#4a67c9');P(ctx,X+W,Y+18,5,1,'#6f8ae3');P(ctx,X+W+5,Y+18,1,26,'#2c3f86');P(ctx,X+W-1,Y+44,7,2,'#2c3f86');
      P(ctx,X-5,Y+30,7,12,'#e6e2f2');P(ctx,X-5,Y+41,7,1,'#b8b4c8');P(ctx,X-5,Y+30,1,12,'#cfcadf');
    }else{P(ctx,b.x+1,b.y+19,b.w-2,3,'#f4f2fb');P(ctx,b.x+1,b.y+22,b.w-2,1,'#b8b4c8');}
    [[4,3],[26,3],[15,5]].slice(0,Math.min(3,bedPillows)).forEach(([dx,dy])=>drawPillow(b.x+dx,b.y+dy));
  }}
  pics.forEach(pc=>{
    const cx=pc.x*T+8,cy=6.5;ctx.save();ctx.translate(cx,cy);if(pc.crooked)ctx.rotate(pc.ang+Math.sin(clock*2+pc.x)*.03);
    P(ctx,-6,-4,13,10,'#c9953e');P(ctx,-6,-4,13,1,'#f0cf7a');P(ctx,-6,5,13,1,'#8a6020');
    if(pc.art===0){P(ctx,-5,-3,11,8,'#ff9e7a');P(ctx,-5,-3,11,3,'#c77dff');P(ctx,-5,1,11,4,'#3fa35a');P(ctx,1,-2,3,3,'#ffd23f');}
    else if(pc.art===1){P(ctx,-5,-3,11,8,'#6fb3ff');P(ctx,-3,0,6,3,'#f4f4f8');P(ctx,3,-1,2,5,'#f4f4f8');P(ctx,-2,1,1,1,'#1b1530');P(ctx,-5,3,11,2,'#4f8ad9');}
    else{P(ctx,-5,-3,11,8,'#f4ead5');P(ctx,-3,-1,7,5,'#251d37');P(ctx,-3,-2,1,1,'#251d37');P(ctx,3,-2,1,1,'#251d37');P(ctx,-2,0,1,1,'#ffd23f');P(ctx,2,0,1,1,'#ffd23f');P(ctx,0,2,1,1,'#e0708f');}
    ctx.restore();
    if(pc.crooked&&state==='play'&&Math.floor(clock*2+pc.x)%4===0)P(ctx,cx+7,1,1,3,'#ffd23f');
  });
  if(lv.wake){const cx=7*T+8,cy=6;P(ctx,cx-3,cy-5,7,11,'#c9953e');P(ctx,cx-5,cy-3,11,7,'#c9953e');P(ctx,cx-3,cy-4,7,9,'#f4ead5');P(ctx,cx-4,cy-3,9,7,'#f4ead5');
    P(ctx,cx,cy-3,1,3,'#1b1530');P(ctx,cx-1,cy-3,1,1,'#1b1530');P(ctx,cx-2,cy+1,2,1,'#1b1530');P(ctx,cx,cy,1,1,'#1b1530');
    const a=clock*1.2;P(ctx,cx+Math.round(Math.cos(a)*3),cy+Math.round(Math.sin(a)*3),1,1,'#e2344f');}
  const V=tilesOf('V');if(V.length){const [vx,vy]=V.reduce((m,v)=>v[0]<m[0]?v:m,V[0]),X=vx*T,Y=vy*T;
    if(tvOn){const k=Math.floor(clock*2)%4,bgc=['#2a4a8a','#8a2a6a','#2a7a5a','#8a6a2a'][k];P(ctx,X+4,Y-5,24,10,bgc);P(ctx,X+4,Y-5,24,1,'rgba(255,255,255,.25)');
      const fx=X+6+Math.round((Math.sin(clock*2)+1)*8);P(ctx,fx,Y-2,6,3,'#f4f4f8');P(ctx,fx+6,Y-3,2,5,'#f4f4f8');P(ctx,fx+1,Y-1,1,1,'#1b1530');
      P(ctx,X+20,Y-4,5,4,'#251d37');P(ctx,X+20,Y-5,1,1,'#251d37');P(ctx,X+24,Y-5,1,1,'#251d37');P(ctx,X+21,Y-3,1,1,'#ffd23f');P(ctx,X+23,Y-3,1,1,'#ffd23f');}
    else{for(let i=0;i<14;i++)P(ctx,X+5+Math.floor(Math.random()*22),Y-4+Math.floor(Math.random()*8),1,1,Math.random()<.5?'#3a5070':'#2a3a54');}}
  const U=tilesOf('U');if(U.length&&groupDone.tub){const [ux,uy]=U[Math.min(U.length-1,1)],bx=ux*T+2,by=uy*T+4+Math.round(Math.sin(clock*3));
    P(ctx,bx+1,by+3,8,4,'#ffd23f');P(ctx,bx+5,by,4,4,'#ffd23f');P(ctx,bx+9,by+2,2,1,'#ff8a2a');P(ctx,bx+7,by+1,1,1,'#1b1530');P(ctx,bx+1,by+6,8,1,'#d9a820');}
  if(lv.love){
    const beat=Math.abs(Math.sin(clock*Math.PI*(118+musicLvl*6)/60)),k=musicLvl?Math.round(beat*Math.min(2,musicLvl)):0;
    tilesOf('M').forEach(([x,y])=>{const X=x*T,Y=y*T;P(ctx,X+4-k,Y+3-k,8+k*2,6+k*2,'#3a3048');P(ctx,X+5-k,Y+4-k,6+k*2,4+k*2,'#15101f');P(ctx,X+7,Y+5,2,2,musicLvl?GARL[(Math.floor(clock*4)+x)%5]:'#4a3f5a');
      for(let i=0;i<3;i++)P(ctx,X+3+i*4,Y+15,3,1,i<musicLvl?'#5fe0b0':'#3a2f5f');
      if(musicLvl&&state==='play'&&Math.random()<.015*musicLvl)addNote(X+4+Math.random()*8,Y-2);});
    tilesOf('L').forEach(([x,y])=>{if(!lampsOff.has(x+','+y))return;const X=x*T,Y=y*T;P(ctx,X+5,Y,6,1,'#5a4a3a');P(ctx,X+4,Y+1,8,3,'#5a4a3a');P(ctx,X+3,Y+4,10,2,'#4a3a2e');P(ctx,X+4,Y+1,2,4,'#6a5a48');});
  }
}
function drawChoresTop(){
  flys.forEach(f=>{const k=Math.min(1,f.t/.45),x=f.x0+(f.x1-f.x0)*k,y=f.y0+(f.y1-f.y0)*k-Math.sin(k*Math.PI)*18;ctx.globalAlpha=Math.max(0,1-Math.max(0,(k-.75)*4));ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(k*9);ctx.drawImage(itemSpr(f.type),-8,-8);ctx.restore();ctx.globalAlpha=1;});
  if(lv&&lv.love&&state!=='talk')cats.forEach(c=>{if(c.thirsty&&c.state!=='gone')drawEmote('drop',Math.round(c.x),Math.round(c.y-17+Math.sin(clock*4+c.seed)),1);});
}

/* ---------- el amor: la fiesta con Perla ---------- */
function partyPct(){const nL=tilesOf('L').length||1;return Math.min(100,musicLvl/3*30+lampsOff.size/nL*30+(milkNeed?milkGiven/milkNeed:1)*40);}
function giveMilk(c){
  player.held=null;c.thirsty=false;c.milk=true;milkGiven++;stats.nice++;SFX.meow();puff(c.x,c.y-8,'#ff9ec4',10);snapCat(c);c.wait=3;
  say(c.x,c.y-22,['¡Gracias, Carbón!','¡Salud!','¡Leche fresquita!','¡Qué fiestón!'][Math.floor(Math.random()*4)],'#5fe0b0');
}
function updateLove(dt){
  if(!loveEnd&&partyPct()>=100){loveEnd=true;say(player.x,player.y-26,'¡LA MEJOR FIESTA!','#ff5c9d');SFX.win();setTimeout(()=>{if(state==='play'&&lv&&lv.love)loveFinale();},900);}
}
function loveIntro(){
  const pc=cats.find(c=>c.key==='perla');if(!pc)return;beginTalk(pc);
  talkLines([
    {who:'carbon',mood:'happy',text:'Listo. La casa quedó impecable y todos se fueron. Ahora, a descansar un rato...'},
    {who:'cat',text:'Hola, Carbón. ¿Ya terminó la fiesta? Yo recién llego... y traje a unas amigas.'},
    {who:'carbon',mood:'love',text:'¿P-Perla? ¿Vos acá? ¡No! Digo... ¡la fiesta recién empieza!'},
    {who:'cat',mood:'happy',text:'¡Qué bueno! Me dijeron que sos el mejor anfitrión del barrio. Quiero ver la mejor fiesta de todas.'},
    {who:'carbon',mood:'love',text:'(Adiós, casa ordenada...) ¡Ya vas a ver! Música fuerte, luces bajas y leche para todos.'}
  ],()=>{closeTalk();say(player.x,player.y-24,'¡A armar la mejor fiesta!','#ff5c9d');});
}
function loveGreeting(c){
  const p=Math.round(partyPct());
  if(c.key==='perla')return p<35?'Mmm... esto está muy tranquilo, Carbón. ¿Esto es una fiesta?':p<70?'¡Ahora sí se está poniendo linda! Pero todavía falta algo...':'¡Esta fiesta es increíble! Casi, casi perfecta.';
  if(c.thirsty)return['¡Carbón! ¿No hay nada para tomar en esta fiesta?','Tengo la garganta seca de tanto bailar. ¿Hay leche?','¿Me traés una leche de la heladera? ¡Porfi!'][Math.floor(c.seed)%3];
  return['¡Gracias por la leche! ¡Qué fiestón!','¡Esta fiesta va a quedar en la historia!','¡Subí la música, Carbón!'][Math.floor(c.seed)%3];
}
function loveMenu(c){
  const o=[];
  if(player.held&&player.held.kind==='milk'&&c.thirsty)o.push({label:'Darle leche',run:()=>talkLines([{who:'carbon',text:'Tomá, recién salida de la heladera.'},{who:'cat',mood:'happy',text:'¡Gracias! ¡Sos el mejor anfitrión del barrio!'}],()=>{closeTalk();giveMilk(c);})});
  if(c.key==='perla')o.push({label:'Invitarla a bailar',run:()=>talkLines([{who:'carbon',mood:'love',text:'Perla... ¿bailamos?'},{who:'cat',mood:'happy',text:'Cuando la fiesta esté a pleno, Carbón. Música fuerte, luces bajas y todos contentos.'}],null)});
  o.push({label:'Seguir la fiesta',run:()=>closeTalk()});
  return o;
}
function loveFinale(){
  const pc=cats.find(c=>c.key==='perla');player.held=null;if(!pc){loveWin();return;}
  beginTalk(pc);
  talkLines([
    {who:'cat',mood:'fiestero',text:'¡Carbón! ¡Esta es la mejor fiesta en la historia del barrio!'},
    {who:'carbon',mood:'love',text:'Es que... la armé para vos.'},
    {who:'cat',mood:'happy',text:'Ay, Carbón... ¡que no termine nunca! Le voy a avisar a TODO el barrio.'},
    {who:'carbon',mood:'perdido',text:'¿A todo el barrio? Perla... mi humano llega en un rato...'},
    {who:'cat',mood:'fiestero',text:'¡Ya les avisé a todos! ¡Ahora sí empieza la fiesta de verdad!'}
  ],()=>{closeTalk();loveWin();});
}
function loveWin(){
  state='win';SFX.win();const stars=timeLeft>60?3:timeLeft>25?2:1;
  progress.stars[LI]=Math.max(progress.stars[LI]||0,stars);progress.unlocked=Math.max(progress.unlocked,Math.min(LEVELS.length,LI+2));saveProgress();
  show(`<div class="card">
    <p class="eyebrow">NIVEL ${LI+1} SUPERADO</p>
    <h2>La mejor fiesta del barrio</h2>
    <div class="stars">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3-stars)}</span></div>
    <p>Perla está feliz, la música retumba y nadie para de bailar. Pero Perla le avisó a todo el barrio... y ya están tocando el timbre.</p>
    <p class="facts">Las estrellas dependen del tiempo que te sobró: más de 1 minuto para tres.</p>
    <div class="row"><button class="btn" data-act="next">Siguiente nivel</button><button class="btn ghost" data-act="retry">Repetir</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}
function loseLove(){
  state='lose';SFX.lose();
  show(`<div class="card">
    <p class="eyebrow">PERLA SE ABURRIÓ</p>
    <h2>Se fue a otra fiesta</h2>
    <p>La fiesta llegó al ${Math.round(partyPct())}% y Perla quería la mejor de todas. Carbón se quedó solo con el volumen al mínimo.</p>
    <p class="tip">Subí la música en el equipo, apagá todas las lámparas y llevale una leche de la heladera a cada invitado con sed (la gota azul).</p>
    <div class="row"><button class="btn" data-act="retry">Intentar de nuevo</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}

/* ---------- el despertar de Carbón ---------- */
function startWake(){state='cine';for(const k in keys)keys[k]=false;CINE={type:'wake',t:0,flags:{}};player.dir='down';player.jumpT=0;camSnap=true;hint.innerHTML='<b>ESPACIO</b><span>Saltear</span>';lastHint='';}
function updateWake(dt,t,F1){
  if(t<1.5&&Math.floor(t/.16)!==Math.floor((t-dt)/.16)&&Math.floor(t/.16)%2===0)tone(1900,.07,'square',.035);
  if(t>1.55&&F1('jump')){player.jumpT=.45;camShake=.35;SFX.meow();say(player.x,player.y-26,'¡!','#ffd23f');}
  if(player.jumpT>0)player.jumpT=Math.max(0,player.jumpT-dt);
  if(t>5.2){player.jumpT=0;CINE=null;state='play';introT=3;lastHint='';say(player.x,player.y-24,'¡A ordenar!','#ffb547');}
}
function drawWake(t){
  if(t<1.5){const sh=Math.round(Math.sin(t*60)*2);fText('¡RIIIING!',160+sh,44,10,'#ffd23f');}
  if(t>1.6){ctx.globalAlpha=Math.min(1,(t-1.6)*3);P(ctx,110,27,100,24,'#140c1e');P(ctx,112,29,96,20,'#2a2046');fText('7:55 PM',160,45,12,Math.floor(t*2)%2?'#ff5c9d':'#ffd23f');ctx.globalAlpha=1;}
  if(t>2.3){ctx.globalAlpha=Math.min(1,(t-2.3)*3);fText('¡Mi humano vuelve a las 8!',160,ROWS*T-42,7,'#f4ead5');ctx.globalAlpha=1;}
  if(t>3.4){ctx.globalAlpha=Math.min(1,(t-3.4)*3);fText('¡Hay que ordenar la habitación!',160,ROWS*T-28,7,'#ffd23f');ctx.globalAlpha=1;}
}

/* ---------- batalla de baile ---------- */
let DZ=null,DBG=null;
const LANES=['left','down','up','right'],LANEC=['#ff5c9d','#6fb3ff','#5fe0b0','#ffd23f'],LANEF=[523,587,659,784];
const DANCERS=['pelusa','mostaza','chispa'],DBEAT=[.5,.46,.42],GROUND_D=198,DX_P=100,DX_R=220,DTY=10,DSPD=74;
const DPAT=[[0,1,2,3,4,5,6,7],[0,1,1.5,2,3,4,5,5.5,6,7],[0,.5,1,2,2.5,3,4,4.5,5,6,6.5,7]];
const DANCE_TOTAL=DPAT.reduce((s,p)=>s+p.length,0),DBASS=[45,45,48,50,45,45,52,50];
const CROWD=[['nube',62,160,2],['luna',92,152,1.5],['oreo',230,152,1.5],['lola',258,160,2],['copito',142,150,1.25],['nieve',178,150,1.25],['manchita',28,172,2],['canela',292,172,2],['tigre',10,190,2],['bigotes',310,190,2]];
const LX=i=>Math.round(160+(i-1.5)*19);
const ARW={};
function arrowImg(lane,col){
  const key=lane+col;if(ARW[key])return ARW[key];
  const rows=[".....o.....","....oXo....","...oXXXo...","..oXXXXXo..",".oXXXXXXXo.","oXXXXXXXXXo","ooooXXXoooo","...oXXXo...","...oXXXo...","...oXXXo...","...ooooo..."];
  const c=document.createElement('canvas');c.width=11;c.height=11;const g=c.getContext('2d');
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch==='.')return;g.fillStyle=ch==='o'?'#140c1e':(y>0&&rows[y-1][x]==='o'?tint(col,.45):col);g.fillRect(x,y,1,1);}));
  const o=document.createElement('canvas');o.width=11;o.height=11;const og=o.getContext('2d');og.imageSmoothingEnabled=false;og.translate(5.5,5.5);og.rotate([-Math.PI/2,Math.PI,0,Math.PI/2][lane]);og.drawImage(c,-5.5,-5.5);
  return ARW[key]=o;
}
function danceBG(){
  if(DBG)return DBG;const c=document.createElement('canvas');c.width=320;c.height=208;const g=c.getContext('2d');
  let sd=7;const r=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646;};
  for(let y=0;y<150;y++){const k=y/150;P(g,0,y,320,1,`rgb(${Math.round(16+k*56)},${Math.round(10+k*18)},${Math.round(44+k*52)})`);}
  for(let i=0;i<60;i++)P(g,Math.floor(r()*320),Math.floor(r()*90),1,1,r()<.3?'#ffffff':'#9f9ad0');
  for(let y=-11;y<=11;y++)for(let x=-11;x<=11;x++)if(x*x+y*y<=121)P(g,262+x,30+y,1,1,(x+y<-5)?'#fff8e0':'#f0e2b8');
  P(g,256,26,4,3,'#d8c89a');P(g,266,34,3,3,'#d8c89a');P(g,259,36,2,2,'#d8c89a');
  let x=0;while(x<320){const w=14+Math.floor(r()*22),h=30+Math.floor(r()*40);P(g,x,128-h,w,h,'#26173f');P(g,x,128-h,w,1,'#35245a');for(let wy=128-h+4;wy<124;wy+=6)for(let wx=x+3;wx<x+w-3;wx+=5)if(r()<.35)P(g,wx,wy,2,3,r()<.6?'#ffd27a':'#ff9ec4');x+=w+Math.floor(r()*4);}
  x=-10;while(x<320){const w=22+Math.floor(r()*30),h=16+Math.floor(r()*30);P(g,x,132-h,w,h,'#170e2a');P(g,x,132-h,w,1,'#2e2050');for(let wy=132-h+4;wy<128;wy+=7)for(let wx=x+3;wx<x+w-4;wx+=6)if(r()<.25)P(g,wx,wy,3,4,'#ffcf6a');x+=w+2;}
  const bands=[150,156,163,171,180,190,201,213];
  for(let i=0;i<bands.length-1;i++){const y0=bands[i],y1=bands[i+1],tw=18+i*5,off=(i%2)*tw/2;let n=0;
    for(let xx=-off;xx<320;xx+=tw,n++){P(g,Math.round(xx),y0,Math.ceil(tw),y1-y0,(n+i)%2?'#9a5540':'#8c4b39');P(g,Math.round(xx),y0,1,y1-y0,'#5a2a20');}
    P(g,0,y0,320,1,'#5a2a20');P(g,0,y0+1,320,1,'rgba(255,200,160,.12)');}
  P(g,0,124,320,4,'#2a2233');P(g,0,124,320,1,'#5a4f6a');for(let bx=2;bx<320;bx+=9){P(g,bx,128,3,19,'#241c2e');P(g,bx,128,1,19,'#4a3f5a');}P(g,0,146,320,4,'#2a2233');P(g,0,146,320,1,'#4a3f5a');
  g.imageSmoothingEnabled=false;g.drawImage(PLANT_SPR,0,118,32,32);g.drawImage(PLANT_SPR,288,118,32,32);
  return DBG=c;
}
function danceAcc(){const z=DZ;if(!z)return 1;const j=z.hits+z.miss+z.stray;return j?z.hits/j:1;}
function dcheer(text){const m=CROWD[Math.floor(Math.random()*8)];DZ.cheers.push({x:m[1],y:m[2]-16*m[3]-4,text,t:1});}
function dsparks(x,y,n,cols){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=30+Math.random()*60;DZ.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-30,t:.3+Math.random()*.3,col:cols[i%cols.length]});}}
function danceTalk(lines,then){
  const pseudo=k=>({key:k,def:TYPES[k],known:true,x:0,y:0,seed:0});
  D={cat:pseudo('chispa')};
  lines=lines.map(l=>l.k?Object.assign({},l,{as:pseudo(l.k)}):l);
  pL.style.setProperty('--pc','#3b2f7a');
  dlg.hidden=false;dlg.classList.remove('in');void dlg.offsetWidth;dlg.classList.add('in');
  for(const k in keys)keys[k]=false;
  hint.innerHTML='<b>ESPACIO</b><span>Seguir la charla</span>';lastHint='';
  talkLines(lines,()=>{closeTalk();if(then)then();});
}
function startDance(){
  state='dance';DBG=null;
  DZ={phase:'talk',round:0,st:0,bt:.5,nb:0,notes:[],hits:0,miss:0,stray:0,perf:0,combo:0,rh:0,fx:[],pops:[],cheers:[],flash:[0,0,0,0],pose:{p:{lane:-1,t:9},r:{lane:-1,t:9}},endT:0};
  danceTalk([
    {who:'cat',k:'chispa',mood:'fiestero',text:'¡Carbón! ¿Viniste a cortarnos la fiesta?'},
    {who:'carbon',text:'Mi humano está por llegar. Se tienen que ir.'},
    {who:'cat',k:'mostaza',mood:'fiestero',text:'¿Irnos? En este balcón mandan los fiesteros. Si nos querés echar, ganános bailando.'},
    {who:'cat',k:'pelusa',mood:'fiestero',text:'¡Batalla de baile! Tres rondas: primero yo, después Mostaza y al final la reina de la pista, Chispa.'},
    {who:'cat',k:'chispa',mood:'retador',text:'Nosotros hacemos los pasos y vos los repetís. Si acertás el noventa por ciento, nos vamos todos.'},
    {who:'carbon',mood:'angry',text:'Trato hecho. ¡Que suene la música!'}
  ],()=>startRound(0));
}
function startRound(r){
  const z=DZ;z.phase='play';z.round=r;z.bt=DBEAT[r];z.st=-.25;z.nb=0;z.rh=0;z.rres=false;z.notes=[];
  let prev=-1;const lanes=DPAT[r].map(()=>{let l;do{l=Math.floor(Math.random()*4);}while(l===prev&&Math.random()<.7);prev=l;return l;});
  DPAT[r].forEach((bb,i)=>{z.notes.push({who:'r',lane:lanes[i],t:(4+bb)*z.bt});z.notes.push({who:'p',lane:lanes[i],t:(16+bb)*z.bt});});
  SFX.bell();
  hint.innerHTML='<b>← ↓ ↑ →</b><span>o W A S D: cuando es tu turno, apretá cada flecha justo cuando llega arriba, a su lugar.</span>';lastHint='x';
}
function dancePress(lane){
  const z=DZ;if(!z||lane<0||z.phase!=='play')return;
  z.flash[lane]=.14;const b=z.st/z.bt;
  let best=null;for(const n of z.notes){if(n.who!=='p'||n.done||n.lane!==lane)continue;const d=Math.abs(n.t-z.st);if(d<=.16&&(!best||d<best.d))best={n,d};}
  z.pose.p={lane,t:0};
  if(best){
    const n=best.n,perf=best.d<=.07;n.done=true;n.hit=true;z.hits++;z.rh++;z.combo++;if(perf)z.perf++;
    tone(LANEF[lane],.14,'square',.05);if(perf)tone(LANEF[lane]*2,.08,'triangle',.03,0,.04);
    z.pops.push({text:perf?'¡PERFECTO!':'¡BIEN!',col:perf?'#ffd23f':'#5fe0b0',t:.7});dsparks(LX(lane),DTY+5,perf?12:6,[LANEC[lane],'#ffffff']);
    if(z.combo%5===0)dcheer(['¡Fiu fiu!','¡Eso!','¡Qué pasos!','¡Vamos Carbón!'][Math.floor(Math.random()*4)]);
  }else if(b>=15.5&&b<=24.5){z.stray++;z.combo=0;z.pops.push({text:'¡FUERA DE RITMO!',col:'#ff5c9d',t:.7});tone(160,.1,'square',.04);}
  else tone(LANEF[lane]/2,.08,'triangle',.03);
}
function danceWinTalk(){
  danceTalk([
    {who:'cat',k:'chispa',mood:'happy',text:'¡Qué pasos, Carbón! Palabra de fiestero: nos vamos todos.'},
    {who:'cat',k:'mostaza',mood:'happy',text:'¡Mañana todo el barrio va a hablar de este baile!'},
    {who:'carbon',mood:'happy',text:'Gracias, gracias. Ahora... ¡cada uno a su casa!'}
  ],danceWin);
}
function danceWin(){
  state='win';SFX.win();rep=100;const acc=DZ.final,stars=acc>=.98?3:acc>=.94?2:1;
  progress.stars[LI]=Math.max(progress.stars[LI]||0,stars);progress.unlocked=Math.max(progress.unlocked,Math.min(LEVELS.length,LI+2));saveProgress();
  show(`<div class="card">
    <p class="eyebrow">NIVEL ${LI+1} SUPERADO</p>
    <h2>¡Carbón, rey de la pista!</h2>
    <div class="stars">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3-stars)}</span></div>
    <p>Los fiesteros se fueron aplaudiendo y todo el barrio habla del baile de Carbón. Tu reputación subió al máximo.</p>
    <div class="score">
      <span>Precisión</span><span>${Math.round(acc*100)}%</span>
      <span>Pasos perfectos</span><span>${DZ.perf} de ${DANCE_TOTAL}</span>
      <span class="t">Reputación</span><span class="t">100</span>
    </div>
    <p class="facts">Estrellas: 94% para dos, 98% para tres.</p>
    <div class="row"><button class="btn" data-act="next">Siguiente nivel</button><button class="btn ghost" data-act="retry">Repetir</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}
function danceLose(){
  state='lose';
  show(`<div class="card">
    <p class="eyebrow">TE FALTÓ RITMO</p>
    <h2>Los fiesteros siguen en tu balcón</h2>
    <p>Acertaste el ${Math.round(DZ.final*100)}% de los pasos y hacía falta el 90%.</p>
    <p class="tip">Mirá bien los pasos del rival: después vienen los mismos, en el mismo orden. Apretá cada flecha cuando toca su lugar, arriba de todo. Apretar de más también cuenta como error.</p>
    <div class="row"><button class="btn" data-act="retry">Intentar de nuevo</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}
function updateDance(dt){
  const z=DZ;if(!z)return;
  z.pose.p.t+=dt;z.pose.r.t+=dt;for(let i=0;i<4;i++)z.flash[i]=Math.max(0,z.flash[i]-dt);
  z.fx.forEach(p=>{p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;});z.fx=z.fx.filter(p=>p.t>0);
  z.pops.forEach(p=>p.t-=dt);z.pops=z.pops.filter(p=>p.t>0);
  z.cheers.forEach(c=>{c.t-=dt;c.y-=8*dt;});z.cheers=z.cheers.filter(c=>c.t>0);
  if(z.phase==='play'){
    z.st+=dt;const bt=z.bt;
    while(z.nb*bt/2<z.st+.1){
      const hb=z.nb,bb=hb/2,d=Math.max(0,hb*bt/2-z.st);
      if(bb<27){if(hb%2===0){tone(110,.13,'sine',.13,-70,d);tone(mtof(DBASS[(hb/2)%8]),bt*.8,'triangle',.045,0,d);if((hb/2)%2===1)noise(.09,.045,d,1600);if(bb>=13&&bb<16)tone(1320,.05,'square',.03,0,d);}else noise(.03,.018,d,7000);}
      z.nb++;
    }
    z.notes.forEach(n=>{
      if(n.who==='r'){
        if(!n.sched&&n.t<z.st+.1){n.sched=true;tone(LANEF[n.lane],.13,'square',.04,0,Math.max(0,n.t-z.st));}
        if(!n.done&&z.st>=n.t){n.done=true;z.pose.r={lane:n.lane,t:0};dsparks(DX_R,120,3,[LANEC[n.lane]]);}
      }else if(!n.done&&z.st>n.t+.16){n.done=true;n.miss=true;z.miss++;z.combo=0;z.pose.p={lane:n.lane,t:0,miss:true};z.pops.push({text:'¡UY!',col:'#ff5c9d',t:.7});if(Math.random()<.6)dcheer('¡Uuuh!');}
    });
    const b=z.st/bt;
    if(b>=12&&!z.rturn){z.rturn=true;dcheer('¡Bien, '+TYPES[DANCERS[z.round]].name+'!');}
    if(b>=24.3&&!z.rres){z.rres=true;const n=DPAT[z.round].length;if(z.rh===n){dcheer('¡PERFECTO!');SFX.win();}}
    if(b>=27){
      z.rturn=false;
      if(z.round<2)startRound(z.round+1);
      else{z.phase='end';z.endT=0;z.final=z.hits/(DANCE_TOTAL+z.stray);z.won=z.final>=.9;if(z.won){SFX.win();for(let i=0;i<4;i++)dcheer(['¡BRAVO!','¡Carbón!','¡Genio!','¡Otra!'][i]);}else{SFX.lose();dcheer('¡Uuuh!');}}
    }
  }else if(z.phase==='end'){
    z.endT+=dt;
    if(z.won&&Math.random()<.7)z.fx.push({x:Math.random()*320,y:-4,vx:(Math.random()-.5)*20,vy:20+Math.random()*30,t:3,col:GARL[Math.floor(Math.random()*5)]});
    if(z.endT>2.8&&!z.endDone){z.endDone=true;if(z.won)danceWinTalk();else danceLose();}
  }
}
function spotLight(x,col,a){
  ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(0,0,0,GROUND_D);g.addColorStop(0,`rgba(${col},${a*.05})`);g.addColorStop(1,`rgba(${col},${a*.3})`);
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-5,0);ctx.lineTo(x+5,0);ctx.lineTo(x+46,GROUND_D+4);ctx.lineTo(x-46,GROUND_D+4);ctx.closePath();ctx.fill();
  glow(ctx,x,GROUND_D,40,col,a*.35);ctx.globalCompositeOperation='source-over';
}
function danceFighter(key,x,face,pose,beat){
  const s=fightSprites(key),w=FW*FSC,h=FH*FSC;let img=s.idle[beat%2],yo=0,f=face;
  if(pose){if(pose.miss)img=s.dizzy;else{const L=pose.lane,k=Math.min(1,pose.t/.25);if(L===0){img=s.scratch;f=-1;}else if(L===3){img=s.scratch;f=1;}else if(L===2){img=s.power;yo=-Math.round(Math.sin(k*Math.PI)*10);}else if(L===1)img=s.crouch[0];}}
  else if(beat%4===3)yo=-2;
  ctx.globalAlpha=.45;P(ctx,Math.round(x-24),GROUND_D-2,48,4,'#000');ctx.globalAlpha=1;
  ctx.save();ctx.translate(Math.round(x),Math.round(GROUND_D-h+2+yo));if(f<0)ctx.scale(-1,1);ctx.drawImage(img,-FANCH*FSC,0,w,h);ctx.restore();
  if(pose&&pose.miss)for(let i=0;i<3;i++){const a=clock*6+i*2.1;P(ctx,Math.round(x+Math.cos(a)*14),Math.round(GROUND_D-h+14+Math.sin(a)*4),3,3,'#ffd23f');}
}
function renderDance(){
  const z=DZ;ctx.setTransform(S,0,0,S,0,0);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(danceBG(),0,0);
  const bt=z.bt||.5,b=z.phase==='play'?Math.max(0,z.st/bt):clock/.5,beat=Math.floor(b),pulse=Math.max(0,1-(b-beat)*3);
  for(let i=0;i<14;i++){const x=(i*73+11)%320,y=(i*37)%80+4;ctx.globalAlpha=.4+.5*Math.sin(clock*3+i);P(ctx,x,y,1,1,'#ffffff');}ctx.globalAlpha=1;
  for(const [x0,x1] of [[0,160],[160,320]])for(let x=x0;x<=x1;x+=2){const k=(x-x0)/(x1-x0),y=Math.round(9+Math.sin(k*Math.PI)*16);P(ctx,x,y,2,1,'#140c1e');
    if((x-x0)%12===6){const i=(x/12)|0,on=(i+beat)%3!==0;P(ctx,x,y+1,2,3,on?GARL[i%5]:'#3a2f5f');if(on){ctx.globalCompositeOperation='lighter';glow(ctx,x+1,y+3,8+pulse*5,GARL_RGB[i%5],.4);ctx.globalCompositeOperation='source-over';}}}
  const turnR=z.phase==='play'&&b>=4&&b<12,turnP=z.phase==='play'&&b>=12&&b<24;
  spotLight(DX_R,'255,120,200',turnR?1:.3);spotLight(DX_P,'150,140,255',turnP||z.phase!=='play'?1:.3);
  const cheering=z.phase==='end'&&z.won;
  CROWD.forEach(([k,x,y,sc],i)=>{
    const sz=16*sc,fr=(beat+i)%2,hop=cheering?Math.round(Math.abs(Math.sin(clock*8+i))*6):fr?Math.round(sc*1.5):0,flip=((beat>>1)+i)%2===1;
    const img=(z.phase==='end'&&!z.won)?SPR[k].normal[0]:SPR[k].dance[fr],X=Math.round(x-sz/2),Y=Math.round(y-sz-hop);
    ctx.globalAlpha=.35;P(ctx,X+sz*.2,y-2,sz*.6,2,'#000');ctx.globalAlpha=1;
    if(flip){ctx.save();ctx.translate(X+sz,Y);ctx.scale(-1,1);ctx.drawImage(img,0,0,sz,sz);ctx.restore();}else ctx.drawImage(img,X,Y,sz,sz);
    drawAcc(ctx,k,'front',X,Y,sc,flip,clock+i);
  });
  const rival=z.phase==='talk'?'chispa':DANCERS[Math.min(2,z.round)];
  danceFighter(rival,DX_R,-1,z.pose.r.t<.28?z.pose.r:null,beat);
  danceFighter('carbon',DX_P,1,z.pose.p.t<.3?z.pose.p:(cheering?{lane:2,t:(clock*2)%1*.25}:null),beat);
  fText('CARBÓN',DX_P,206,5,'#ffd23f');fText(TYPES[rival].name.toUpperCase(),DX_R,206,5,'#ff9ec4');
  if(z.phase==='play'){
    P(ctx,120,3,80,98,'rgba(10,6,24,.66)');P(ctx,120,3,80,1,'#5a4f8a');P(ctx,120,100,80,1,'#5a4f8a');P(ctx,120,3,1,98,'#5a4f8a');P(ctx,199,3,1,98,'#5a4f8a');
    for(let bb=Math.ceil(b);bb<b+2.4;bb++){const y=Math.round(DTY+5+(bb*bt-z.st)*DSPD);if(y<100)P(ctx,121,y,78,1,bb%4===0?'rgba(255,255,255,.14)':'rgba(255,255,255,.05)');}
    for(let i=0;i<4;i++){ctx.drawImage(arrowImg(i,'#3a2f6a'),LX(i)-5,DTY);if(z.flash[i]>0){ctx.globalAlpha=z.flash[i]/.14;ctx.drawImage(arrowImg(i,'#ffffff'),LX(i)-5,DTY);ctx.globalAlpha=1;}}
    z.notes.forEach(n=>{if(n.done)return;const y=Math.round(DTY+(n.t-z.st)*DSPD);if(y>92||y<DTY-10)return;ctx.drawImage(arrowImg(n.lane,n.who==='r'?tint(LANEC[n.lane],-.4):LANEC[n.lane]),LX(n.lane)-5,y);});
    const who=turnR?'PASOS DE '+TYPES[rival].name.toUpperCase():turnP?'¡AHORA VOS!':'';if(who)fText(who,160,96,5,turnR?'#ff9ec4':'#ffd23f');
  }
  z.fx.forEach(p=>{ctx.globalAlpha=Math.min(1,p.t*3);P(ctx,Math.round(p.x),Math.round(p.y),2,2,p.col);});ctx.globalAlpha=1;
  z.cheers.forEach(c=>{ctx.globalAlpha=Math.min(1,c.t*2);fText(c.text,c.x,Math.round(c.y),5,'#f4ead5');});ctx.globalAlpha=1;
  z.pops.forEach((p,i)=>{if(i<z.pops.length-1)return;ctx.globalAlpha=Math.min(1,p.t*2.5);fText(p.text,160,Math.round(114-(.7-p.t)*14),8,p.col);ctx.globalAlpha=1;});
  if(z.phase!=='talk'){
    const acc=danceAcc(),col=acc>=.9?'#5fe0b0':'#ff5c9d';
    P(ctx,238,5,78,24,'rgba(10,6,24,.66)');fText('PRECISIÓN',277,13,4,'#a99cc9');fText(Math.round(acc*100)+'%',277,23,7,col);P(ctx,242,25,70,2,'#2a2046');P(ctx,242,25,Math.round(70*acc),2,col);P(ctx,242+63,23,1,6,'#ffd23f');
    P(ctx,4,5,78,24,'rgba(10,6,24,.66)');fText('RONDA '+(Math.min(2,z.round)+1)+'/3',43,15,6,'#ffd23f');fText('VS '+TYPES[rival].name.toUpperCase(),43,24,5,'#ff9ec4');
  }
  if(z.phase==='play'){
    let big='',small='';
    if(b<2){big='RONDA '+(z.round+1);small=z.round===2?'¡LA REINA DE LA PISTA!':'CONTRA '+TYPES[rival].name.toUpperCase();}
    else if(b<4){big='¡MIRÁ SUS PASOS!';}
    else if(b>=12&&b<16){big=b<13?'¡TU TURNO!':String(16-Math.floor(b));small='REPETÍ LOS MISMOS PASOS';}
    else if(b>=24.3){big=z.rh+' DE '+DPAT[z.round].length;small=z.rh===DPAT[z.round].length?'¡RONDA PERFECTA!':'PASOS ACERTADOS';}
    if(big){P(ctx,0,108,320,small?28:20,'rgba(10,6,24,.62)');fText(big,160,123,big.length>3?10:14,'#ffd23f');if(small)fText(small,160,132,5,'#f4ead5');}
  }else if(z.phase==='end'){
    const k=Math.min(1,z.endT*3);P(ctx,0,86,320,40,'rgba(10,6,24,'+(.7*k)+')');ctx.globalAlpha=k;
    fText(z.won?'¡REY DE LA PISTA!':'TE FALTÓ RITMO',160,108,z.won?13:12,z.won?'#ffd23f':'#ff5c9d');fText('PRECISIÓN FINAL: '+Math.round(z.final*100)+'%  ·  HACÍA FALTA 90%',160,120,5,'#f4ead5');ctx.globalAlpha=1;
  }
  const vg=ctx.createRadialGradient(160,104,90,160,104,220);vg.addColorStop(0,'rgba(10,6,30,0)');vg.addColorStop(1,'rgba(10,6,30,.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,320,208);
}

