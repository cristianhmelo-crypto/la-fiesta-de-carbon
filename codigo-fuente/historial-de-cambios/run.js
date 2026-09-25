/* ---------- la huida: carrera en primera persona ---------- */
let RN=null;
const RF=110,RHOR=78,RW2=1.8,RCH=2.4,RWIN=240;
const RCATS=['manchita','copito','tigre','humo','luna','rulo','bigotes','pelusa','nube','sombra','mostaza','canela','garra','pirata','nieve','chispa','oreo','lola'];
const rcat=()=>RCATS[Math.floor(Math.random()*RCATS.length)];
function rproj(x,y,rz){const k=RF/rz;return[160+(x-RN.camX)*k,RHOR+(RN.camH-y)*k,k];}
function rq(pts,col){ctx.fillStyle=col;ctx.beginPath();pts.forEach((p,i)=>{const s=rproj(p[0],p[1],p[2]);if(i)ctx.lineTo(s[0],s[1]);else ctx.moveTo(s[0],s[1]);});ctx.closePath();ctx.fill();}
const FOGC={};
function fogc(h,rz){const f=Math.min(.9,Math.max(0,rz/20)),k=h+Math.round(f*30);return FOGC[k]||(FOGC[k]=tint(h,-Math.round(f*30)/30));}
function startRun(){
  state='run';musicMode='fight';for(const k in keys)keys[k]=false;
  RN={phase:'look',t:0,pz:0,v:7,lane:0,camX:0,camH:1,jy:0,vy:0,slide:0,inv:0,slow:0,close:.3,hits:0,dodged:0,obs:[],runners:[],pops:[],shout:{text:'¡¡CARBÓN!!',t:1.8},shT:3,stepH:.4,ph:0,decoT:.8,tut:{},shake:0,lastStep:0};
  const R=RN;let z=18;
  while(z<RWIN-10){
    const p=z/RWIN,pool=p<.15?['sleep','box']:p<.35?['sleep','box','table','chair']:['sleep','box','table','chair','throw','cross','throw'];
    const n=p<.15?1:p<.5?(Math.random()<.35?2:1):(Math.random()<.6?2:1);
    const lanes=shuffle([-1,0,1]).slice(0,n);
    lanes.forEach((ln,i)=>{
      let type=pool[Math.floor(Math.random()*pool.length)];
      if(n===2&&i===1&&type==='cross')type='sleep';
      const o={type,x:ln,lane:ln,z:z+(i?Math.random()*.6:0),k:rcat(),done:false};
      if(type==='throw'){o.side=ln===0?(Math.random()<.5?-1:1):-ln;o.x=o.side*1.6;o.item=THROWN[Math.floor(Math.random()*THROWN.length)];}
      if(type==='cross'){o.side=Math.random()<.5?-1:1;o.x=o.side*1.7;}
      R.obs.push(o);
    });
    z+=Math.max(4.4,7.6-p*3.4)+Math.random()*2.4;
  }
  hint.innerHTML='<b>← →</b><span>Cambiar de carril. ↑ o ESPACIO: saltar gatos dormidos y cajas. ↓: agacharse bajo las mesas y lo que vuela.</span>';lastHint='x';
  SFX.vs();tone(400,.6,'sawtooth',.05,300);
}
function runKey(k){
  const R=RN;if(!R||R.phase!=='run')return;
  if(k==='left'&&R.lane>-1){R.lane--;noise(.05,.03,0,4000);}
  if(k==='right'&&R.lane<1){R.lane++;noise(.05,.03,0,4000);}
  if(k==='up'&&R.jy===0&&R.vy===0){R.vy=4.4;R.jy=.001;R.slide=0;SFX.jump();}
  if(k==='down'){if(R.jy>0)R.vy=-7;else if(R.slide<=0){R.slide=.75;noise(.25,.04,0,1400);}}
}
function runHit(o){
  const R=RN;o.hit=true;o.ht=0;R.hits++;R.slow=.9;R.inv=1;R.close=Math.min(1,R.close+.3);R.shake=.4;R.jy=0;R.vy=0;R.slide=0;
  SFX.hurt();noise(.15,.06,0,800);
  R.pops.push({text:o.type==='sleep'||o.type==='cross'?'¡MIAU!':o.type==='table'?'¡PUM!':'¡AUCH!',col:'#ff5c9d',t:.8});
  if(R.close<1)R.shout={text:['¡YA TE AGARRO!','¡VENÍ ACÁ!','¡CARBÓN!'][Math.floor(Math.random()*3)],t:1.2};
}
function updateRun(dt){
  const R=RN;if(!R)return;R.t+=dt;R.shake=Math.max(0,R.shake-dt);
  R.pops.forEach(p=>p.t-=dt);R.pops=R.pops.filter(p=>p.t>0);
  if(R.shout){R.shout.t-=dt;if(R.shout.t<=0)R.shout=null;}
  R.obs.forEach(o=>{if(o.hit)o.ht+=dt;});
  if(R.phase==='look'){if(R.t>2.1){R.phase='turn';R.t=0;SFX.swish();}return;}
  if(R.phase==='turn'){if(R.t>.35){R.phase='run';R.t=0;R.pops.push({text:'¡CORRÉ A LA VENTANA!',col:'#ffd23f',t:1.4});}return;}
  if(R.phase==='caught'){if(R.t>1.8&&!R.done){R.done=true;loseRun();}return;}
  if(R.phase==='out'){
    if(R.t>2.6&&R.t<4.8)rep=Math.max(0,R.rep0*(1-(R.t-2.6)/2.2));
    if(R.t>5.6&&!R.done){R.done=true;player.hp=R.hits===0?3:R.hits<=2?2:1;escapeCard();}
    return;
  }
  R.slow=Math.max(0,R.slow-dt);R.inv=Math.max(0,R.inv-dt);R.slide=Math.max(0,R.slide-dt);
  R.v=(7+4.2*Math.min(1,R.pz/RWIN))*(R.slow>0?.55:1);R.pz+=R.v*dt;
  R.camX+=(R.lane-R.camX)*Math.min(1,dt*14);
  if(R.jy>0||R.vy>0){R.vy-=12*dt;R.jy+=R.vy*dt;if(R.jy<=0){R.jy=0;R.vy=0;tone(180,.05,'square',.03);}}
  const th=R.slide>0?.5:1+R.jy;R.camH+=(th-R.camH)*Math.min(1,dt*16);
  R.ph+=dt*R.v*1.3;const st=Math.floor(R.ph/Math.PI);if(R.jy===0&&st!==R.lastStep){R.lastStep=st;noise(.03,.02,0,3000);}
  R.close=Math.max(0,R.close-dt*.025);
  R.stepH-=dt;if(R.stepH<=0){R.stepH=.42;tone(70,.09,'sine',.04+R.close*.14,-20);}
  R.shT-=dt;if(R.shT<=0){R.shT=2.4+Math.random()*3-R.close*1.4;R.shout={text:['¡CARBÓN!','¡VENÍ ACÁ!','¡MI CASA!','¡MIRÁ ESTE LÍO!','¡NO TE ESCAPÁS!'][Math.floor(Math.random()*5)],t:1.1};}
  for(const o of R.obs){
    const rz=o.z-R.pz;if(rz<-2||rz>26)continue;
    if(o.type==='cross'&&rz<7.5&&!o.hit){if(o.vx===undefined){o.vx=-o.side*2.7;tone(700,.08,'triangle',.04,300);}o.x+=o.vx*dt;}
    if(o.type==='throw'&&rz<10&&!o.launched){o.launched=true;o.fly=0;o.spin=0;tone(900,.12,'square',.03,-400);}
    if(o.type==='throw'&&o.launched){o.fly=Math.min(1,o.fly+dt/.7);o.x=o.side*1.6+(o.lane-o.side*1.6)*o.fly;o.spin+=dt*12;}
    if(!o.done&&rz<.4){
      o.done=true;
      if(Math.abs(o.x-R.camX)<.55&&!o.hit){
        const low=o.type==='sleep'||o.type==='box'||o.type==='cross',high=o.type==='table'||o.type==='throw';
        if((low&&R.jy>.3)||(high&&R.slide>0)){R.dodged++;R.pops.push({text:low?'¡HOP!':'¡ZAS!',col:'#5fe0b0',t:.6});}
        else if(R.inv<=0)runHit(o);
      }else if(o.type!=='chair'&&Math.abs(o.x-R.camX)<1.2)R.dodged++;
    }
  }
  R.decoT-=dt;
  if(R.decoT<=0){R.decoT=1.3+Math.random()*2.2;const s=Math.random()<.5?-1:1;R.runners.push({k:rcat(),x:s*1.45,z:R.pz+.5,v:R.v+2.5+Math.random()*2,ph:Math.random()*6,say:Math.random()<.45?['¡Rajemos!','¡Corré, Carbón!','¡Sálvese quien pueda!','¡Miauuu!'][Math.floor(Math.random()*4)]:null});}
  R.runners.forEach(r=>{r.z+=r.v*dt;r.ph+=dt*10;});R.runners=R.runners.filter(r=>r.z-R.pz<23);
  if(R.pz>=RWIN-1.2){R.phase='out';R.t=0;R.rep0=rep;noise(.5,.1,0,3000);tone(1200,.4,'triangle',.05,-600);setTimeout(()=>SFX.win(),300);}
  else if(R.close>=1){R.phase='caught';R.t=0;SFX.lose();R.shout={text:'¡TE TENGO!',t:2};}
}
function warnMark(x,y,rz){const p=rproj(x,y,rz),s=Math.max(5,Math.min(12,Math.round(p[2]*.2)));fText('!',Math.round(p[0]),Math.round(p[1]-Math.abs(Math.sin(clock*9))*3),s,'#ffd23f');}
function drawTable(x,rz){
  const w=.46,d=.28,top=.78;
  for(const zz of [rz+d-.05,rz-d+.05])for(const lx of [x-w+.06,x+w-.06])rq([[lx-.03,0,zz],[lx+.03,0,zz],[lx+.03,top,zz],[lx-.03,top,zz]],fogc(zz>rz?'#3a2010':'#5a3319',rz));
  rq([[x-w,top,rz-d],[x+w,top,rz-d],[x+w,top,rz+d],[x-w,top,rz+d]],fogc('#b07a48',rz));
  rq([[x-w,top-.24,rz-d],[x+w,top-.24,rz-d],[x+w,top,rz-d],[x-w,top,rz-d]],fogc('#ff7aa8',rz));
  rq([[x-w,top-.24,rz-d],[x+w,top-.24,rz-d],[x+w,top-.2,rz-d],[x-w,top-.2,rz-d]],fogc('#d9557f',rz));
  rq([[x-.13,top,rz],[x+.13,top,rz],[x+.13,top+.16,rz],[x-.13,top+.16,rz]],fogc('#f6e3c0',rz));
  rq([[x-.13,top+.13,rz],[x+.13,top+.13,rz],[x+.13,top+.16,rz],[x-.13,top+.16,rz]],fogc('#ff9ec4',rz));
  rq([[x-.01,top+.16,rz],[x+.01,top+.16,rz],[x+.01,top+.26,rz],[x-.01,top+.26,rz]],'#f4ead5');
  const f=rproj(x,top+.29,rz);P(ctx,Math.round(f[0])-1,Math.round(f[1])-1,2,2,Math.floor(clock*10)%2?'#ffd23f':'#ff8a2a');
}
function drawCouch(x,rz){
  const w=.47,d=.3;
  rq([[x-w,.45,rz+d],[x+w,.45,rz+d],[x+w,1.2,rz+d],[x-w,1.2,rz+d]],fogc('#4a2f84',rz));
  rq([[x-w,.45,rz-d],[x+w,.45,rz-d],[x+w,.45,rz+d],[x-w,.45,rz+d]],fogc('#7858c2',rz));
  rq([[x-w,0,rz-d],[x+w,0,rz-d],[x+w,.45,rz-d],[x-w,.45,rz-d]],fogc('#5a3c98',rz));
  rq([[x-w,.43,rz-d],[x+w,.43,rz-d],[x+w,.47,rz-d],[x-w,.47,rz-d]],fogc('#8a6dd0',rz));
  for(const s of [-1,1])rq([[x+s*w,0,rz-d],[x+s*(w-.12),0,rz-d],[x+s*(w-.12),.7,rz-d],[x+s*w,.7,rz-d]],fogc('#3e2670',rz));
  rq([[x-.3,.47,rz+d-.05],[x-.05,.47,rz+d-.05],[x-.05,.72,rz+d-.05],[x-.3,.72,rz+d-.05]],fogc('#ff7aa8',rz));
}
function drawObs(o,rz){
  const al=Math.max(0,Math.min(1,(22-rz)/5));
  ctx.globalAlpha=al*(o.hit?Math.max(0,1-o.ht*1.6):1);const ga=ctx.globalAlpha,hy=o.hit?o.ht*1.4:0;
  const spr=(img,x,y,w,flip)=>{const p=rproj(x,y,rz),s=Math.max(1,Math.round(w*p[2])),X=Math.round(p[0]-s/2),Y=Math.round(p[1]-s);if(flip){ctx.save();ctx.translate(X+s,Y);ctx.scale(-1,1);ctx.drawImage(img,0,0,s,s);ctx.restore();}else ctx.drawImage(img,X,Y,s,s);return[X,Y,s];};
  const shadow=(x,w)=>{const a=rproj(x-w/2,0,rz),b=rproj(x+w/2,0,rz);ctx.globalAlpha=ga*.45;P(ctx,Math.round(a[0]),Math.round(a[1]-a[2]*.03),Math.round(b[0]-a[0]),Math.max(1,Math.round(a[2]*.06)),'#000');ctx.globalAlpha=ga;};
  if(o.type==='sleep'){shadow(o.x,.7);const q=spr(SPR[o.k].sleep[Math.floor(clock*1.2+o.z)%2],o.x,hy,.72);if(!o.hit){const zz=(clock*.8+o.z)%1;fText('z',Math.round(q[0]+q[2]*.85),Math.round(q[1]-zz*q[2]*.4),Math.max(4,Math.round(q[2]*.22)),'#cfe3ff');}}
  else if(o.type==='box'){shadow(o.x,.75);spr(itemSpr('caja'),o.x,hy-.06,.85);}
  else if(o.type==='cross'){shadow(o.x,.6);const fr=Math.floor(clock*10)%2;spr(SPR[o.k].side[fr],o.x,hy+(fr?.04:0),.72,(o.vx===undefined?-o.side:o.vx)<0);if(!o.done&&!o.hit)warnMark(o.x,.9,rz);}
  else if(o.type==='throw'){
    spr(SPR[o.k].angry[o.launched?0:Math.floor(clock*6)%2],o.side*1.55,0,.7,o.side>0);if(!o.launched)warnMark(o.side*1.55,.85,rz);
    if(o.launched&&!o.hit){shadow(o.x,.3);const p=rproj(o.x,.8,rz),s=Math.max(2,Math.round(.45*p[2]));ctx.save();ctx.translate(Math.round(p[0]),Math.round(p[1]));ctx.rotate(o.spin);ctx.drawImage(itemSpr(o.item),-s/2,-s/2,s,s);ctx.restore();}
  }
  else if(o.type==='table')drawTable(o.x,rz);
  else if(o.type==='chair')drawCouch(o.x,rz);
  ctx.globalAlpha=1;
}
function drawCorridor(pz,endZ,endType){
  const R=RN,zN=.3,zF=Math.min(22,endZ),glows=[];
  for(let y=RHOR+1;y<208;y++){
    const rz=R.camH*RF/(y-RHOR);if(rz>zF)continue;const k=RF/rz,wz=pz+rz,band=Math.floor(wz*1.6)&1;
    const xl=Math.floor(160+(-RW2-R.camX)*k),xr=Math.ceil(160+(RW2-R.camX)*k);
    P(ctx,xl,y,xr-xl,1,fogc(band?'#8a5530':'#7a4a2a',rz));
    for(const sx of [-1.35,-.95,.95,1.35])P(ctx,Math.round(160+(sx-R.camX)*k),y,1,1,fogc('#4a2a14',rz));
    const rl=Math.round(160+(-.5-R.camX)*k),rr=Math.round(160+(.5-R.camX)*k),bw=Math.max(1,Math.round(k*.07));
    P(ctx,rl,y,rr-rl,1,fogc((Math.floor(wz*3)&1)?'#8e2a4f':'#7d2346',rz));P(ctx,rl,y,bw,1,fogc('#c9953e',rz));P(ctx,rr-bw,y,bw,1,fogc('#c9953e',rz));
  }
  for(let n=Math.floor(pz+zN);n<pz+zF;n++){
    const z0=Math.max(zN,n-pz),z1=Math.min(zF,n+1-pz);if(z1<=z0)continue;const mid=(z0+z1)/2;
    for(const s of [-1,1]){const x=s*RW2;
      rq([[x,0,z0],[x,0,z1],[x,RCH,z1],[x,RCH,z0]],fogc(n%2?'#6b4f86':'#62487c',mid));
      rq([[x,0,z0],[x,0,z1],[x,.8,z1],[x,.8,z0]],fogc('#4a3160',mid));
      rq([[x,.78,z0],[x,.78,z1],[x,.86,z1],[x,.86,z0]],fogc('#c9953e',mid));
      rq([[x,0,z0],[x,0,z1],[x,.12,z1],[x,.12,z0]],fogc('#2a1810',mid));
    }
    rq([[-RW2,RCH,z0],[RW2,RCH,z0],[RW2,RCH,z1],[-RW2,RCH,z1]],fogc('#1e1530',mid));
    if(n%4===0&&n-pz>zN+.3&&n+1.2-pz<zF){
      const side=((n/4)&1)?-1:1,x=side*(RW2-.01),t=Math.abs((n/4)*7)%3,a=n-pz+.15,b=n-pz+1;
      if(t===0){rq([[x,1.05,a],[x,1.05,b],[x,1.75,b],[x,1.75,a]],fogc('#c9953e',a));rq([[x,1.12,a+.08],[x,1.12,b-.08],[x,1.68,b-.08],[x,1.68,a+.08]],fogc(['#ff9e7a','#6fb3ff','#5fe0b0'][Math.abs(n/4)%3],a));}
      else if(t===1){rq([[x,0,a],[x,0,b+.1],[x,1.8,b+.1],[x,1.8,a]],fogc('#7a4524',a));rq([[x,.12,a+.1],[x,.12,b],[x,1.7,b],[x,1.7,a+.1]],fogc('#8d5430',a));rq([[x,.9,b-.14],[x,.9,b-.06],[x,.98,b-.06],[x,.98,b-.14]],'#e0b030');}
      else{rq([[x,1.3,a+.3],[x,1.3,a+.6],[x,1.55,a+.6],[x,1.55,a+.3]],fogc('#f5d08a',a));glows.push([x*.97,1.45,a+.45,'255,200,130',60]);}
    }
    for(const s of [-1,1]){const rz=n+.5-pz;if(rz<.5||rz>zF)continue;const p=rproj(s*RW2*.97,RCH-.1,rz),on=(n+(s>0?2:0)+Math.floor(clock*2))%3!==0,i=((n%5)+5+(s>0?2:0))%5;
      const sz=Math.max(1,Math.round(p[2]*.05));P(ctx,Math.round(p[0])-sz,Math.round(p[1])-sz,sz*2,sz*2,on?GARL[i]:'#3a2f5f');if(on)glows.push([s*RW2*.97,RCH-.1,rz,GARL_RGB[i],10]);}
  }
  if(endZ<22){
    const z=endZ;rq([[-RW2,0,z],[RW2,0,z],[RW2,RCH,z],[-RW2,RCH,z]],fogc('#6b4f86',z*.5));rq([[-RW2,0,z],[RW2,0,z],[RW2,.8,z],[-RW2,.8,z]],fogc('#4a3160',z*.5));
    const a=rproj(-.75,endType==='window'?1.95:1.8,z),b=rproj(.75,endType==='window'?.5:0,z),x0=Math.round(a[0]),y0=Math.round(a[1]),w=Math.round(b[0]-a[0]),h=Math.round(b[1]-a[1]);
    if(endType==='window'){
      P(ctx,x0-3,y0-3,w+6,h+6,'#d9ccb0');const g=ctx.createLinearGradient(0,y0,0,y0+h);g.addColorStop(0,'#1a2455');g.addColorStop(1,'#4a3a8e');ctx.fillStyle=g;ctx.fillRect(x0,y0,w,h);
      for(let i=0;i<14;i++)P(ctx,x0+Math.round(((i*37)%97)/97*w),y0+Math.round(((i*53)%89)/89*h*.8),1,1,'#ffffff');
      const mr=Math.max(2,Math.round(w*.12)),mx=x0+Math.round(w*.7),my=y0+Math.round(h*.3);ctx.fillStyle='#fff1bf';ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fill();
      P(ctx,x0+Math.round(w/2)-1,y0,2,h,'#d9ccb0');P(ctx,x0,y0+Math.round(h/2)-1,w,2,'#d9ccb0');
      P(ctx,x0-Math.round(w*.18),y0-3,Math.round(w*.2),h+8,'#a33e62');P(ctx,x0+w-Math.round(w*.02),y0-3,Math.round(w*.2),h+8,'#a33e62');
      glows.push([0,1.2,z-.2,'150,170,255',Math.max(40,w*1.2)]);
      if(z<9){fText('¡LA VENTANA!',Math.round(a[0]+w/2),y0-6,Math.max(5,Math.min(10,Math.round(w/10))),'#5fe0b0');}
    }else{P(ctx,x0,y0,w,h,'#ffd6a0');P(ctx,x0,y0,Math.round(w*.3),h,'#7a4524');glows.push([0,.9,z-.2,'255,200,140',Math.max(50,w*1.5)]);}
  }
  ctx.globalCompositeOperation='lighter';
  glows.forEach(([x,y,rz,col,r])=>{const p=rproj(x,y,rz);glow(ctx,p[0],p[1],Math.min(90,r*(r>30?1:p[2]/40)),col,.35*Math.max(0,1-rz/22));});
  ctx.globalCompositeOperation='source-over';
}
function drawPaw(cx,cy,flip){
  const ell=(x,y,rx,ry,c)=>{for(let j=-ry;j<=ry;j++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(j*j)/(ry*ry))));P(ctx,Math.round(cx+x*flip-w),Math.round(cy+y+j),w*2+1,1,c);}};
  ell(0,0,19,15,'#0c0812');ell(0,0,18,14,'#251d37');ell(-4,-5,11,7,'#30274a');
  for(const [tx,ty] of [[-11,-11],[0,-15],[11,-11]]){ell(tx,ty,6,5,'#0c0812');ell(tx,ty,5,4,'#251d37');ell(tx-1,ty-1,2,2,'#433a70');}
  ell(-14,-6,2,4,'#6f60c4');
}
function renderRun(){
  const R=RN;ctx.setTransform(S,0,0,S,0,0);ctx.imageSmoothingEnabled=false;
  if(R.phase==='out'){renderRunOut();return;}
  if(R.phase==='turn'){
    const k=R.t/.35;ctx.save();ctx.translate(Math.round(-k*320),0);renderRunView(true);ctx.restore();
    ctx.save();ctx.translate(Math.round((1-k)*320),0);renderRunView(false);ctx.restore();
  }else renderRunView(R.phase==='look');
  runHUD();
}
function renderRunView(look){
  const R=RN,sh=R.shake>0?(Math.random()-.5)*R.shake*12:0;
  const cx0=R.camX,ch0=R.camH;if(look){R.camX=0;R.camH=1;}
  ctx.save();ctx.translate(Math.round(sh),Math.round(sh*.5));
  P(ctx,-8,-8,336,224,'#0c0816');
  if(look){
    drawCorridor(0,9,'door');
    const rz=Math.max(1.6,3.6-R.t*.7),p=rproj(0,0,rz),sc=p[2]*1.9/58;
    ctx.globalAlpha=.45;P(ctx,Math.round(p[0]-p[2]*.4),Math.round(p[1]-2),Math.round(p[2]*.8),4,'#000');ctx.globalAlpha=1;
    ctx.save();ctx.translate(Math.round(p[0]),Math.round(p[1]));ctx.scale(sc,sc);drawHuman({x:0,y:0,pose:'broom',face:1,moving:true});ctx.restore();
    [[-1.2,4.5,'humo'],[1.1,5.5,'pelusa'],[.3,7,'tigre']].forEach(([x,z,k])=>{const q=rproj(x,0,z),s=Math.round(.7*q[2]);ctx.drawImage(SPR[k].angry[Math.floor(clock*8)%2],Math.round(q[0]-s/2),Math.round(q[1]-s-Math.abs(Math.sin(clock*9+x))*s*.3),s,s);});
  }else{
    const rem=RWIN-R.pz,list=[];
    R.obs.forEach(o=>{const rz=o.z-R.pz;if(rz>.45&&rz<22&&rz<rem)list.push({rz,d:()=>drawObs(o,rz)});});
    R.runners.forEach(r=>{const rz=r.z-R.pz;if(rz>.45&&rz<22)list.push({rz,d:()=>{const p=rproj(r.x,Math.abs(Math.sin(r.ph))*.08,rz),s=Math.max(1,Math.round(.7*p[2]));ctx.drawImage(SPR[r.k].back[Math.floor(r.ph)%2],Math.round(p[0]-s/2),Math.round(p[1]-s),s,s);if(r.say&&rz<6)fText(r.say,Math.round(p[0]),Math.round(p[1]-s-3),5,'#f4ead5');}});});
    drawCorridor(R.pz,rem,'window');
    list.sort((a,b)=>b.rz-a.rz).forEach(e=>e.d());
    const ph=R.ph,run=R.jy===0&&R.slide<=0,ly=run?Math.max(0,Math.sin(ph))*10:0,ry=run?Math.max(0,Math.sin(ph+Math.PI))*10:0,base=R.jy>0?196:R.slide>0?216:206;
    drawPaw(108-(R.slide>0?10:0),base-ly,1);drawPaw(212+(R.slide>0?10:0),base-ry,-1);
    if(R.inv>0&&Math.floor(clock*14)%2){ctx.globalAlpha=.25;P(ctx,0,0,320,208,'#ff3b5c');ctx.globalAlpha=1;}
  }
  ctx.restore();
  R.camX=cx0;R.camH=ch0;
  const vg=ctx.createRadialGradient(160,110,70,160,110,210);vg.addColorStop(0,'rgba(10,6,30,0)');vg.addColorStop(1,'rgba(10,6,30,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,320,208);
}
function runHUD(){
  const R=RN;
  if(R.phase==='look'){
    P(ctx,0,0,320,18,'#000');P(ctx,0,190,320,18,'#000');
    if(R.shout){const s=Math.round(Math.sin(clock*40)*2);fText(R.shout.text,160+s,46,13,'#ff5c9d');}
    if(R.t>.9)fText('¡Tu humano agarró la escoba!',160,176,7,'#f4ead5');
    return;
  }
  if(R.phase!=='caught'&&R.close>.5){const a=(R.close-.5)*1.3*(.7+.3*Math.sin(clock*8));const g=ctx.createRadialGradient(160,104,60,160,104,200);g.addColorStop(0,'rgba(255,40,80,0)');g.addColorStop(1,'rgba(255,40,80,'+Math.min(.7,a)+')');ctx.fillStyle=g;ctx.fillRect(0,0,320,208);}
  const hand=R.phase==='caught'?Math.min(1,R.t*1.5):Math.max(0,(R.close-.72)/.28);
  if(hand>0){for(const s of [-1,1]){const bx=s<0?0:320,hx=bx-s*(10+hand*60),hy=208-hand*70;
    ctx.save();ctx.translate(Math.round(hx),Math.round(hy));ctx.scale(-s,1);
    P(ctx,-8,0,50,90,'#140c1e');P(ctx,-6,2,46,88,'#f1c9a0');P(ctx,-6,2,46,6,'#ffe0c0');for(let f=0;f<4;f++){P(ctx,-6+f*12,-18+(f===0?8:0),10,22,'#140c1e');P(ctx,-5+f*12,-17+(f===0?8:0),8,20,'#f1c9a0');P(ctx,-4+f*12,-16+(f===0?8:0),6,4,'#ffe0c0');}P(ctx,34,10,20,90,'#4f8a67');
    ctx.restore();}}
  if(R.phase==='caught'){ctx.globalAlpha=Math.min(.85,R.t*.6);P(ctx,0,0,320,208,'#000');ctx.globalAlpha=1;fText('¡TE AGARRÓ!',160,100,14,'#ff5c9d');return;}
  const prog=Math.min(1,R.pz/RWIN);
  P(ctx,98,5,124,7,'rgba(10,6,24,.7)');P(ctx,100,7,120,3,'#2a2046');P(ctx,100,7,Math.round(120*prog),3,'#5fe0b0');
  ctx.drawImage(SPR.carbon.normal[0],Math.round(100+120*prog-6),1,12,12);
  P(ctx,222,3,11,11,'#d9ccb0');P(ctx,223,4,9,9,'#2a3a7a');P(ctx,227,4,1,9,'#d9ccb0');P(ctx,223,8,9,1,'#d9ccb0');P(ctx,229,5,2,2,'#fff1bf');
  fText(Math.max(0,Math.ceil((RWIN-R.pz)/2.4))+' m hasta la ventana',160,21,4,'#f4ead5');
  P(ctx,4,4,74,18,'rgba(10,6,24,.7)');fText('TU HUMANO',41,11,4,'#ff9ec4');P(ctx,8,14,66,4,'#2a2046');P(ctx,8,14,Math.round(66*Math.min(1,R.close)),4,R.close>.7?'#ff3b5c':'#ffb547');
  if(R.shout){const s=Math.round(Math.sin(clock*40)*1.5);ctx.globalAlpha=Math.min(1,R.shout.t*3);fText(R.shout.text,160+s,40,8,'#ff5c9d');ctx.globalAlpha=1;}
  const nx=R.obs.find(o=>!o.done&&o.z-R.pz<8&&o.z-R.pz>1&&Math.abs(o.x-R.lane)<.6&&!R.tut[o.type]);
  if(nx&&R.phase==='run'){const txt={sleep:'↑ ¡SALTÁ AL GATO DORMIDO!',box:'↑ ¡SALTÁ LA CAJA!',table:'↓ ¡AGACHATE BAJO LA MESA!',chair:'← → ¡ESQUIVÁ EL SILLÓN!',throw:'↓ ¡AGACHATE! ¡TE TIRAN COSAS!',cross:'↑ ¡SALTÁ AL GATO QUE CRUZA!'}[nx.type];fText(txt,160,60,6,'#ffd23f');if(nx.z-R.pz<1.6)R.tut[nx.type]=true;}
  R.pops.forEach((p,i)=>{if(i<R.pops.length-1)return;ctx.globalAlpha=Math.min(1,p.t*2.5);fText(p.text,160,Math.round(96-(1-p.t)*10),p.text.length>8?9:12,p.col);ctx.globalAlpha=1;});
}
function renderRunOut(){
  const R=RN,t=R.t;ctx.drawImage(danceBG(),0,0);
  for(let i=0;i<12;i++){const x=(i*73+11)%320,y=(i*37)%80+4;ctx.globalAlpha=.4+.5*Math.sin(clock*3+i);P(ctx,x,y,1,1,'#ffffff');}ctx.globalAlpha=1;
  [['manchita',30,-1],['humo',290,1]].forEach(([k,x,f])=>{const img=SPR[k].normal[Math.floor(clock*1.2)%2];if(f<0){ctx.save();ctx.translate(x+16,160);ctx.scale(-1,1);ctx.drawImage(img,0,0,32,32);ctx.restore();}else ctx.drawImage(img,x-16,160,32,32);});
  const s=fightSprites('carbon'),k=Math.min(1,t/1.3),x=40+k*120,y=GROUND_D+(1-k)*70-Math.sin(k*Math.PI)*85,img=k<1?s.jump:s.idle[Math.floor(clock*3)%2],w=FW*1.5,h=FH*1.5;
  ctx.globalAlpha=.45;P(ctx,Math.round(x-18),GROUND_D-2,36,3,'#000');ctx.globalAlpha=1;
  ctx.drawImage(img,Math.round(x-FANCH*1.5),Math.round(y-h+2),w,h);
  if(t<.5){ctx.globalAlpha=1-t*2;P(ctx,0,0,320,208,'#ffffff');ctx.globalAlpha=1;}
  if(t>1.4){ctx.globalAlpha=Math.min(1,(t-1.4)*3);P(ctx,0,26,320,22,'rgba(10,6,24,.6)');fText('¡ESCAPASTE!',160,43,14,'#5fe0b0');ctx.globalAlpha=1;}
  if(t>2.4){ctx.globalAlpha=Math.min(1,(t-2.4)*3);P(ctx,0,52,320,30,'rgba(10,6,24,.6)');fText('...pero todo el barrio vio la fiesta del desastre.',160,64,5,'#f4ead5');fText('PRESTIGIO: '+Math.round(rep),160,77,9,rep>40?'#ffd23f':'#ff5c9d');ctx.globalAlpha=1;}
  if(t>3)fText('¿Ese es Carbón?',46,152,5,'#f4ead5');
  if(t>3.6)fText('¡Qué papelón!',276,152,5,'#f4ead5');
}
function loseRun(){
  state='lose';
  show(`<div class="card">
    <p class="eyebrow">TE ATRAPARON</p>
    <h2>Tu humano te agarró de la nuca</h2>
    <p>Directo a la cucha y sin cena. Los gatos del barrio se escaparon sin vos.</p>
    <p class="tip">← → para cambiar de carril. ↑ o ESPACIO para saltar a los gatos dormidos, las cajas y los gatos que cruzan. ↓ para agacharte debajo de las mesas y de lo que te tiran. Cada choque deja que tu humano se acerque.</p>
    <div class="row"><button class="btn" data-act="retry">Intentar de nuevo</button><button class="btn ghost" data-act="levels">Niveles</button></div>
  </div>`);
}

