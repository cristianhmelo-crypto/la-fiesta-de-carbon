p='fiesta-carbon.html'; s=open(p,encoding='utf-8').read()
rd=lambda f:open('parts/'+f,encoding='utf-8').read()
def rep(a,b):
    global s
    assert a in s, 'MISSING: '+a[:90]
    s=s.replace(a,b,1)
def splice(start,end,new):
    global s
    a=s.index(start); b=s.index(end,a); s=s[:a]+new+s[b:]

# gatos y personalidades
splice('const TYPES={','const FRONT=[',rd('types.js'))
rep("const HATC={manchita:['#ff5c9d','#ffd23f'],copito:['#5fe0b0','#6fb3ff'],luna:['#c77dff','#ffd23f']};",
    "const HATC={manchita:['#ff5c9d','#ffd23f'],copito:['#5fe0b0','#6fb3ff'],luna:['#c77dff','#ffd23f'],pelusa:['#ffd23f','#ff5c9d'],mostaza:['#5fe0b0','#c77dff']};\nObject.assign(ACC,{pelusa:['hat'],mostaza:['hat','glasses'],nube:['bottle'],sombra:['glasses'],canela:['bowtie']});")
rep("FPAT.humo=FPAT.tigre;","FPAT.humo=FPAT.tigre;FPAT.bigotes=FPAT.tigre;FPAT.mostaza=FPAT.tigre;FPAT.canela=FPAT.tigre;FPAT.nube=FPAT.manchita;")
rep("const eyeLine=(key==='carbon'||key==='rulo')?pal.d:famOf('b')[3];","const eyeLine=(key==='carbon'||key==='rulo'||key==='sombra')?pal.d:famOf('b')[3];")
rep("if(key==='carbon'||key==='rulo'){const rim=key==='carbon'?'#6f60c4':'#7c7c9c';","if(key==='carbon'||key==='rulo'||key==='sombra'){const rim=key==='carbon'?'#6f60c4':'#7c7c9c';")

# objetos perdidos y ratón
rep("const cap=t=>t.charAt(0).toUpperCase()+t.slice(1);","""const cap=t=>t.charAt(0).toUpperCase()+t.slice(1);
Object.assign(ITEM_DRAW,{
  collar(g,x,y){P(g,x+3,y+13,10,2,'rgba(0,0,0,.25)');P(g,x+4,y+8,8,1,'#e2344f');P(g,x+3,y+9,1,4,'#e2344f');P(g,x+12,y+9,1,4,'#e2344f');P(g,x+4,y+13,8,1,'#b0223b');P(g,x+4,y+8,3,1,'#ff6b85');P(g,x+7,y+10,3,3,'#ffd23f');P(g,x+7,y+10,1,1,'#fff6c0');},
  mono(g,x,y){P(g,x+3,y+13,10,2,'rgba(0,0,0,.25)');P(g,x+3,y+8,4,5,'#a35ad9');P(g,x+9,y+8,4,5,'#a35ad9');P(g,x+7,y+9,2,3,'#c98af0');P(g,x+3,y+8,4,1,'#c98af0');P(g,x+9,y+12,4,1,'#7a3aa8');P(g,x+5,y+13,2,2,'#7a3aa8');P(g,x+9,y+13,2,2,'#7a3aa8');},
  lana(g,x,y){P(g,x+3,y+13,10,2,'rgba(0,0,0,.25)');P(g,x+4,y+7,8,7,'#ff7aa8');P(g,x+5,y+6,6,1,'#ff7aa8');P(g,x+5,y+14,6,1,'#d9557f');P(g,x+5,y+8,6,1,'#ffb0cc');P(g,x+4,y+10,7,1,'#d9557f');P(g,x+6,y+12,5,1,'#ffb0cc');P(g,x+12,y+12,2,1,'#ff7aa8');P(g,x+13,y+13,2,1,'#ff7aa8');},
  raton(g,x,y){P(g,x+3,y+13,10,2,'rgba(0,0,0,.25)');P(g,x+4,y+9,7,4,'#9a98aa');P(g,x+5,y+8,5,1,'#b4b2c4');P(g,x+9,y+7,2,2,'#f0a0b4');P(g,x+10,y+10,1,1,'#1b1530');P(g,x+11,y+11,1,1,'#ff5c9d');P(g,x+2,y+11,2,1,'#f0a0b4');P(g,x+1,y+10,1,1,'#f0a0b4');}
});
const LOST={collar:'el collar rojo',mono:'el moño de seda',lana:'la pelota de lana'};
MESS.raton={name:'tu ratón de juguete',carry:true,dest:'cucha'};
Object.assign(HELD_NAME,{collar:'collar rojo',mono:'moño',lana:'pelota de lana',raton:'tu ratón'});
const CUCHA=new Map([[MAP1,[13,10]],[MAP2,[8,10]],[MAP3,[2,10]]]);
let toyHome=true;""")

