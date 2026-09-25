p='fiesta-carbon.html'; s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)>=n, 'MISSING: '+a[:90]
    s=s.replace(a,b,n)

# ---- geometría flexible para poses en cuatro patas
rep("  const sh=[tx+3+ln,ty-7],shF=[tx-2+ln,ty-7],hip=[tx+2,ty+7],hipF=[tx-3,ty+7];",
    "  const sh=p.sh||[tx+3+ln,ty-7],shF=p.shF||[tx-2+ln,ty-7],hip=p.hip||[tx+2,ty+7],hipF=p.hipF||[tx-3,ty+7];")
rep("  const sw=p.tail||0,Q=[[tx-5,ty+6],[tx-13,ty+5],[tx-16,ty-6+sw],[tx-11,ty-14+sw]];",
    "  const sw=p.tail||0,Q=p.tailQ?p.tailQ.map((q,i)=>i>=2?[q[0],q[1]+sw]:q):[[tx-5,ty+6],[tx-13,ty+5],[tx-16,ty-6+sw],[tx-11,ty-14+sw]];")
rep("const kF=joint(hipF,p.ff,7,7.5,-1);","const kF=joint(hipF,p.ff,p.ll||7,p.ll2||7.5,-1);")
rep("const eF=joint(shF,p.fp,6,6.5,1);","const eF=joint(shF,p.fp,p.al||6,p.al2||6.5,1);")
rep("  ell(tx,ty,7,9.5,'torso',{tilt:ln/9.5});","  ell(tx,ty,p.trx||7,p.try||9.5,'torso',{tilt:ln/9.5});")
rep("  cap([tx+1+ln,ty-6],[hx-1,hy+5],3.7,3.4,'torso');","  cap(p.neckA||[tx+1+ln,ty-6],[hx-1,hy+5],3.7,3.4,'torso');")
rep("const k=joint(hip,p.nf,7,7.5,-1);","const k=joint(hip,p.nf,p.ll||7,p.ll2||7.5,-1);")
rep("const e=joint(sh,p.np,6,6.5,1);","const e=joint(sh,p.np,p.al||6,p.al2||6.5,1);")
rep("  slam:{np:[31,2],fp:[21,3],nf:[28,40],ff:[16,41],claws:2,mouth:'grin',hy:12,tail:-3}","""  slam:{np:[31,2],fp:[21,3],nf:[28,40],ff:[16,41],claws:2,mouth:'grin',hy:12,tail:-3},
  crouch0:{tx:22,ty:34,trx:11,try:6,sh:[30,32],shF:[28,31],hip:[15,34],hipF:[13,33],np:[33,46],fp:[29,46],nf:[19,46],ff:[12,46],al:7.5,al2:7.5,ll:6.5,ll2:7,hx:36,hy:27,neckA:[30,30],tailQ:[[12,31],[5,29],[3,20],[7,13]]},
  crouch1:{tx:22,ty:34.5,trx:11,try:6,sh:[30,32.5],shF:[28,31.5],hip:[15,34.5],hipF:[13,33.5],np:[33,46],fp:[29,46],nf:[19,46],ff:[12,46],al:7.5,al2:7.5,ll:6.5,ll2:7,hx:36,hy:28,neckA:[30,30.5],tailQ:[[12,31.5],[5,29],[2,21],[5,14]]},
  cblock:{tx:21,ty:35,trx:11,try:6,sh:[29,33],shF:[27,32],hip:[14,35],hipF:[12,34],np:[37,40],fp:[29,46],nf:[18,46],ff:[11,46],al:7.5,al2:7.5,ll:6.5,ll2:7,hx:35,hy:30,neckA:[29,31],tailQ:[[11,32],[4,31],[1,22],[4,12]],mouth:'open',claws:1},
  lowsc:{tx:24,ty:34,trx:11,try:6,sh:[32,32],shF:[30,31],hip:[17,34],hipF:[15,33],np:[48,43],fp:[31,46],nf:[21,46],ff:[14,46],al:8,al2:8.5,ll:6.5,ll2:7,hx:38,hy:28,neckA:[32,30],tailQ:[[14,31],[7,29],[4,21],[8,14]],claws:1,mouth:'grin'},
  pounce:{tx:24,ty:28,trx:12,try:5.5,sh:[33,26],shF:[31,25],hip:[15,29],hipF:[13,28],np:[45,26],fp:[43,30],nf:[6,34],ff:[8,31],al:7,al2:7,ll:6.5,ll2:7,hx:39,hy:22,neckA:[33,25],tailQ:[[12,28],[6,27],[2,25],[-2,24]],claws:2,mouth:'open'}""")
