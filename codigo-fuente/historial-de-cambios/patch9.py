p='fiesta-carbon.html'; s=open(p,encoding='utf-8').read()
rd=lambda f:open('parts/'+f,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)>=n, 'MISSING: '+a[:90]
    s=s.replace(a,b,n)
def splice(start,end,new):
    global s
    a=s.index(start); b=s.index(end,a); s=s[:a]+new+s[b:]

draw2=rd('draw2.js').replace("""    if(fi.atk&&fi.atk.sp==='shadow'){ctx.globalCompositeOperation='multiply';fi.trailPos.forEach(t=>{ctx.globalAlpha=t.t*2;P(ctx,Math.round(t.x-24),Math.round(GROUND-t.y-80),48,80,'#6f60c4');});ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}}""","}").replace("ctx.drawImage(shadow?s.white:s.dash,","ctx.drawImage(shadow?s.ghost:s.dash,")

# poses nuevas
rep("  power:{np:[32,3],fp:[18,4],claws:2,eyes:'glow',mouth:'grin',hy:12,tail:-3}","""  power:{np:[32,3],fp:[18,4],claws:2,eyes:'glow',mouth:'grin',hy:12,tail:-3},
  scratch2:{tx:23,lean:2,hx:30,hy:14,np:[29,25],fp:[45,18],nf:[30,46],ff:[12,46],claws:2,mouth:'grin',tail:-3},
  block:{tx:20,lean:-1,hx:25,hy:14,np:[31,11],fp:[29,14],nf:[27,46],ff:[13,46],tail:-2},
  heavy:{tx:23,lean:2,hx:29,hy:13,np:[37,1],fp:[27,23],nf:[30,46],ff:[13,46],claws:1,mouth:'grin',tail:4},
  dash:{tx:25,lean:4,hx:34,hy:18,np:[45,21],fp:[41,25],nf:[33,46],ff:[9,44],claws:2,mouth:'grin',tail:-4},
  slam:{np:[31,2],fp:[21,3],nf:[28,40],ff:[16,41],claws:2,mouth:'grin',hy:12,tail:-3}""")
rep("dizzy:mk('dizzy'),power:mk('power')};","dizzy:mk('dizzy'),power:mk('power'),scratch2:mk('scratch2'),block:mk('block'),heavy:mk('heavy'),dash:mk('dash'),slam:mk('slam')};\n  s.ghost=(()=>{const c=document.createElement('canvas');c.width=FW;c.height=FH;const g=c.getContext('2d');g.drawImage(s.dash,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#4a3a8e';g.fillRect(0,0,FW,FH);return c;})();")

splice('function drawFighter(fi){','/* ---------- caras para las charlas',draw2+'\n')
splice('/* ---------- pelea ---------- */','/* dibujo de la pelea */',rd('fight2.js'))
splice("  if(f.phase==='fatality'){ctx.globalAlpha=Math.min(.72,t*1.8);","function renderVS(t){",rd('rtail.js'))
rep("        else if(A.unblock===undefined&&false){}\n","")

# sonido de bloqueo
rep("  fridge:()=>{tone(1200,.05,'triangle',.05);tone(900,.08,'triangle',.05,0,.05);}","  fridge:()=>{tone(1200,.05,'triangle',.05);tone(900,.08,'triangle',.05,0,.05);},\n  block:()=>{tone(1400,.05,'square',.04);noise(.05,.04,0,3000);}")

# teclas
rep("    if(e.code==='KeyX'||e.code==='KeyK'){e.preventDefault();if(!e.repeat)F.in.bite=true;}","    if(e.code==='KeyX'||e.code==='KeyK'){e.preventDefault();if(!e.repeat)F.in.bite=true;}\n    if(e.code==='KeyC'||e.code==='KeyL'||e.code==='ShiftLeft'||e.code==='ShiftRight'){e.preventDefault();if(!e.repeat)F.in.special=true;}")
rep('<div class="abtns"><button class="abtn bbtn" id="bBtn">MORDER</button>','<div class="abtns"><button class="abtn bbtn cbtn" id="cBtn">ESPECIAL</button><button class="abtn bbtn" id="bBtn">MORDER</button>')
rep(".bbtn{width:70px;height:70px;background:var(--pink);font-size:8px;margin-bottom:26px}",".bbtn{width:70px;height:70px;background:var(--pink);font-size:8px;margin-bottom:26px}\n.cbtn{background:#6fb3ff;font-size:7px;margin-bottom:60px}")
rep("const bBtn=$('#bBtn');","const cBtn=$('#cBtn');\ncBtn.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();cBtn.classList.add('on');if(state==='fight'&&F)F.in.special=true;else if(state==='talk')advance();else doAction();});\n['pointerup','pointercancel','pointerleave'].forEach(t=>cBtn.addEventListener(t,()=>cBtn.classList.remove('on')));\nconst bBtn=$('#bBtn');")
rep("<kbd>X</kbd> morder en la pelea ·","<kbd>X</kbd> morder y <kbd>C</kbd> especial en la pelea ·")
open(p,'w',encoding='utf-8').write(s)
print('ok')