# niveles
splice('const LEVELS=[','/* ---------- guardado ---------- */',rd('levels.js')+'\n')

# carga de nivel
rep("cats.push({key:k,def:d,tx:x,ty:y,x:x*T+8,y:y*T+13,hp:d.hp,","cats.push({key:k,def:d,known:false,quest:false,woke:false,carry:null,pctNeed:d.pers==='fiestero'?d.pct:0,tx:x,ty:y,x:x*T+8,y:y*T+13,hp:d.hp,")
rep("  stats={cleaned:0,food:0,box:0,fight:0,fatal:0};","""  stats={cleaned:0,food:0,box:0,fight:0,fatal:0,nice:0,favor:0,rude:0};
  rep=70;const thief=cats.find(c=>c.def.steals);toyHome=!thief;if(thief)thief.carry='raton';""")

# comer pescado del piso
rep("    if(f){items.splice(items.indexOf(f),1);feed(c);}","    if(f&&c.def.pers==='hambriento'){items.splice(items.indexOf(f),1);leaveHappy(c,5,'¡Ñam!');}")

# acciones
splice('function getAction(){','function feed(c){',rd('action.js'))

# fiesteros, objetos huérfanos, victoria con reputación
rep("""  const messLeft=items.filter(i=>i.kind==='mess').length+(player.held&&player.held.kind==='mess'?1:0);
  if(messLeft===0&&cats.every(c=>c.state==='gone'||c.state==='boxed'))win();""","""  const pct=cleanPct();
  cats.forEach(c=>{if(c.pctNeed&&(c.state==='wander'||c.state==='sleep')&&pct>=c.pctNeed-1e-6){leaveHappy(c,4,'¡Qué fiestón! Chau');}});
  items=items.filter(it=>!(it.kind==='lost'&&(it.owner.state==='gone'||it.owner.state==='leaving'||it.owner.state==='fleeing'||it.owner.state==='boxed')));
  if(player.held&&player.held.kind==='lost'&&['gone','leaving','fleeing','boxed'].includes(player.held.owner.state))player.held=null;
  if(rep<=0){loseRep();return;}
  const messLeft=items.filter(i=>i.kind==='mess').length+(player.held&&player.held.kind==='mess'?1:0);
  if(messLeft===0&&cats.every(c=>c.state==='gone'||c.state==='boxed')){if(rep<REP_MIN)loseRep();else win();}""")

# dibujo: ítems, objetos perdidos, cucha, burbuja y ratón robado
rep("items.forEach(it=>ctx.drawImage(itemSpr(it.kind==='mess'?it.type:it.kind==='box'?'caja':'pescado'),Math.round(it.x-8),Math.round(it.y-14)));",
    """drawCucha();
  items.forEach(it=>{ctx.drawImage(itemSpr(it.kind==='box'?'caja':it.kind==='food'?'pescado':it.type),Math.round(it.x-8),Math.round(it.y-14));
    if(it.kind==='lost'){const a=(Math.sin(clock*5+it.x)+1)/2;ctx.globalAlpha=a;P(ctx,Math.round(it.x+4),Math.round(it.y-11),1,3,'#ffffff');P(ctx,Math.round(it.x+3),Math.round(it.y-10),3,1,'#ffffff');ctx.globalAlpha=1;}});""")
