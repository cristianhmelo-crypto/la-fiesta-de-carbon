/* ---------- reputación ---------- */
let rep=70;const REP_MIN=50;
function addRep(d){
  if(!d)return;rep=Math.max(0,Math.min(100,rep+d));
  popups.push({x:player.x,y:player.y-30,text:(d>0?'+':'')+d+' REP',color:d>0?'#5fe0b0':'#ff5c9d',t:1.9});
  if(d<0)SFX.err();
}
const hostile=c=>c.def.pers==='agresivo'||c.def.pers==='okupa'||c.def.pers==='retador';
const fightMode=c=>c.def.pers==='okupa'?'defense':(c.def.pers==='agresivo'||c.def.pers==='retador')?'challenged':'bully';
function cleanPct(){const left=items.filter(i=>i.kind==='mess').length+(player&&player.held&&player.held.kind==='mess'?1:0),tot=stats.cleaned+left;return tot?stats.cleaned/tot:1;}
function dropToy(c){if(c.carry){items.push({kind:'mess',type:c.carry,x:c.x,y:c.y});c.carry=null;say(c.x,c.y-28,'¡Tu ratón!','#ffd23f');}}
function leaveHappy(c,d,txt){snapCat(c);c.state='leaving';c.path=null;c.known=true;addRep(d);stats.nice++;say(c.x,c.y-20,txt||'¡Chau, Carbón!','#5fe0b0');puff(c.x,c.y-8,'#ff9ec4',8);SFX.meow();}

/* ---------- escondites ---------- */
const HIDE_NAMES={S:'el sillón',B:'la cama',K:'la biblioteca',P:'una planta',T:'la mesa',L:'una lámpara'};
let hideGroups=[],hidden=[];
function buildHideGroups(){
  hideGroups=[];hidden=[];const seen=new Set();
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const ch=map[y][x];if(!HIDE_NAMES[ch]||seen.has(y*COLS+x))continue;
    const tiles=[],q=[[x,y]];seen.add(y*COLS+x);
    while(q.length){const [a,b]=q.pop();tiles.push([a,b]);for(const [dx,dy] of DIRS){const nx=a+dx,ny=b+dy;if(tileAt(nx,ny)===ch&&!seen.has(ny*COLS+nx)){seen.add(ny*COLS+nx);q.push([nx,ny]);}}}
    const cx=tiles.reduce((s,t)=>s+t[0],0)/tiles.length,cy=tiles.reduce((s,t)=>s+t[1],0)/tiles.length;
    const kit=tiles.some(([a,b])=>DIRS.some(([dx,dy])=>tileAt(a+dx,b+dy)===',')),room=kit?'de la cocina':ch==='B'?'del dormitorio':cy<6.5?'del living':'del cuarto de abajo';
    hideGroups.push({ch,tiles,name:HIDE_NAMES[ch],room,searched:false});
  }
}
function startQuest(c){
  c.quest=true;c.known=true;
  let pool=hideGroups.filter(g=>!g.searched&&!hidden.some(h=>h.g===g));
  if(!pool.length){hideGroups.forEach(g=>g.searched=false);pool=hideGroups.filter(g=>!hidden.some(h=>h.g===g));}
  const g=pool[Math.floor(Math.random()*pool.length)];
  const decoys=hideGroups.filter(o=>o!==g&&o.name!==g.name);
  const dc=decoys[Math.floor(Math.random()*decoys.length)]||g;
  hidden.push({g,type:c.def.lost,owner:c});
  const a=g.name+' '+g.room,b=dc.name+' '+dc.room;
  c.clue=Math.random()<.5?a+' o '+b:b+' o '+a;
}
function nearHide(){
  if(!hidden.length)return null;let best=null;
  for(const g of hideGroups){if(g.searched)continue;for(const [x,y] of g.tiles){const d=tileDist(x,y);if(d<=10&&(!best||d<best.d))best={g,d,x,y};}}
  return best;
}
function searchSpot(hs){
  player.busy={t:0,dur:.9,search:hs};SFX.clean();
}
function finishSearch(hs){
  const h=hidden.find(o=>o.g===hs.g);
  if(h){hidden.splice(hidden.indexOf(h),1);items.push({kind:'lost',type:h.type,owner:h.owner,x:player.x+(player.face>0?8:-8),y:player.y});say(player.x,player.y-22,'¡Acá estaba '+LOST[h.type]+'!','#ffd23f');SFX.fish();puff(hs.x*T+8,hs.y*T+8,'#ffd23f',10);}
  else{hs.g.searched=true;say(player.x,player.y-22,'Nada por acá...','#a99cc9');puff(hs.x*T+8,hs.y*T+8,'#c9c2dd',6);SFX.drop();}
}

