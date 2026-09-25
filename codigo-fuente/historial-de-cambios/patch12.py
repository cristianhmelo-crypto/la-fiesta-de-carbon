p='fiesta-carbon.html'; s=open(p,encoding='utf-8').read()
rd=lambda f:open('parts/'+f,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)>=n, 'MISSING: '+a[:90]
    s=s.replace(a,b,n)

rep("   tip:'Pensá el orden: primero los favores, después los fiesteros. Aceptá los desafíos solo si estás listo para ganar.'}\n];","""   tip:'Pensá el orden: primero los favores, después los fiesteros. Aceptá los desafíos solo si estás listo para ganar.'},
  {name:'La fiesta imposible',map:MAP3,time:120,impossible:true,arrivals:8,cats:['humo','rulo','sombra','luna','bigotes','tigre','pelusa','mostaza','pirata','garra','manchita','copito','canela','nube','nieve','chispa','oreo','lola'],mess:12,boxes:2,party:4,
   story:'Se corrió la voz y vino todo el barrio. Dieciocho invitados, y siguen llegando más por la puerta.',
   tip:'Esta fiesta no la para nadie. Hacé lo que puedas mientras dure...'},
  {name:'¡Sálvese quien pueda!',map:MAP3,time:50,escape:true,cats:['humo','rulo','sombra','luna','bigotes','tigre','pelusa','mostaza','pirata','garra','manchita','canela'],mess:4,boxes:0,party:0,
   story:'Tu humano abrió la puerta y vio todo. Los gatos corren despavoridos y tiran lo que encuentran, y tu humano agarró la escoba.',
   tip:'Esquivá lo que vuela y la escoba. ESPACIO: saltar (lo que tiran los gatos pasa por abajo). La escoba se esquiva saliendo de la zona roja. Tenés 3 vidas.'}
];""")
rep('/* ---------- pantallas ---------- */',rd('escape.js')+'\n/* ---------- pantallas ---------- */')

# carga de nivel
rep("  LI=i;lv=LEVELS[i];map=lv.map;bg=paintMap(map);","  LI=i;lv=LEVELS[i];map=lv.map;bg=paintMap(map);H=null;CINE=null;doorOpen=0;eproj=[];camShake=0;arrT=0;musicMode='house';")

# actualización
rep("function update(dt){\n  timeLeft-=dt;\n  if(timeLeft<=0){timeLeft=0;lose();return;}","""let arrT=0;
function spawnGuest(){
  const keysT=Object.keys(TYPES),k=keysT[Math.floor(Math.random()*keysT.length)],d=TYPES[k],x=doorT[0],y=doorT[1]-1;
  cats.push({key:k,def:d,huntCd:30,hunting:false,known:false,quest:false,woke:false,carry:null,pctNeed:0,tx:x,ty:y,x:x*T+8,y:y*T+13,hp:d.hp,state:'wander',moving:false,tgt:null,spd:0,wait:.5,face:1,dir:'down',seed:Math.random()*3,anim:0,stun:0,boxT:0});
  say(x*T+8,y*T-6,'¡Llegué!','#ffd23f');SFX.meow();doorOpen=1;setTimeout(()=>{if(!(lv&&lv.escape)&&state!=='cine')doorOpen=0;},900);
}
function update(dt){
  if(lv.escape){updateEscape(dt);return;}
  timeLeft-=dt;
  if(timeLeft<=0){timeLeft=0;if(lv.impossible)startArrival();else lose();return;}
  if(lv.arrivals){arrT+=dt;if(arrT>lv.arrivals&&cats.filter(c=>c.state!=='gone').length<34){arrT=0;spawnGuest();}}""")
rep("  if(rep<=0){loseRep();return;}","  if(rep<=0&&!lv.impossible){loseRep();return;}")
rep("  if(messLeft===0&&cats.every(c=>c.state==='gone'||c.state==='boxed')){","  if(!lv.impossible&&messLeft===0&&cats.every(c=>c.state==='gone'||c.state==='boxed')){")
rep("  else if(state==='fight'&&F)updateFight(dt);","  else if(state==='fight'&&F)updateFight(dt);\n  else if(state==='cine'&&CINE){updateCine(dt);cats.forEach(c=>{c.anim+=dt;});}")

# gatos en pánico
rep("  if(c.state==='hunt')return;","""  if(c.state==='hunt')return;
  if(c.state==='panic'){const opts=shuffle(DIRS.slice()).filter(([dx,dy])=>catWalkable(c.tx+dx,c.ty+dy,false));if(opts.length){const [dx,dy]=opts[0];moveCat(c,c.tx+dx,c.ty+dy,72+Math.random()*24);}return;}""")
