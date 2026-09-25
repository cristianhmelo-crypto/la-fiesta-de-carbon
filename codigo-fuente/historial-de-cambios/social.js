/* ---------- reputación ---------- */
let rep=70;const REP_MIN=50;
function addRep(d){
  if(!d)return;rep=Math.max(0,Math.min(100,rep+d));
  popups.push({x:player.x,y:player.y-30,text:(d>0?'+':'')+d+' REP',color:d>0?'#5fe0b0':'#ff5c9d',t:1.9});
  if(d<0)SFX.err();
}
const hostile=c=>c.def.pers==='agresivo'||c.def.pers==='okupa';
function cleanPct(){const left=items.filter(i=>i.kind==='mess').length+(player&&player.held&&player.held.kind==='mess'?1:0),tot=stats.cleaned+left;return tot?stats.cleaned/tot:1;}
function dropToy(c){if(c.carry){items.push({kind:'mess',type:c.carry,x:c.x,y:c.y});c.carry=null;say(c.x,c.y-28,'¡Tu ratón!','#ffd23f');}}
function leaveHappy(c,d,txt){snapCat(c);c.state='leaving';c.path=null;c.known=true;addRep(d);stats.nice++;say(c.x,c.y-20,txt||'¡Chau, Carbón!','#5fe0b0');puff(c.x,c.y-8,'#ff9ec4',8);SFX.meow();}
function leaveSad(c,d){snapCat(c);c.state='leaving';c.path=null;addRep(d);stats.rude++;say(c.x,c.y-20,'¡Hmph!','#ff5c9d');}
function startQuest(c){
  c.quest=true;c.known=true;
  const far=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(SOLID.has(map[y][x]))continue;if(Math.abs(x-c.tx)+Math.abs(y-c.ty)<6)continue;if(items.some(it=>Math.abs(it.x-(x*T+8))<10&&Math.abs(it.y-(y*T+13))<10))continue;far.push([x,y]);}
  const [x,y]=far[Math.floor(Math.random()*far.length)]||[c.tx,c.ty];
  items.push({kind:'lost',type:c.def.lost,owner:c,x:x*T+8,y:y*T+13});
}
/* ---------- charlas ---------- */
const dlg=$('#dlg'),dlgImg=$('#dlgImg'),dlgName=$('#dlgName'),dlgText=$('#dlgText'),dlgOpts=$('#dlgOpts'),dlgMore=$('#dlgMore');
let D=null;const PORT={};
function portrait(k){return PORT[k]||(PORT[k]=fightSprites(k).idle[0].toDataURL());}
function talkLines(lines,then){D.queue=lines.slice();D.then=then;D.opts=null;nextLine();}
function nextLine(){
  if(!D)return;
  if(D.queue.length){
    const l=D.queue.shift(),me=l.who==='carbon';D.cur=l;D.typed=0;
    dlgImg.src=portrait(me?'carbon':D.cat.key);dlgImg.style.transform=me?'none':'scaleX(-1)';
    dlgName.textContent=me?'CARBÓN':D.cat.def.name.toUpperCase();dlgName.className=me?'me':'';
    dlgText.textContent='';dlgOpts.innerHTML='';dlgMore.hidden=true;return;
  }
  const t=D.then;D.then=null;D.cur=null;
  if(typeof t==='function')t();else if(Array.isArray(t))showOpts(t);else closeTalk();
}
function showOpts(opts){D.opts=opts;D.sel=0;dlgMore.hidden=true;renderOpts();}
function renderOpts(){dlgOpts.innerHTML=D.opts.map((o,i)=>`<button type="button" data-i="${i}" class="${i===D.sel?'sel':''}"><span class="arrow">${i===D.sel?'▶':''}</span>${o.label}${o.note?`<em class="${o.good?'gain':'cost'}">${o.note}</em>`:''}</button>`).join('');}
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
function openTalk(c){
  snapCat(c);c.wait=999;c.dir='down';state='talk';D={cat:c};dlg.hidden=false;
  for(const k in keys)keys[k]=false;
  hint.innerHTML='<b>ESPACIO</b><span>Seguir la charla · ↑ ↓ elegir respuesta · ESC salir</span>';lastHint='';
  talkLines([{who:'cat',text:greeting(c)}],menuFor(c));
}
function closeTalk(){if(D&&D.cat&&D.cat.wait>=900)D.cat.wait=1;dlg.hidden=true;D=null;if(state==='talk')state='play';lastHint='';grabFocus();}
function fightNow(c,defense){closeTalk();startFight(c,defense);}
function greeting(c){
  const p=c.woke?'dormilon-woke':c.def.pers;
  if(c.quest)return'¿Encontraste '+LOST[c.def.lost]+'? Sin eso no me voy.';
  return{
    educado:'¡Qué buena fiesta, Carbón! ¿Qué se te ofrece?',
    perdido:'¡Carbón! Justo te estaba buscando...',
    hambriento:'Mmm... ¿qué hay de comer en esta casa?',
    fiestero:'¡Esta fiesta está buenísima! ¡Subí la música!',
    dormilon:'Zzz... zzz... zzz...',
    'dormilon-woke':'Zzz... (dijo que se va cuando la casa esté impecable)',
    agresivo:'¿Qué mirás?',
    okupa:c.carry?'Linda casa. Y lindo ratón de juguete, ¿es tuyo? Ahora es mío.':'Qué linda casa... ahora es mía.'
  }[p]||'¡Miau!';
}
function menuFor(c){
  const d=c.def,h=player.held,o=[],pers=d.pers,name=d.name;
  if(h&&h.kind==='lost'&&h.owner===c)
    o.push({label:'Devolverle '+LOST[h.type],note:'+12',good:true,run:()=>{player.held=null;stats.favor++;talkLines([{who:'carbon',text:'¿Esto es tuyo?'},{who:'cat',text:'¡'+cap(LOST[h.type])+'! Sos un genio, Carbón. Ahora sí me voy.'}],()=>{closeTalk();leaveHappy(c,12,'¡Gracias!');});}});
  if(h&&h.kind==='food'){
    if(pers==='hambriento')o.push({label:'Darle el pescado',note:'+8',good:true,run:()=>{player.held=null;talkLines([{who:'carbon',text:'Tomá, recién salido de la heladera.'},{who:'cat',text:'¡Pescadito! Ahora sí, me voy feliz. ¡Gracias por todo!'}],()=>{closeTalk();leaveHappy(c,8,'¡Ñam!');});}});
    else o.push({label:'Ofrecerle el pescado',run:()=>talkLines([{who:'cat',text:'No, gracias, ya comí. Pero qué atento.'}],null)});
  }
  if(pers==='dormilon'&&!c.woke){
    o.push({label:'Despertarlo con cuidado',run:()=>talkLines([{who:'carbon',text:name+'... '+name+', despertate.'},{who:'cat',text:'Mmm... cinco minutitos más. Cuando la casa esté impecable me voy, prometido.'}],()=>{c.woke=true;c.known=true;c.pctNeed=1;closeTalk();})});
    o.push({label:'Despertarlo de un grito',note:'se enoja',run:()=>talkLines([{who:'carbon',text:'¡ARRIBA, '+name.toUpperCase()+'!'},{who:'cat',text:'¡¿QUÉ?! ¿Quién me despertó así? ¡Vas a ver!'}],()=>{c.state='wander';fightNow(c,false);})});
  }else if(pers!=='dormilon'){
    o.push({label:'Pedirle con buena onda que se vaya',run:()=>niceAsk(c)});
    o.push({label:'Echarlo sin vueltas',note:hostile(c)||pers==='hambriento'?'se arma pelea':'−10',run:()=>rudeAsk(c)});
  }
  o.push({label:'Desafiarlo a pelear',note:hostile(c)?'defensa propia':'−15',good:hostile(c),run:()=>{if(!hostile(c))addRep(-15);talkLines([{who:'carbon',text:'Vos y yo. En la pista. Ahora.'},{who:'cat',text:hostile(c)?'Te estaba esperando.':'¿En serio, Carbón? Bueno... vos lo pediste.'}],()=>fightNow(c,hostile(c)));}});
  o.push({label:'Nada, seguí disfrutando la fiesta',run:()=>closeTalk()});
  return o;
}
function niceAsk(c){
  const d=c.def,pers=d.pers;
  if(pers==='educado')return talkLines([{who:'carbon',text:'Che, se hizo tarde. Mi humano está por volver.'},{who:'cat',text:'¡Uy, tenés razón! Gracias por la fiesta, Carbón. Me voy.'}],()=>{closeTalk();leaveHappy(c,6);});
  if(pers==='perdido'){
    if(c.quest)return talkLines([{who:'carbon',text:'Todavía lo estoy buscando.'},{who:'cat',text:'Buscá bien. '+cap(LOST[d.lost])+' no se fue caminando.'}],null);
    return talkLines([{who:'carbon',text:'Se terminó la fiesta. ¿Te acompaño a la puerta?'},{who:'cat',text:d.joke[0]},{who:'carbon',text:d.joke[1]},{who:'cat',text:d.joke[2]},{who:'carbon',text:'Está bien, lo busco.'}],()=>{startQuest(c);closeTalk();say(player.x,player.y-24,'¡A buscar '+LOST[d.lost]+'!','#ffd23f');});
  }
  if(pers==='hambriento')return talkLines([{who:'carbon',text:'¿Te vas?'},{who:'cat',text:'¿Con la panza vacía? Ni loco. ¿No hay pescado en la heladera?'}],()=>{c.known=true;closeTalk();});
  if(pers==='fiestero')return talkLines([{who:'carbon',text:'La fiesta se terminó.'},{who:'cat',text:'¿Terminó? ¡Si está todo tirado! Cuando la casa esté ordenada al '+Math.round(d.pct*100)+'%, me doy cuenta y me voy.'}],()=>{c.known=true;closeTalk();});
  if(pers==='agresivo')return talkLines([{who:'carbon',text:'Ya es hora de irse, ¿no?'},{who:'cat',text:'¿Me estás echando? ¡Vení que te enseño!'}],()=>fightNow(c,true));
  if(pers==='okupa')return talkLines([{who:'carbon',text:'Gracias por venir. Ya es hora de irse.'},{who:'cat',text:'¿Irme? Esta casa ahora es mía. Si la querés, vas a tener que ganármela.'}],()=>{c.known=true;closeTalk();});
  closeTalk();
}
function rudeAsk(c){
  const pers=c.def.pers;
  if(hostile(c)||pers==='hambriento')return talkLines([{who:'carbon',text:'¡Fuera de mi casa!'},{who:'cat',text:'Ah, ¿sí? ¡Vamos a ver quién se va!'}],()=>{if(!hostile(c))addRep(-10);fightNow(c,hostile(c));});
  talkLines([{who:'carbon',text:'¡Afuera de mi casa! ¡Ya!'},{who:'cat',text:'¡Qué maleducado! Me voy, pero esto lo va a saber todo el barrio.'}],()=>{closeTalk();leaveSad(c,-10);});
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
    if(c.quest)list.push(`<span class="q"><b>${n}</b> busca ${LOST[c.def.lost]}${player.held&&player.held.kind==='lost'&&player.held.owner===c?' · ¡lo tenés!':''}</span>`);
    else if(!c.known)return;
    else if(p==='hambriento')list.push(`<span class="q"><b>${n}</b> se va con un pescado</span>`);
    else if(p==='fiestero'||c.woke)list.push(`<span class="q"><b>${n}</b> se va con la casa al ${Math.round((c.pctNeed||c.def.pct)*100)}% · ahora ${pct}%</span>`);
    else if(p==='okupa')list.push(`<span class="q bad"><b>${n}</b> quiere quedarse con tu casa</span>`);
  });
  if(rep<REP_MIN)list.unshift('<span class="q bad">Tu reputación está por debajo de 50: hacé favores o perdés el nivel</span>');
  const html=list.join('');if(html!==lastQ){questsEl.innerHTML=html;lastQ=html;}
}
