/* ---------- pintar el mapa ---------- */
function windowAt(m,x){return m[0][x]==='#'&&m[1]&&m[1][x]!=='#'&&x%6===3;}
const LAMPS=new Map([[MAP1,[[13.5,4]]],[MAP2,[[5,4]]],[MAP3,[[12.5,4]]]]);
const PLANT=[
"......gG........",
"..G..gGlG..G....",
".GlG.gGlG.GlG...",
".GllGgGlGGllG...",
"..GllGGGGllG.G..",
".G.GlGgGlG..GlG.",
"GlG.GGgGG.GGllG.",
"GllGGGgGGGllGG..",
".GGllGgGllGG....",
"...GGGgGGG......",
"....RRRRRRRR....",
"....rPPPPPpr....",
".....pPPPPp.....",
".....pPPPPp.....",
"......pppp......",
"................"];
const PLANT_SPR=buildSprite(PLANT,{G:'#2f7a45',g:'#245c35',l:'#6cc26e',R:'#e08a57',r:'#a44f2b',P:'#c2643a',p:'#8e4424',b:'#2f7a45',o:'#0f2618'});
const FURN=new Set('SBTFXPKL');
function paintMap(m){
  const W=COLS*T,H=ROWS*T;const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  const at=(x,y)=>(m[y]&&m[y][x])||'#';
  const wallish=ch=>ch==='#'||ch==='D';
  let sd=11;const r=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646;};
  const hash=(x,y)=>{let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295;};
  const kitchenAt=(x,y)=>{const ch=at(x,y);if(ch===',')return true;if(ch==='.'||ch==='r'||ch==='L'||wallish(ch))return false;return DIRS.some(([dx,dy])=>at(x+dx,y+dy)===',');};
  const kitchenMap=[];for(let y=0;y<ROWS;y++){kitchenMap[y]=[];for(let x=0;x<COLS;x++)kitchenMap[y][x]=kitchenAt(x,y);}
  /* suelos, píxel por píxel */
  const img=g.createImageData(W,H),Dd=img.data;
  const WOODS=[[174,116,66],[163,106,59],[184,125,72],[155,99,55],[170,112,62]];
  const rowsB=[];
  for(let pr=0;pr<H/4;pr++){const bounds=[];let x=-Math.floor(r()*20);while(x<W){x+=14+Math.floor(r()*20);bounds.push(x);}rowsB.push({bounds,cols:bounds.map(()=>WOODS[Math.floor(r()*WOODS.length)]).concat([WOODS[0]])});}
  const setPx=(x,y,col)=>{const i=(y*W+x)*4;Dd[i]=col[0];Dd[i+1]=col[1];Dd[i+2]=col[2];Dd[i+3]=255;};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const tx=x>>4,ty=y>>4;if(wallish(at(tx,ty)))continue;
    if(kitchenMap[ty][tx]){
      const lx=x&7,ly=y&7,alt=((x>>3)+(y>>3))&1;let col=alt?[196,208,206]:[238,231,214];
      if(lx===7||ly===7)col=[150,146,132];else if(lx===0||ly===0)col=col.map(v=>v+12);else if(lx===6||ly===6)col=col.map(v=>v-14);
      const n=(hash(x,y)-.5)*7;setPx(x,y,col.map(v=>Math.max(0,Math.min(255,v+n))));
    }else{
      const row=rowsB[y>>2],ly=y&3;let seg=0;while(seg<row.bounds.length&&row.bounds[seg]<=x)seg++;
      let col=row.cols[seg].slice();
      const h=hash(x,y),h2=hash(x>>2,y>>2);
      col=col.map(v=>v+(h2-.5)*8);
      if(ly===0)col=col.map(v=>v+16);
      if(ly===3)col=[104,64,38];
      if(row.bounds.includes(x))col=[96,58,34];
      if(ly>0&&ly<3){if(h<.07)col=col.map(v=>v-18);else if(h>.965)col=col.map(v=>v+12);if(row.bounds.includes(x+2)&&ly===1&&h>.5)col=[80,52,32];}
      setPx(x,y,col.map(v=>Math.max(0,Math.min(255,v))));
    }
  }
  g.putImageData(img,0,0);
  /* alfombras */
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(at(x,y)!=='r')continue;const X=x*T,Y=y*T,same=(dx,dy)=>at(x+dx,y+dy)==='r';
    for(let py=0;py<16;py++)for(let px=0;px<16;px++){
      const gx=X+px,gy=Y+py;
      const dl=same(-1,0)?9:px,dr=same(1,0)?9:15-px,dt=same(0,-1)?9:py,db=same(0,1)?9:15-py,d=Math.min(dl,dr,dt,db);
      let col;
      if(d<=3){col=d===0?'#4e1530':d===3?'#5e1a38':'#c9953e';if(d===1&&(gx+gy)%3===0)col='#f0cf7a';if(d===2&&(gx+gy)%4===0)col='#8e2a4f';}
      else{const a=((gx+gy)%8+8)%8,b=((gx-gy)%8+8)%8;col='#7d2346';if(a===0||b===0)col='#9e3259';if(a===4&&b===4)col='#e2b35c';if(a===0&&b===0)col='#d0557f';if((a===4&&(b===3||b===5))||(b===4&&(a===3||a===5)))col='#b54a33';}
      g.fillStyle=col;g.fillRect(gx,gy,1,1);
    }
    if(!same(-1,0))for(let py=1;py<16;py+=2)P(g,X-2,Y+py,2,1,'#e9dcc0');
    if(!same(1,0))for(let py=1;py<16;py+=2)P(g,X+16,Y+py,2,1,'#e9dcc0');
  }
  /* sombras de las paredes sobre el piso */
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(wallish(at(x,y)))continue;const X=x*T,Y=y*T;
    if(wallish(at(x,y-1)))for(let i=0;i<6;i++)P(g,X,Y+i,16,1,'rgba(14,8,32,'+(0.46-i*0.075)+')');
    if(wallish(at(x-1,y)))for(let i=0;i<4;i++)P(g,X+i,Y,1,16,'rgba(14,8,32,'+(0.32-i*0.08)+')');
    if(wallish(at(x+1,y)))for(let i=0;i<3;i++)P(g,X+15-i,Y,1,16,'rgba(14,8,32,'+(0.2-i*0.06)+')');
  }
  /* sombras de los muebles */
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const ch=at(x,y);if(!FURN.has(ch)||ch==='P'||ch==='L')continue;const X=x*T,Y=y*T;
    if(at(x,y+1)!==ch){P(g,X+1,Y+16,15,2,'rgba(14,8,32,.32)');P(g,X+2,Y+18,14,1,'rgba(14,8,32,.16)');}
    if(at(x+1,y)!==ch)P(g,X+16,Y+3,2,14,'rgba(14,8,32,.22)');
  }
  const firstWin=[...Array(COLS).keys()].find(i=>windowAt(m,i));
  /* paredes, puerta y muebles */
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const ch=at(x,y),X=x*T,Y=y*T;
    const same=(dx,dy)=>at(x+dx,y+dy)===ch,U=same(0,-1),Dn=same(0,1),Lf=same(-1,0),Rt=same(1,0);
    switch(ch){
      case '#':{
        P(g,X,Y,16,16,'#271e3b');
        for(let k=0;k<3;k++)P(g,X+Math.floor(hash(x,y+k)*14),Y+Math.floor(hash(y,x+k)*14),2,1,'#2e2446');
        if(!wallish(at(x-1,y)))P(g,X,Y,1,16,'#4a3b70');
        if(!wallish(at(x+1,y)))P(g,X+15,Y,1,16,'#181227');
        if(y>0&&!wallish(at(x,y-1)))P(g,X,Y,16,1,'#4a3b70');
        const below=at(x,y+1);
        if(!wallish(below)&&y<ROWS-1){
          const fy=y===0?2:7;
          P(g,X,Y+fy-1,16,1,'#8fb3b4');
          P(g,X,Y+fy,16,11-fy,'#3c6570');
          for(let sx=0;sx<16;sx++){const gx=X+sx;if(gx%6===0)P(g,gx,Y+fy,1,11-fy,'#335763');if(gx%6===3)for(let sy=fy+1;sy<11;sy+=3)P(g,gx,Y+sy,1,1,'#6c9ba0');}
          P(g,X,Y+11,16,3,'#5e3d2b');P(g,X,Y+11,16,1,'#80563b');P(g,X,Y+13,16,1,'#4a2e1f');
          if(x%2===0)P(g,X+7,Y+12,1,1,'#4a2e1f');
          P(g,X,Y+14,16,2,'#2a1810');P(g,X,Y+14,16,1,'#3e2619');
          if(y===0&&windowAt(m,x)){
            P(g,X+2,Y+1,12,11,'#d9ccb0');
            for(let yy=0;yy<9;yy++){const t=yy/8;P(g,X+3,Y+2+yy,10,1,'rgb('+Math.round(20+t*22)+','+Math.round(29+t*30)+','+Math.round(69+t*55)+')');}
            P(g,X+5,Y+3,1,1,'#fff6c8');P(g,X+11,Y+8,1,1,'#cfe3ff');P(g,X+4,Y+9,1,1,'#9fb3e8');
            if(x===firstWin){P(g,X+9,Y+3,3,3,'#fff1bf');P(g,X+10,Y+3,2,2,'#1a2455');P(g,X+9,Y+4,1,1,'#fffbe6');}
            P(g,X+8,Y+2,1,9,'#d9ccb0');P(g,X+3,Y+6,10,1,'#d9ccb0');
            P(g,X+13,Y+1,1,11,'#a8987a');P(g,X+2,Y+11,12,1,'#a8987a');
            P(g,X+1,Y+12,14,2,'#efe3c6');P(g,X+1,Y+13,14,1,'#b8a888');
            P(g,X,Y+1,3,11,'#a33e62');P(g,X+1,Y+1,1,11,'#c75580');P(g,X,Y+11,3,2,'#7d2c4a');
            P(g,X+13,Y+1,3,11,'#a33e62');P(g,X+14,Y+1,1,11,'#7d2c4a');P(g,X+13,Y+11,3,2,'#7d2c4a');
            P(g,X,Y,16,1,'#c9953e');
          }
        }
        break;}
      case 'D':
        P(g,X,Y,16,16,'#271e3b');P(g,X+1,Y,14,16,'#3a2a22');
        P(g,X+2,Y+1,12,15,'#7a4524');P(g,X+2,Y+1,12,1,'#9a5c33');P(g,X+2,Y+1,1,15,'#8d5430');
        for(const py of [3,9]){P(g,X+4,Y+py,8,5,'#6a3a1e');P(g,X+4,Y+py,8,1,'#51290f');P(g,X+4,Y+py+4,8,1,'#8d5430');P(g,X+11,Y+py,1,5,'#8d5430');}
        P(g,X+11,Y+8,2,2,'#e0b030');P(g,X+11,Y+8,1,1,'#fff0a0');
        P(g,X+1,Y-6,14,5,'#6a2a3e');P(g,X+2,Y-5,12,3,'#9c3a58');for(let i=0;i<6;i++)P(g,X+3+i*2,Y-4,1,1,'#d9a441');
        break;
      case 'S':{
        P(g,X,Y,16,16,'#5a3c98');
        if(!U){P(g,X,Y+1,16,6,'#4a2f84');P(g,X,Y+1,16,1,'#7d60c4');P(g,X,Y+6,16,1,'#3a2468');if(Rt)P(g,X+15,Y+2,1,4,'#3a2468');}
        const sy=U?0:7;P(g,X,Y+sy,16,16-sy,'#6a4bb3');P(g,X,Y+sy,16,1,'#8a6dd0');P(g,X+7,Y+sy+4,1,1,'#553a98');P(g,X+4,Y+sy+2,3,1,'#7858c2');
        if(Rt)P(g,X+15,Y+sy,1,16-sy,'#553a98');
        if(!Dn){P(g,X,Y+14,16,2,'#3e2670');P(g,X,Y+14,16,1,'#4f3490');}
        if(!Lf){P(g,X,Y+1,3,15,'#4a2f84');P(g,X,Y+1,3,1,'#8a6dd0');P(g,X+2,Y+2,1,13,'#3a2468');}
        if(!Rt){P(g,X+13,Y+1,3,15,'#4a2f84');P(g,X+13,Y+1,3,1,'#8a6dd0');P(g,X+13,Y+2,1,13,'#5d40a0');}
        if(!Lf&&!U){P(g,X+3,Y+5,6,6,'#ff7aa8');P(g,X+3,Y+5,6,1,'#ffa6c6');P(g,X+3,Y+10,6,1,'#c9507c');P(g,X+8,Y+5,1,6,'#d9557f');P(g,X+5,Y+7,2,2,'#ffd23f');}
        break;}
      case 'T':{
        P(g,X,Y,16,15,'#8a5530');for(let k=3;k<15;k+=4)P(g,X,Y+k,16,1,'#7b4a29');
        for(let k=0;k<4;k++)P(g,X+Math.floor(hash(x+k,y)*12),Y+1+Math.floor(hash(y+k,x)*12),3,1,'#9a6238');
        if(!U)P(g,X,Y,16,2,'#b07a48');if(!Lf)P(g,X,Y,1,15,'#5a3319');if(!Rt)P(g,X+15,Y,1,15,'#5a3319');
        if(!Dn){P(g,X,Y+13,16,2,'#5a3319');P(g,X+1,Y+15,2,1,'#3a2010');P(g,X+13,Y+15,2,1,'#3a2010');}
        const q=r();
        if(q<.3){P(g,X+4,Y+4,8,6,'#f1ede4');P(g,X+4,Y+9,8,1,'#c9c2b0');P(g,X+5,Y+5,6,4,'#dcd5c4');P(g,X+6,Y+6,3,2,'#e8a04a');P(g,X+9,Y+6,1,1,'#7ad35a');}
        else if(q<.55){P(g,X+5,Y+5,4,5,'#e2344f');P(g,X+5,Y+5,4,1,'#ff6b85');P(g,X+8,Y+6,1,4,'#b0223b');P(g,X+7,Y+2,1,3,'#f4ead5');}
        else if(q<.78){for(let i=0;i<7;i++)P(g,X+8-(i>>1),Y+3+i,(i>>1)*2+1,1,i%2?'#5fe0b0':'#ffd23f');P(g,X+8,Y+2,1,1,'#ff5c9d');}
        else{P(g,X+4,Y+6,7,4,'#f6e3c0');P(g,X+4,Y+6,7,1,'#ff9ec4');P(g,X+4,Y+9,7,1,'#c9a878');P(g,X+6,Y+5,1,1,'#e2344f');}
        break;}
      case 'B':{
        P(g,X,Y,16,16,'#e6e2f2');
        let by=0;
        if(!U){P(g,X,Y,16,4,'#6b4a2e');P(g,X,Y,16,1,'#8a6340');P(g,X,Y+3,16,1,'#4f361f');P(g,X+2,Y+4,12,5,'#fbfaff');P(g,X+2,Y+4,12,1,'#ffffff');P(g,X+2,Y+8,12,1,'#cfcadf');P(g,X+13,Y+5,1,3,'#dcd7ea');P(g,X,Y+9,16,2,'#eeeaf8');P(g,X,Y+10,16,1,'#c9c4dc');by=11;}
        for(let py=by;py<16;py++)for(let px=0;px<16;px++){const gx=X+px,gy=Y+py;let col='#4a67c9';if(gx%5===0||gy%5===0)col='#3b55ad';else if(gx%5===1&&gy%5===1)col='#6f8ae3';g.fillStyle=col;g.fillRect(gx,gy,1,1);}
        if(!Lf)P(g,X,Y,1,16,'#2c3f86');if(!Rt)P(g,X+15,Y,1,16,'#2c3f86');if(!Dn)P(g,X,Y+15,16,1,'#2c3f86');
        break;}
      case 'F':
        P(g,X,Y,16,16,'#e4ecf1');if(!Lf)P(g,X,Y,1,16,'#ffffff');if(!Rt)P(g,X+14,Y,2,16,'#b3c0cc');
        P(g,X,Y,16,1,'#f7fbff');P(g,X,Y+6,16,1,'#9aa9b7');P(g,X,Y+7,16,1,'#f7fbff');P(g,X,Y+14,16,2,'#8995a2');
        if(!Rt){P(g,X+12,Y+2,1,3,'#7d8da0');P(g,X+12,Y+9,1,4,'#7d8da0');P(g,X+11,Y+2,1,3,'#c9d4dd');}
        if(!Lf){P(g,X+3,Y+2,4,4,'#fdfdfd');P(g,X+4,Y+3,2,2,'#251d37');P(g,X+3,Y+9,2,2,'#ff5c9d');P(g,X+7,Y+10,2,2,'#5fe0b0');}
        else{P(g,X+4,Y+9,3,2,'#ffd23f');}
        break;
      case 'X':
        P(g,X+3,Y+4,10,11,'#4f8a67');P(g,X+3,Y+4,1,11,'#6fb088');P(g,X+12,Y+4,1,11,'#3a6a4f');
        P(g,X+2,Y+2,12,3,'#3c6e51');P(g,X+2,Y+2,12,1,'#5c9a74');P(g,X+6,Y+1,4,1,'#2e5a41');
        P(g,X+6,Y+6,1,8,'#40775a');P(g,X+9,Y+6,1,8,'#40775a');P(g,X+3,Y+14,10,1,'#2e5a41');
        break;
      case 'P':g.drawImage(PLANT_SPR,X,Y);break;
      case 'K':{
        P(g,X,Y,16,16,'#5a3520');P(g,X,Y,1,16,'#7a4a2c');P(g,X+15,Y,1,16,'#3e2414');
        const cols=['#d9534f','#f0c14a','#4fa3d9','#6fbf62','#b77dd8','#e8894a'];
        for(const sy of [1,8]){
          P(g,X+1,Y+sy,14,6,'#26150b');let bx=X+2;
          while(bx<X+14){const w=Math.min(1+Math.floor(r()*2),X+14-bx),h=4+Math.floor(r()*3),col=cols[Math.floor(r()*cols.length)];
            P(g,bx,Y+sy+6-h,w,h,col);P(g,bx,Y+sy+6-h,w,1,tint(col,.35));if(w>1)P(g,bx+w-1,Y+sy+7-h,1,h-1,tint(col,-.25));
            bx+=w+(r()<.18?1:0);}
          P(g,X+1,Y+sy+6,14,1,'#7a4a2c');
        }
        P(g,X+1,Y+15,14,1,'#3e2414');
        break;}
      case 'L':
        P(g,X+4,Y+14,8,2,'rgba(14,8,32,.35)');
        P(g,X+5,Y+13,6,2,'#2a2233');P(g,X+6,Y+13,4,1,'#4a3f5a');
        P(g,X+7,Y+5,2,8,'#4a3f5a');P(g,X+7,Y+5,1,8,'#6a5f7a');
        P(g,X+5,Y,6,1,'#f5d08a');P(g,X+4,Y+1,8,3,'#f5d08a');P(g,X+3,Y+4,10,2,'#f5d08a');
        P(g,X+4,Y+1,2,4,'#fff0c4');P(g,X+10,Y+1,2,5,'#d29e55');P(g,X+3,Y+5,10,1,'#fff7d8');
        break;
    }
  }
  /* lámparas colgantes de la cocina */
  (LAMPS.get(m)||[]).forEach(([tx,ty])=>{const cx=Math.round(tx*T),cy=Math.round(ty*T);
    P(g,cx-4,cy-3,8,6,'#f2cf7a');P(g,cx-3,cy-4,6,1,'#f2cf7a');P(g,cx-3,cy+3,6,1,'#c9953e');P(g,cx+3,cy-2,1,4,'#d9ae5a');P(g,cx-3,cy-2,2,2,'#fff4cf');P(g,cx-1,cy,2,2,'#fffbe8');});
  return c;
}