rep("function render(){\n  if(state==='fight'&&F){renderFight();return;}","""function drawCucha(){
  const cc=CUCHA.get(map);if(!cc)return;const x=cc[0]*T+1,y=cc[1]*T+4;
  P(ctx,x+1,y+10,14,2,'rgba(12,6,28,.35)');P(ctx,x+1,y+2,14,9,'#7a3a5e');P(ctx,x+2,y+1,12,1,'#9c4c78');P(ctx,x+3,y+3,10,6,'#e27aa0');P(ctx,x+3,y+3,10,1,'#f7a6c4');P(ctx,x+1,y+10,14,1,'#5a2a44');
  if(toyHome)ctx.drawImage(itemSpr('raton'),x,y-5);
}
function render(){
  if(state==='fight'&&F){renderFight();return;}""")
rep("""  }else{
    drawCatSprite(c.key,mood,fr,x,y+bob,c.face,dir);
    drawAcc(ctx,c.key,view,x,y+bob,1,c.face<0,clock+c.seed);
  }""","""  }else{
    drawCatSprite(c.key,mood,fr,x,y+bob,c.face,dir);
    drawAcc(ctx,c.key,view,x,y+bob,1,c.face<0,clock+c.seed);
  }
  if(c.carry){P(ctx,x+9,y+10+bob,4,3,'#9a98aa');P(ctx,x+12,y+9+bob,1,1,'#f0a0b4');P(ctx,x+8,y+12+bob,1,1,'#f0a0b4');}
  if(player&&state==='play'&&(c.state==='wander'||c.state==='sleep')&&dist(c.x,c.y,player.x,player.y)<44){
    const bx=x+10,by=y-8+Math.round(Math.sin(clock*4+c.seed));
    const col=c.quest?'#ffd23f':!c.known?'#ffffff':hostile(c)?'#ff5c9d':'#5fe0b0';
    P(ctx,bx-1,by-1,9,6,'#1b1530');P(ctx,bx,by,7,4,col);P(ctx,bx+1,by+4,2,2,col);
    if(c.quest)ctx.drawImage(itemSpr(c.def.lost),0,0,16,16,bx,by-1,7,7);else{P(ctx,bx+1,by+1,1,1,'#1b1530');P(ctx,bx+3,by+1,1,1,'#1b1530');P(ctx,bx+5,by+1,1,1,'#1b1530');}
  }""")

# pelea: modo defensa y reputación
rep("function startFight(c){","function startFight(c,defense){")
rep("F={cat:c,phase:'intro',","F={cat:c,defense:!!defense,phase:'intro',")
splice("function exitFight(win,fatal){","/* dibujo de la pelea */","""function exitFight(win,fatal){
  const c=F.cat,def=F.defense;F=null;state='play';musicMode='house';lastHint='';camSnap=true;
  if(win){
    dropToy(c);c.state='fleeing';c.path=null;c.hp=0;c.moving=false;stats.fight++;if(fatal)stats.fatal++;
    say(c.x,c.y-20,fatal?'¡Nunca más!':'¡Me voy!','#ffd23f');SFX.meow();
    let d=def?(c.def.pers==='okupa'?5:0):-5;if(fatal&&c.def.pers!=='okupa')d-=5;addRep(d);
  }else{c.hp=c.def.hp;player.stun=1.2;timeLeft=Math.max(1,timeLeft-8);say(player.x,player.y-24,'¡Perdiste! -8 s','#ff5c9d');addRep(-5);}
  grabFocus();
}
""")

# HTML: HUD, charla, encargos
rep("""    <div class="cell"><span class="label">Cosas tiradas</span><span class="val" id="hMess">0</span></div>
    <div class="cell"><span class="label">Gatos a la vista</span><span class="val" id="hCats">0</span></div>""","""    <div class="cell repcell"><span class="label">Reputación en el barrio</span><div class="repline"><span class="val" id="hRep">70</span><div class="repbar" title="Mínimo para ganar: 50"><i id="hRepFill"></i><b></b></div></div></div>
    <div class="cell"><span class="label">Invitados en casa</span><span class="val" id="hCats">0</span></div>
    <div class="cell"><span class="label">Cosas tiradas</span><span class="val" id="hMess">0</span></div>""")
