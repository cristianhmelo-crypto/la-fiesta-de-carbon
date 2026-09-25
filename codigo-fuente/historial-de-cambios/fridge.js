function fridgeOpen(){return items.some(i=>i.kind==='mess'&&MESS[i.type].dest==='fridge')||!!(player&&player.held&&player.held.kind==='mess'&&MESS[player.held.type].dest==='fridge');}
function drawFridge(){
  if(!fridgeOpen())return;
  fridgeGroups.forEach(fg=>{const X=fg.x*T,Y=fg.y*T,W=fg.w*T;
    P(ctx,X+1,Y+1,W-5,12,'#fff6d6');P(ctx,X+1,Y+1,W-5,1,'#ffffff');P(ctx,X+1,Y+5,W-5,1,'#d9ccaa');P(ctx,X+1,Y+9,W-5,1,'#d9ccaa');
    P(ctx,X+3,Y+2,2,3,'#7ad35a');P(ctx,X+6,Y+3,3,2,'#e2344f');P(ctx,X+W-12,Y+6,3,3,'#ffd23f');P(ctx,X+4,Y+10,4,2,'#f4f4f8');P(ctx,X+10,Y+7,2,2,'#ff9ec4');
    P(ctx,X+W-4,Y,4,15,'#9aa9b7');
    P(ctx,X+W-4,Y+14,4,15,'#e4ecf1');P(ctx,X+W-4,Y+14,1,15,'#ffffff');P(ctx,X+W-1,Y+14,1,15,'#8a99a8');
    P(ctx,X+W-3,Y+17,2,2,'#ff5c9d');P(ctx,X+W-3,Y+21,2,3,'#f4f4f8');P(ctx,X+W-3,Y+25,2,2,'#5fe0b0');
  });
}
function drawDisco(){
  const dc=DISCO.get(map);if(!dc)return;const cx=Math.round(dc[0]*T),cy=Math.round(dc[1]*T)-6;
  ctx.globalAlpha=.25;P(ctx,cx-4,cy+12,8,2,'#000');ctx.globalAlpha=1;
  for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){if(dx*dx+dy*dy>18)continue;P(ctx,cx+dx,cy+dy,1,1,((dx+dy+Math.floor(clock*8))&1)?'#dfe3ee':'#7c8298');}
  P(ctx,cx-2,cy-2,1,1,'#ffffff');
}
