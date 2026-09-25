const EPITHET={carbon:'EL GATO MÁS POPULAR DEL BARRIO',manchita:'LA DAMA TRICOLOR',copito:'EL BELLO DURMIENTE',tigre:'EL ESTÓMAGO SIN FONDO',humo:'EL PATOTERO DEL BARRIO',luna:'LA SIAMESA ESCURRIDIZA',rulo:'EL DEL SMOKING',bigotes:'EL DESPISTADO',pelusa:'LA REINA DE LA PISTA',nube:'LA NUBE HAMBRIENTA',sombra:'LA CALLEJERA',mostaza:'EL ALMA DE LA FIESTA',canela:'LA COQUETA',garra:'CAMPEÓN DE LOS TECHOS',pirata:'EL TERROR DE LOS TACHOS',nieve:'LA ELEGANTE',chispa:'PURA ENERGÍA',oreo:'EL MÚSICO',lola:'LA GOLOSA'};
const TAUNT={educado:'Qué pena pelear con el anfitrión... pero bueno.',perdido:'¿Y si pierdo? ¿Me ayudás a buscar mis cosas igual?',hambriento:'Después de esto, me como tu pescado.',fiestero:'¡Esto también es parte de la fiesta!',dormilon:'Me despertaste. Ahora aguantate.',agresivo:'Te voy a dejar como alfombra.',okupa:'Cuando gane, esta casa es mía para siempre.',retador:'Que el barrio vea quién manda.'};
const FACEC={};
function faceCanvas(k,m){const key=k+'|'+m;return FACEC[key]||(FACEC[key]=buildFace(k,m));}
function statsOf(k){if(k==='carbon')return[4,4,3];const d=TYPES[k];const cl=v=>Math.max(1,Math.min(5,Math.round(v)));return[cl(d.hp*.7+(d.angry?1:0)),cl((d.speed-18)/5),cl(d.hp*.8)];}
const easeBack=x=>{x=Math.max(0,Math.min(1,x));const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const easeOut=x=>{x=Math.max(0,Math.min(1,x));return 1-Math.pow(1-x,3);};
function renderVS(t){
  const f=F,ek=f.e.key,out=Math.max(0,(t-3.0)/.4),seam=[178,142];
  /* fondo partido */
  ctx.fillStyle='#2a0a24';ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(seam[0],-10);ctx.lineTo(seam[1],218);ctx.lineTo(-10,218);ctx.fill();
  ctx.fillStyle='#0a1638';ctx.beginPath();ctx.moveTo(seam[0],-10);ctx.lineTo(330,-10);ctx.lineTo(330,218);ctx.lineTo(seam[1],218);ctx.fill();
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2+clock*.25;ctx.fillStyle=i%2?'rgba(255,92,157,.07)':'rgba(111,179,255,.07)';ctx.beginPath();ctx.moveTo(160,90);ctx.lineTo(160+Math.cos(a)*400,90+Math.sin(a)*400);ctx.lineTo(160+Math.cos(a+.12)*400,90+Math.sin(a+.12)*400);ctx.fill();}
  ctx.restore();
  const off=(clock*14)%8;
  for(let y=-8;y<216;y+=8)for(let x=-8;x<328;x+=8){const left=x+ (y*(seam[1]-seam[0])/208) <seam[0]-(y/208)*0+0? true:false;
    const sx=seam[0]+(seam[1]-seam[0])*(y/208),isL=x<sx,dd=Math.abs(x-sx),r=Math.min(3,1+dd/60);
    P(ctx,Math.round(x+(isL?off:-off)),y,Math.round(r),Math.round(r),isL?'rgba(255,92,157,.16)':'rgba(111,179,255,.16)');}
  for(let i=0;i<10;i++){const y=((i*26+clock*160)%260)-30;P(ctx,0,Math.round(y),seam[0]-20,1,'rgba(255,200,230,.12)');P(ctx,seam[1]+20,Math.round(240-y),200,1,'rgba(200,220,255,.12)');}
  /* caras gigantes */
  const kL=easeBack((t-.08)/.42),kR=easeBack((t-.16)/.42);
  const lx=Math.round(-140+kL*150-out*200),rx=Math.round(330-kR*142+out*200),bobL=Math.round(Math.sin(clock*3)*1.5),bobR=Math.round(Math.sin(clock*3+1.5)*1.5);
  const fl=faceCanvas('carbon','angry'),fr=faceCanvas(ek,hostile(f.cat)?'retador':'angry');
  ctx.globalAlpha=.35;ctx.drawImage(fl,lx+6,22+bobL,120,120);ctx.save();ctx.translate(rx+120-6,22+bobR);ctx.scale(-1,1);ctx.drawImage(fr,0,0,120,120);ctx.restore();ctx.globalAlpha=1;
  ctx.drawImage(fl,lx,16+bobL,120,120);
  ctx.save();ctx.translate(rx+120,16+bobR);ctx.scale(-1,1);ctx.drawImage(fr,0,0,120,120);ctx.restore();
  /* rayo */
  if(t>.05){const pts=[];for(let i=0;i<=12;i++){const u=i/12;pts.push([seam[0]+(seam[1]-seam[0])*u+(i%12?(Math.random()-.5)*10:0),-10+228*u]);}
    const fz=Math.sin(clock*40)>-.3;
    ctx.lineJoin='miter';ctx.strokeStyle=fz?'#ffd23f':'#ff9a3c';ctx.lineWidth=5;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.stroke();}
  /* placas con nombre */
  const kN=easeOut((t-.32)/.35),nOutL=-180+kN*180-out*220,nOutR=180-kN*180+out*220;
  ctx.save();ctx.translate(nOutL,0);
  ctx.fillStyle='#000';ctx.beginPath();ctx.moveTo(-10,140);ctx.lineTo(154,140);ctx.lineTo(146,164);ctx.lineTo(-10,164);ctx.fill();
  ctx.fillStyle='#ffd23f';ctx.fillRect(-10,140,160,2);
  fText('CARBÓN',64,156,11,'#ffd23f');ctx.font='5px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#f4ead5';ctx.fillText(EPITHET.carbon,72,163);ctx.textAlign='left';
  ctx.restore();
  ctx.save();ctx.translate(nOutR,0);
  ctx.fillStyle='#000';ctx.beginPath();ctx.moveTo(174,140);ctx.lineTo(330,140);ctx.lineTo(330,164);ctx.lineTo(166,164);ctx.fill();
  ctx.fillStyle='#6fb3ff';ctx.fillRect(170,140,160,2);
  fText(TYPES[ek].name.toUpperCase(),256,156,11,'#6fb3ff');ctx.font='5px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#f4ead5';ctx.fillText(EPITHET[ek]||'',250,163);ctx.textAlign='left';
  ctx.restore();
  /* estadísticas */
  if(t>.8){const names=['FUERZA','VELOCIDAD','AGUANTE'],sL=statsOf('carbon'),sR=statsOf(ek),fill=Math.min(1,(t-.8)/.6);
    ctx.globalAlpha=Math.min(1,(t-.8)*4)*(1-out);ctx.font='5px "Press Start 2P"';
    names.forEach((n,i)=>{const y=172+i*8;ctx.textAlign='left';ctx.fillStyle='#a99cc9';ctx.fillText(n,8,y+4);ctx.textAlign='right';ctx.fillText(n,312,y+4);
      for(let j=0;j<5;j++){const onL=j<Math.round(sL[i]*fill),onR=j<Math.round(sR[i]*fill);P(ctx,58+j*9,y-1,7,5,onL?'#ffd23f':'#3a2f5f');P(ctx,256-j*9,y-1,7,5,onR?'#6fb3ff':'#3a2f5f');}});
    ctx.textAlign='left';ctx.globalAlpha=1;}
  /* VS */
  if(t>=.55){
    if(!f.vsSlam){f.vsSlam=true;f.shake=1;f.flash=.6;SFX.hit();noise(.35,.1,0,200);tone(70,.5,'sawtooth',.1,-30);sparks(160,86,36,['#ffd23f','#ffffff','#ff5c9d','#6fb3ff'],1.6);}
    const k=Math.min(1,(t-.55)/.18),sc=1+(1-easeOut(k))*2.4,rot=-.12+(1-k)*.4;
    ctx.save();ctx.translate(160,90);ctx.rotate(rot);ctx.scale(sc,sc);ctx.globalAlpha=1-out;
    ctx.font='28px "Press Start 2P"';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#000';for(const [a,b] of [[-3,0],[3,0],[0,-3],[0,3],[3,3],[4,5],[-3,-3],[3,-3],[-3,3]])ctx.fillText('VS',a,b);
    ctx.fillStyle='#7a1030';ctx.fillText('VS',2,2);
    const g=ctx.createLinearGradient(0,-14,0,14);g.addColorStop(0,'#fff6c0');g.addColorStop(.45,'#ffd23f');g.addColorStop(.55,'#ff9a3c');g.addColorStop(1,'#ff5c9d');ctx.fillStyle=g;ctx.fillText('VS',0,0);
    ctx.restore();ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.globalAlpha=1;
  }
  /* dificultad y provocación */
  if(t>.9){ctx.globalAlpha=(1-out);ctx.font='5px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#f4ead5';ctx.fillText(f.mode==='challenged'?'¡TE DESAFIÓ!':'NIVEL DEL RIVAL',160,9);ctx.textAlign='left';for(let i=0;i<5;i++)P(ctx,138+i*9,12,7,5,i<=LI?'#ff5c9d':'#3a2f5f');ctx.globalAlpha=1;}
  if(t>1.15){const q='«'+(f.cat.def.dare&&f.mode==='challenged'?f.cat.def.dare:TAUNT[f.cat.def.pers]||'¡Pelea!')+'»',n=Math.min(q.length,Math.floor((t-1.15)*42));
    ctx.globalAlpha=1-out;ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(0,196,320,12);ctx.font='5px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#ffffff';ctx.fillText(q.slice(0,n),160,204);ctx.textAlign='left';ctx.globalAlpha=1;
    if(n<q.length&&Math.floor(t*40)%3===0)tone(620,.02,'square',.012);}
  f.fx.forEach(p=>{ctx.globalAlpha=Math.min(1,p.t*3);P(ctx,Math.round(p.x),Math.round(p.y),2,2,p.col);});ctx.globalAlpha=1;
  if(t>.9&&t<3){ctx.globalAlpha=.6+.4*Math.sin(clock*6);ctx.font='5px "Press Start 2P"';ctx.textAlign='right';ctx.fillStyle='#a99cc9';ctx.fillText('ESPACIO: SALTEAR',316,190);ctx.textAlign='left';ctx.globalAlpha=1;}
  /* entrada y salida */
  if(t<.25){ctx.globalAlpha=1-t/.25;P(ctx,-10,-10,340,228,'#ffffff');ctx.globalAlpha=1;
    ctx.strokeStyle='#000';ctx.lineWidth=6;for(let i=0;i<3;i++){const x=40+i*110;ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x-60+t*200,218);ctx.stroke();}}
  if(out>0){ctx.globalAlpha=Math.min(1,out*1.2);P(ctx,-10,-10,340,228,'#ffffff');ctx.globalAlpha=1;}
  if(f.flash>0){ctx.globalAlpha=f.flash;P(ctx,-10,-10,340,228,'#ffffff');ctx.globalAlpha=1;}
}