rep("dash:mk('dash'),slam:mk('slam')};","dash:mk('dash'),slam:mk('slam'),crouch:[mk('crouch0'),mk('crouch1')],cblock:mk('cblock'),lowsc:mk('lowsc'),pounce:mk('pounce')};")

# ---- ataques con altura
rep("  scratch:{start:.06,active:.08,rec:.15,range:52,dy:30,dmg:6,kb:25,chain:'scratch2'},","  scratch:{start:.06,active:.08,rec:.15,range:52,dy:30,dmg:6,kb:25,chain:'scratch2',h:'high'},")
rep("  scratch2:{start:.05,active:.08,rec:.17,range:54,dy:30,dmg:6,kb:30,chain:'heavy'},","  scratch2:{start:.05,active:.08,rec:.17,range:54,dy:30,dmg:6,kb:30,chain:'heavy',h:'high'},")
rep("heavy:{start:.11,active:.1,rec:.3,range:56,dy:50,","heavy:{h:'mid',start:.11,active:.1,rec:.3,range:56,dy:50,")
rep("  jscratch:{start:.04,active:.22,rec:.08,range:54,dy:64,dmg:10,kb:110},","  jscratch:{start:.04,active:.22,rec:.08,range:54,dy:64,dmg:10,kb:110,h:'over'},\n  lowsc:{start:.07,active:.09,rec:.2,range:58,dy:20,dmg:7,kb:50,h:'low'},")
rep("function isBlocking(fi){return fi.holdAway&&fi.y===0&&!fi.atk&&fi.hurt<=0&&fi.down<=0;}",
    "function isBlocking(fi,h){if(!(fi.holdAway&&fi.y===0&&(!fi.atk)&&fi.hurt<=0&&fi.down<=0))return false;if(h==='low')return!!fi.crouch;if(h==='over')return!fi.crouch;return true;}")
rep("  if(!opt.unblock&&isBlocking(o)){","  if(!opt.unblock&&isBlocking(o,opt.h||'mid')){")
rep("const f=F,mul=a===f.e?f.ai.dmg:1,hx=o.x-a.face*14,hy=GROUND-o.y-56;","const f=F,mul=a===f.e?f.ai.dmg:1,hx=o.x-a.face*14,hy=GROUND-o.y-(o.crouch?30:56);")
rep("if(dx>0&&dx<=A.range&&Math.abs(fi.y-o.y)<=A.dy&&o.down<=0&&o.inv<=0&&o.hp>0){a.hit=true;a.landed=landHit(fi,o,A.dmg,{kb:A.kb,knock:A.knock,launch:A.launch,big:A.big,unblock:A.unblock,bite:a.type==='bite',label:a.type==='bite'?'¡ÑAM!':a.type==='heavy'?'¡PAF!':a.type==='jscratch'?'¡ZAS!':''});}",
    "if(dx>0&&dx<=A.range&&Math.abs(fi.y-o.y)<=A.dy&&o.down<=0&&o.inv<=0&&o.hp>0&&!(A.h==='high'&&o.crouch&&o.y===0)){a.hit=true;a.landed=landHit(fi,o,A.dmg,{h:A.h,kb:A.kb,knock:A.knock,launch:A.launch,big:A.big,unblock:A.unblock,bite:a.type==='bite',label:a.type==='bite'?'¡ÑAM!':a.type==='heavy'?'¡PAF!':a.type==='jscratch'?'¡ZAS!':a.type==='lowsc'?'¡A LAS PATAS!':''});}")
rep("landHit(fi,o,D2.dmg,{kb:last?140:30,","landHit(fi,o,D2.dmg,{h:'mid',kb:last?140:30,")
rep("landHit(fi,o,ATK.pound.dmg,{kb:130,","landHit(fi,o,ATK.pound.dmg,{h:'low',kb:130,")
rep("landHit(pr.owner,o,12,{kb:pr.dir*0+120,","landHit(pr.owner,o,12,{h:'low',kb:120,")

# ---- salto felino (pounce) y estado agachado
rep("    }else if(a.type==='pound'){","""    }else if(a.type==='pounce'){
      if(fi.y===0&&a.t>.1){fi.vx*=.4;a.land=(a.land||0)+dt;if(a.land>.22)fi.atk=null;}
      else if(!a.hit){const dx=(o.x-fi.x)*fi.face;if(dx>-6&&dx<=46&&Math.abs(fi.y-o.y)<=50&&o.down<=0&&o.inv<=0&&o.hp>0){a.hit=true;landHit(fi,o,11,{h:'over',kb:130,knock:true,big:true,label:'¡SALTO FELINO!'});}}
    }else if(a.type==='pound'){""")
