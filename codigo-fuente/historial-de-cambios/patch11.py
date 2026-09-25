p='fiesta-carbon.html'; s=open(p,encoding='utf-8').read()
rd=lambda f:open('parts/'+f,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)>=n, 'MISSING: '+a[:90]
    s=s.replace(a,b,n)
def splice(start,end,new):
    global s
    a=s.index(start); b=s.index(end,a); s=s[:a]+new+s[b:]

vs=rd('vs3.js').replace("""  for(let y=-8;y<216;y+=8)for(let x=-8;x<328;x+=8){const left=x+ (y*(seam[1]-seam[0])/208) <seam[0]-(y/208)*0+0? true:false;
    const sx=""","""  for(let y=-8;y<216;y+=8)for(let x=-8;x<328;x+=8){
    const sx=""")

# ---------- caras que hablan
rep("function buildFace(key,moodName){\n  const W=40,H=40,pal=PALS[key],coat=COAT[key]||'solid',M=MOODS[moodName]||MOODS.neutral,",
    "function buildFace(key,moodName,talk){\n  const W=40,H=40,pal=PALS[key],coat=COAT[key]||'solid',M0=MOODS[moodName]||MOODS.neutral,M=talk&&!['big','fangs','grin','o'].includes(M0.mouth)?Object.assign({},M0,{mouth:'talk'}):M0,")
rep("  switch(M.mouth){","  switch(M.mouth){\n    case 'talk':for(let x=18;x<=22;x++)put(x,29,dark);for(let x=19;x<=21;x++)put(x,30,dark);put(20,30,tongue);put(17,28,eyeLine);put(23,28,eyeLine);break;")
rep("function faceURL(key,mood){const k=key+'|'+mood;return FACES[k]||(FACES[k]=buildFace(key,mood).toDataURL());}",
    "function faceURL(key,mood,talk){const k=key+'|'+mood+(talk?'|t':'');return FACES[k]||(FACES[k]=buildFace(key,mood,talk).toDataURL());}")

# ---------- caja de diálogo nueva
rep('    <div class="dlg" id="dlg" hidden><img id="dlgImg" alt=""><div class="dlgBody"><b id="dlgName"></b><p id="dlgText"></p><div id="dlgOpts" class="dlgOpts"></div><span class="dlgMore" id="dlgMore" hidden>▼ ESPACIO</span></div></div>',
    '    <div class="dlg" id="dlg" hidden><div class="dlgPort left" id="pL"><img id="imgL" alt=""><span class="tag">CARBÓN</span></div><div class="dlgBox" id="dlgBox"><div class="dlgHead"><b id="dlgName"></b><em id="dlgRole"></em></div><p id="dlgText"></p><div id="dlgOpts" class="dlgOpts"></div><span class="dlgMore" id="dlgMore" hidden>▼ ESPACIO</span></div><div class="dlgPort right" id="pR"><img id="imgR" alt=""><span class="tag" id="tagR"></span></div></div>')