rep("moveCat(c,nx,ny,c.state==='fleeing'?62:44)","moveCat(c,nx,ny,c.state==='fleeing'?62:(lv&&lv.escape?92:44))")
rep("  const x=Math.round(c.x-8),y=Math.round(c.y-14);\n  softShadow(x,y);","  const hop=c.scared>0?Math.round(Math.abs(Math.sin(c.scared*9))*5):0,x=Math.round(c.x-8),y=Math.round(c.y-14)-hop;\n  softShadow(x,y+hop);")
rep("  if(c.carry){P(ctx,x+9,y+10+bob,4,3,'#9a98aa');","  if(c.scared>0||c.warnThrow||c.state==='panic'&&Math.floor(clock*2+c.seed)%3===0){const bx=x+10,by=y-10+Math.round(Math.sin(clock*9)*1.5),col=c.warnThrow?'#ff5c9d':'#ffd23f';P(ctx,bx-1,by-1,6,9,'#1b1530');P(ctx,bx,by,4,7,col);P(ctx,bx+1,by+1,2,3,'#ffffff');P(ctx,bx+1,by+5,2,1,'#ffffff');}\n  if(c.carry){P(ctx,x+9,y+10+bob,4,3,'#9a98aa');")

# dibujo: puerta, zona de la escoba, humano, objetos y saltos
rep("  drawCucha();","""  drawCucha();
  drawDoorOpen();
  if(H&&H.zone&&(H.warn>0||H.sweep>0)){const z=H.zone,a=H.sweep>0?.55:(.18+.18*Math.sin(clock*22));ctx.globalAlpha=a;P(ctx,Math.round(z.x),Math.round(z.y),Math.round(z.w),Math.round(z.h),'#ff3b5c');ctx.globalAlpha=1;P(ctx,Math.round(z.x),Math.round(z.y),Math.round(z.w),1,'#ff3b5c');P(ctx,Math.round(z.x),Math.round(z.y+z.h-1),Math.round(z.w),1,'#ff3b5c');}""")
rep("  if(state!=='title'&&state!=='select')ents.push({y:player.y+.1,d:drawPlayer});","""  if(state!=='title'&&state!=='select')ents.push({y:player.y+.1,d:()=>{const j=player.jumpT>0?Math.round(Math.sin((1-player.jumpT/.45)*Math.PI)*10):0;if(j){ctx.globalAlpha=.35;P(ctx,Math.round(player.x-5),Math.round(player.y),10,2,'#000');ctx.globalAlpha=1;}if(player.inv>0&&lv&&lv.escape&&Math.floor(clock*16)%2)return;ctx.save();ctx.translate(0,-j);drawPlayer();ctx.restore();}});
  if(H&&(state==='cine'||(lv&&lv.escape)))ents.push({y:H.y,d:()=>drawHuman(H)});""")
rep("  drawDisco();\n  notes.forEach(drawNote);","  drawDisco();\n  notes.forEach(drawNote);\n  eproj.forEach(o=>{ctx.globalAlpha=.3;P(ctx,Math.round(o.x-4),Math.round(o.y+8),8,2,'#000');ctx.globalAlpha=1;ctx.save();ctx.translate(Math.round(o.x),Math.round(o.y));ctx.rotate(o.rot);ctx.drawImage(itemSpr(o.type),-8,-11);ctx.restore();});")
rep("  const k=S*Z,ox=-Math.round(camX*k),oy=-Math.round(camY*k);","  const k=S*Z,ox=-Math.round(camX*k)+Math.round((Math.random()-.5)*camShake*14),oy=-Math.round(camY*k)+Math.round((Math.random()-.5)*camShake*14);")
rep("  if(state==='play'&&timeLeft<12){ctx.fillStyle=","  if(state==='cine')drawCineOverlay();\n  if(state==='play'&&!lv.escape&&timeLeft<12){ctx.fillStyle=")
rep("  if(state==='play'&&timeLeft<14){const ph=(clock*.28)%1;","  if(doorOpen)L.push({x:doorT[0]*T+8,y:doorT[1]*T+4,r:64,a:.9*Math.min(1,doorOpen),col:'255,214,160'});\n  if(state==='play'&&!(lv&&lv.escape)&&timeLeft<14){const ph=(clock*.28)%1;")
rep("  if(state==='play'&&!player.busy&&player.stun<=0){","  if(state==='play'&&!lv.escape&&!player.busy&&player.stun<=0){")