rep("""    const mv=(c.right?1:0)-(c.left?1:0);fi.vx=mv*(fi.holdAway?62:84);
    if(fi.y===0)fi.face=o.x>fi.x?1:-1;
    if(c.special&&fi.meter>=100&&fi.y===0)startSpecial(fi,o);""","""    if(fi.y===0)fi.face=o.x>fi.x?1:-1;
    if(c.down&&fi.y===0){
      fi.crouch=true;fi.crouchT+=dt;fi.vx=0;
      if(c.special&&fi.meter>=100)startSpecial(fi,o);
      else if(c.jump&&fi.crouchT>.12){fi.crouch=false;fi.atk={type:'pounce',t:0,hit:false};fi.vy=215;fi.vx=fi.face*245;SFX.jump();SFX.swish();}
      else if(c.scratch&&fi.cd<=0){startAtk(fi,'lowsc');}
      else if(c.bite&&fi.cd<=0){fi.crouch=false;startAtk(fi,'bite');}
      fi.x=Math.max(30,Math.min(290,fi.x));fi.trailPos.forEach(t=>t.t-=dt);fi.trailPos=fi.trailPos.filter(t=>t.t>0);return;
    }
    fi.crouch=false;fi.crouchT=0;
    const mv=(c.right?1:0)-(c.left?1:0);fi.vx=mv*(fi.holdAway?62:84);
    if(c.special&&fi.meter>=100&&fi.y===0)startSpecial(fi,o);""")
# mantener agachado durante el barrido; soltar al recibir golpes o saltar
rep("function startAtk(fi,type){fi.atk={type,t:0,hit:false,hits:0,next:0};fi.cd=.1;SFX.swish();}","function startAtk(fi,type){fi.atk={type,t:0,hit:false,hits:0,next:0};fi.crouch=type==='lowsc';fi.cd=.1;SFX.swish();}")
rep("  o.hp=Math.max(0,o.hp-dmg);o.hurt=opt.knock?.45:.3;o.atk=null;","  o.hp=Math.max(0,o.hp-dmg);o.hurt=opt.knock?.45:.3;o.atk=null;if(opt.knock||opt.launch)o.crouch=false;")
rep("Object.assign(fi,{x,y:0,vx:0,vy:0,face,hp,max:hp,trail:hp,atk:null,","Object.assign(fi,{crouch:false,crouchT:0,x,y:0,vx:0,vy:0,face,hp,max:hp,trail:hp,atk:null,")
rep("return{key,x,y:0,vx:0,vy:0,face,hp,max:hp,trail:hp,atk:null,","return{crouch:false,crouchT:0,key,x,y:0,vx:0,vy:0,face,hp,max:hp,trail:hp,atk:null,")

# ---- entrada del jugador
rep("  const pc={left:keys.left,right:keys.right,jump:f.in.jump,","  const pc={left:keys.left,right:keys.right,down:keys.down,jump:f.in.jump,")

# ---- IA: agacharse, barrer y saltar como gato
rep("  const e=F.e,p=F.p,ai=F.ai,c={left:false,right:false,jump:false,scratch:false,bite:false,special:false};","  const e=F.e,p=F.p,ai=F.ai,c={left:false,right:false,down:false,jump:false,scratch:false,bite:false,special:false};")
rep("  if(p.atk&&p.atk.aiBlock&&d<80&&p.atk.type!=='bite'){c[away]=true;return c;}","""  if(p.atk&&p.atk.aiBlock&&d<80&&p.atk.type!=='bite'){
    const t=p.atk.type;
    if(t==='lowsc'){c.down=true;c[away]=true;}
    else if(t==='jscratch'||t==='pounce'){c[away]=true;}
    else if((t==='scratch'||t==='scratch2')&&Math.random()<.5){c.down=true;}
    else c[away]=true;
    return c;}
  if(e.plan==='pounce'){c.down=true;e.planT=(e.planT||0)+dt;if(e.planT>.18){c.jump=true;e.plan='wait';e.planT=0;}return c;}""")
rep("    if(p.awayT>.25&&d<44&&r<ai.bite*3)e.plan='bite';","""    if(p.awayT>.25&&!p.crouch&&d<58&&r<ai.aggr*.6)e.plan='low';
    else if(p.crouch&&d>40&&d<130&&r<.25+LI*.08)e.plan='pounce';
    else if(p.awayT>.25&&d<44&&r<ai.bite*3)e.plan='bite';
    else if(d>70&&d<150&&r<.06+LI*.03)e.plan='pounce';""")
