  const fr=c.moving?(Math.floor(c.anim*7)%2):(Math.floor(c.anim*1.2)%2);
  let bob=c.moving&&fr?-1:0;
  const view=dir==='side'?'side':dir==='up'?'back':'front';
  if(c.state==='wander'&&!c.moving&&c.wait>0&&c.stun<=0){
    const beat=Math.floor(clock*2.4+c.seed*2),face=(beat>>1)%2?1:-1;bob=beat%2?-2:0;
    const img=SPR[c.key].dance[beat%2];
    if(face<0){ctx.save();ctx.translate(x+16,y+bob);ctx.scale(-1,1);ctx.drawImage(img,0,0);ctx.restore();}else ctx.drawImage(img,x,y+bob);
    drawAcc(ctx,c.key,'front',x,y+bob,1,face<0,clock+c.seed);
    if(Math.random()<.012)addNote(x+12,y-2);
  }else{
    drawCatSprite(c.key,mood,fr,x,y+bob,c.face,dir);
    drawAcc(ctx,c.key,view,x,y+bob,1,c.face<0,clock+c.seed);
  }
