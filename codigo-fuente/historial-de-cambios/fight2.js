/* ---------- pelea ---------- */
const GROUND=178,GRAV=720;
const ATK={
  scratch:{start:.06,active:.08,rec:.15,range:52,dy:30,dmg:6,kb:60,chain:'scratch2'},
  scratch2:{start:.05,active:.08,rec:.17,range:54,dy:30,dmg:6,kb:70,chain:'heavy'},
  heavy:{start:.11,active:.1,rec:.3,range:50,dy:50,dmg:12,kb:120,knock:true,launch:230,big:true},
  jscratch:{start:.04,active:.22,rec:.08,range:54,dy:64,dmg:10,kb:110},
  bite:{start:.18,active:.08,rec:.34,range:42,dy:24,dmg:15,kb:150,knock:true,unblock:true,big:true},
  dash:{dur:.62,rec:.25,dmg:4,hits:5,range:40},
  pound:{rec:.35,dmg:12}
};
const SPECIAL_OF={carbon:'shadow',tigre:'pound',garra:'pound',rulo:'pound',nube:'pound',lola:'pound'};
const SPECIAL_NAME={shadow:'TORMENTA DE SOMBRAS',fury:'FURIA DE GARRAS',pound:'PANZAZO SÍSMICO'};
const specialOf=k=>SPECIAL_OF[k]||'fury';
let F=null;
function fighter(key,x,face,hp){return{key,x,y:0,vx:0,vy:0,face,hp,max:hp,trail:hp,atk:null,hurt:0,down:0,inv:0,block:0,holdAway:false,awayT:0,meter:0,combo:0,comboT:0,anim:Math.random(),cd:0,think:.9,plan:'wait',trailPos:[]};}
function startFight(c,mode){
  snapCat(c);
  for(const k in keys)keys[k]=false;
  const hp=Math.round(55+c.def.hp*9+LI*10);
  const others=cats.filter(o=>o!==c&&o.state!=='gone').map(o=>o.key);
  const pool=['manchita','copito','tigre','humo','luna','rulo','nieve','chispa'];
  while(others.length<8)others.push(pool[Math.floor(Math.random()*pool.length)]);
  shuffle(others);
  const ang=c.def.angry?1:0;
  F={cat:c,mode:mode||'bully',phase:'intro',phaseT:0,time:40,round:1,wins:{p:0,e:0},shake:0,flash:0,hitstop:0,slow:0,superT:0,superBy:null,fx:[],proj:[],cheers:[],banner:null,fatHit:false,
    p:fighter('carbon',84,1,100),e:fighter(c.key,236,-1,hp),eMax:hp,
    ai:{react:Math.max(.12,.6-LI*.1-ang*.06),aggr:.28+LI*.1+ang*.1,bite:.07+LI*.05,dmg:.72+LI*.12,jump:.1+LI*.05,block:Math.min(.7,.08+LI*.15+ang*.05),combo:Math.min(.85,.15+LI*.18)},
    crowd:others.slice(0,8).map((k,i)=>({key:k,x:26+i*38+(Math.random()*8-4),seed:Math.random()*4})),
    in:{jump:false,scratch:false,bite:false,special:false}};
  state='fight';musicMode='fight';lastHint='';
  hint.innerHTML='<b>PELEA</b><span>← → moverte · alejarte = cubrirte · ↑ saltar · ESPACIO rasguño (3 seguidos = combo) · X mordida (rompe la guardia) · C especial cuando la barra está llena</span>';
  SFX.vs();
}
function resetRound(){
  const f=F;f.time=40;f.proj=[];
  [[f.p,84,1,100],[f.e,236,-1,f.eMax]].forEach(([fi,x,face,hp])=>{Object.assign(fi,{x,y:0,vx:0,vy:0,face,hp,max:hp,trail:hp,atk:null,hurt:0,down:0,inv:0,block:0,combo:0,dizzy:false,fly:null,trailPos:[]});});
}
function fcheer(){const m=F.crowd[Math.floor(Math.random()*F.crowd.length)];F.cheers.push({x:m.x,y:112,t:1.1,text:['¡Dale!','¡Miau!','¡Pelea!','¡Uuuh!','¡Vamos!','¡Fiu fiu!','¡Qué golpe!'][Math.floor(Math.random()*7)]});}
function sparks(x,y,n,cols,spd=1){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=(40+Math.random()*90)*spd;F.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,t:.35+Math.random()*.3,col:cols[i%cols.length]});}}
function isBlocking(fi){return fi.holdAway&&fi.y===0&&!fi.atk&&fi.hurt<=0&&fi.down<=0;}
function landHit(a,o,dmgBase,opt){
  const f=F,mul=a===f.e?f.ai.dmg:1,hx=o.x-a.face*14,hy=GROUND-o.y-56;
  if(!opt.unblock&&isBlocking(o)){
    const chip=Math.max(1,Math.round(dmgBase*mul*.15));o.hp=Math.max(1,o.hp-chip);o.block=.2;o.vx=a.face*45;
    a.meter=Math.min(100,a.meter+5);o.meter=Math.min(100,o.meter+7);
    sparks(hx,hy,8,['#9fd8ff','#ffffff','#6fb3ff'],.7);f.hitstop=.05;SFX.block();
    f.cheers.push({x:hx,y:hy-12,t:.6,text:'¡CUBIERTO!',big:true,col:'#9fd8ff'});return false;
  }
  const dmg=Math.round(dmgBase*mul*(.9+Math.random()*.2));
  a.combo=(o.hurt>0||o.down>0||o.y>0)&&a.comboT>0?a.combo+1:1;a.comboT=.9;
  o.hp=Math.max(0,o.hp-dmg);o.hurt=opt.knock?.45:.3;o.atk=null;o.vx=a.face*(opt.kb||80);
  if(opt.launch)o.vy=opt.launch;else if(o.y>0)o.vy=Math.max(o.vy,90);
  if(opt.knock)o.knockPending=true;
  a.meter=Math.min(100,a.meter+10);o.meter=Math.min(100,o.meter+6);
  f.hitstop=opt.big?.12:.07;f.shake=opt.big?.8:.35;
  sparks(hx,hy,opt.big?18:10,opt.big?['#ffffff','#ff5c9d','#ffd23f']:['#ffffff','#ffd23f'],opt.big?1.3:1);
  f.cheers.push({x:hx,y:hy-14,t:.8,text:(opt.label?opt.label+' ':'')+'-'+dmg,big:true});
  if(a.combo>=2)f.banner={text:a.combo+' GOLPES',t:1,side:a===f.p?-1:1};
  (opt.bite?SFX.bite:SFX.hit)();
  if(Math.random()<.6)fcheer();
  return true;
}
function startAtk(fi,type){fi.atk={type,t:0,hit:false,hits:0,next:0};fi.cd=.1;SFX.swish();}
function startSpecial(fi,o){
  const sp=specialOf(fi.key);fi.meter=0;F.superT=.55;F.superBy=fi;F.flash=.35;SFX.power();
  F.banner={text:SPECIAL_NAME[sp],t:1.6,side:0,sp:true};
  if(sp==='pound'){fi.atk={type:'pound',t:0,air:true,hit:false};fi.vy=340;fi.vx=Math.max(-190,Math.min(190,(o.x-fi.x)/0.95));}
  else{fi.atk={type:'dash',sp,t:0,hits:0,next:.05};}
}
function fighterStep(fi,o,dt,c){
  fi.anim+=dt;fi.cd=Math.max(0,fi.cd-dt);fi.comboT=Math.max(0,fi.comboT-dt);fi.inv=Math.max(0,fi.inv-dt);
  const away=o.x>fi.x?'left':'right';
  fi.holdAway=!!c[away];fi.awayT=fi.holdAway?fi.awayT+dt:0;
  if(fi.down>0){fi.down-=dt;fi.vx*=Math.pow(.01,dt);if(fi.down<=0){fi.inv=.35;SFX.jump();}}
  else if(fi.hurt>0){fi.hurt-=dt;fi.vx*=Math.pow(.02,dt);if(fi.hurt<=0&&fi.knockPending&&fi.y===0){fi.knockPending=false;fi.down=.8;}}
  else if(fi.block>0){fi.block-=dt;fi.vx*=Math.pow(.02,dt);}
  else if(fi.atk){
    const a=fi.atk;a.t+=dt;
    if(a.type==='dash'){
      const D2=ATK.dash;
      if(a.t<D2.dur){fi.vx=fi.face*280;fi.trailPos.push({x:fi.x,y:fi.y,t:.25});
        a.next-=dt;if(a.next<=0&&a.hits<D2.hits&&Math.abs(o.x-fi.x)<D2.range&&Math.abs(o.y-fi.y)<40&&o.down<=0&&o.inv<=0&&o.hp>0){a.next=.1;a.hits++;const last=a.hits===D2.hits;landHit(fi,o,D2.dmg,{kb:last?140:30,knock:last,big:last,label:last?'¡ZAS!':''});if(last)a.t=D2.dur;}}
      else{fi.vx=0;if(a.t>D2.dur+D2.rec)fi.atk=null;}
    }else if(a.type==='pound'){
      if(a.air){if(fi.y===0&&a.t>.1){a.air=false;a.t=0;F.shake=1;SFX.ko();sparks(fi.x,GROUND-4,20,['#ffd23f','#ff9a3c','#ffffff']);
          F.proj.push({x:fi.x,dir:1,owner:fi,t:0},{x:fi.x,dir:-1,owner:fi,t:0});
          if(Math.abs(o.x-fi.x)<34&&o.y<20&&o.down<=0&&o.inv<=0)landHit(fi,o,ATK.pound.dmg,{kb:130,knock:true,big:true,label:'¡PUM!'});fi.vx=0;}}
      else if(a.t>ATK.pound.rec)fi.atk=null;
    }else{
      const A=ATK[a.type];
      if(a.type==='bite'&&a.t<A.start)fi.vx=fi.face*70;else if(fi.y===0)fi.vx*=.7;
      if(!a.hit&&a.t>=A.start&&a.t<=A.start+A.active){
        const dx=(o.x-fi.x)*fi.face;
        if(dx>0&&dx<=A.range&&Math.abs(fi.y-o.y)<=A.dy&&o.hurt<=0&&o.down<=0&&o.inv<=0&&o.hp>0){a.hit=true;a.landed=landHit(fi,o,A.dmg,{kb:A.kb,knock:A.knock,launch:A.launch,big:A.big,unblock:A.unblock,bite:a.type==='bite',label:a.type==='bite'?'¡ÑAM!':a.type==='heavy'?'¡PAF!':a.type==='jscratch'?'¡ZAS!':''});}
        else if(A.unblock===undefined&&false){}
      }
      if(c.scratch&&A.chain&&a.t>=A.start)a.queued=true;
      if(a.t>=A.start+A.active+A.rec*(a.queued&&a.hit?.35:1)){
        if(a.queued&&a.hit&&A.chain){startAtk(fi,A.chain);}else fi.atk=null;
      }
    }
  }else{
    const mv=(c.right?1:0)-(c.left?1:0);fi.vx=mv*(fi.holdAway?62:84);
    if(fi.y===0)fi.face=o.x>fi.x?1:-1;
    if(c.special&&fi.meter>=100&&fi.y===0)startSpecial(fi,o);
    else if(c.jump&&fi.y===0){fi.vy=255;SFX.jump();}
    else if(c.scratch&&fi.cd<=0)startAtk(fi,fi.y>0?'jscratch':'scratch');
    else if(c.bite&&fi.cd<=0&&fi.y===0)startAtk(fi,'bite');
  }
  if(fi.y>0||fi.vy!==0){fi.vy-=GRAV*dt;fi.y+=fi.vy*dt;if(fi.y<=0){fi.y=0;fi.vy=0;if(fi.atk&&fi.atk.type==='jscratch')fi.atk=null;if(fi.knockPending&&fi.hurt<=0){fi.knockPending=false;fi.down=.8;}}}
  fi.x=Math.max(30,Math.min(290,fi.x+fi.vx*dt));
  fi.trailPos.forEach(t=>t.t-=dt);fi.trailPos=fi.trailPos.filter(t=>t.t>0);
}
function aiCtrl(dt){
  const e=F.e,p=F.p,ai=F.ai,c={left:false,right:false,jump:false,scratch:false,bite:false,special:false};
  const d=Math.abs(p.x-e.x),to=p.x>e.x?'right':'left',away=to==='right'?'left':'right';
  if(e.atk&&(e.atk.type==='scratch'||e.atk.type==='scratch2')&&e.atk.hit&&e.atk.landed&&Math.random()<ai.combo)c.scratch=true;
  if(e.atk)return c;
  if(p.atk&&!p.atk.aiSeen){p.atk.aiSeen=true;p.atk.aiBlock=Math.random()<ai.block;}
  if(F.proj.some(pr=>pr.owner===p&&Math.abs(pr.x-e.x)<70)&&e.y===0&&Math.random()<ai.block+.2){c.jump=true;return c;}
  if(p.atk&&p.atk.aiBlock&&d<80&&p.atk.type!=='bite'){c[away]=true;return c;}
  if(e.meter>=100&&(specialOf(e.key)==='pound'?d<150:d<130)&&Math.random()<dt*1.5+LI*.01){c.special=true;return c;}
  e.think-=dt;
  if(e.think<=0){
    e.think=ai.react*(.7+Math.random()*.6);
    const r=Math.random();
    if(p.awayT>.25&&d<44&&r<ai.bite*3)e.plan='bite';
    else if(d<42&&r<ai.bite)e.plan='bite';
    else if(d<52&&r<ai.aggr+ai.bite)e.plan='scratch';
    else if(d<52&&r<ai.aggr+ai.bite+.25)e.plan='back';
    else if(d>=54&&r<ai.jump)e.plan='jumpatk';
    else e.plan=d>=48?'approach':'wait';
  }
  switch(e.plan){
    case 'approach':c[to]=true;break;
    case 'back':c[away]=true;break;
    case 'scratch':c.scratch=true;e.plan='wait';break;
    case 'bite':c[to]=true;if(d<41){c.bite=true;e.plan='wait';}break;
    case 'jump':c.jump=true;e.plan='wait';break;
    case 'jumpatk':c.jump=true;c[to]=true;e.plan='airatk';break;
    case 'airatk':c[to]=true;if(e.y>24&&d<60){c.scratch=true;e.plan='wait';}if(e.y===0&&e.vy===0)e.plan='wait';break;
  }
  return c;
}
function updateProj(dt){
  const f=F;
  f.proj.forEach(pr=>{pr.t+=dt;pr.x+=pr.dir*210*dt;const o=pr.owner===f.p?f.e:f.p;
    if(!pr.done&&Math.abs(pr.x-o.x)<16&&o.y<12&&o.down<=0&&o.inv<=0&&o.hp>0){pr.done=true;landHit(pr.owner,o,12,{kb:pr.dir*0+120,knock:true,big:true,label:'¡PUM!'});}});
  f.proj=f.proj.filter(pr=>!pr.done&&pr.t<1.3&&pr.x>0&&pr.x<320);
}
function roundOver(pWon){
  const f=F;if(pWon)f.wins.p++;else f.wins.e++;
  const final=f.wins.p>=2||f.wins.e>=2,loser=pWon?f.e:f.p,winner=pWon?f.p:f.e;
  f.perfect=winner.hp>=winner.max;f.slow=final?1.1:.6;
  if(final&&pWon){toFinish();return;}
  if(final){f.phase='lose';f.phaseT=0;SFX.lose();return;}
  loser.down=9;loser.hurt=0;loser.atk=null;f.phase='roundEnd';f.phaseT=0;f.roundWinner=pWon?'p':'e';SFX.ko();
}
function updateFight(rdt){
  const f=F;
  let dt=rdt;if(f.slow>0){f.slow-=rdt;dt=rdt*.3;}
  f.phaseT+=dt;f.shake=Math.max(0,f.shake-rdt*2.5);f.flash=Math.max(0,f.flash-rdt*2.2);
  [f.p,f.e].forEach(x=>{x.trail+=(x.hp-x.trail)*Math.min(1,rdt*2.2);});
  f.fx.forEach(p=>{p.t-=rdt;p.x+=p.vx*rdt;p.y+=p.vy*rdt;p.vy+=260*rdt;});f.fx=f.fx.filter(p=>p.t>0);
  f.cheers.forEach(p=>{p.t-=rdt;p.y-=14*rdt;});f.cheers=f.cheers.filter(p=>p.t>0);
  if(f.banner){f.banner.t-=rdt;if(f.banner.t<=0)f.banner=null;}
  if(Math.random()<rdt*(f.phase==='fatality'?6:1.2))fcheer();
  const pc={left:keys.left,right:keys.right,jump:f.in.jump,scratch:f.in.scratch,bite:f.in.bite,special:f.in.special};
  f.in={jump:false,scratch:false,bite:false,special:false};
  if(f.superT>0){f.superT-=rdt;return;}
  if(f.hitstop>0){f.hitstop-=rdt;return;}
  const none={};
  switch(f.phase){
    case 'intro':if(f.phaseT>2.1){f.phase='ready';f.phaseT=0;SFX.bell();}break;
    case 'ready':fighterStep(f.p,f.e,dt,none);fighterStep(f.e,f.p,dt,none);if(f.phaseT>1.4){f.phase='fight';f.phaseT=0;}break;
    case 'fight':
      f.time-=dt;
      fighterStep(f.p,f.e,dt,pc);fighterStep(f.e,f.p,dt,aiCtrl(dt));updateProj(dt);
      {const dash=(f.p.atk&&f.p.atk.type==='dash')||(f.e.atk&&f.e.atk.type==='dash');const dx=f.e.x-f.p.x;
       if(!dash&&Math.abs(dx)<38&&Math.abs(f.e.y-f.p.y)<30&&f.e.down<=0&&f.p.down<=0){const push=(38-Math.abs(dx))/2*(dx>=0?1:-1);f.p.x=Math.max(30,Math.min(290,f.p.x-push));f.e.x=Math.max(30,Math.min(290,f.e.x+push));}}
      if(f.e.hp<=0)roundOver(true);
      else if(f.p.hp<=0)roundOver(false);
      else if(f.time<=0)roundOver(f.p.hp/f.p.max>=f.e.hp/f.e.max);
      break;
    case 'roundEnd':
      fighterStep(f.p,f.e,dt,none);fighterStep(f.e,f.p,dt,none);
      if(f.phaseT>2.4){f.round++;resetRound();f.phase='ready';f.phaseT=0;SFX.bell();}
      break;
    case 'finish':
      f.p.y=Math.max(0,f.p.y);fighterStep(f.p,f.e,dt,{left:pc.left,right:pc.right});
      if(pc.scratch||pc.bite||pc.special){f.phase='fatality';f.phaseT=0;f.p.face=f.e.x>f.p.x?1:-1;SFX.power();hint.innerHTML='<b>PELEA</b><span>¡Golpe final de Carbón!</span>';}
      else if(f.phaseT>3.5){f.phase='ko';f.phaseT=0;}
      break;
    case 'fatality':{
      const t=f.phaseT,p=f.p,e=f.e;
      if(t>.4&&t<.75){p.x+=((e.x-p.face*42)-p.x)*Math.min(1,dt*14);p.atk={type:'scratch',t:.1,hit:true};}
      if(!f.fatHit&&t>=.75){f.fatHit=true;f.flash=1;f.shake=1.3;SFX.fatality();e.fly={vx:p.face*230,vy:330,rot:0};e.dizzy=false;sparks(e.x,GROUND-e.y-56,40,['#ffffff','#ff5c9d','#ffd23f','#5fe0b0']);if(ACC[e.key]&&ACC[e.key].includes('hat'))f.hatFly={x:e.x,y:GROUND-90,vx:-p.face*60,vy:-160,r:0};}
      if(e.fly){e.fly.vy-=GRAV*.6*dt;e.x+=e.fly.vx*dt;e.y+=e.fly.vy*dt;e.fly.rot+=dt*14*p.face;}
      if(f.hatFly){const h=f.hatFly;h.vy+=400*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.r+=dt*8;if(h.y>GROUND-6){h.y=GROUND-6;h.vy*=-.3;h.vx*=.6;}}
      if(t>1.1)p.atk=null;
      if(t>3.6)exitFight(true,true);
      break;}
    case 'ko':if(f.phaseT>1.9)exitFight(true,false);break;
    case 'lose':if(f.phaseT>2.6)exitFight(false,false);break;
  }
}
function toFinish(){const f=F;f.phase='finish';f.phaseT=0;f.e.hp=0;f.e.atk=null;f.e.hurt=0;f.e.down=0;f.e.knockPending=false;f.e.dizzy=true;f.e.vx=0;f.e.y=0;f.e.vy=0;f.p.atk=null;f.proj=[];SFX.ko();
  hint.innerHTML='<b>ESPACIO</b><span>¡Rematalo! Apretá ESPACIO para el golpe final.</span>';}
function exitFight(win,fatal){
  const c=F.cat,mode=F.mode;F=null;state='play';musicMode='house';lastHint='';camSnap=true;
  if(win){
    dropToy(c);c.state='fleeing';c.path=null;c.hp=0;c.moving=false;stats.fight++;if(fatal)stats.fatal++;
    say(c.x,c.y-20,fatal?'¡Nunca más!':'¡Me voy!','#ffd23f');SFX.meow();
    let d=mode==='defense'?5:mode==='challenged'?3:-5;if(fatal&&mode==='bully')d-=5;addRep(d);
  }else{c.hp=c.def.hp;player.stun=1.2;timeLeft=Math.max(1,timeLeft-8);say(player.x,player.y-24,'¡Perdiste! -8 s','#ff5c9d');addRep(mode==='challenged'?-8:-5);c.huntCd=25;}
  grabFocus();
}