/* ---------- charlas ---------- */
const dlg=$('#dlg'),dlgImg=$('#dlgImg'),dlgName=$('#dlgName'),dlgText=$('#dlgText'),dlgOpts=$('#dlgOpts'),dlgMore=$('#dlgMore');
let D=null;
function baseMood(c){return c.woke?'dormilon':c.def.pers;}
function talkLines(lines,then){D.queue=lines.slice();D.then=then;D.opts=null;nextLine();}
function nextLine(){
  if(!D)return;
  if(D.queue.length){
    const l=D.queue.shift(),me=l.who==='carbon';D.cur=l;D.typed=0;
    dlgImg.src=me?faceURL('carbon',l.mood||'neutral'):faceURL(D.cat.key,l.mood||baseMood(D.cat));
    dlgName.textContent=me?'CARBÓN':D.cat.def.name.toUpperCase();dlgName.className=me?'me':'';
    dlgText.textContent='';dlgOpts.innerHTML='';dlgMore.hidden=true;return;
  }
  const t=D.then;D.then=null;D.cur=null;
  if(typeof t==='function')t();else if(Array.isArray(t))showOpts(t);else closeTalk();
}
function showOpts(opts){D.opts=opts;D.sel=0;dlgMore.hidden=true;renderOpts();}
function renderOpts(){dlgOpts.innerHTML=D.opts.map((o,i)=>`<button type="button" data-i="${i}" class="${i===D.sel?'sel':''}"><span class="arrow">${i===D.sel?'▶':''}</span>${o.label}</button>`).join('');}
function pickOpt(i){const o=D.opts[i];if(!o)return;D.opts=null;dlgOpts.innerHTML='';SFX.pick();o.run();}
function moveSel(d){if(!D||!D.opts)return;D.sel=(D.sel+d+D.opts.length)%D.opts.length;renderOpts();tone(900,.03,'square',.03);}
function advance(){
  if(!D)return;
  if(D.opts)return pickOpt(D.sel);
  if(D.cur&&D.typed<D.cur.text.length){D.typed=D.cur.text.length;dlgText.textContent=D.cur.text;dlgMore.hidden=false;return;}
  nextLine();
}
function tickTalk(dt){
  if(!D||!D.cur)return;
  if(D.typed<D.cur.text.length){
    const before=Math.floor(D.typed);D.typed=Math.min(D.cur.text.length,D.typed+dt*48);
    dlgText.textContent=D.cur.text.slice(0,Math.floor(D.typed));
    if(Math.floor(D.typed)!==before&&Math.floor(D.typed)%3===0)tone(D.cur.who==='carbon'?420:620+Math.random()*160,.025,'square',.012);
    if(D.typed>=D.cur.text.length)dlgMore.hidden=false;
  }
}
function beginTalk(c){
  snapCat(c);c.wait=999;c.dir='down';state='talk';D={cat:c};dlg.hidden=false;
  for(const k in keys)keys[k]=false;
  hint.innerHTML='<b>ESPACIO</b><span>Seguir la charla · ↑ ↓ elegir respuesta</span>';lastHint='';
}
function openTalk(c){beginTalk(c);talkLines([{who:'cat',text:greeting(c)}],menuFor(c));}
function closeTalk(){if(D&&D.cat&&D.cat.wait>=900)D.cat.wait=1;dlg.hidden=true;D=null;if(state==='talk')state='play';lastHint='';grabFocus();}
function fightNow(c,mode){closeTalk();c.hunting=false;if(c.state==='hunt')c.state='wander';startFight(c,mode);}
function greeting(c){
  if(c.quest)return'¿Encontraste '+LOST[c.def.lost]+'? Creo que lo dejé en '+c.clue+'.';
  if(c.woke)return'Zzz... (dijo que se va cuando la casa esté impecable)';
  return{
    educado:'¡Qué buena fiesta, Carbón! ¿Qué se te ofrece?',
    perdido:'¡Carbón! Justo te estaba buscando...',
    hambriento:'Mmm... ¿qué hay de comer en esta casa?',
    fiestero:'¡Esta fiesta está buenísima! ¡Subí la música!',
    dormilon:'Zzz... zzz... zzz...',
    agresivo:'¿Qué mirás?',
    retador:c.def.dare||'¿Pelea?',
    okupa:c.carry?'Linda casa. Y lindo ratón de juguete. Ahora los dos son míos.':'Qué linda casa... ahora es mía.'
  }[c.def.pers]||'¡Miau!';
}
function menuFor(c){
  const d=c.def,h=player.held,pers=d.pers,name=d.name,o=[];
  if(h&&h.kind==='lost'&&h.owner===c)
    o.push({label:'Devolverle '+LOST[h.type],run:()=>{player.held=null;stats.favor++;talkLines([{who:'carbon',text:'¿Esto es tuyo?',mood:'happy'},{who:'cat',mood:'happy',text:'¡'+cap(LOST[h.type])+'! Sos un genio, Carbón. Ahora sí me voy.'}],()=>{closeTalk();leaveHappy(c,12,'¡Gracias!');});}});
  else if(h&&h.kind==='food'&&pers==='hambriento')
    o.push({label:'Darle el pescado',run:()=>{player.held=null;talkLines([{who:'carbon',text:'Tomá, recién salido de la heladera.'},{who:'cat',mood:'happy',text:'¡Pescadito! Ahora sí, me voy feliz. ¡Gracias por todo!'}],()=>{closeTalk();leaveHappy(c,8,'¡Ñam!');});}});
  else if(pers==='dormilon'&&!c.woke)
    o.push({label:'Despertarlo con cuidado',run:()=>talkLines([{who:'carbon',text:name+'... '+name+', despertate.'},{who:'cat',text:'Mmm... cinco minutitos más. Cuando la casa esté impecable me voy, prometido.'}],()=>{c.woke=true;c.known=true;c.pctNeed=1;closeTalk();})});
  else if(pers!=='dormilon')
    o.push({label:'Pedirle que se vaya',run:()=>askToLeave(c)});
  const mode=fightMode(c);
  o.push({label:mode==='bully'?'Desafiarlo a pelear':'Pelear',run:()=>{if(mode==='bully')addRep(-15);
    talkLines([{who:'carbon',mood:'angry',text:'Vos y yo. En la pista. Ahora.'},{who:'cat',mood:mode==='bully'?'angry':baseMood(c),text:mode==='bully'?'¿En serio, Carbón? Bueno... vos lo pediste.':'Te estaba esperando.'}],()=>fightNow(c,mode));}});
  o.push({label:'Dejarlo tranquilo',run:()=>closeTalk()});
  return o;
}
function askToLeave(c){
  const d=c.def,pers=d.pers;
  if(pers==='educado')return talkLines([{who:'carbon',text:'Se hizo tarde. Mi humano está por volver.'},{who:'cat',mood:'happy',text:'¡Uy, tenés razón! Gracias por la fiesta, Carbón. Me voy.'}],()=>{closeTalk();leaveHappy(c,6);});
  if(pers==='perdido'){
    if(c.quest)return talkLines([{who:'carbon',text:'Todavía lo estoy buscando.'},{who:'cat',text:'Fijate en '+c.clue+'. Estoy casi seguro.'}],null);
    return talkLines([{who:'carbon',text:'Se terminó la fiesta. ¿Te acompaño a la puerta?'},{who:'cat',text:d.joke[0]},{who:'carbon',mood:'angry',text:d.joke[1]},{who:'cat',text:d.joke[2]},{who:'carbon',text:'¿Y dónde lo dejaste?'}],()=>{startQuest(c);talkLines([{who:'cat',text:'Mmm... en '+c.clue+'. Una de las dos, seguro.'}],()=>{closeTalk();say(player.x,player.y-24,'¡A buscar '+LOST[d.lost]+'!','#ffd23f');});});
  }
  if(pers==='hambriento')return talkLines([{who:'carbon',text:'¿Te vas?'},{who:'cat',text:'¿Con la panza vacía? Ni loco. ¿No hay pescado en la heladera?'}],()=>{c.known=true;closeTalk();});
  if(pers==='fiestero')return talkLines([{who:'carbon',text:'La fiesta se terminó.'},{who:'cat',text:'¿Terminó? ¡Si está todo tirado! Cuando la casa esté ordenada al '+Math.round(d.pct*100)+'%, me doy cuenta y me voy.'}],()=>{c.known=true;closeTalk();});
  if(pers==='agresivo')return talkLines([{who:'carbon',text:'Ya es hora de irse, ¿no?'},{who:'cat',mood:'angry',text:'¿Me estás echando? ¡Vení que te enseño!'}],()=>fightNow(c,'challenged'));
  if(pers==='retador')return talkLines([{who:'carbon',text:'La fiesta terminó.'},{who:'cat',text:'Me voy cuando me ganes. Ni un segundo antes.'}],()=>fightNow(c,'challenged'));
  if(pers==='okupa')return talkLines([{who:'carbon',text:'Gracias por venir. Ya es hora de irse.'},{who:'cat',text:'¿Irme? Esta casa ahora es mía. Si la querés, vas a tener que ganármela.'}],()=>{c.known=true;closeTalk();});
  closeTalk();
}
/* ---------- los que vienen a desafiar a Carbón ---------- */
function challenge(c){
  c.hunting=false;c.state='wander';c.known=true;beginTalk(c);SFX.vs();
  talkLines([{who:'cat',text:c.def.dare||'¡Pelea, Carbón!'}],[
    {label:'Aceptar el desafío',run:()=>talkLines([{who:'carbon',mood:'angry',text:'Cuando quieras.'}],()=>fightNow(c,'challenged'))},
    {label:'Hacerse el distraído',run:()=>talkLines([{who:'carbon',text:'Ahora no, estoy ordenando.'},{who:'cat',mood:'angry',text:'¡Gallina! Tomá, para que tengas más para ordenar.'}],()=>{closeTalk();c.huntCd=14;
      for(let i=0;i<2;i++){const k=MESS_KEYS[Math.floor(Math.random()*MESS_KEYS.length)];items.push({kind:'mess',type:k,x:c.x+(i?10:-10),y:c.y});}puff(c.x,c.y-6,'#ff5c9d',10);say(c.x,c.y-22,'¡Ups!','#ff5c9d');})}
  ]);
}
function updateHunt(c,dt){
  if(c.huntCd>0)c.huntCd-=dt;
  if(state!=='play')return false;
  if(c.state==='hunt'){
    if(dist(c.x,c.y,player.x,player.y)<18&&!player.busy&&player.stun<=0){snapCat(c);challenge(c);return true;}
    if(!c.moving){
      const path=bfs(c.tx,c.ty,Math.floor(player.x/T),Math.floor((player.y-4)/T));
      if(path&&path.length&&!(path[0][0]===doorT[0]&&path[0][1]===doorT[1]))moveCat(c,path[0][0],path[0][1],c.def.speed*1.35);
      else{c.state='wander';c.huntCd=6;}
    }
    return false;
  }
  if((c.def.pers==='retador'||c.def.pers==='agresivo')&&c.state==='wander'&&c.huntCd<=0&&!c.moving&&!cats.some(o=>o.state==='hunt')){
    c.state='hunt';c.wait=0;say(c.x,c.y-22,'¡Carbón!','#ff5c9d');
  }
  return false;
}
/* ---------- encargos visibles ---------- */
const questsEl=$('#quests');let lastQ='',qT=0;
function updateQuests(dt){
  qT-=dt;if(qT>0)return;qT=.25;
  if(!lv||!(state==='play'||state==='talk'||state==='pause')){if(lastQ){questsEl.innerHTML='';lastQ='';}return;}
  const pct=Math.round(cleanPct()*100),list=[];
  cats.forEach(c=>{
    if(c.state==='gone'||c.state==='leaving'||c.state==='fleeing'||c.state==='boxed')return;
    const n=c.def.name,p=c.def.pers;
    if(c.state==='hunt')list.push(`<span class="q bad"><b>${n}</b> te está buscando para pelear</span>`);
    else if(c.quest)list.push(`<span class="q"><b>${n}</b> busca ${LOST[c.def.lost]}: ${c.clue}${player.held&&player.held.kind==='lost'&&player.held.owner===c?' · ¡lo tenés!':''}</span>`);
    else if(!c.known)return;
    else if(p==='hambriento')list.push(`<span class="q"><b>${n}</b> se va con un pescado</span>`);
    else if(p==='fiestero'||c.woke)list.push(`<span class="q"><b>${n}</b> se va con la casa al ${Math.round((c.pctNeed||c.def.pct)*100)}% · ahora ${pct}%</span>`);
    else if(p==='okupa')list.push(`<span class="q bad"><b>${n}</b> quiere quedarse con tu casa</span>`);
  });
  if(rep<REP_MIN)list.unshift('<span class="q bad">Tu reputación está por debajo de 50: hacé favores o perdés el nivel</span>');
  const html=list.join('');if(html!==lastQ){questsEl.innerHTML=html;lastQ=html;}
}
