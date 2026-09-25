p='fiesta-carbon.html'; s=open(p,encoding='utf-8').read()
rd=lambda f:open('parts/'+f,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)>=n, 'MISSING: '+a[:90]
    s=s.replace(a,b,n)
def splice(start,end,new):
    global s
    a=s.index(start); b=s.index(end,a); s=s[:a]+new+s[b:]

splice("Object.assign(PALS,{\n  bigotes","const FRONT=[",rd('types.js'))
rep('/* ---------- pelea ---------- */',rd('faces.js')+'\n/* ---------- pelea ---------- */')
splice('/* ---------- reputación ---------- */','/* ---------- pantallas ---------- */',rd('social2.js')+'\n')

rep("canela:['bowtie']});","canela:['bowtie'],garra:['scar'],pirata:['patch'],nieve:['bowtie'],chispa:['hat'],lola:['bottle']});\nHATC.chispa=['#ff5c9d','#5fe0b0'];")
rep("    if(a==='bowtie'){","""    if(a==='patch'){if(view==='front'){R(8,5,3,2,'#141018');R(3,4,5,1,'#141018');}if(view==='side')R(12,6,3,2,'#141018');}
    if(a==='scar'){if(view==='front')R(9,4,1,3,'#e07a8a');if(view==='side')R(13,5,1,3,'#e07a8a');}
    if(a==='bowtie'){""")
rep("  /* contorno */\n  const out=buf.slice();\n  for(let y=0;y<FH;y++)","""  if(acc.includes('patch')){for(let y=hy-2;y<=hy+1;y++)for(let x=hx+1;x<=hx+5;x++)put(x,y,'#141018');for(let x=hx-7;x<=hx+1;x++)put(x,hy-4+Math.round((x-hx)*.15),'#141018');}
  if(acc.includes('scar')){[[2,-5],[3,-4],[3,-3],[4,-2],[4,0],[5,1]].forEach(([a,b])=>put(hx+a,hy+b,'#e07a8a'));}
  /* contorno */
  const out=buf.slice();
  for(let y=0;y<FH;y++)""")
rep("FPAT.nube=FPAT.manchita;","FPAT.nube=FPAT.manchita;FPAT.garra=FPAT.tigre;FPAT.pirata=FPAT.rulo;FPAT.oreo=FPAT.rulo;FPAT.lola=FPAT.manchita;FPAT.chispa=FPAT.manchita;")
rep("(key==='carbon'||key==='rulo'||key==='sombra')","DARKCATS.has(key)",2)

rep("const LOST={collar:'el collar rojo',mono:'el moño de seda',lana:'la pelota de lana'};","""const LOST={collar:'el collar rojo',mono:'el moño de seda',lana:'la pelota de lana',disco:'el disco de vinilo'};
ITEM_DRAW.disco=(g,x,y)=>{P(g,x+3,y+13,10,2,'rgba(0,0,0,.25)');P(g,x+4,y+6,8,8,'#15121c');P(g,x+3,y+7,10,6,'#15121c');P(g,x+5,y+7,3,1,'#4a4658');P(g,x+4,y+9,1,2,'#4a4658');P(g,x+7,y+9,2,2,'#ff5c9d');P(g,x+7,y+9,1,1,'#ffd23f');};
HELD_NAME.disco='disco';""")

rep("cats.push({key:k,def:d,known:false,","cats.push({key:k,def:d,huntCd:(d.pers==='agresivo'?28:14)+Math.random()*14,hunting:false,known:false,")
rep("rep=70;const thief=","rep=70;buildHideGroups();const thief=")