rep('    <div class="overlay" id="ov"></div>','''    <div class="dlg" id="dlg" hidden><img id="dlgImg" alt=""><div class="dlgBody"><b id="dlgName"></b><p id="dlgText"></p><div id="dlgOpts" class="dlgOpts"></div><span class="dlgMore" id="dlgMore" hidden>▼ ESPACIO</span></div></div>
    <div class="overlay" id="ov"></div>''')
rep('<div class="pad" id="pad">','<div class="quests" id="quests" aria-live="polite"></div>\n\n  <div class="pad" id="pad">')
rep(".hud{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}",""".hud{display:grid;grid-template-columns:1fr 1.6fr 1fr 1fr 1fr;gap:6px}
.repline{display:flex;align-items:center;gap:8px}
.repbar{position:relative;flex:1;height:10px;background:#140e2a;border:2px solid #000;min-width:40px}
.repbar i{position:absolute;left:0;top:0;bottom:0;width:70%;background:var(--mint);transition:width .3s,background .3s}
.repbar b{position:absolute;left:50%;top:-4px;bottom:-4px;width:2px;background:var(--cream)}
.quests{display:flex;flex-wrap:wrap;gap:6px;min-height:0}
.q{background:var(--panel);border:2px solid var(--line);padding:3px 8px;font-size:15px;color:var(--muted)}
.q b{color:var(--amber);font-weight:600}
.q.bad{border-color:var(--pink);color:var(--cream)}
.dlg{position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:10px;background:rgba(18,12,36,.96);border:3px solid var(--cream);box-shadow:4px 4px 0 #000;padding:8px 10px;align-items:flex-start;z-index:5}
.dlg img{width:86px;height:80px;image-rendering:pixelated;flex:none;background:#2e2552;border:2px solid var(--line)}
.dlgBody{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
#dlgName{font-family:var(--pix);font-size:9px;color:#6fb3ff;letter-spacing:1px}
#dlgName.me{color:var(--amber)}
#dlgText{margin:0;font-size:18px;min-height:2.4em;line-height:1.3}
.dlgOpts{display:flex;flex-direction:column;gap:2px}
.dlgOpts button{text-align:left;background:transparent;border:0;color:var(--cream);font-family:var(--body);font-size:17px;padding:2px 6px;cursor:pointer;display:flex;gap:6px;align-items:baseline}
.dlgOpts button .arrow{width:12px;color:var(--amber);font-size:12px}
.dlgOpts button.sel,.dlgOpts button:hover{background:var(--panel2);color:var(--amber)}
.dlgOpts em{font-style:normal;font-size:14px;margin-left:auto;padding-left:10px;color:var(--pink)}
.dlgOpts em.gain{color:var(--mint)}
.dlgMore{align-self:flex-end;font-family:var(--pix);font-size:7px;color:var(--amber);animation:blink .8s steps(2) infinite}
@media (max-width:700px){.dlg{position:fixed;left:8px;right:8px;bottom:8px;z-index:15}.dlg img{width:56px;height:52px}#dlgText{font-size:16px}.dlgOpts button{font-size:15px}}""")
rep("@media (max-width:560px){.hud{grid-template-columns:repeat(2,minmax(0,1fr))}","@media (max-width:760px){.hud{grid-template-columns:repeat(2,minmax(0,1fr))}.repcell{grid-column:1/-1}}\n@media (max-width:560px){")

# HUD
rep("const hTime=$('#hTime'),","const hRep=$('#hRep'),hRepFill=$('#hRepFill'),hTime=$('#hTime'),")
rep("  hCats.textContent=cats.filter(c=>c.state!=='gone'&&c.state!=='boxed').length;","""  hCats.textContent=cats.filter(c=>c.state!=='gone'&&c.state!=='boxed').length;
  hRep.textContent=Math.round(rep);hRepFill.style.width=rep+'%';hRepFill.style.background=rep<REP_MIN?'var(--pink)':rep<65?'var(--amber)':'var(--mint)';hRep.classList.toggle('warn',state==='play'&&rep<REP_MIN);""")
