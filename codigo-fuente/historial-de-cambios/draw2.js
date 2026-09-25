function drawFighter(fi){
  const s=fightSprites(fi.key),flip=fi.face<0,w=FW*FSC,h=FH*FSC,o=fi===F.p?F.e:F.p;
  const sh=Math.max(.3,1-fi.y/140);ctx.globalAlpha=.5;P(ctx,Math.round(fi.x-22*sh),GROUND-2,Math.round(44*sh),4,'#000');ctx.globalAlpha=1;
  const ko=(F.phase==='lose'&&fi===F.p&&F.phaseT>.2)||(F.phase==='ko'&&fi===F.e);
  if(fi.fly||ko||fi.down>0){
    ctx.save();ctx.translate(Math.round(fi.x),fi.fly?Math.round(GROUND-fi.y-48):GROUND-28);ctx.rotate(fi.fly?fi.fly.rot:-Math.PI/2*(fi.face||1));if(flip)ctx.scale(-1,1);
    ctx.drawImage(fi.fly?s.hurtNH:s.hurt,-w/2,-h/2,w,h);ctx.restore();
    if(fi.down>0&&!fi.fly)for(let i=0;i<3;i++){const a=clock*6+i*2.1;P(ctx,Math.round(fi.x-fi.face*30+Math.cos(a)*10),Math.round(GROUND-30+Math.sin(a)*3),2,2,'#ffd23f');}
    return;
  }
  const oAtk=o.atk&&Math.abs(o.x-fi.x)<90;
  let img;
  if(F.phase==='fatality'&&fi===F.p&&F.phaseT<.45)img=s.power;
  else if(F.superT>0&&F.superBy===fi)img=s.power;
  else if(fi.dizzy)img=s.dizzy;
  else if(fi.hurt>0)img=s.hurt;
  else if(fi.block>0||(fi.holdAway&&oAtk&&fi.y===0&&!fi.atk))img=s.block;
  else if(fi.atk)img=fi.atk.type==='pound'?(fi.y>0?s.slam:s.heavy):fi.atk.type==='dash'?s.dash:(s[fi.atk.type]||s.scratch);
  else if(fi.y>0)img=s.jump;
  else if(Math.abs(fi.vx)>5)img=s.walk[Math.floor(fi.anim*7)%2];
  else img=s.idle[Math.floor(fi.anim*3)%2];
  const wob=fi.dizzy?Math.round(Math.sin(clock*9)*3):0,dy=Math.round(GROUND-fi.y-h+2);
  if(fi.trailPos.length){const shadow=fi.atk&&fi.atk.sp==='shadow';fi.trailPos.forEach((t,i)=>{ctx.globalAlpha=t.t*1.6;ctx.save();ctx.translate(Math.round(t.x),Math.round(GROUND-t.y-h+2));if(flip)ctx.scale(-1,1);ctx.drawImage(shadow?s.white:s.dash,-FANCH*FSC,0,w,h);ctx.restore();});ctx.globalAlpha=1;
    if(fi.atk&&fi.atk.sp==='shadow'){ctx.globalCompositeOperation='multiply';fi.trailPos.forEach(t=>{ctx.globalAlpha=t.t*2;P(ctx,Math.round(t.x-24),Math.round(GROUND-t.y-80),48,80,'#6f60c4');});ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}}
  if(fi.inv>0&&Math.floor(clock*20)%2)ctx.globalAlpha=.5;
  ctx.save();ctx.translate(Math.round(fi.x)+wob,dy);if(flip)ctx.scale(-1,1);
  ctx.drawImage(img,-FANCH*FSC,0,w,h);if(fi.hurt>.18)ctx.drawImage(s.white,-FANCH*FSC,0,w,h);
  ctx.restore();ctx.globalAlpha=1;
  if(fi.block>0){ctx.globalAlpha=Math.min(1,fi.block*5);ctx.strokeStyle='#9fd8ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(fi.x+fi.face*18,dy+44,26,-Math.PI/2.6,Math.PI/2.6,fi.face<0);ctx.stroke();ctx.globalAlpha=1;}
  if(img===s.power){ctx.globalCompositeOperation='lighter';const ex=fi.x+fi.face*10,ey=dy+26;const g=ctx.createRadialGradient(ex,ey,0,ex,ey,30);g.addColorStop(0,'rgba(255,230,120,.8)');g.addColorStop(1,'rgba(255,230,120,0)');ctx.fillStyle=g;ctx.fillRect(ex-30,ey-30,60,60);ctx.globalCompositeOperation='source-over';}
  if(fi.atk&&['scratch','scratch2','jscratch','heavy'].includes(fi.atk.type)&&fi.atk.t>ATK[fi.atk.type].start*.5&&fi.atk.t<ATK[fi.atk.type].start+ATK[fi.atk.type].active+.06){
    const hv=fi.atk.type==='heavy',ax=fi.x+fi.face*48,ay=GROUND-fi.y-(fi.atk.type==='jscratch'?40:hv?86:66);ctx.globalAlpha=.85;
    for(let i=0;i<3;i++)for(let k=0;k<8;k++){const kk=hv?-k:k;P(ctx,Math.round(ax+fi.face*(k*2-5)),Math.round(ay-9+i*7+kk*2),2,1,i===1?'#ffd23f':'#ffffff');}
    ctx.globalAlpha=1;
  }
  if(fi.atk&&fi.atk.type==='dash'&&fi.atk.t<ATK.dash.dur){for(let i=0;i<6;i++){const yy=dy+20+i*10+Math.round(Math.sin(clock*40+i)*2);P(ctx,Math.round(fi.x-fi.face*(40+((clock*400+i*30)%50))),yy,18,1,fi.atk.sp==='shadow'?'#a597d6':'#ffd23f');}}
  if(fi.dizzy)for(let i=0;i<3;i++){const a=clock*5+i*2.1;P(ctx,Math.round(fi.x+fi.face*8+Math.cos(a)*16),Math.round(dy+2+Math.sin(a)*4),3,3,'#ffd23f');}
}
