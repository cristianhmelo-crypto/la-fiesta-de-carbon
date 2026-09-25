p='fiesta-carbon.html'; s=open(p,encoding='utf-8').read()
rd=lambda f:open('parts/'+f,encoding='utf-8').read()
def rep(a,b):
    global s
    assert a in s, 'MISSING: '+a[:90]
    s=s.replace(a,b,1)
def cut(start,end):
    global s
    a=s.index(start); b=s.index(end,a); s=s[:a]+s[b:]
# quitar sprites viejos de pelea y drawFighter viejo
cut('const FSPR={};','function fighter(key,x,face,hp)')
cut('function drawFighter(fi){','function hpBar(')
# insertar módulo nuevo antes de la pelea
rep('/* ---------- pelea ---------- */', rd('fighter.js')+'/* ---------- pelea ---------- */')
# alcances
rep("""  scratch:{start:.07,active:.1,rec:.16,range:36,dy:26,dmg:7,kb:90},
  jscratch:{start:.04,active:.22,rec:.08,range:38,dy:52,dmg:11,kb:120},
  bite:{start:.2,active:.08,rec:.32,range:25,dy:20,dmg:19,kb:150}""","""  scratch:{start:.07,active:.1,rec:.16,range:52,dy:30,dmg:7,kb:90},
  jscratch:{start:.04,active:.22,rec:.08,range:54,dy:64,dmg:11,kb:120},
  bite:{start:.2,active:.08,rec:.32,range:42,dy:24,dmg:19,kb:150}""")
rep("p:fighter('carbon',92,1,100),e:fighter(c.key,228,-1,hp),","p:fighter('carbon',84,1,100),e:fighter(c.key,236,-1,hp),")
rep("fi.x=Math.max(22,Math.min(298,fi.x+fi.vx*dt));","fi.x=Math.max(30,Math.min(290,fi.x+fi.vx*dt));")
rep("{const dx=f.e.x-f.p.x;if(Math.abs(dx)<24&&Math.abs(f.e.y-f.p.y)<20){const push=(24-Math.abs(dx))/2*(dx>=0?1:-1);f.p.x=Math.max(22,Math.min(298,f.p.x-push));f.e.x=Math.max(22,Math.min(298,f.e.x+push));}}",
    "{const dx=f.e.x-f.p.x;if(Math.abs(dx)<38&&Math.abs(f.e.y-f.p.y)<30){const push=(38-Math.abs(dx))/2*(dx>=0?1:-1);f.p.x=Math.max(30,Math.min(290,f.p.x-push));f.e.x=Math.max(30,Math.min(290,f.e.x+push));}}")
# IA
rep("if(p.atk&&d<42&&","if(p.atk&&d<58&&")
rep("else if(d<27&&r<ai.bite)e.plan='bite';","else if(d<42&&r<ai.bite)e.plan='bite';")
rep("else if(d<38&&r<ai.aggr+ai.bite)e.plan='scratch';","else if(d<52&&r<ai.aggr+ai.bite)e.plan='scratch';")
rep("else if(d<38&&r<ai.aggr+ai.bite+.25)e.plan='back';","else if(d<52&&r<ai.aggr+ai.bite+.25)e.plan='back';")
rep("else if(d>=38&&r<ai.jump)e.plan='jumpatk';","else if(d>=54&&r<ai.jump)e.plan='jumpatk';")
rep("else e.plan=d>=34?'approach':'wait';","else e.plan=d>=48?'approach':'wait';")
rep("case 'bite':c[to]=true;if(d<26){c.bite=true;e.plan='wait';}break;","case 'bite':c[to]=true;if(d<41){c.bite=true;e.plan='wait';}break;")
rep("if(e.y>24&&d<44){c.scratch=true;","if(e.y>24&&d<60){c.scratch=true;")
# golpes y remate
rep("const hx=o.x-a.face*8,hy=GROUND-o.y-26;","const hx=o.x-a.face*14,hy=GROUND-o.y-56;")
rep("p.x+=((e.x-p.face*26)-p.x)*Math.min(1,dt*14);","p.x+=((e.x-p.face*42)-p.x)*Math.min(1,dt*14);")
rep("sparks(e.x,GROUND-e.y-26,40,","sparks(e.x,GROUND-e.y-56,40,")
rep("f.hatFly={x:e.x,y:GROUND-46,","f.hatFly={x:e.x,y:GROUND-90,")
rep("const x0=f.e.x-50+i*18,y0=40,len=150*k;","const x0=f.e.x-60+i*22,y0=30,len=160*k;")
# retrato VS con la pose de pelea
rep("""  const lx=Math.round(-90+k*112),rx=Math.round(330-k*132);
  ctx.drawImage(SPR.carbon.angry[0],lx,40,96,96);
  ctx.save();ctx.translate(rx+96,40);ctx.scale(-1,1);ctx.drawImage(SPR[F.e.key][TYPES[F.e.key].angry?'angry':'normal'][0],0,0,96,96);drawAcc(ctx,F.e.key,'front',0,0,6,false,0);ctx.restore();
  fText('CARBÓN',lx+48,156,9,'#ffd23f');fText(TYPES[F.e.key].name.toUpperCase(),rx+48,156,9,'#6fb3ff');""",
"""  const lx=Math.round(-170+k*160),rx=Math.round(330-k*174),bob=Math.floor(clock*3)%2;
  const fp=fightSprites('carbon').idle[bob],fe=fightSprites(F.e.key).idle[bob];
  ctx.drawImage(fp,lx,22,FW*3,FH*3);
  ctx.save();ctx.translate(rx+FW*3,22);ctx.scale(-1,1);ctx.drawImage(fe,0,0,FW*3,FH*3);ctx.restore();
  fText('CARBÓN',lx+FANCH*3,178,9,'#ffd23f');fText(TYPES[F.e.key].name.toUpperCase(),rx+FW*3-FANCH*3,178,9,'#6fb3ff');""")
rep("""  if(t>.8){ctx.font='6px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#f4ead5';ctx.fillText('DIFICULTAD',160,180);ctx.textAlign='left';for(let i=0;i<5;i++)P(ctx,140+i*9,186,7,7,i<=LI?'#ff5c9d':'#3a2f5f');}""",
"""  if(t>.8){ctx.font='6px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#f4ead5';ctx.fillText('DIFICULTAD',160,16);ctx.textAlign='left';for(let i=0;i<5;i++)P(ctx,138+i*9,22,7,7,i<=LI?'#ff5c9d':'#3a2f5f');}""")
open(p,'w',encoding='utf-8').write(s)
print('ok')