# cámara para las cinemáticas
rep("  const talking=state==='talk'&&D&&D.cat,inGame=state==='play'||state==='pause'||state==='win'||state==='lose'||talking;\n  const tz=talking?(zoomNear?7/3:2):inGame&&zoomNear?5/3:1;",
    "  const cf=state==='cine'?cineFocus():null,talking=state==='talk'&&D&&D.cat,inGame=state==='play'||state==='pause'||state==='win'||state==='lose'||talking||!!cf;\n  const tz=cf?5/3:talking?(zoomNear?7/3:2):inGame&&zoomNear?5/3:1;")
rep("  if(talking){fx=(player.x+D.cat.x)/2;","  if(cf){fx=cf[0];fy=cf[1];}\n  if(talking){fx=(player.x+D.cat.x)/2;")

# acción = salto en el escape
rep("function doAction(){","function doAction(){\n  if(lv&&lv.escape){if(state==='play')jumpEscape();return;}")
rep("function begin(){initAudio();state='play';hide();SFX.meow();introT=4;camSnap=true;grabFocus();say(player.x,player.y-24,'¡Este sos vos!','#ffb547');}",
    "function begin(){initAudio();state='play';hide();SFX.meow();introT=4;camSnap=true;grabFocus();say(player.x,player.y-24,'¡Este sos vos!','#ffb547');if(lv.escape){escapeInit();hint.innerHTML='<b>ESPACIO</b><span>Saltar: lo que tiran los gatos pasa por abajo. A la escoba la esquivás saliendo de la zona roja.</span>';lastHint='x';}}")
rep("  else if(a==='resume')pause();","  else if(a==='resume')pause();\n  else if(a==='escbegin')begin();")

# HUD
rep('<div class="cell"><span class="label">Tu humano llega en</span>','<div class="cell"><span class="label" id="lTime">Tu humano llega en</span>')
rep('<div class="cell"><span class="label">Invitados en casa</span>','<div class="cell"><span class="label" id="lCats">Invitados en casa</span>')
rep('<div class="cell"><span class="label">Cosas tiradas</span>','<div class="cell"><span class="label" id="lMess">Cosas tiradas</span>')
rep('<div class="cell"><span class="label">En la boca</span>','<div class="cell"><span class="label" id="lHeld">En la boca</span>')
rep("  hHeld.textContent=player&&player.held?HELD_NAME[player.held.type]:'nada';","""  hHeld.textContent=player&&player.held?HELD_NAME[player.held.type]:'nada';
  const esc=!!lv.escape;
  $('#lTime').textContent=esc?'Aguantá':'Tu humano llega en';$('#lMess').textContent=esc?'Vidas':'Cosas tiradas';$('#lCats').textContent=esc?'Gatos que faltan salir':'Invitados en casa';$('#lHeld').textContent=esc?'Salto':'En la boca';
  if(esc&&player){hMess.textContent='♥'.repeat(Math.max(0,player.hp||0))+'♡'.repeat(Math.max(0,3-(player.hp||0)));hHeld.textContent=player.jumpCd>0?'cargando':'listo';}""")

# ficha del nivel
rep("  const uniq=[...new Set(lv.cats)];","  const uniq=[...new Set(lv.cats)].slice(0,lv.impossible||lv.escape?6:99);")
rep("<p class=\"facts\">Tiempo: ${fmt(lv.time)} · ${lv.cats.length} invitados · ${lv.mess} cosas tiradas · ${lv.boxes} cajas · reputación mínima para ganar: ${REP_MIN}</p>",
    "<p class=\"facts\">${lv.escape?'Aguantá '+fmt(lv.time)+' · 3 vidas · ESPACIO: saltar':lv.impossible?'Tiempo: '+fmt(lv.time)+' · '+lv.cats.length+' invitados (y siguen llegando) · nadie gana esta fiesta':'Tiempo: '+fmt(lv.time)+' · '+lv.cats.length+' invitados · '+lv.mess+' cosas tiradas · '+lv.boxes+' cajas · reputación mínima para ganar: '+REP_MIN}</p>")
rep('<button class="btn" data-act="begin">A la fiesta</button>','<button class="btn" data-act="begin">${lv.escape?\'¡A esquivar!\':\'A la fiesta\'}</button>')
open(p,'w',encoding='utf-8').write(s)
print('ok')