rep(".dlg{position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:10px;background:rgba(18,12,36,.96);border:3px solid var(--cream);box-shadow:4px 4px 0 #000;padding:8px 10px;align-items:flex-start;z-index:5}",
    """.dlg{position:absolute;left:10px;right:10px;bottom:14px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:end;z-index:5}
.dlg.in{animation:dlgIn .38s cubic-bezier(.2,1.35,.4,1)}
@keyframes dlgIn{from{transform:translateY(60px);opacity:0}to{transform:none;opacity:1}}
.dlgPort{position:relative;width:120px;height:120px;border:3px solid #000;box-shadow:4px 4px 0 #000,inset 0 0 0 2px rgba(255,255,255,.15);background:radial-gradient(circle at 50% 38%,var(--pc,#4a3a8e) 0,#120c26 78%);transition:transform .2s cubic-bezier(.2,1.4,.4,1),filter .2s}
.dlgPort::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 1px,transparent 1px 3px);pointer-events:none}
.dlgPort img{width:100%;height:100%;image-rendering:pixelated;display:block}
.dlgPort.right img{transform:scaleX(-1)}
.dlg.in .dlgPort.left{animation:portL .5s cubic-bezier(.2,1.3,.4,1)}
.dlg.in .dlgPort.right{animation:portR .5s cubic-bezier(.2,1.3,.4,1)}
@keyframes portL{from{transform:translateX(-170px) rotate(-10deg)}}
@keyframes portR{from{transform:translateX(170px) rotate(10deg)}}
.dlgPort.dim{filter:brightness(.42) saturate(.5);transform:translateY(10px) scale(.92)}
.dlgPort.act{transform:translateY(-6px) scale(1.05);box-shadow:4px 4px 0 #000,0 0 0 3px var(--amber)}
.dlgPort .tag{position:absolute;left:-3px;right:-3px;bottom:-16px;background:#000;color:var(--amber);font-family:var(--pix);font-size:7px;text-align:center;padding:4px 2px;letter-spacing:1px;white-space:nowrap;overflow:hidden}
.dlgPort.right .tag{color:#6fb3ff}
.dlgBox{position:relative;background:linear-gradient(180deg,rgba(24,16,50,.97),rgba(12,8,28,.97));border:3px solid var(--cream);box-shadow:4px 4px 0 #000,inset 0 0 0 2px #3a2f6a;padding:10px 14px 12px;min-height:124px;display:flex;flex-direction:column;gap:6px}
.dlgBox::before{content:"";position:absolute;bottom:22px;width:0;height:0;border:9px solid transparent}
.dlgBox.fromL::before{left:-21px;border-right-color:var(--cream)}
.dlgBox.fromR::before{right:-21px;border-left-color:var(--cream)}
.dlgHead{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;border-bottom:2px dashed #3a2f6a;padding-bottom:4px}
#dlgRole{font-style:normal;font-family:var(--pix);font-size:7px;color:var(--pink);letter-spacing:1px}
#dlgText.shake{animation:shk .1s steps(2) infinite;color:#ffd0dc}
@keyframes shk{50%{transform:translate(1px,-1px)}}""")
rep(".dlg img{width:80px;height:80px;image-rendering:pixelated;flex:none;background:#2e2552;border:2px solid var(--line)}\n","")
rep("@media (max-width:700px){.dlg{position:fixed;left:8px;right:8px;bottom:8px;z-index:15}.dlg img{width:56px;height:52px}#dlgText{font-size:16px}.dlgOpts button{font-size:15px}}",
    "@media (max-width:700px){.dlg{position:fixed;left:6px;right:6px;bottom:10px;z-index:15;gap:6px}.dlgPort{width:64px;height:64px}.dlgPort .tag{font-size:6px}#dlgText{font-size:16px}.dlgOpts button{font-size:15px}.dlgBox{min-height:90px;padding:8px}}")

rep("const dlg=$('#dlg'),dlgImg=$('#dlgImg'),dlgName=$('#dlgName'),","""const pL=$('#pL'),pR=$('#pR'),imgL=$('#imgL'),imgR=$('#imgR'),tagR=$('#tagR'),dlgBox=$('#dlgBox'),dlgRole=$('#dlgRole');
const ROLE={educado:'BUENA ONDA',perdido:'DESPISTADO',hambriento:'GLOTÓN',fiestero:'FIESTERO',dormilon:'DORMILÓN',agresivo:'PATOTERO',okupa:'OKUPA',retador:'RETADOR'};
const ROLEC={educado:'#2f8a64',perdido:'#8a7a2f',hambriento:'#8a552f',fiestero:'#8a2f7a',dormilon:'#2f558a',agresivo:'#8a2f2f',okupa:'#552f8a',retador:'#9a4a1a'};
const VOICE={carbon:360};
function voiceOf(k){if(!VOICE[k]){let h=0;for(const ch of k)h=(h*31+ch.charCodeAt(0))%997;VOICE[k]=500+(h%7)*65;}return VOICE[k];}
const dlg=$('#dlg'),dlgName=$('#dlgName'),""")
rep("""    const l=D.queue.shift(),me=l.who==='carbon';D.cur=l;D.typed=0;
    dlgImg.src=me?faceURL('carbon',l.mood||'neutral'):faceURL(D.cat.key,l.mood||baseMood(D.cat));
    dlgName.textContent=me?'CARBÓN':D.cat.def.name.toUpperCase();dlgName.className=me?'me':'';
    dlgText.textContent='';dlgOpts.innerHTML='';dlgMore.hidden=true;return;""","""    const l=D.queue.shift(),me=l.who==='carbon',c=D.cat;D.cur=l;D.typed=0;D.flap=0;
    D.mood=l.mood||(me?'neutral':baseMood(c));D.key=me?'carbon':c.key;
    imgL.src=faceURL('carbon',me?D.mood:'neutral');imgR.src=faceURL(c.key,me?baseMood(c):D.mood);
    pL.classList.toggle('act',me);pL.classList.toggle('dim',!me);pR.classList.toggle('act',!me);pR.classList.toggle('dim',me);
    dlgBox.classList.toggle('fromL',me);dlgBox.classList.toggle('fromR',!me);
    dlgName.textContent=me?'CARBÓN':c.def.name.toUpperCase();dlgName.className=me?'me':'';
    dlgRole.textContent=me?'EL ANFITRIÓN':(c.known||c.def.pers==='retador'||c.def.pers==='agresivo'?ROLE[c.def.pers]:'???');
    dlgText.classList.toggle('shake',['angry','agresivo','retador'].includes(D.mood));
    D.emoteT=0;
    dlgText.textContent='';dlgOpts.innerHTML='';dlgMore.hidden=true;return;""")
