  if(f.phase==='fatality'){ctx.globalAlpha=Math.min(.72,t*1.8);P(ctx,-10,-10,340,228,'#000');ctx.globalAlpha=1;}
  f.proj.forEach(pr=>{const x=Math.round(pr.x),a=1-pr.t/1.3;ctx.globalAlpha=a;for(let i=0;i<14;i++){const hh=4+Math.round(Math.abs(Math.sin(i*1.7+pr.t*30))*10);P(ctx,x-pr.dir*i*2,GROUND-hh,2,hh,i%3?'#ffb547':'#fff3c4');}P(ctx,x-pr.dir*30,GROUND-2,30,2,'#ff9a3c');ctx.globalAlpha=1;});
  const back=f.superT>0?f.superBy:null;
  if(back){drawFighter(back===f.p?f.e:f.p);ctx.globalAlpha=Math.min(.75,(.55-f.superT)*6+.3);P(ctx,-10,-10,340,228,'#05030c');ctx.globalAlpha=1;
    for(let i=0;i<22;i++){const a=i/22*Math.PI*2+clock*.8,r1=40,r2=260;ctx.strokeStyle=i%2?'rgba(255,210,63,.35)':'rgba(255,92,157,.3)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(back.x+Math.cos(a)*r1,GROUND-50+Math.sin(a)*r1);ctx.lineTo(back.x+Math.cos(a)*r2,GROUND-50+Math.sin(a)*r2);ctx.stroke();}
    drawFighter(back);}
  else{drawFighter(f.e);drawFighter(f.p);}
  if(f.hatFly){const h=f.hatFly,c=HATC[f.e.key]||['#ff5c9d','#ffd23f'];ctx.save();ctx.translate(h.x,h.y);ctx.rotate(h.r);P(ctx,-3,-6,6,3,c[0]);P(ctx,-5,-3,10,3,c[1]);P(ctx,-7,0,14,3,c[0]);P(ctx,-1,-9,3,3,'#ffffff');ctx.restore();}
  if(f.phase==='fatality'&&t>.7&&t<1.9){
    const k=Math.min(1,(t-.7)*5),a=t<1.5?1:1-(t-1.5)/.4;ctx.globalAlpha=Math.max(0,a);
    for(let i=0;i<3;i++){const x0=f.e.x-60+i*22,y0=30,len=160*k;ctx.lineCap='square';
      ctx.strokeStyle='#ff5c9d';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+len*.45,y0+len);ctx.stroke();
      ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+len*.45,y0+len);ctx.stroke();}
    ctx.globalAlpha=1;
  }
  f.fx.forEach(p=>{ctx.globalAlpha=Math.min(1,p.t*3);P(ctx,Math.round(p.x),Math.round(p.y),2,2,p.col);});ctx.globalAlpha=1;
  f.cheers.forEach(c=>{ctx.globalAlpha=Math.min(1,c.t*2);ctx.font=(c.big?7:5)+'px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#000';ctx.fillText(c.text,Math.round(c.x)+1,Math.round(c.y)+1);ctx.fillStyle=c.col||(c.big?'#ffd23f':'#f4ead5');ctx.fillText(c.text,Math.round(c.x),Math.round(c.y));});
  ctx.globalAlpha=1;ctx.textAlign='left';
  /* marcador */
  hpBar(10,8,120,f.p,false,'CARBÓN');hpBar(190,8,120,f.e,true,TYPES[f.cat.key].name.toUpperCase());
  const meter=(x,fi,right)=>{const full=fi.meter>=100,w=Math.round(80*fi.meter/100);P(ctx,x-1,29,82,6,'#000');P(ctx,x,30,80,4,'#1b1540');P(ctx,right?x+80-w:x,30,w,4,full?(Math.floor(clock*8)%2?'#ffffff':'#6fb3ff'):'#6fb3ff');
    ctx.font='5px "Press Start 2P"';ctx.textAlign=right?'right':'left';ctx.fillStyle=full?'#ffd23f':'#a99cc9';ctx.fillText(full?(right?'ESPECIAL LISTO':'C: ¡ESPECIAL!'):'ESPECIAL',right?x+80:x,42);ctx.textAlign='left';};
  meter(10,f.p,false);meter(230,f.e,true);
  for(let i=0;i<2;i++){P(ctx,108+i*9,24,6,6,'#000');P(ctx,109+i*9,25,4,4,i<f.wins.p?'#ffd23f':'#3a2f5f');P(ctx,206-i*9,24,6,6,'#000');P(ctx,207-i*9,25,4,4,i<f.wins.e?'#ffd23f':'#3a2f5f');}
  P(ctx,146,4,28,16,'#000');P(ctx,147,5,26,14,'#241a44');fText(String(Math.max(0,Math.ceil(f.time))),160,17,8,f.time<10?'#ff5c9d':'#f4ead5');
  ctx.font='5px "Press Start 2P"';ctx.textAlign='center';ctx.fillStyle='#a99cc9';ctx.fillText('RONDA '+f.round,160,28);ctx.textAlign='left';
  if(f.banner){const b=f.banner,a=Math.min(1,b.t*3);ctx.globalAlpha=a;
    if(b.sp)fText(b.text,160,70,9,'#ffd23f','#7a1030');
    else fText(b.text,b.side<0?60:260,62,8,'#ff9a3c');
    ctx.globalAlpha=1;}
  if(f.phase==='ready')fText(f.phaseT<.8?'RONDA '+f.round:'¡PELEA!',160,104,16,'#ffd23f');
  if(f.phase==='roundEnd'){fText('K.O.',160,92,22,f.roundWinner==='p'?'#ffd23f':'#ff5c9d');if(f.perfect&&f.phaseT>.5)fText('¡PERFECT!',160,118,10,'#5fe0b0');else if(f.phaseT>.6)fText(f.roundWinner==='p'?'RONDA PARA CARBÓN':'RONDA PARA '+TYPES[f.cat.key].name.toUpperCase(),160,118,6,'#f4ead5');}
  if(f.phase==='finish'){const b=Math.sin(clock*10)>0;fText('¡REMATALO!',160,92,14,b?'#ff5c9d':'#ffd23f');fText('ESPACIO',160,112,8,'#f4ead5');if(f.perfect)fText('¡PERFECT!',160,130,8,'#5fe0b0');}
  if(f.phase==='fatality'&&t>1){const sc=1+Math.max(0,.4-(t-1))*2;fText('¡FATALITY',160,78,Math.round(14*sc),'#ff5c9d');fText('GATUNO!',160,100,Math.round(14*sc),'#ff5c9d');if(t>1.5)fText('GARRA SUPREMA DE CARBÓN',160,120,6,'#ffd23f');}
  if(f.phase==='ko')fText('K.O.',160,100,22,'#ffd23f');
  if(f.phase==='lose'){fText('K.O.',160,92,22,'#ff5c9d');if(f.phaseT>.8)fText('CARBÓN PERDIÓ LA PELEA',160,116,6,'#f4ead5');}
  if(f.phase==='fight'&&f.phaseT<4&&f.round===1){ctx.globalAlpha=Math.min(1,(4-f.phaseT));fText('alejarte = cubrirte · ESPACIO x3 = combo · X mordida · C especial',160,200,5,'#f4ead5');ctx.globalAlpha=1;}
  if(f.flash>0){ctx.globalAlpha=f.flash;P(ctx,-10,-10,340,228,'#ffffff');ctx.globalAlpha=1;}
}
