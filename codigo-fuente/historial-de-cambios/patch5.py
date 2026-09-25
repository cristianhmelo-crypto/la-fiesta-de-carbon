p='fiesta-carbon.html'; s=open(p,encoding='utf-8').read()
rd=lambda f:open('parts/'+f,encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert a in s, 'MISSING: '+a[:80]
    s=s.replace(a,b,cnt)
def splice(start,end,new):
    global s
    a=s.index(start); b=s.index(end,a); s=s[:a]+new+s[b:]

# 1 party module before objetos
rep('/* ---------- objetos ---------- */', rd('party.js')+'/* ---------- objetos ---------- */')

# 2 fridge items + MESS
splice('const MESS={','/* ---------- niveles ---------- */',rd('mess.js'))

# 3 sounds + music
rep("""  lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.2,'square',.05,0,i*.16))
};""","""  lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.2,'square',.05,0,i*.16))
};
"""+rd('sound.js'))

# 4 stats
rep("stats={cleaned:0,food:0,box:0,fight:0};","stats={cleaned:0,food:0,box:0,fight:0,fatal:0};")

# 5 getAction
splice('function getAction(){','function feed(c){',rd('action.js'))

# 6 fight module before HUD
rep('/* ---------- HUD ---------- */', rd('fight.js')+'/* ---------- HUD ---------- */')

# 7 dancing
rep("if(Math.random()<.3){c.wait=.4+Math.random()*1.6;c.dir='down';return;}","if(Math.random()<.45){c.wait=1+Math.random()*2.5;c.dir='down';return;}")
rep("""  const fr=c.moving?(Math.floor(c.anim*7)%2):(Math.floor(c.anim*1.2)%2);
  const bob=c.moving&&fr?-1:0;
  drawCatSprite(c.key,mood,fr,x,y+bob,c.face,dir);""",rd('drawcat.js'))

# 8 fridge / disco / notes / spots
rep("let lights=[],beams=[],motes=[];","let lights=[],beams=[],motes=[],fridgeGroups=[];")
rep("  lights=[];beams=[];motes=[];","  lights=[];beams=[];motes=[];fridgeGroups=[];\n  for(let y=0;y<ROWS;y++){let x=0;while(x<COLS){if(map[y][x]==='F'){let w=0;while(map[y][x+w]==='F')w++;fridgeGroups.push({x,y,w});x+=w;}else x++;}}")
rep("""  if(state==='play'&&timeLeft<14){const ph=(clock*.28)%1;""","""  if(fridgeOpen())fridgeGroups.forEach(fg=>L.push({x:fg.x*T+fg.w*8,y:fg.y*T+20,r:48,a:.9,col:'205,235,255'}));
  const dc=DISCO.get(map);if(dc)for(let i=0;i<3;i++){const a=clock*.9+i*2.1;L.push({x:dc[0]*T+Math.cos(a)*34,y:dc[1]*T+Math.sin(a)*22,r:24,a:.6,col:GARL_RGB[i*2%5]});}
  if(state==='play'&&timeLeft<14){const ph=(clock*.28)%1;""")
rep("""  motes.forEach(m=>{const b=beams[m.b];""","""  const dc=DISCO.get(map);
  if(dc){const cx=dc[0]*T,cy=dc[1]*T;for(let i=0;i<26;i++){const a=i*2.4+clock*.7,rr=14+(i*29%64);ctx.globalAlpha=.35+.35*Math.sin(clock*3+i);P(ctx,Math.round(cx+Math.cos(a)*rr),Math.round(cy+Math.sin(a)*rr*.7),i%3?1:2,1,i%4?'#ffffff':GARL[i%5]);}ctx.globalAlpha=1;}
  motes.forEach(m=>{const b=beams[m.b];""")
rep("""  drawGarland();
  items.forEach(""","""  drawGarland();
  drawFridge();
  items.forEach(""")
rep("""  ents.sort((a,b)=>a.y-b.y).forEach(e=>e.d());
  lightPass(k,ox,oy);""","""  ents.sort((a,b)=>a.y-b.y).forEach(e=>e.d());
  drawDisco();
  notes.forEach(drawNote);
  lightPass(k,ox,oy);""")
rep("function render(){\n  if(!bg)return;",rd('fridge.js')+"function render(){\n  if(state==='fight'&&F){renderFight();return;}\n  if(!bg)return;")
rep("  motes.forEach(m=>{m.t+=m.sp*dt;","  notes.forEach(n=>{n.t-=dt;n.y-=12*dt;n.x+=Math.sin(clock*4+n.ph)*6*dt;});notes=notes.filter(n=>n.t>0);\n  motes.forEach(m=>{m.t+=m.sp*dt;")

# 9 loop
rep("  if(state==='play'){update(dt);introT=Math.max(0,introT-dt);}","  if(state==='play'){update(dt);introT=Math.max(0,introT-dt);}\n  else if(state==='fight'&&F)updateFight(dt);")

# 10 keys
rep("addEventListener('keydown',e=>{","""addEventListener('keydown',e=>{
  if(state==='fight'&&F){
    if(e.code==='Space'||e.code==='KeyZ'||e.code==='KeyJ'){e.preventDefault();if(!e.repeat)F.in.scratch=true;}
    if(e.code==='KeyX'||e.code==='KeyK'){e.preventDefault();if(!e.repeat)F.in.bite=true;}
    if((e.code==='ArrowUp'||e.code==='KeyW')&&!e.repeat)F.in.jump=true;
    const kk=KMAP[e.code];if(kk){keys[kk]=true;e.preventDefault();}
    return;
  }""")
rep("  const on=e=>{e.preventDefault();initAudio();keys[k]=true;","  const on=e=>{e.preventDefault();initAudio();keys[k]=true;if(k==='up'&&state==='fight'&&F)F.in.jump=true;")
rep("aBtn.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();aBtn.classList.add('on');doAction();});",
"""aBtn.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();aBtn.classList.add('on');if(state==='fight'&&F)F.in.scratch=true;else doAction();});
const bBtn=$('#bBtn');
bBtn.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();bBtn.classList.add('on');if(state==='fight'&&F)F.in.bite=true;else doAction();});
['pointerup','pointercancel','pointerleave'].forEach(t=>bBtn.addEventListener(t,()=>bBtn.classList.remove('on')));""")
rep('    <button class="abtn" id="aBtn">ACCIÓN</button>','    <div class="abtns"><button class="abtn bbtn" id="bBtn">MORDER</button><button class="abtn" id="aBtn">ACCIÓN</button></div>')
rep(".abtn{width:92px;height:92px;border-radius:50%;background:var(--amber);color:#1a1230;font-size:11px}",".abtn{width:88px;height:88px;border-radius:50%;background:var(--amber);color:#1a1230;font-size:10px}\n.abtns{display:flex;gap:10px;align-items:flex-end}\n.bbtn{width:70px;height:70px;background:var(--pink);font-size:8px;margin-bottom:26px}")

# 11 texts
rep('<b>PELEAR</b><span>Unos zarpazos y se va corriendo.</span>','<b>PELEAR</b><span>Desafialo a un duelo 1 contra 1.</span>')
rep("<kbd>ESPACIO</kbd> para actuar ·","<kbd>ESPACIO</kbd> para actuar y rasguñar · <kbd>X</kbd> morder en la pelea ·")
rep("tip:'Llevá la basura al tacho verde y limpiá lo que está en el piso. A Copito, que duerme, tapalo con una caja.'",
    "tip:'La basura va al tacho verde y la comida vuelve a la heladera. A Copito, que duerme, tapalo con una caja. Si un gato no se deja convencer, desafialo: se arma una pelea.'")
rep("const pts={c:stats.cleaned*10,f:stats.food*30,b:stats.box*20,p:stats.fight*15,t:Math.floor(timeLeft)*2};",
    "const pts={c:stats.cleaned*10,f:stats.food*30,b:stats.box*20,p:stats.fight*30+stats.fatal*20,t:Math.floor(timeLeft)*2};")
rep("<span>Gatos echados a zarpazos (${stats.fight})</span>","<span>Peleas ganadas (${stats.fight}, ${stats.fatal} con golpe final)</span>")
open(p,'w',encoding='utf-8').write(s)
print('ok')