rep("""    const before=Math.floor(D.typed);D.typed=Math.min(D.cur.text.length,D.typed+dt*48);
    dlgText.textContent=D.cur.text.slice(0,Math.floor(D.typed));
    if(Math.floor(D.typed)!==before&&Math.floor(D.typed)%3===0)tone(D.cur.who==='carbon'?420:620+Math.random()*160,.025,'square',.012);
    if(D.typed>=D.cur.text.length)dlgMore.hidden=false;""","""    const before=Math.floor(D.typed);D.typed=Math.min(D.cur.text.length,D.typed+dt*46);
    dlgText.textContent=D.cur.text.slice(0,Math.floor(D.typed));
    const ch=D.cur.text[Math.floor(D.typed)-1]||'';
    if(Math.floor(D.typed)!==before&&Math.floor(D.typed)%2===0&&/[a-záéíóúñ]/i.test(ch))tone(voiceOf(D.key)*(.9+Math.random()*.2),.03,D.key==='carbon'?'triangle':'square',.014);
    D.flap+=dt;const open=D.typed<D.cur.text.length&&Math.floor(D.flap/.1)%2===0,me=D.cur.who==='carbon';
    (me?imgL:imgR).src=faceURL(D.key,D.mood,open);
    if(D.typed>=D.cur.text.length){dlgMore.hidden=false;(me?imgL:imgR).src=faceURL(D.key,D.mood,false);}""")
rep("""  snapCat(c);c.wait=999;c.dir='down';state='talk';D={cat:c};dlg.hidden=false;""","""  snapCat(c);c.wait=999;c.dir='down';state='talk';D={cat:c};
  player.dir='side';player.face=c.x>player.x?1:-1;
  tagR.textContent=c.def.name.toUpperCase();pR.style.setProperty('--pc',ROLEC[c.def.pers]||'#4a3a8e');pL.style.setProperty('--pc','#3b2f7a');
  dlg.hidden=false;dlg.classList.remove('in');void dlg.offsetWidth;dlg.classList.add('in');SFX.meow();""")

# ---------- cámara, barras de cine y emociones en la casa
rep("  const inGame=state==='play'||state==='pause'||state==='win'||state==='lose';\n  const tz=inGame&&zoomNear?5/3:1;",
    "  const talking=state==='talk'&&D&&D.cat,inGame=state==='play'||state==='pause'||state==='win'||state==='lose'||talking;\n  const tz=talking?(zoomNear?7/3:2):inGame&&zoomNear?5/3:1;")
rep("  const fx=inGame?player.x:COLS*T/2,fy=inGame?player.y-6:ROWS*T/2;",
    "  let fx=inGame?player.x:COLS*T/2,fy=inGame?player.y-6:ROWS*T/2;\n  if(talking){fx=(player.x+D.cat.x)/2;fy=(player.y+D.cat.y)/2-6+ROWS*T/Z*.2;}")
