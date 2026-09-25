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