rep("if(c.state!=='wander'&&c.state!=='sleep')continue;","if(c.state!=='wander'&&c.state!=='sleep'&&c.state!=='hunt')continue;")
rep("  const fr=nearestTileOf(fridges,11);\n  if(fr&&(!cat||fr.d<cat.d))","  const hs=nearHide();\n  if(hs&&(!cat||hs.d<cat.d))return{label:'Buscar en '+hs.g.name,tx:hs.x*T+8,ty:hs.y*T,run:()=>searchSpot(hs)};\n  const fr=nearestTileOf(fridges,11);\n  if(fr&&(!cat||fr.d<cat.d))")
rep("  if(p.busy){\n    p.busy.t+=dt;p.moving=false;","  if(p.busy&&p.busy.search){p.busy.t+=dt;p.moving=false;if(p.busy.t>=p.busy.dur){const hs=p.busy.search;p.busy=null;finishSearch(hs);}return;}\n  if(p.busy){\n    p.busy.t+=dt;p.moving=false;")
rep("  items=items.filter(it=>!(it.kind==='lost'&&","  hidden=hidden.filter(h=>!['gone','leaving','fleeing','boxed'].includes(h.owner.state));\n  items=items.filter(it=>!(it.kind==='lost'&&")

rep("function updateCat(c,dt){\n  if(c.state==='gone')return;\n  c.anim+=dt;","function updateCat(c,dt){\n  if(c.state==='gone')return;\n  c.anim+=dt;\n  if(c.state!=='boxed'&&c.state!=='sleep'&&updateHunt(c,dt))return;")
rep("""    if(d<=st){c.x=gx;c.y=gy;c.tx=c.tgt[0];c.ty=c.tgt[1];c.moving=false;onArrive(c);}else{c.x+=dx/d*st;c.y+=dy/d*st;}
    return;
  }""","""    if(d<=st){c.x=gx;c.y=gy;c.tx=c.tgt[0];c.ty=c.tgt[1];c.moving=false;onArrive(c);}else{c.x+=dx/d*st;c.y+=dy/d*st;}
    return;
  }
  if(c.state==='hunt')return;""")
rep("  if(player&&state==='play'&&(c.state==='wander'||c.state==='sleep')&&dist(c.x,c.y,player.x,player.y)<44){","""  if(c.state==='hunt'){const bx=x+10,by=y-9+Math.round(Math.sin(clock*8)*1.5);P(ctx,bx-1,by-1,6,8,'#1b1530');P(ctx,bx,by,4,6,'#ff5c9d');P(ctx,bx+1,by+1,2,3,'#ffffff');P(ctx,bx+1,by+5,2,1,'#ffffff');}
  else if(player&&state==='play'&&(c.state==='wander'||c.state==='sleep')&&dist(c.x,c.y,player.x,player.y)<44){""")

rep("F={cat:c,defense:!!defense,","F={cat:c,mode:defense||'bully',")
rep("const c=F.cat,def=F.defense;","const c=F.cat,mode=F.mode;")
rep("let d=def?(c.def.pers==='okupa'?5:0):-5;if(fatal&&c.def.pers!=='okupa')d-=5;addRep(d);","let d=mode==='defense'?5:mode==='challenged'?3:-5;if(fatal&&mode==='bully')d-=5;addRep(d);")
rep("say(player.x,player.y-24,'¡Perdiste! -8 s','#ff5c9d');addRep(-5);}","say(player.x,player.y-24,'¡Perdiste! -8 s','#ff5c9d');addRep(mode==='challenged'?-8:-5);c.huntCd=25;}")
rep("if(t>.35){const sc=t<.55?1+(.55-t)*6:1;fText('VS',160,112,Math.round(26*sc),'#ffd23f','#7a1030');}","if(t>.35){const sc=t<.55?1+(.55-t)*6:1;fText('VS',160,112,Math.round(26*sc),'#ffd23f','#7a1030');}\n  if(F.mode==='challenged'&&t>.9)fText('¡TE DESAFIÓ!',160,198,8,'#ff5c9d');")

splice('const LEVELS=[','/* ---------- guardado ---------- */',rd('levels.js')+'\n')
rep('<div class="who"><img src="${catImg[k]}" alt="">','<div class="who"><img src="${faceURL(k,TYPES[k].pers)}" alt="">')
rep(".method img,.who img{width:40px;height:40px;image-rendering:pixelated}",".method img{width:40px;height:40px;image-rendering:pixelated}\n.who img{width:56px;height:56px;image-rendering:pixelated;flex:none}")
rep(".dlg img{width:86px;height:80px;",".dlg img{width:80px;height:80px;")
rep("    else if(e.code==='Escape'){e.preventDefault();if(D.opts)closeTalk();}\n","")
open(p,'w',encoding='utf-8').write(s)
print('ok')