rep("  const dir=c.state==='sleep'?'down':(c.dir||'down');","  const talking=state==='talk'&&D&&D.cat===c,tface=talking?(player.x>c.x?1:-1):c.face;\n  const dir=talking?'side':c.state==='sleep'?'down':(c.dir||'down');")
rep("  if(c.state==='wander'&&!c.moving&&c.wait>0&&c.stun<=0){","  if(!talking&&c.state==='wander'&&!c.moving&&c.wait>0&&c.stun<=0){")
rep("    drawCatSprite(c.key,mood,fr,x,y+bob,c.face,dir);\n    drawAcc(ctx,c.key,view,x,y+bob,1,c.face<0,clock+c.seed);",
    "    drawCatSprite(c.key,mood,fr,x,y+bob,tface,dir);\n    drawAcc(ctx,c.key,view,x,y+bob,1,tface<0,clock+c.seed);")
rep("function render(){\n  if(state==='fight'&&F){renderFight();return;}","""const EMO={
  anger:{rows:["R.R.R.R","RR...RR","......."," ","RR...RR","R.R.R.R"],c:{R:'#ff3b5c'}},
  ask:{rows:[".YYY.","Y...Y","...Y.","..Y..",".....","..Y.."],c:{Y:'#ffd23f'}},
  heart:{rows:[".P.P.","PPPPP","PPPPP",".PPP.","..P.."],c:{P:'#ff5c9d'}},
  note:{rows:["..NNN","..N.N","..N.N","NNN..","NNN.."],c:{N:'#5fe0b0'}},
  zz:{rows:["BBBB","..B.",".B..","BBBB"],c:{B:'#cfe3ff'}},
  drop:{rows:["..B..",".BBB.","BBBBB","BBBBB",".BBB."],c:{B:'#6fb3ff'}},
  dots:{rows:["W.W.W"],c:{W:'#1b1530'}}
};
function emoteFor(m){return{angry:'anger',agresivo:'anger',retador:'anger',perdido:'ask',happy:'heart',educado:'heart',fiestero:'note',dormilon:'zz',hambriento:'drop',okupa:'dots',neutral:'dots'}[m]||'dots';}
function drawEmote(type,x,y,k){
  const e=EMO[type],w=e.rows[0].length,h=e.rows.length,bw=w+6,bh=h+5,sc=Math.min(1,k*3);
  ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
  P(ctx,-bw/2-1,-bh-4,bw+2,bh+2,'#1b1530');P(ctx,-bw/2,-bh-3,bw,bh,'#ffffff');P(ctx,-1,-3,3,2,'#ffffff');P(ctx,-2,-3,1,2,'#1b1530');P(ctx,2,-3,1,2,'#1b1530');P(ctx,-1,-1,3,1,'#1b1530');
  e.rows.forEach((r,yy)=>[...r].forEach((ch,xx)=>{if(e.c[ch])P(ctx,-w/2+xx,-bh-1+yy+ (type==='dots'?1:0),1,1,e.c[ch]);}));
  ctx.restore();
}
let talkAnim=0;
function render(){
  if(state==='fight'&&F){renderFight();return;}""")
rep("""  drawDisco();
  notes.forEach(drawNote);
  lightPass(k,ox,oy);""","""  drawDisco();
  notes.forEach(drawNote);
  lightPass(k,ox,oy);
  if(state==='talk'&&D&&D.cur){D.emoteT=(D.emoteT||0)+1/60;const me=D.cur.who==='carbon',who=me?player:D.cat;ctx.setTransform(k,0,0,k,ox,oy);drawEmote(emoteFor(D.mood),Math.round(who.x),Math.round(who.y-18+Math.sin(clock*5)),D.emoteT);}""")