rep("    case 'scratch':c.scratch=true;e.plan='wait';break;","    case 'scratch':c.scratch=true;e.plan='wait';break;\n    case 'low':c.down=true;c.scratch=true;e.plan='wait';break;")

# ---- dibujo de las poses nuevas
rep("  else if(fi.block>0||(fi.holdAway&&oAtk&&fi.y===0&&!fi.atk))img=s.block;","  else if(fi.crouch&&!fi.atk&&(fi.block>0||(fi.holdAway&&oAtk)))img=s.cblock;\n  else if(fi.block>0||(fi.holdAway&&oAtk&&fi.y===0&&!fi.atk))img=s.block;")
rep("  else if(fi.atk)img=fi.atk.type==='pound'?","  else if(fi.atk&&fi.atk.type==='pounce')img=s.pounce;\n  else if(fi.atk&&fi.atk.type==='lowsc')img=s.lowsc;\n  else if(fi.crouch)img=s.crouch[Math.floor(fi.anim*2.5)%2];\n  else if(fi.atk)img=fi.atk.type==='pound'?")
rep("if(fi.block>0){ctx.globalAlpha=Math.min(1,fi.block*5);ctx.strokeStyle='#9fd8ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(fi.x+fi.face*18,dy+44,26,","if(fi.block>0){ctx.globalAlpha=Math.min(1,fi.block*5);ctx.strokeStyle='#9fd8ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(fi.x+fi.face*18,dy+(fi.crouch?68:44),fi.crouch?18:26,")
rep("if(fi.atk&&['scratch','scratch2','jscratch','heavy'].includes(fi.atk.type)&&","if(fi.atk&&fi.atk.type==='lowsc'&&fi.atk.t>.03&&fi.atk.t<.2){ctx.globalAlpha=.85;for(let k=0;k<10;k++)P(ctx,Math.round(fi.x+fi.face*(44+k*2)),GROUND-4-(k%3),2,1,k%2?'#ffd23f':'#ffffff');ctx.globalAlpha=1;}\n  if(fi.atk&&['scratch','scratch2','jscratch','heavy'].includes(fi.atk.type)&&")
# siseo cuando está agachado
rep("  if(fi.dizzy)for(let i=0;i<3;i++){const a=clock*5+i*2.1;P(ctx,Math.round(fi.x+fi.face*8+Math.cos(a)*16),","  if(fi.crouch&&!fi.atk&&fi.hurt<=0&&Math.floor(clock*3+fi.anim)%4===0){ctx.font='5px \"Press Start 2P\"';ctx.textAlign='center';ctx.fillStyle='#ff9ec4';ctx.fillText('¡FFF!',Math.round(fi.x+fi.face*34),dy+44);ctx.textAlign='left';}\n  if(fi.dizzy)for(let i=0;i<3;i++){const a=clock*5+i*2.1;P(ctx,Math.round(fi.x+fi.face*8+Math.cos(a)*16),")

# ---- textos de ayuda
rep("fText('ESPACIO x3 = COMBO · X = MORDIDA',160,190,5,'#f4ead5');fText('ALEJARTE = CUBRIRTE · C = ESPECIAL',160,200,5,'#f4ead5');",
    "fText('ESPACIO x3 = COMBO · X = MORDIDA · C = ESPECIAL',160,184,5,'#f4ead5');fText('↓ = 4 PATAS · ↓+ESPACIO = BARRIDO · ↓ Y ↑ = SALTO FELINO',160,193,5,'#f4ead5');fText('ALEJARTE = CUBRIRTE (PARADO ARRIBA, EN 4 PATAS ABAJO)',160,202,5,'#f4ead5');")
rep("hint.innerHTML='<b>PELEA</b><span>← → moverte · alejarte = cubrirte · ↑ saltar · ESPACIO rasguño (3 seguidos = combo) · X mordida (rompe la guardia) · C especial cuando la barra está llena</span>';",
    "hint.innerHTML='<b>PELEA</b><span>← → moverte · alejarte = cubrirte · ↑ saltar · ↓ ponerte en 4 patas (esquivás los zarpazos altos) · ↓+ESPACIO barrido · ↓ y después ↑ salto felino · ESPACIO rasguño (3 = combo) · X mordida · C especial</span>';")
open(p,'w',encoding='utf-8').write(s)
print('ok')