rep("'<b>ESPACIO</b><span>Movete con las flechas y acercate a algo. Si el teclado no responde, hacé clic sobre el juego.</span>'","'<b>ESPACIO</b><span>Acercate a un gato para hablarle, o a algo tirado para ordenarlo. Si el teclado no responde, hacé clic sobre el juego.</span>'")

# módulo social
rep('/* ---------- pantallas ---------- */',rd('social.js')+'\n/* ---------- pantallas ---------- */')

# bucle
rep("  else if(state==='fight'&&F)updateFight(dt);","  else if(state==='fight'&&F)updateFight(dt);\n  else if(state==='talk'){tickTalk(dt);cats.forEach(c=>updateCat(c,dt));}\n  updateQuests(dt);")

# teclado y botones en charla
rep("addEventListener('keydown',e=>{","""addEventListener('keydown',e=>{
  if(state==='talk'&&D){
    if(e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();moveSel(-1);}
    else if(e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();moveSel(1);}
    else if(e.code==='Space'||e.code==='Enter'||e.code==='KeyZ'||e.code==='KeyJ'){e.preventDefault();if(!e.repeat)advance();}
    else if(e.code==='Escape'){e.preventDefault();if(D.opts)closeTalk();}
    return;
  }""")
rep("  const on=e=>{e.preventDefault();initAudio();keys[k]=true;","  const on=e=>{e.preventDefault();initAudio();if(state==='talk'){if(k==='up')moveSel(-1);if(k==='down')moveSel(1);return;}keys[k]=true;")
rep("if(state==='fight'&&F)F.in.scratch=true;else doAction();});","if(state==='fight'&&F)F.in.scratch=true;else if(state==='talk')advance();else doAction();});")
rep("if(state==='fight'&&F)F.in.bite=true;else doAction();});","if(state==='fight'&&F)F.in.bite=true;else if(state==='talk')advance();else doAction();});\ndlgOpts.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&D&&D.opts){D.sel=+b.dataset.i;pickOpt(D.sel);}});\ndlg.addEventListener('click',e=>{if(!e.target.closest('button')&&D&&!D.opts)advance();});")

# pantallas
rep("""    <p class="eyebrow">JUEGO DE LIMPIEZA GATUNA</p>
    <h2>Carbón hizo una fiesta. Su humano está por volver.</h2>
    <p>Anoche Carbón invitó a los gatos del barrio y la casa quedó patas arriba. Ordená todo antes de que se abra la puerta. Algunos invitados no se quieren ir, así que vas a tener que elegir cómo sacarlos:</p>
    <div class="methods">
      <div class="method"><img src="${IMG.caja}" alt=""><b>TAPARLO</b><span>Agarrá una caja y ponésela encima.</span></div>
      <div class="method"><img src="${IMG.pelea}" alt=""><b>PELEAR</b><span>Desafialo a un duelo 1 contra 1.</span></div>
      <div class="method"><img src="${IMG.pescado}" alt=""><b>CONVENCERLO</b><span>Pescado de la heladera: se va contento.</span></div>
    </div>""","""    <p class="eyebrow">EL GATO MÁS POPULAR DEL BARRIO</p>
    <h2>Carbón hizo una fiesta. Su humano está por volver.</h2>
    <p>Los invitados no se quieren ir. Hablá con cada gato: algunos se van si se lo pedís bien, otros te piden un favor y otros quieren pelea. Cuidá tu reputación: si terminás por debajo de 50, el barrio te da la espalda y perdés.</p>
    <div class="methods">
      <div class="method"><img src="${IMG.lost}" alt=""><b>HACER FAVORES</b><span>Encontrá lo que perdieron. Suma reputación.</span></div>
      <div class="method"><img src="${IMG.pescado}" alt=""><b>CONVENCER</b><span>Hablá con buena onda o convidá pescado.</span></div>
      <div class="method"><img src="${IMG.pelea}" alt=""><b>PELEAR</b><span>Solo si no queda otra. Resta reputación.</span></div>
    </div>""")