rep("""  if(state==='play'&&timeLeft<12){ctx.fillStyle='rgba(255,60,120,'+(0.06+0.06*Math.sin(clock*8))+')';ctx.fillRect(0,0,COLS*T,ROWS*T);}
}""","""  if(state==='play'&&timeLeft<12){ctx.fillStyle='rgba(255,60,120,'+(0.06+0.06*Math.sin(clock*8))+')';ctx.fillRect(0,0,COLS*T,ROWS*T);}
  talkAnim+=((state==='talk'?1:0)-talkAnim)*.14;
  if(talkAnim>.01){
    const g2=ctx.createRadialGradient(160,70,40,160,70,200);g2.addColorStop(0,'rgba(8,4,20,0)');g2.addColorStop(1,'rgba(8,4,20,'+(.55*talkAnim)+')');ctx.fillStyle=g2;ctx.fillRect(0,0,COLS*T,ROWS*T);
    const bh=Math.round(18*talkAnim);P(ctx,0,0,COLS*T,bh,'#000');P(ctx,0,ROWS*T-bh,COLS*T,bh,'#000');
    if(bh>4){P(ctx,0,bh,COLS*T,1,'rgba(255,210,63,.35)');P(ctx,0,ROWS*T-bh-1,COLS*T,1,'rgba(255,210,63,.35)');}
  }
}""")

# ---------- VS nuevo, entrada al escenario y cartel de ronda
splice("function renderVS(t){","/* ---------- HUD ---------- */",vs+"\n")
rep("    case 'intro':if(f.phaseT>2.1){f.phase='ready';f.phaseT=0;SFX.bell();}break;",
    "    case 'intro':if(pc.scratch||pc.jump||pc.bite||pc.special)f.skipVS=true;if(f.phaseT>3.4||(f.skipVS&&f.phaseT>.8)){f.phase='ready';f.phaseT=0;f.flash=.7;f.fx=[];SFX.bell();}break;")
rep("    case 'ready':fighterStep(f.p,f.e,dt,none);fighterStep(f.e,f.p,dt,none);if(f.phaseT>1.4){f.phase='fight';f.phaseT=0;}break;",
    """    case 'ready':{
      const k=easeOut(f.phaseT/.5);
      if(f.phaseT<.5){f.p.x=-40+(84+40)*k;f.e.x=360-(360-236)*k;f.p.vx=f.e.vx=120;if(Math.random()<.4){sparks(f.p.x-10,GROUND-3,1,['#6b5c96']);sparks(f.e.x+10,GROUND-3,1,['#6b5c96']);}}
      else{if(f.p.vx===120){f.p.vx=f.e.vx=0;f.p.x=84;f.e.x=236;f.shake=.3;}}
      fighterStep(f.p,f.e,dt,none);fighterStep(f.e,f.p,dt,none);if(f.phaseT<.5){f.p.vx=f.e.vx=120;}
      if(f.phaseT>1.1&&!f.burst){f.burst=true;f.flash=.35;f.shake=.6;SFX.hit();noise(.2,.06,0,1500);}
      if(f.phaseT>1.6){f.phase='fight';f.phaseT=0;f.burst=false;}
      break;}""")
rep("  if(f.phase==='ready')fText(f.phaseT<.8?'RONDA '+f.round:'¡PELEA!',160,104,16,'#ffd23f');","""  if(f.phase==='ready'){
    const t2=f.phaseT;
    if(t2>.35&&t2<1.1){const k=easeOut((t2-.35)/.25),ko=Math.max(0,(t2-.95)/.15),bx=-340+k*340+ko*340;
      ctx.save();ctx.translate(bx,0);P(ctx,0,86,320,26,'rgba(0,0,0,.8)');P(ctx,0,86,320,2,'#ff5c9d');P(ctx,0,110,320,2,'#6fb3ff');
      for(let i=0;i<12;i++)P(ctx,((i*37+clock*300)%360)-20,90+(i%5)*4,24,1,'rgba(255,255,255,.2)');
      fText(f.round===3?'RONDA FINAL':'RONDA '+f.round,160,104,14,'#ffd23f');ctx.restore();}
    if(t2>=1.1){const k=Math.min(1,(t2-1.1)/.15),sc=1+(1-k)*1.8;ctx.save();ctx.translate(160,98);ctx.scale(sc,sc);ctx.globalAlpha=Math.min(1,(1.6-t2)*4);fText('¡PELEA!',0,6,20,'#ff5c9d','#000');ctx.restore();ctx.globalAlpha=1;}
  }""")
open(p,'w',encoding='utf-8').write(s)
print('ok')
