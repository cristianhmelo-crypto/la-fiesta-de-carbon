/* ---------- cinemática inicial: la historia ---------- */
let ST=null,SBG=null;
const GS=198;
const SPOSE={
  stand0:{np:[30,33],fp:[25,34],eyes:'soft',tail:1},
  stand1:{np:[30,34],fp:[25,35],ty:28,hy:14,eyes:'soft',tail:2},
  talk:{np:[34,27],fp:[25,34],eyes:'soft',mouth:'open',tail:1},
  laugh:{np:[29,31],fp:[24,32],eyes:'happy',mouth:'grin',hy:12,tail:3},
  laugh2:{np:[29,32],fp:[24,33],eyes:'happy',mouth:'open',hy:13,ty:28,tail:-1},
  point:{np:[45,18],fp:[25,33],eyes:'happy',mouth:'grin',tail:2},
  angry:{np:[37,22],fp:[32,24],eyes:'angry',mouth:'open',tail:-3},
  sad:{np:[28,35],fp:[24,35],eyes:'sad',mouth:'frown',hx:25,hy:15,ty:28,tail:-4},
  surprise:{np:[36,14],fp:[30,16],eyes:'soft',mouth:'open',hy:12,tail:-3},
  cheer:{np:[34,3],fp:[21,5],eyes:'happy',mouth:'open',hy:12,tail:-3},
  jump:{nf:[29,40],ff:[16,41],np:[35,5],fp:[22,7],ty:26,hy:12,tail:-3,eyes:'happy',mouth:'open'},
  walk0:{nf:[31,46],ff:[13,46],np:[32,32],fp:[23,32],eyes:'soft',tail:1},
  walk1:{nf:[25,46],ff:[18,46],ty:28,hy:14,np:[26,33],fp:[30,32],eyes:'soft',tail:-1},
  swalk0:{nf:[31,46],ff:[13,46],np:[29,35],fp:[23,35],eyes:'sad',mouth:'frown',hx:25,hy:15,tail:-4},
  swalk1:{nf:[25,46],ff:[18,46],ty:28,hy:16,np:[26,35],fp:[29,35],eyes:'sad',mouth:'frown',hx:25,tail:-4},
  run0:{nf:[33,46],ff:[11,45],np:[40,24],fp:[20,28],eyes:'happy',mouth:'open',tx:23,lean:2,hx:30,tail:-3},
  run1:{nf:[23,45],ff:[20,46],ty:28,np:[24,28],fp:[38,24],eyes:'happy',mouth:'open',tx:23,lean:2,hx:30,hy:14,tail:3}
};
const STC={};
function sspr(key,pose,hat){const k=key+'|'+pose+'|'+(hat?1:0);return STC[k]||(STC[k]=buildFighter(key,Object.assign({},FBASE,SPOSE[pose]),!hat));}
function storyBG(){
  if(SBG)return SBG;const c=document.createElement('canvas');c.width=320;c.height=208;const g=c.getContext('2d');
  let sd=5;const r=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646;};
  const stops=[[0,[28,20,72]],[.5,[90,47,122]],[.8,[224,112,122]],[1,[255,176,112]]];
  for(let y=0;y<150;y++){const t=y/150;let i=0;while(i<stops.length-2&&t>stops[i+1][0])i++;const [t0,c0]=stops[i],[t1,c1]=stops[i+1],k=Math.min(1,(t-t0)/(t1-t0));P(g,0,y,320,1,`rgb(${c0.map((v,j)=>Math.round(v+(c1[j]-v)*k)).join(',')})`);}
  for(let i=0;i<45;i++)P(g,Math.floor(r()*320),Math.floor(r()*70),1,1,r()<.3?'#ffffff':'#c9c2ff');
  for(let y=-18;y<=18;y++)for(let x=-18;x<=18;x++){const d=x*x+y*y;if(d<=324)P(g,258+x,138+y,1,1,d<200?'#ffe6a8':'#ffc98a');}
  let x=110;while(x<330){const w=26+Math.floor(r()*24),h=22+Math.floor(r()*20),y0=150-h;P(g,x,y0,w,h,'#3a2350');g.fillStyle='#3a2350';g.beginPath();g.moveTo(x-3,y0);g.lineTo(x+w/2,y0-12-r()*6);g.lineTo(x+w+3,y0);g.fill();for(let wy=y0+5;wy<146;wy+=8)for(let wx=x+4;wx<x+w-4;wx+=7)if(r()<.35)P(g,wx,wy,3,4,'#ffcf7a');x+=w+4+Math.floor(r()*6);}
  for(const [tx,ty,rr] of [[206,104,30],[232,96,24],[184,118,20]]){for(let y=-rr;y<=rr;y++)for(let xx=-rr;xx<=rr;xx++)if(xx*xx+y*y<=rr*rr){const lit=xx+y<-rr*.4;P(g,tx+xx,ty+y,1,1,lit?'#3f6a4f':((xx*3+y*7)&7)===0?'#1f3a2c':'#2a4a3a');}}
  P(g,202,120,8,40,'#3a2414');P(g,202,120,3,40,'#5a3a22');
  P(g,110,150,210,38,'#2f5a42');for(let i=0;i<120;i++)P(g,110+Math.floor(r()*210),150+Math.floor(r()*36),1,2,r()<.5?'#3f7a55':'#26503a');
  for(let fx=124;fx<320;fx+=8){g.fillStyle='#f0e6d6';g.beginPath();g.moveTo(fx,164);g.lineTo(fx+2.5,160);g.lineTo(fx+5,164);g.lineTo(fx+5,188);g.lineTo(fx,188);g.fill();P(g,fx+4,164,1,24,'#b8ab98');}
  P(g,120,168,200,3,'#e0d4c0');P(g,120,180,200,3,'#e0d4c0');P(g,120,170,200,1,'#a89880');P(g,120,182,200,1,'#a89880');
  P(g,300,66,4,122,'#2a2233');P(g,301,66,1,122,'#4a3f5a');P(g,292,62,20,5,'#2a2233');P(g,294,67,16,4,'#fff0b8');P(g,296,186,12,4,'#2a2233');
  P(g,0,188,320,20,'#8f86a0');for(let sx=0;sx<320;sx+=18)P(g,sx,188,1,20,'#6f6680');P(g,0,188,320,1,'#b0a8c0');P(g,0,197,320,1,'#7a7190');P(g,0,205,320,3,'#5a5270');
  P(g,4,70,112,118,'#e2b98c');for(let y=74;y<188;y+=6)P(g,4,y,112,1,'#cfa577');P(g,108,70,8,118,'#c99a6a');P(g,4,70,2,118,'#f0cfa6');
  g.fillStyle='#9a3446';g.beginPath();g.moveTo(-8,74);g.lineTo(60,28);g.lineTo(128,74);g.closePath();g.fill();
  g.strokeStyle='#7a2436';g.lineWidth=1;for(let y=36;y<74;y+=5){const half=(y-28)/46*68;g.beginPath();g.moveTo(60-half,y+.5);g.lineTo(60+half,y+.5);g.stroke();}
  g.fillStyle='#c24a60';g.beginPath();g.moveTo(-8,74);g.lineTo(60,28);g.lineTo(62,31);g.lineTo(-6,76);g.closePath();g.fill();
  P(g,-8,74,136,4,'#5a1a28');P(g,-8,74,136,1,'#7a2a3a');
  P(g,84,36,14,24,'#8e4a3a');for(let y=38;y<60;y+=4)P(g,84,y,14,1,'#6e3428');P(g,82,34,18,4,'#6e3428');
  P(g,46,126,28,62,'#5a3319');P(g,48,128,24,60,'#7a4524');P(g,48,128,24,2,'#9a5c33');
  for(const [py,ph] of [[134,20],[158,24]]){P(g,52,py,16,ph,'#6a3a1e');P(g,52,py,16,1,'#51290f');P(g,52,py+ph-1,16,1,'#9a5c33');}
  P(g,66,158,3,3,'#e0b030');P(g,66,158,1,1,'#fff0a0');P(g,55,120,10,5,'#e8dcc0');P(g,56,121,8,3,'#8a6a40');
  P(g,40,186,40,4,'#a89eb8');P(g,40,186,40,1,'#c8c0d8');
  for(const wx of [12,80]){P(g,wx-2,102,32,32,'#f4ead5');P(g,wx,104,28,28,'#2a1d3a');P(g,wx-3,134,34,4,'#7a4524');for(let i=0;i<8;i++)P(g,wx-2+i*4,131,3,3,GARL[i%5]);P(g,wx+2,130,24,2,'#3f7a55');}
  for(const [bx,by,br] of [[8,184,10],[24,186,8],[100,184,9],[116,186,7]])for(let y=-br;y<=br;y++)for(let xx=-br;xx<=br;xx++)if(xx*xx+y*y<=br*br&&by+y<190)P(g,bx+xx,by+y,1,1,xx+y<-br*.3?'#4f8a5f':'#2f5a42');
  P(g,120,168,7,20,'#3a4a8a');P(g,119,166,9,4,'#4a5aa0');P(g,127,170,2,4,'#e2344f');
  return SBG=c;
}
function sActor(k){return ST.actors.find(a=>a.key===k);}
function sBub(k,text,dur){ST.bubs=ST.bubs.filter(b=>b.k!==k);ST.bubs.push({k,text,t:dur||1.6});}
function confettiBurst(x,y,n){for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,s=60+Math.random()*120;ST.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:2.5+Math.random(),col:GARL[i%5],rot:Math.random()*6,kind:'c'});}}
const SSTEPS=[
  {dur:3.4,enter:S=>{S.cap='Una tarde cualquiera, en el barrio de Carbón...';['humo','manchita','tigre','chispa'].forEach(k=>sActor(k).pose='laugh');}},
  {talk:[
    {who:'cat',k:'humo',mood:'retador',text:'¿Ya te vas, Carbón? ¡Si recién está anocheciendo!',set:{humo:'point',manchita:'stand',tigre:'stand',chispa:'stand'}},
    {who:'cat',k:'manchita',mood:'fiestero',text:'Siempre lo mismo. Carbón, el primero en irse de todas las fiestas.',set:{manchita:'laugh',humo:'laugh'}},
    {who:'cat',k:'tigre',mood:'fiestero',text:'¡Carbón, el gato más aburrido del barrio!',set:{tigre:'point'}},
    {who:'cat',k:'chispa',mood:'fiestero',text:'¡A-bu-rri-do! ¡A-bu-rri-do!',set:{chispa:'laugh',tigre:'laugh',humo:'laugh',manchita:'laugh',carbon:'sad'}},
    {who:'carbon',mood:'angry',text:'¡No soy aburrido!',set:{carbon:'angry',humo:'surprise',manchita:'surprise',tigre:'surprise',chispa:'surprise'}},
    {who:'carbon',mood:'angry',text:'Es que cada vez que los invito a casa, ustedes hacen un desastre. ¡Un DESASTRE!'},
    {who:'cat',k:'humo',mood:'okupa',text:'¿Ah, sí? Bueno... entonces nos vamos.',set:{humo:'sad',carbon:'stand'}},
    {who:'cat',k:'manchita',mood:'perdido',text:'Vamos, chicos. Acá no nos quieren.',set:{manchita:'sad',tigre:'sad',chispa:'sad'}}
  ]},
  {dur:4.6,enter:S=>{[['humo',262,0],['manchita',292,.25],['tigre',322,.5],['chispa',352,.7]].forEach(([k,x,d])=>{const a=sActor(k);a.tx=x;a.spd=24;a.delay=d;a.sadWalk=true;});
      [523,440,392,330].forEach((f,i)=>tone(f,.35,'triangle',.04,0,.3+i*.35));},
    upd:(S,dt,t)=>{if(t>.8)sActor('carbon').pose='sad';if(t>2&&!S.f1){S.f1=1;sBub('carbon','...',2.2);}}},
  {dur:1.2,enter:S=>{const c=sActor('carbon');c.vy=150;c.pose='surprise';sBub('carbon','!',1);SFX.meow();},
    upd:(S,dt,t)=>{if(t>.45&&!S.f2){S.f2=1;const c=sActor('carbon');c.tx=150;c.spd=90;c.run=true;}}},
  {talk:[
    {who:'carbon',mood:'perdido',text:'¡Esperen! ¡Mentira, chicos! ¡Era una broma!',set:{carbon:'surprise'}},
    {who:'carbon',mood:'fiestero',text:'¿Por qué no hacemos una fiesta en mi casa? ¡¿AHORA?!',set:{carbon:'cheer'}}
  ]},
  {dur:3.6,enter:S=>{['humo','manchita','tigre','chispa'].forEach((k,i)=>{const a=sActor(k);a.tx=a.x;a.face=-1;a.pose='surprise';a.sadWalk=false;sBub(k,'!',.9);});tone(1200,.1,'square',.04);},
    upd:(S,dt,t)=>{
      if(t>.9&&!S.f3){S.f3=1;SFX.win();noise(.3,.06,0,2000);S.actors.forEach((a,i)=>{a.vy=170+i*8;a.pose='cheer';if(a.key!=='carbon')a.hat=true;});confettiBurst(220,120,70);sBub('humo','¡FIESTAAA!',1.8);}
      if(t>1.9&&!S.f4){S.f4=1;[['humo',196],['manchita',230],['tigre',264],['chispa',298]].forEach(([k,x],i)=>{const a=sActor(k);a.tx=x;a.spd=70;a.run=true;a.delay=i*.12;a.faceAfter=-1;});}
    }},
  {talk:[
    {who:'cat',k:'chispa',mood:'fiestero',text:'¡Yo llevo la música!',set:{chispa:'cheer',humo:'laugh',manchita:'laugh',tigre:'laugh',carbon:'laugh'}},
    {who:'cat',k:'tigre',mood:'hambriento',text:'¡Yo llevo el pollo! ...Y el queso. Y las salchichas.',set:{tigre:'point'}},
    {who:'cat',k:'manchita',mood:'happy',text:'¡Y yo le aviso a todo el barrio!',set:{manchita:'point'}},
    {who:'carbon',mood:'perdido',text:'Eh... a todo el barrio no, ¿eh? Mi humano vuelve a las ocho...',set:{carbon:'surprise'}},
    {who:'cat',k:'humo',mood:'fiestero',text:'¡Demasiado tarde! ¡A la casa de Carbón!',set:{humo:'cheer',manchita:'cheer',tigre:'cheer',chispa:'cheer'}}
  ]},
  {dur:7.4,enter:S=>{tone(300,.4,'sawtooth',.03,-100);},
    upd:(S,dt,t)=>{
      S.door=Math.min(1,Math.max(0,(t-.2)*2));if(t>6.4)S.door=Math.max(0,1-(t-6.4)*3);
      if(t>.5&&!S.f5){S.f5=1;['humo','manchita','tigre','chispa'].forEach((k,i)=>{const a=sActor(k);a.tx=60;a.spd=95;a.run=true;a.delay=i*.35;a.enter=true;});}
      if(t>2.2&&!S.f6){S.f6=1;const c=sActor('carbon');c.tx=84;c.spd=70;c.run=true;c.faceAfter=1;}
      if(t>3.4&&!S.f7){S.f7=1;const c=sActor('carbon');c.pose='sad';sBub('carbon','Esto va a terminar mal...',2);}
      if(t>5.4&&!S.f8){S.f8=1;const c=sActor('carbon');c.tx=60;c.spd=60;c.run=false;c.enter=true;}
      if(t>6.6&&!S.f9){S.f9=1;noise(.15,.08,0,500);tone(90,.15,'square',.06);}
    }},
  {dur:6.5,enter:S=>{S.party=1;S.cap=null;},
    upd:(S,dt,t)=>{
      const beat=Math.floor(t/.42);if(beat!==S.lastBeat){S.lastBeat=beat;tone(100,.12,'sine',.12,-60);if(beat%2)noise(.06,.03,0,5000);tone(mtof([45,48,52,50][Math.floor(beat/2)%4]),.3,'triangle',.05);if(Math.random()<.7)S.fx.push({x:91,y:34,vx:(Math.random()-.5)*10,vy:-18,t:2,col:GARL[beat%5],kind:'n',ph:Math.random()*6});}
      if(t>1&&!S.fa){S.fa=1;SFX.win();}
    }}
];
function startStory(){
  initAudio();hide();state='story';loadLevel(0);hLevel.textContent='PRÓLOGO · UNA TARDE EN EL BARRIO';
  ST={step:-1,t:0,T:0,actors:[['carbon',96,1],['humo',170,-1],['manchita',206,-1],['tigre',242,-1],['chispa',278,-1]].map(([key,x,face])=>({key,x,tx:x,face,pose:'stand',hat:false,a:1,y:0,vy:0,anim:Math.random(),delay:0,spd:40})),fx:[],bubs:[],door:0,party:0,fade:1,cap:null,capT:0,warm:[],lastCur:null};
  const poses=['stand0','stand1','talk','laugh','laugh2','point','surprise','sad','walk0','walk1','swalk0','swalk1','cheer','jump','run0','run1'];
  ST.actors.forEach(a=>{poses.forEach(p=>ST.warm.push([a.key,p,false]));if(ACC[a.key]&&ACC[a.key].includes('hat'))['cheer','jump','run0','run1','laugh','laugh2','point','stand0','stand1','talk'].forEach(p=>ST.warm.push([a.key,p,true]));});
  ST.warm.push(['carbon','angry',false]);
  hint.innerHTML='<b>ESPACIO</b><span>Seguir · <b>ESC</b> o tocá acá para saltear la intro</span>';lastHint='x';
  grabFocus();nextStory();
}
function nextStory(){
  const S=ST;if(!S)return;S.step++;S.t=0;
  if(S.step>=SSTEPS.length){endStory();return;}
  const st=SSTEPS[S.step];if(st.enter)st.enter(S);
  if(st.talk)danceTalk(st.talk,()=>nextStory());
}
function endStory(){if(!ST)return;if(D)closeTalk();ST=null;showIntro(0);}
function updateStory(dt){
  const S=ST;if(!S)return;S.t+=dt;S.T+=dt;
  for(let i=0;i<3&&S.warm.length;i++){const [k,p,h]=S.warm.shift();sspr(k,p,h);}
  S.fade=Math.max(0,S.fade-dt*.8);
  if(D&&D.cur&&D.cur!==S.lastCur){S.lastCur=D.cur;if(D.cur.set)for(const k in D.cur.set){const a=sActor(k);if(a)a.pose=D.cur.set[k];}}
  const spk=D&&D.cur?(D.cur.who==='carbon'?'carbon':D.cur.as&&D.cur.as.key):null;
  S.actors.forEach(a=>{
    a.anim+=dt;a.speaking=a.key===spk&&D.typed<D.cur.text.length;
    if(a.delay>0){a.delay-=dt;}
    else if(Math.abs(a.tx-a.x)>1.5){const d=Math.sign(a.tx-a.x);a.x+=d*Math.min(Math.abs(a.tx-a.x),a.spd*dt);a.face=d;a.walking=true;}
    else if(a.walking){a.walking=false;a.run=false;if(a.faceAfter){a.face=a.faceAfter;a.faceAfter=0;}}
    if(a.y>0||a.vy>0){a.vy-=520*dt;a.y+=a.vy*dt;if(a.y<=0){a.y=0;a.vy=0;}}
    if(a.enter&&a.x<74)a.a=Math.max(0,a.a-dt*3.5);
  });
  S.bubs.forEach(b=>b.t-=dt);S.bubs=S.bubs.filter(b=>b.t>0);
  S.fx.forEach(p=>{p.t-=dt;if(p.kind==='c'){p.vy+=120*dt;p.vx*=.99;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=dt*8;if(p.y>200){p.y=200;p.vy=0;p.vx*=.8;}}else{p.x+=Math.sin(p.t*4+p.ph)*.4+p.vx*dt;p.y+=p.vy*dt;}});S.fx=S.fx.filter(p=>p.t>0);
  if(Math.random()<dt*2.5)noise(.02,.006,0,7000);
  const st=SSTEPS[S.step];if(!st)return;
  if(st.upd)st.upd(S,dt,S.t);
  if(!st.talk&&st.dur&&S.t>=st.dur)nextStory();
}
function drawActor(a){
  if(a.a<=0)return;let pose=a.pose;
  if(a.walking&&a.delay<=0)pose=(a.run?'run':a.sadWalk?'swalk':'walk')+(Math.floor(a.anim*(a.run?10:5))%2);
  else if(a.y>0)pose='jump';
  else{
    if(pose==='stand')pose='stand'+(Math.floor(clock*1.6+a.x*.1)%2);
    if(pose==='laugh'&&Math.floor(clock*6+a.x*.1)%2)pose='laugh2';
    if(a.speaking&&Math.floor(clock*9)%2)pose={stand0:'talk',stand1:'talk',laugh:'laugh2',point:'laugh2',cheer:'cheer',surprise:'surprise'}[pose]||pose;
  }
  if(a.key==='carbon'&&pose==='angry'&&!SPOSE.angry)pose='surprise';
  const img=sspr(a.key,pose,a.hat),w=FW*2,h=FH*2,shk=pose==='angry'?Math.round(Math.sin(clock*50)):0;
  ctx.globalAlpha=.4*a.a;P(ctx,Math.round(a.x-24),GS-2,48,4,'#000');ctx.globalAlpha=a.a;
  ctx.save();ctx.translate(Math.round(a.x)+shk,Math.round(GS-h+2-a.y));if(a.face<0)ctx.scale(-1,1);ctx.drawImage(img,-FANCH*2,0,w,h);ctx.restore();ctx.globalAlpha=1;
}
function drawBubble(x,y,text){
  ctx.font='6px "Press Start 2P"';const w=Math.max(12,Math.ceil(ctx.measureText(text).width)+10),h=13,X=Math.round(Math.min(316-w,Math.max(4,x-w/2))),Y=Math.round(y-h);
  P(ctx,X-1,Y,w+2,h,'#140c1e');P(ctx,X,Y-1,w,h+2,'#140c1e');P(ctx,X,Y,w,h,'#fffaf0');P(ctx,X,Y+h-2,w,2,'#e0d4c0');
  P(ctx,Math.round(x)-2,Y+h,5,2,'#fffaf0');P(ctx,Math.round(x)-1,Y+h+2,3,2,'#fffaf0');P(ctx,Math.round(x)-3,Y+h,1,2,'#140c1e');P(ctx,Math.round(x)+3,Y+h,1,2,'#140c1e');
  ctx.fillStyle='#2a1d3a';ctx.textAlign='center';ctx.fillText(text,X+w/2,Y+9);ctx.textAlign='left';
}
function renderStory(){
  const Z=ST;ctx.setTransform(S,0,0,S,0,0);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(storyBG(),0,0);
  for(let i=0;i<14;i++){const x=(i*71+13)%320,y=(i*29)%66+3;ctx.globalAlpha=Math.max(0,.3+.5*Math.sin(clock*2.5+i));P(ctx,x,y,1,1,'#ffffff');}ctx.globalAlpha=1;
  const party=Z.party,beat=Math.floor(Z.t/.42);
  [[0,12],[1,80]].forEach(([wi,wx])=>{
    const col=party?GARL[(beat+wi*2)%5]:'#ffc870';
    P(ctx,wx,104,28,28,col);P(ctx,wx+4,108,20,20,tint(col,.3));
    if(party){(wi?['manchita','tigre']:['humo','chispa']).forEach((k,j)=>{const img=darkSpr(k)[(beat+j)%2];ctx.drawImage(img,wx+j*12,113-((beat+j)%2)*2,16,16);});}
    else{P(ctx,wx,104,5,28,'#b8497a');P(ctx,wx+1,104,1,28,'#d86a98');P(ctx,wx+23,104,5,28,'#b8497a');P(ctx,wx+26,104,1,28,'#8a2a5a');}
    P(ctx,wx+13,104,2,28,'#f4ead5');P(ctx,wx,117,28,2,'#f4ead5');
  });
  if(Z.door>0){P(ctx,48,128,24,60,'#1a1026');const g=ctx.createLinearGradient(0,128,0,188);g.addColorStop(0,'#ffe0b0');g.addColorStop(1,'#ff9e6a');ctx.globalAlpha=Z.door;ctx.fillStyle=g;ctx.fillRect(50,130,20,58);ctx.globalAlpha=1;const w=Math.round(24*(1-Z.door*.8));P(ctx,48,128,w,60,'#7a4524');P(ctx,48,128,w,2,'#9a5c33');P(ctx,48+w-1,128,1,60,'#51290f');}
  P(ctx,77,114,4,2,'#3a2a22');P(ctx,76,116,6,8,'#3a2a22');P(ctx,77,117,4,6,'#fff0b8');
  ctx.globalCompositeOperation='lighter';
  glow(ctx,258,138,80,'255,150,100',.22);
  glow(ctx,302,70,44,'255,230,160',.55);
  const cg=ctx.createLinearGradient(0,70,0,192);cg.addColorStop(0,'rgba(255,230,160,.18)');cg.addColorStop(1,'rgba(255,230,160,.05)');ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(295,71);ctx.lineTo(309,71);ctx.lineTo(334,192);ctx.lineTo(270,192);ctx.closePath();ctx.fill();
  glow(ctx,79,120,26,'255,200,120',.5);
  [[26,0],[94,1]].forEach(([x,wi])=>glow(ctx,x,118,36,party?GARL_RGB[(beat+wi*2)%5]:'255,190,110',party?.55:.38));
  if(Z.door>0){glow(ctx,60,168,44,'255,190,120',.5*Z.door);ctx.fillStyle='rgba(255,190,120,'+(.18*Z.door)+')';ctx.beginPath();ctx.moveTo(48,188);ctx.lineTo(72,188);ctx.lineTo(86,202);ctx.lineTo(34,202);ctx.closePath();ctx.fill();}
  for(let i=0;i<8;i++){const x=140+((i*53+clock*6*(i%3+1))%170),y=150+Math.sin(clock*1.3+i)*14,a=Math.max(0,Math.sin(clock*2+i*1.7));glow(ctx,x,y,4,'200,255,120',.6*a);P(ctx,Math.round(x),Math.round(y),1,1,'rgba(230,255,170,'+a+')');}
  ctx.globalCompositeOperation='source-over';
  Z.actors.forEach(drawActor);
  Z.fx.forEach(p=>{ctx.globalAlpha=Math.min(1,p.t*2);const x=Math.round(p.x),y=Math.round(p.y);if(p.kind==='c')P(ctx,x,y,Math.round(Math.abs(Math.cos(p.rot))*2+1),2,p.col);else{P(ctx,x+2,y,1,4,p.col);P(ctx,x,y+3,2,2,p.col);P(ctx,x+3,y,2,1,p.col);}});ctx.globalAlpha=1;
  Z.bubs.forEach(b=>{const a=sActor(b.k);if(!a||a.a<=0)return;drawBubble(a.x+a.face*4,GS-82-a.y,b.text);});
  if(Z.cap&&Z.step===0){ctx.globalAlpha=Math.max(0,Math.min(1,Z.t*1.5,(3.4-Z.t)*2));P(ctx,0,22,320,16,'rgba(10,6,24,.6)');fText(Z.cap,160,33,6,'#f4ead5');ctx.globalAlpha=1;}
  if(party){const t=Z.t;
    if(t>.9){const k=Math.min(1,(t-.9)/.35),sc=1+(1-k)*1.2;ctx.save();ctx.translate(166,44);ctx.scale(sc,sc);ctx.globalAlpha=k;fText('LA FIESTA',0,0,16,'#ffd23f');fText('DE CARBÓN',0,22,16,'#ff5c9d');ctx.restore();ctx.globalAlpha=1;}
    if(t>3.4){ctx.globalAlpha=Math.min(1,(t-3.4)*2);P(ctx,0,80,320,16,'rgba(10,6,24,.6)');fText('Unas horas más tarde...',160,91,6,'#f4ead5');ctx.globalAlpha=1;}}
  P(ctx,0,0,320,12,'#000');P(ctx,0,204,320,4,'#000');
  const vg=ctx.createRadialGradient(160,110,90,160,110,220);vg.addColorStop(0,'rgba(10,6,30,0)');vg.addColorStop(1,'rgba(10,6,30,.5)');ctx.fillStyle=vg;ctx.fillRect(0,0,320,208);
  const fo=Math.max(Z.fade,party&&Z.t>5.4?Math.min(1,Z.t-5.4):0);if(fo>0){ctx.globalAlpha=fo;P(ctx,0,0,320,208,'#000');ctx.globalAlpha=1;}
}

