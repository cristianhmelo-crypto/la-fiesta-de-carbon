function nearCucha(){const cc=CUCHA.get(map);if(!cc)return null;const x=cc[0]*T+8,y=cc[1]*T+12;return dist(player.x,player.y,x,y)<=15?{x,y}:null;}
function boxCost(c){return hostile(c)?-1:(c.state==='sleep'?-2:-8);}
function getAction(){
  const p=player,cat=nearestCat(19);
  if(p.held){
    const h=p.held;
    if(h.kind==='mess'){
      const m=MESS[h.type],bin=nearestTileOf(bins,11),fr=nearestTileOf(fridges,11);
      if(m.dest==='cucha'){
        const cu=nearCucha();
        if(cu)return{label:'Dejar tu ratón en tu cucha',tx:cu.x,ty:cu.y-8,run:()=>{p.held=null;stats.cleaned++;toyHome=true;SFX.fridge();puff(cu.x,cu.y-4,'#ffd23f',8);say(cu.x,cu.y-10,'¡Tu ratón!','#ffd23f');}};
        return{label:'Soltar tu ratón (va en tu cucha, cerca de la puerta)',run:dropHeld};
      }
      if(m.dest==='fridge'){
        if(fr)return{label:'Guardar '+m.name+' en la heladera',tx:fr.x*T+8,ty:fr.y*T,run:()=>{p.held=null;stats.cleaned++;SFX.fridge();puff(fr.x*T+8,fr.y*T+10,'#cfe8ff',8);say(fr.x*T+8,fr.y*T+4,'+10','#5fe0b0');}};
        if(bin)return{label:cap(m.name)+' va en la heladera, no al tacho',warn:true,tx:bin.x*T+8,ty:bin.y*T,run:()=>{SFX.err();say(p.x,p.y-22,'¡A la heladera!','#6fb3ff');}};
        return{label:'Soltar '+m.name+' (va en la heladera)',run:dropHeld};
      }
      if(bin)return{label:'Tirar '+m.name+' al tacho',tx:bin.x*T+8,ty:bin.y*T,run:()=>{p.held=null;stats.cleaned++;SFX.trash();puff(bin.x*T+8,bin.y*T+4,'#9be7b8',8);say(bin.x*T+8,bin.y*T,'+10','#5fe0b0');}};
      if(fr)return{label:cap(m.name)+' va al tacho verde',warn:true,tx:fr.x*T+8,ty:fr.y*T,run:()=>{SFX.err();say(p.x,p.y-22,'¡Al tacho!','#5fe0b0');}};
      return{label:'Soltar '+m.name+' (va al tacho verde)',run:dropHeld};
    }
    if(h.kind==='box'){
      if(cat){const c=cat.c,cost=boxCost(c);
        if(!c.def.box)return{label:c.def.name+' no entra en ninguna caja',warn:true,tx:c.x,ty:c.y-16,run:()=>{SFX.err();say(c.x,c.y-18,'¡No entro!','#ff5c9d');}};
        return{label:'Tapar a '+c.def.name+' con la caja (reputación '+cost+')',warn:cost<-2,tx:c.x,ty:c.y-16,run:()=>{snapCat(c);dropToy(c);c.state='boxed';c.boxT=0;p.held=null;stats.box++;addRep(cost);SFX.box();puff(c.x,c.y-4,'#e0ad6a',8);say(c.x,c.y-18,'¿Eh?','#e0ad6a');}};
      }
      return{label:'Soltar la caja',run:dropHeld};
    }
    if(h.kind==='lost'&&cat&&cat.c===h.owner)return{label:'Devolverle '+LOST[h.type]+' a '+cat.c.def.name,tx:cat.c.x,ty:cat.c.y-16,run:()=>openTalk(cat.c)};
    if(cat)return{label:'Hablar con '+cat.c.def.name,tx:cat.c.x,ty:cat.c.y-16,run:()=>openTalk(cat.c)};
    if(h.kind==='food'){
      const fr=nearestTileOf(fridges,11);
      if(fr)return{label:'Guardar el pescado',tx:fr.x*T+8,ty:fr.y*T,run:()=>{p.held=null;SFX.drop();}};
      return{label:'Dejar el pescado en el piso',run:dropHeld};
    }
    if(h.kind==='lost')return{label:'Soltar '+LOST[h.type]+' (es de '+h.owner.def.name+')',run:dropHeld};
  }
  const it=nearestItem(13),catD=cat?cat.d:Infinity;
  if(it&&it.d<=catD){
    const o=it.it;
    if(o.kind==='box')return{label:'Agarrar la caja',tx:o.x,ty:o.y-12,run:()=>{items.splice(items.indexOf(o),1);p.held={kind:'box',type:'caja'};SFX.pick();}};
    if(o.kind==='food')return{label:'Agarrar el pescado',tx:o.x,ty:o.y-12,run:()=>{items.splice(items.indexOf(o),1);p.held={kind:'food',type:'pescado'};SFX.pick();}};
    if(o.kind==='lost')return{label:'¡Agarrar '+LOST[o.type]+' de '+o.owner.def.name+'!',tx:o.x,ty:o.y-12,run:()=>{items.splice(items.indexOf(o),1);p.held={kind:'lost',type:o.type,owner:o.owner};SFX.fish();say(o.x,o.y-16,'¡Lo encontré!','#ffd23f');}};
    const m=MESS[o.type];
    if(m.carry)return{label:'Agarrar '+m.name+(m.dest==='fridge'?' (va en la heladera)':m.dest==='cucha'?' (va en tu cucha)':' (va al tacho)'),tx:o.x,ty:o.y-12,run:()=>{items.splice(items.indexOf(o),1);p.held={kind:'mess',type:o.type};SFX.pick();}};
    return{label:m.verb+' '+m.name,tx:o.x,ty:o.y-12,run:()=>{p.busy={t:0,dur:.8,item:o};SFX.clean();}};
  }
  const fr=nearestTileOf(fridges,11);
  if(fr&&(!cat||fr.d<cat.d))return{label:'Sacar un pescado de la heladera',tx:fr.x*T+8,ty:fr.y*T,run:()=>{p.held={kind:'food',type:'pescado'};SFX.fish();say(fr.x*T+8,fr.y*T,'¡Pescado!','#8fb3d4');}};
  if(cat)return{label:'Hablar con '+cat.c.def.name,tx:cat.c.x,ty:cat.c.y-16,run:()=>openTalk(cat.c)};
  return null;
}