rep("  pescado:imgOf(g=>ITEM_DRAW.pescado(g,0,-3)),","  pescado:imgOf(g=>ITEM_DRAW.pescado(g,0,-3)),\n  lost:imgOf(g=>ITEM_DRAW.collar(g,0,-3)),")
rep("<p class=\"facts\">Tiempo: ${fmt(lv.time)} · ${lv.mess} cosas tiradas · ${lv.boxes} cajas${lv.party?' · los gatos tiran algo cada '+lv.party+' s':''}</p>",
    "<p class=\"facts\">Tiempo: ${fmt(lv.time)} · ${lv.cats.length} invitados · ${lv.mess} cosas tiradas · ${lv.boxes} cajas · reputación mínima para ganar: ${REP_MIN}</p>")
rep('<button class="btn" data-act="begin">A ordenar</button>','<button class="btn" data-act="begin">A la fiesta</button>')
splice("function win(){","function lose(){","""function win(){
  state='win';SFX.win();
  const stars=rep>=85?3:rep>=70?2:1;
  progress.stars[LI]=Math.max(progress.stars[LI]||0,stars);progress.unlocked=Math.max(progress.unlocked,Math.min(LEVELS.length,LI+2));saveProgress();
  const pts={n:stats.nice*40,f:stats.favor*30,c:stats.cleaned*10,p:stats.fight*20,r:Math.round(rep)*5,t:Math.floor(timeLeft)*2};
  const total=pts.n+pts.f+pts.c+pts.p+pts.r+pts.t,last=LI===LEVELS.length-1;
  show(`<div class="card">
    <p class="eyebrow">${last?'¡TERMINASTE EL JUEGO!':'NIVEL '+(LI+1)+' SUPERADO'}</p>
    <h2>${last?'Casa impecable y Carbón sigue siendo el gato más querido del barrio.':'Todos se fueron y el barrio te sigue queriendo.'}</h2>
    <div class="stars">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3-stars)}</span></div>
    <p class="facts">Las estrellas dependen de tu reputación: 70 para dos, 85 para tres.</p>
    <div class="score">
      <span>Gatos que se fueron contentos (${stats.nice})</span><span>${pts.n}</span>
      <span>Favores hechos (${stats.favor})</span><span>${pts.f}</span>
      <span>Cosas ordenadas (${stats.cleaned})</span><span>${pts.c}</span>
      <span>Peleas ganadas (${stats.fight}, ${stats.fatal} con golpe final)</span><span>${pts.p}</span>
      <span>Reputación final (${Math.round(rep)})</span><span>${pts.r}</span>
      <span>Tiempo de sobra</span><span>${pts.t}</span>
      <span class="t">Total</span><span class="t">${total}</span>
    </div>
    <div class="row">${last?'':'<button class="btn" data-act="next">Siguiente nivel</button>'}<button class="btn ghost" data-act="retry">Repetir</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}
function loseRep(){
  state='lose';SFX.lose();
  const why=stats.fight>=2?'Te peleaste con demasiados invitados':stats.rude>=2?'Echaste a varios invitados de mala manera':'Trataste mal a los invitados';
  show(`<div class="card">
    <p class="eyebrow">EL BARRIO HABLA</p>
    <h2>${cats.every(c=>c.state==='gone'||c.state==='boxed')?'La casa quedó impecable, pero nadie te quiere':'Tu reputación se fue al piso'}</h2>
    <p>${why}. Tu reputación terminó en ${Math.round(rep)} y hace falta al menos ${REP_MIN}. Ahora dicen que Carbón se volvió un patotero y nadie lo invita a ninguna fiesta.</p>
    <p class="tip">Hacé favores, pedí las cosas con buena onda y guardá las peleas para los gatos que te buscan pelea o quieren quedarse con tu casa.</p>
    <div class="row"><button class="btn" data-act="retry">Intentar de nuevo</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}
""")
rep("if(c.length)parts.push(c.length===1?c[0].def.name+' paseando por el living':c.length+' gatos desconocidos');","if(c.length)parts.push(c.length===1?c[0].def.name+' paseando por el living':c.length+' gatos de fiesta en el living');")
open(p,'w',encoding='utf-8').write(s)
print('ok')
