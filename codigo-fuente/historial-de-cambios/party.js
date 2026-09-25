/* ---------- baile y accesorios ---------- */
function danceRows(){const r=variant(FRONT,'happy');r[8]=".b.bbllllbD.b...";r[9]=".b..ccggcc..b...";r[10]="..bHsbllbsDb..t.";return r;}
for(const k in PALS)SPR[k].dance=[buildSprite(zRows(danceRows()),PALS[k]),SPR[k].happy[1]];
const DARK={};
function darkSpr(k){
  if(DARK[k])return DARK[k];
  const p=PALS[k],dp={};for(const c in p)dp[c]=(c==='e'||c==='G')?p[c]:tint(p[c],-.5);
  return DARK[k]=[buildSprite(zRows(danceRows()),dp),buildSprite(zRows(variant(FRONT_B,'happy')),dp)];
}
const ACC={manchita:['hat'],copito:['hat'],tigre:['bottle'],humo:['glasses'],luna:['pinkglasses','hat'],rulo:['glasses','bowtie']};
const HATC={manchita:['#ff5c9d','#ffd23f'],copito:['#5fe0b0','#6fb3ff'],luna:['#c77dff','#ffd23f']};
function drawAcc(g,key,view,x,y,sc,flip,t){
  const list=ACC[key];if(!list)return;
  const R=(ax,ay,w,h,col)=>{g.fillStyle=col;const px=flip?16-ax-w:ax;g.fillRect(x+px*sc,y+ay*sc,w*sc,h*sc);};
  for(const a of list){
    if(a==='hat'){
      const [c1,c2]=HATC[key]||['#ff5c9d','#ffd23f'],cx=view==='side'?11:6,top=view==='side'?0:-2;
      R(cx,top-1,2,1,'#ffffff');R(cx,top,2,1,c1);R(cx,top+1,2,1,c2);R(cx-1,top+2,4,1,c1);R(cx-1,top+3,4,1,c2);R(cx-2,top+4,6,1,c1);R(cx+3,top+2,1,3,tint(c1,-.35));
    }
    if(a==='glasses'||a==='pinkglasses'){
      const fr=a==='glasses'?'#0e0b16':'#ff5c9d',ln=a==='glasses'?'#1d1a2e':'#ff9ec4',hl=a==='glasses'?'#6fb3ff':'#ffffff';
      if(view==='front'){R(3,5,3,2,fr);R(8,5,3,2,fr);R(6,5,2,1,fr);R(4,6,1,1,ln);R(9,6,1,1,ln);R(3,5,1,1,hl);R(8,5,1,1,hl);}
      if(view==='side'){R(12,6,3,2,fr);R(9,6,3,1,fr);R(12,6,1,1,hl);}
    }
    if(a==='bottle'){
      const drink=(t%4)<1.1;
      if(view==='front'){
        if(drink){R(7,4,3,5,'#f4f4f8');R(7,3,3,1,'#4f9bd9');R(7,6,3,1,'#4f9bd9');R(8,5,1,1,'#ffffff');}
        else{R(11,8,3,5,'#f4f4f8');R(11,7,3,1,'#4f9bd9');R(11,10,3,1,'#4f9bd9');R(12,9,1,1,'#ffffff');R(11,12,3,1,'#c9ced8');}
      }
      if(view==='side'){R(14,8,3,5,'#f4f4f8');R(14,7,3,1,'#4f9bd9');R(14,10,3,1,'#4f9bd9');}
    }
    if(a==='bowtie'){
      if(view==='front'){R(5,9,2,2,'#e2344f');R(9,9,2,2,'#e2344f');R(7,9,2,1,'#ff6b85');}
      if(view==='side')R(10,9,2,2,'#e2344f');
    }
  }
}
let notes=[];
function addNote(x,y){notes.push({x,y,t:1.4,col:GARL[Math.floor(Math.random()*5)],ph:Math.random()*6});}
function drawNote(n){ctx.globalAlpha=Math.min(1,n.t);const x=Math.round(n.x),y=Math.round(n.y);P(ctx,x+2,y,1,4,n.col);P(ctx,x,y+3,2,2,n.col);P(ctx,x+3,y,2,1,n.col);ctx.globalAlpha=1;}
const DISCO=new Map([[MAP1,[5.5,4.5]],[MAP2,[5.5,9]],[MAP3,[3.5,4]]]);

