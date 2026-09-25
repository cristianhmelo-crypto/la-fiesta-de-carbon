import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
master = os.path.join(base, '..', 'fiesta-carbon.html')
src = io.open(master, encoding='utf-8').read()
rooms = io.open(os.path.join(base, 'rooms.js'), encoding='utf-8').read()

def rep(old, new, count=1):
    global src
    n = src.count(old)
    if n != count:
        print('ANCHOR COUNT', n, 'expected', count, '::', old[:90]); sys.exit(1)
    src = src.replace(old, new)

# ---------- mapas nuevos ----------
MAPS = r'''
const MAP_BED=[
"####################",
"#AA...NBBBN.VV..KK.#",
"#AA....BBB.........#",
"#......BBB.........#",
"#......BBB.....rrr.#",
"#..............rrr.#",
"#P.............rrr.#",
"#..................#",
"#...rrrrr..........#",
"#...rrrrr.......SS.#",
"#...rrrrr.......SS.#",
"#L.......P........L#",
"#########D##########"];
const MAP_KIT=[
"####################",
"#FF,CCCWWCCOOCC,,,X#",
"#,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,#",
"#,,,,,TTTT,,,,,,,,,#",
"#,,,,,TTTT,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,#",
"#CC,,,,,,,,,,,,,,,P#",
"#CC,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,#",
"#P,,,,,,,,,,,,,,,,X#",
"#,,,,,,,,,,,,,,,,,,#",
"#####D##############"];
const MAP_BAT=[
"####################",
"#UUUU;;;EE;;;Y;;;I;#",
"#UUUU;;;;;;;;;;;;;;#",
"#;;;;;;;;;;;;;;;;;;#",
"#;;;;;;;;;;;;;;;;;X#",
"#;;;;;;rrrr;;;;;;;;#",
"#;;;;;;rrrr;;;;;;;;#",
"#E;;;;;;;;;;;;;;;;;#",
"#E;;;;;;;;;;;;;;;;P#",
"#;;;;;;;;;;;;;;;;;;#",
"#;;;;;;;;;;;;;;;;;;#",
"#P;;;;;;;;;;;;;;;;X#",
"#########D##########"];
const MAP_LOVE=MAP1.slice();
MAP_LOVE[1]="#KKMM...P#,,,,,,,FF#";MAP_LOVE[9]="#L.................#";
'''
rep('"####D###############"];\n', '"####D###############"];\n' + MAPS)

# ---------- Perla ----------
rep("TYPES.humo.dare='¿Qué mirás, Carbón? ¿Querés pelea? Porque yo sí.';",
    "TYPES.humo.dare='¿Qué mirás, Carbón? ¿Querés pelea? Porque yo sí.';\n"
    "PALS.perla={b:'#fbf8ff',s:'#efe6f6',i:'#ffb0cc',e:'#7fd4ff',p:'#1b1530',n:'#ff8aa8',w:'#ffffff',l:'#ffffff',t:'#f4eef8',d:'#a898c0'};\n"
    "TYPES.perla={name:'Perla',hp:3,speed:22,box:false,pers:'educado',crush:true,role:'SU AMOR PLATÓNICO',rolec:'#b0407a',trait:'Gata blanca de ojos celestes. El amor platónico de Carbón.'};")
rep("HATC.chispa=['#ff5c9d','#5fe0b0'];", "HATC.chispa=['#ff5c9d','#5fe0b0'];ACC.perla=['bow'];")
rep("    if(a==='bowtie'){", "    if(a==='bow'){if(view==='front'){R(1,0,2,3,'#ff5c9d');R(4,0,2,3,'#ff5c9d');R(3,1,1,1,'#ffd1e0');}if(view==='side'){R(12,1,2,3,'#ff5c9d');R(15,1,1,3,'#ff5c9d');R(14,2,1,1,'#ffd1e0');}}\n    if(a==='bowtie'){")
rep("const DISCO=new Map([[MAP1,[5.5,4.5]],[MAP2,[5.5,9]],[MAP3,[3.5,4]]]);",
    "const DISCO=new Map([[MAP1,[5.5,4.5]],[MAP2,[5.5,9]],[MAP3,[3.5,4]],[MAP_BED,[4.5,8.5]],[MAP_KIT,[9.5,7.5]],[MAP_BAT,[10,8]],[MAP_LOVE,[5.5,4.5]]]);")

# ---------- objetos nuevos ----------
ITEMS = r'''
Object.assign(ITEM_DRAW,{
  almohada(g,x,y){P(g,x+2,y+13,12,2,'rgba(0,0,0,.25)');P(g,x+2,y+7,12,6,'#eef0fb');P(g,x+3,y+6,10,1,'#eef0fb');P(g,x+3,y+13,10,1,'#c9cce0');P(g,x+3,y+8,5,2,'#ffffff');P(g,x+1,y+7,1,1,'#c9cce0');P(g,x+14,y+12,1,1,'#c9cce0');P(g,x+6,y+10,4,1,'#b8bcd8');},
  control(g,x,y){P(g,x+4,y+13,9,2,'rgba(0,0,0,.25)');P(g,x+5,y+4,6,10,'#2a2233');P(g,x+5,y+4,6,1,'#4a3f5a');P(g,x+7,y+5,2,1,'#e2344f');P(g,x+6,y+7,1,1,'#9aa9b7');P(g,x+9,y+7,1,1,'#9aa9b7');P(g,x+6,y+9,1,1,'#9aa9b7');P(g,x+9,y+9,1,1,'#9aa9b7');P(g,x+7,y+11,2,1,'#5fe0b0');},
  plato(g,x,y){P(g,x+2,y+13,12,2,'rgba(0,0,0,.2)');P(g,x+3,y+8,10,5,'#f4f4f8');P(g,x+4,y+7,8,1,'#f4f4f8');P(g,x+4,y+13,8,1,'#c9ced8');P(g,x+5,y+9,6,3,'#e2e6ee');P(g,x+6,y+9,3,2,'#e8894a');P(g,x+9,y+10,1,1,'#7ad35a');},
  vaso(g,x,y){P(g,x+4,y+13,8,2,'rgba(0,0,0,.2)');P(g,x+5,y+5,6,9,'#cfe6f2');P(g,x+5,y+5,6,1,'#ffffff');P(g,x+6,y+6,1,7,'#ffffff');P(g,x+5,y+10,6,3,'#f7f6f0');P(g,x+10,y+5,1,9,'#9fbccc');},
  cascara(g,x,y){P(g,x+3,y+13,10,2,'rgba(0,0,0,.2)');P(g,x+6,y+8,4,5,'#ffd23f');P(g,x+3,y+11,4,2,'#ffd23f');P(g,x+9,y+11,4,2,'#ffd23f');P(g,x+7,y+7,2,1,'#8a6a20');P(g,x+3,y+12,2,1,'#d9a820');P(g,x+11,y+12,2,1,'#d9a820');P(g,x+7,y+10,2,2,'#fff2b0');},
  agua(g,x,y){P(g,x+2,y+9,12,5,'#8fc9e8');P(g,x+3,y+8,8,1,'#8fc9e8');P(g,x+4,y+14,7,1,'#8fc9e8');P(g,x+5,y+10,3,1,'#dff2ff');P(g,x+2,y+13,12,1,'#6aa8cc');P(g,x+13,y+7,2,2,'#8fc9e8');},
  papel(g,x,y){P(g,x+1,y+10,14,2,'#f7f6f0');P(g,x+2,y+12,5,1,'#f7f6f0');P(g,x+9,y+9,5,1,'#f7f6f0');P(g,x+1,y+11,14,1,'#dcd9cc');P(g,x+11,y+6,4,5,'#f7f6f0');P(g,x+12,y+7,2,2,'#c9c2b0');},
  espuma(g,x,y){[[3,10,4],[7,8,5],[10,11,4],[5,12,3],[2,8,2]].forEach(([a,b,r])=>{P(g,x+a,y+b,r,r-1,'#ffffff');P(g,x+a,y+b+r-2,r,1,'#cfe6ee');});P(g,x+8,y+9,1,1,'#bfe3ff');},
  shampoo(g,x,y){P(g,x+4,y+13,8,2,'rgba(0,0,0,.25)');P(g,x+5,y+6,6,8,'#ff7aa8');P(g,x+6,y+4,4,2,'#f4f4f8');P(g,x+7,y+3,2,1,'#f4f4f8');P(g,x+5,y+6,1,8,'#ffb0cc');P(g,x+6,y+8,4,3,'#ffffff');P(g,x+10,y+6,1,8,'#d9557f');},
  cepillo(g,x,y){P(g,x+3,y+13,10,2,'rgba(0,0,0,.2)');P(g,x+2,y+10,10,2,'#5aa9ff');P(g,x+2,y+10,10,1,'#9fd0ff');P(g,x+11,y+8,3,2,'#ffffff');P(g,x+11,y+7,3,1,'#5fe0b0');},
  toalla(g,x,y){P(g,x+2,y+13,12,2,'rgba(0,0,0,.2)');P(g,x+2,y+7,12,6,'#5fe0b0');P(g,x+2,y+7,12,1,'#9ff0d0');P(g,x+2,y+10,12,1,'#ffffff');P(g,x+4,y+13,9,1,'#3ab090');P(g,x+13,y+8,1,5,'#3ab090');},
  patito(g,x,y){P(g,x+3,y+13,10,2,'rgba(0,0,0,.25)');P(g,x+3,y+9,10,5,'#ffd23f');P(g,x+8,y+5,5,5,'#ffd23f');P(g,x+13,y+7,2,2,'#ff8a2a');P(g,x+10,y+6,1,1,'#1b1530');P(g,x+4,y+10,4,1,'#fff2b0');P(g,x+3,y+13,10,1,'#d9a820');},
  botella(g,x,y){P(g,x+4,y+13,8,2,'rgba(0,0,0,.25)');P(g,x+5,y+6,6,8,'#f7f6f0');P(g,x+6,y+4,4,2,'#f7f6f0');P(g,x+6,y+3,4,1,'#4f9bd9');P(g,x+5,y+9,6,2,'#4f9bd9');P(g,x+6,y+7,1,6,'#ffffff');P(g,x+10,y+6,1,8,'#c9ced8');}
});
Object.assign(MESS,{
  almohada:{name:'la almohada',carry:true,dest:'bed'},
  control:{name:'el control de la tele',carry:true,dest:'tv'},
  plato:{name:'el plato sucio',carry:true,dest:'sink'},
  vaso:{name:'el vaso sucio',carry:true,dest:'sink'},
  cascara:{name:'la cáscara de banana',carry:true,dest:'bin'},
  agua:{name:'el charco',carry:false,verb:'Secar'},
  papel:{name:'el papel higiénico',carry:false,verb:'Enrollar'},
  espuma:{name:'la espuma',carry:false,verb:'Limpiar'},
  shampoo:{name:'el shampoo',carry:true,dest:'shelf'},
  cepillo:{name:'el cepillo de dientes',carry:true,dest:'shelf'},
  toalla:{name:'la toalla',carry:true,dest:'shelf'},
  patito:{name:'el patito de goma',carry:true,dest:'tub'}
});
Object.assign(HELD_NAME,{almohada:'almohada',control:'control de la tele',plato:'plato',vaso:'vaso',cascara:'cáscara',shampoo:'shampoo',cepillo:'cepillo',toalla:'toalla',patito:'patito',botella:'leche'});
'''
rep("HELD_NAME.disco='disco';", "HELD_NAME.disco='disco';" + ITEMS)
rep("ITEM_SPR[t]=(t==='confeti'||t==='leche')?c:", "ITEM_SPR[t]=(t==='confeti'||t==='leche'||t==='agua'||t==='espuma')?c:")

# ---------- niveles ----------
i0 = src.index('const LEVELS=[')
i1 = src.index('];', src.index("name:'¡Sálvese quien pueda!'")) + 2
old_levels = src[i0:i1]
imp_start = old_levels.index("  {name:'La fiesta imposible'")
tail = old_levels[imp_start:]
tail = tail.replace("story:'Se corrió la voz y vino todo el barrio. Dieciocho invitados, y siguen llegando más por la puerta.'",
                    "story:'Perla le avisó a todo el barrio y vinieron todos. Dieciocho invitados, y siguen llegando más por la puerta. Tu humano está por volver.'")
NEWLV = r'''const LEVELS=[
  {name:'La habitación',map:MAP_BED,room:true,wake:true,time:200,trash:'window',chores:{bed:true,pics:[5,11,18],remote:true},
   messList:['almohada','almohada','lata','espina','globo','cascara'],partyMess:['lata','espina','globo','cascara'],cats:['manchita','bigotes','copito','nieve','garra'],boxes:1,party:0,
   story:'Carbón se despertó en la cama de su humano, rodeado de invitados. ¡Son casi las ocho! Primero, la habitación: nadie puede enterarse de que hubo fiesta acá.',
   tip:'Tendé la cama, poné las almohadas, enderezá los cuadros, encontrá el control de la tele y tirá la mugre por la ventana. Y hablá con cada gato: cada uno reacciona distinto.',
   doneText:'La habitación quedó impecable. Ahora, la cocina...'},
  {name:'La cocina',map:MAP_KIT,room:true,time:230,
   messList:['queso','salchicha','pollo','carton','plato','plato','vaso','vaso','leche','agua','lata','espina','cascara'],partyMess:['plato','vaso','leche','lata','cascara'],cats:['tigre','lola','canela','luna','mostaza','nube'],boxes:2,party:18,
   story:'En la cocina pasó de todo: la heladera abierta, platos por todos lados y charcos de leche. Y los glotones siguen comiendo.',
   tip:'La comida va a la heladera, los platos y vasos a la pileta y la basura al tacho verde. Los charcos se secan. A los glotones, un pescado de la heladera.',
   doneText:'La cocina brilla. Pero del baño sale un ruido raro...'},
  {name:'El baño',map:MAP_BAT,room:true,bath:true,time:240,
   messList:['papel','papel','agua','agua','espuma','shampoo','cepillo','toalla','patito','lata','globo'],partyMess:['papel','agua','espuma'],cats:['humo','rulo','sombra','oreo','pelusa','pirata','copito'],boxes:2,party:16,
   story:'El baño es un desastre total: papel higiénico por todos lados, espuma, charcos... y la patota del barrio adueñada del lugar.',
   tip:'Las cosas del baño van al botiquín, el patito a la bañera y la basura al cesto. Acá están los que buscan pelea: defenderte no te quita reputación.',
   doneText:'El baño quedó reluciente. Pero afuera, en el balcón, la música sigue...'},
  {name:'El balcón',map:MAP1,dance:true,time:60,cats:['pelusa','mostaza','chispa'],mess:0,boxes:0,party:0,
   story:'Afuera, en el balcón, hay una fiesta con luces y una ronda de gatos bailando. Los fiesteros dicen que se van solo si Carbón les gana una batalla de baile.',
   tip:'El rival hace sus pasos y después vos repetís los mismos. Apretá cada flecha (o W A S D) justo cuando llega a su lugar, arriba. Hay que acertar el 90%.'},
  {name:'El amor',map:MAP_LOVE,love:true,time:150,cats:['perla','manchita','pelusa','mostaza','chispa','nieve','oreo','lola'],mess:0,boxes:0,party:0,
   story:'Todos se fueron... y en la puerta apareció Perla, la gata blanca de la que Carbón está enamorado desde siempre. Quiere fiesta. Y Carbón no le sabe decir que no.',
   tip:'Subí la música en el equipo, apagá las lámparas y llevale leche de la heladera a cada invitado con sed. Llená el medidor de fiesta antes de que Perla se aburra.'},
''' + tail
src = src[:i0] + NEWLV + src[i1:]

# ---------- estado, sólidos y muebles ----------
rep("const SOLID=new Set('#SBTFXPKDL');", "const SOLID=new Set('#SBTFXPKDLANVCWOEUIYM');")
rep("const FURN=new Set('SBTFXPKL');", "const FURN=new Set('SBTFXPKLANVCWOEUIYM');")
rep("const LAMPS=new Map([[MAP1,[[13.5,4]]],[MAP2,[[5,4]]],[MAP3,[[12.5,4]]]]);",
    "const LAMPS=new Map([[MAP1,[[13.5,4]]],[MAP2,[[5,4]]],[MAP3,[[12.5,4]]],[MAP_KIT,[[8,3.5],[14,7.5]]],[MAP_BAT,[[9.5,4]]],[MAP_LOVE,[[13.5,4]]]]);")

# ---------- pintar el mapa ----------
rep("const wallish=ch=>ch==='#'||ch==='D';", "const wallish=ch=>ch==='#'||ch==='D';const BATH=m===MAP_BAT,BEDR=m===MAP_BED;")
rep("const kitchenAt=(x,y)=>{const ch=at(x,y);if(ch===',')return true;if(ch==='.'||ch==='r'||ch==='L'||wallish(ch))return false;return DIRS.some(([dx,dy])=>at(x+dx,y+dy)===',');};",
    "const kitchenAt=(x,y)=>{const ch=at(x,y);if(ch===','||ch===';')return true;if(ch==='.'||ch==='r'||ch==='L'||wallish(ch))return false;return DIRS.some(([dx,dy])=>at(x+dx,y+dy)===','||at(x+dx,y+dy)===';');};")
rep("let col=alt?[196,208,206]:[238,231,214];", "let col=BATH?(alt?[178,214,228]:[234,244,248]):alt?[196,208,206]:[238,231,214];")
rep("P(g,X,Y+fy,16,11-fy,'#3c6570');", "P(g,X,Y+fy,16,11-fy,BATH?'#d6eaf0':BEDR?'#6b4f86':'#3c6570');")
rep("for(let sx=0;sx<16;sx++){const gx=X+sx;if(gx%6===0)P(g,gx,Y+fy,1,11-fy,'#335763');if(gx%6===3)for(let sy=fy+1;sy<11;sy+=3)P(g,gx,Y+sy,1,1,'#6c9ba0');}",
    "if(BATH){for(let sy=fy+3;sy<11;sy+=4)P(g,X,Y+sy,16,1,'#a9cbd8');for(let sx=0;sx<16;sx+=4)P(g,X+sx,Y+fy,1,11-fy,'#a9cbd8');}else for(let sx=0;sx<16;sx++){const gx=X+sx;if(gx%6===0)P(g,gx,Y+fy,1,11-fy,BEDR?'#7d5f98':'#335763');if(gx%6===3)for(let sy=fy+1;sy<11;sy+=3)P(g,gx,Y+sy,1,1,BEDR?'#a585c4':'#6c9ba0');}")
rep("P(g,X+2,Y+4,12,5,'#fbfaff');P(g,X+2,Y+4,12,1,'#ffffff');P(g,X+2,Y+8,12,1,'#cfcadf');P(g,X+13,Y+5,1,3,'#dcd7ea');",
    "if(!BEDR){P(g,X+2,Y+4,12,5,'#fbfaff');P(g,X+2,Y+4,12,1,'#ffffff');P(g,X+2,Y+8,12,1,'#cfcadf');P(g,X+13,Y+5,1,3,'#dcd7ea');}")
rep("      case 'X':\n        P(g,X+3,Y+4,10,11,'#4f8a67');",
    "      case 'X':\n        if(BATH){P(g,X+4,Y+6,8,9,'#c9a878');for(let k=0;k<3;k++)P(g,X+4,Y+8+k*3,8,1,'#a8875a');P(g,X+3,Y+5,10,2,'#e0c090');P(g,X+4,Y+14,8,1,'#8a6a40');P(g,X+6,Y+3,3,2,'#f7f6f0');break;}\n        P(g,X+3,Y+4,10,11,'#4f8a67');")
TILESRC = r'''      case 'A':{
        P(g,X,Y,16,16,'#6e4228');if(!U){P(g,X,Y,16,3,'#8a5634');P(g,X,Y+3,16,1,'#4a2a18');}
        if(!Lf)P(g,X,Y,1,16,'#8a5634');if(!Rt)P(g,X+15,Y,1,16,'#3e2414');
        const t0=U?0:5,b0=Dn?16:13;P(g,X+2,Y+t0,12,b0-t0,'#7a4a2e');P(g,X+2,Y+t0,12,1,'#9a6238');P(g,X+13,Y+t0,1,b0-t0,'#5a3319');
        if(Rt)P(g,X+15,Y+t0,1,b0-t0,'#3e2414');if(Lf)P(g,X,Y+t0,1,b0-t0,'#8a5634');
        if(Rt&&Dn)P(g,X+14,Y+12,1,4,'#e0b030');if(Lf&&Dn)P(g,X+1,Y+12,1,4,'#e0b030');
        if(!Dn){P(g,X,Y+13,16,3,'#3e2414');}
        break;}
      case 'N':
        P(g,X+2,Y+6,12,9,'#7a4a2e');P(g,X+2,Y+6,12,2,'#9a6238');P(g,X+3,Y+9,10,4,'#6a3e24');P(g,X+7,Y+10,2,1,'#e0b030');P(g,X+2,Y+14,12,1,'#3e2414');
        P(g,X+7,Y+2,2,4,'#4a3f5a');P(g,X+4,Y-3,8,5,'#f5d08a');P(g,X+5,Y-4,6,1,'#f5d08a');P(g,X+4,Y+1,8,1,'#d29e55');P(g,X+5,Y-2,2,3,'#fff0c4');
        break;
      case 'V':
        P(g,X,Y+7,16,8,'#4a3450');P(g,X,Y+7,16,1,'#6a4c72');P(g,X,Y+14,16,1,'#2a1c30');P(g,X+3,Y+9,10,3,'#3a2840');
        if(!Lf){P(g,X+3,Y-6,26,13,'#141018');P(g,X+4,Y-5,24,10,'#22324a');P(g,X+5,Y-4,6,1,'#3a5070');P(g,X+14,Y+7,4,1,'#141018');P(g,X+27,Y+5,1,1,'#e2344f');}
        break;
      case 'C':case 'W':case 'O':{
        P(g,X,Y,16,16,'#8a5a3a');P(g,X,Y,16,5,'#e8e4dc');P(g,X,Y,16,1,'#ffffff');P(g,X,Y+5,16,1,'#b8b0a0');
        P(g,X+2,Y+7,12,7,'#9a6a44');P(g,X+2,Y+7,12,1,'#b07a50');P(g,X+7,Y+9,2,1,'#e0b030');P(g,X,Y+14,16,2,'#5a3a22');
        if(!Lf)P(g,X,Y,1,16,'#6a4028');if(!Rt)P(g,X+15,Y,1,16,'#4a2a18');
        if(ch==='W'){P(g,X+(Lf?0:2),Y+1,(Lf?14:12)+(Rt?2:0),4,'#9aa9b7');P(g,X+(Lf?0:3),Y+2,(Lf?13:10)+(Rt?3:0),2,'#6a7a8a');if(!Lf){P(g,X+14,Y-4,2,5,'#c9d1da');P(g,X+11,Y-4,5,1,'#e8eef4');}}
        if(ch==='O'){P(g,X+1,Y,14,5,'#2a2233');P(g,X+3,Y+1,4,3,'#4a3f5a');P(g,X+9,Y+1,4,3,'#4a3f5a');P(g,X+4,Y+2,2,1,'#e2344f');P(g,X+2,Y+7,12,7,'#2a2233');P(g,X+3,Y+8,10,4,'#4a3a2a');P(g,X+4,Y+8,4,1,'#6a5a48');}
        break;}
      case 'E':
        P(g,X+1,Y,14,16,'#eef3f6');P(g,X+1,Y,14,1,'#ffffff');P(g,X+14,Y,1,16,'#b8c8d2');P(g,X+1,Y+5,14,1,'#b8c8d2');P(g,X+1,Y+11,14,1,'#b8c8d2');
        P(g,X+3,Y+1,2,4,'#5fe0b0');P(g,X+6,Y+2,2,3,'#ff9ec4');P(g,X+10,Y+7,3,4,'#6fb3ff');P(g,X+4,Y+8,2,3,'#ffd23f');P(g,X+9,Y+12,4,3,'#c77dff');
        if(!Dn)P(g,X+1,Y+15,14,1,'#9aaab4');
        break;
      case 'U':{
        P(g,X,Y,16,16,'#f4f6fa');const l=Lf?0:3,rr=Rt?16:13,t0=U?0:3,bb=Dn?16:12;P(g,X+l,Y+t0,rr-l,bb-t0,'#8fc9e8');if(!U)P(g,X+l,Y+t0,rr-l,1,'#6aa8cc');
        for(let k=0;k<3;k++){const bx=Math.floor(hash(x+k,y)*11)+2,by=Math.floor(hash(y,x+k)*9)+3;P(g,X+bx,Y+by,2,2,'#ffffff');}
        if(!Dn)P(g,X,Y+13,16,3,'#c9d4dd');if(!Lf)P(g,X,Y,1,16,'#ffffff');if(!Rt)P(g,X+15,Y,1,16,'#c9d4dd');
        if(!U&&!Lf){P(g,X+4,Y-2,2,4,'#c9d1da');P(g,X+3,Y-2,4,1,'#e8eef4');}
        break;}
      case 'I':
        P(g,X+3,Y+1,10,5,'#f4f6fa');P(g,X+3,Y+1,10,1,'#ffffff');P(g,X+12,Y+2,1,4,'#c9d4dd');P(g,X+7,Y+2,2,1,'#c9d1da');
        P(g,X+2,Y+6,12,8,'#f4f6fa');P(g,X+3,Y+14,10,1,'#c9d4dd');P(g,X+4,Y+7,8,5,'#dfe8ee');P(g,X+5,Y+8,6,3,'#9fd0e8');
        break;
      case 'Y':
        P(g,X+6,Y+8,4,7,'#e8ecf2');P(g,X+9,Y+8,1,7,'#c9d4dd');P(g,X+1,Y+2,14,6,'#f4f6fa');P(g,X+1,Y+7,14,1,'#c9d4dd');P(g,X+3,Y+3,10,3,'#bcd8e4');P(g,X+7,Y,2,3,'#c9d1da');
        P(g,X+2,Y-13,12,10,'#c9953e');P(g,X+3,Y-12,10,8,'#a8c8d8');P(g,X+4,Y-11,3,5,'#e0f0f8');P(g,X+9,Y-7,2,1,'#e0f0f8');
        break;
      case 'M':
        P(g,X+1,Y+1,14,15,'#2a2233');P(g,X+1,Y+1,14,1,'#4a3f5a');P(g,X+14,Y+2,1,14,'#1a1424');
        P(g,X+4,Y+3,8,6,'#3a3048');P(g,X+5,Y+4,6,4,'#15101f');P(g,X+5,Y+10,6,4,'#3a3048');P(g,X+6,Y+11,4,2,'#15101f');
        break;
'''
rep("      case 'L':\n        P(g,X+4,Y+14,8,2,'rgba(14,8,32,.35)');", TILESRC + "      case 'L':\n        P(g,X+4,Y+14,8,2,'rgba(14,8,32,.35)');")

# ---------- escondites ----------
rep("const HIDE_NAMES={S:'el sillón',B:'la cama',K:'la biblioteca',P:'una planta',T:'la mesa',L:'una lámpara'};",
    "const HIDE_NAMES={S:'el sillón',B:'la cama',K:'la biblioteca',P:'una planta',T:'la mesa',L:'una lámpara',A:'el ropero',N:'la mesita de luz',C:'la mesada',O:'el horno',E:'el botiquín',U:'la bañera',I:'el inodoro',Y:'el lavatorio',V:'el mueble de la tele'};")
rep("room=kit?'de la cocina'", "room=lv&&lv.room?(cx<9.5?'de la izquierda':'de la derecha'):kit?'de la cocina'")
rep("  if(h){hidden.splice(hidden.indexOf(h),1);",
    "  if(h&&h.chore){hidden.splice(hidden.indexOf(h),1);items.push({kind:'mess',type:h.type,x:player.x+(player.face>0?8:-8),y:player.y});say(player.x,player.y-22,'¡El control de la tele!','#ffd23f');SFX.fish();puff(hs.x*T+8,hs.y*T+8,'#ffd23f',10);}\n  else if(h){hidden.splice(hidden.indexOf(h),1);")

# ---------- carga de nivel ----------
rep("for(let m=0;m<lv.mess;m++){const [x,y]=pool.pop();items.push({kind:'mess',type:MESS_KEYS[m%MESS_KEYS.length],x:x*T+8,y:y*T+13});}",
    "(lv.messList||Array.from({length:lv.mess||0},(_,m)=>MESS_KEYS[m%MESS_KEYS.length])).forEach(t=>{const [x,y]=pool.pop();items.push({kind:'mess',type:t,x:x*T+8,y:y*T+13});});")
rep("const thief=cats.find(c=>c.def.steals);", "const thief=CUCHA.get(map)?cats.find(c=>c.def.steals):null;")
rep("if(thief)thief.carry='raton';", "if(thief)thief.carry='raton';initChores();")

# ---------- acciones ----------
old_mess = src[src.index("      if(m.dest==='fridge'){\n        if(fr)return{label:'Guardar '"):src.index("      return{label:'Soltar '+m.name+' (va al tacho verde)',run:dropHeld};\n")+len("      return{label:'Soltar '+m.name+' (va al tacho verde)',run:dropHeld};\n")]
src = src.replace(old_mess,
"""      const dk=destOf(h.type),here=nearestTileOf(destTiles(dk),destRange(dk));
      if(here)return{label:destPut(dk,m.name),tx:here.x*T+8,ty:here.y*T+(dk==='window'?8:0),run:()=>{p.held=null;deliver(h.type,dk,here);}};
      const wr=wrongDest(dk);
      if(wr)return{label:cap(m.name)+' '+destWhere(dk)+', no acá',warn:true,tx:wr.x*T+8,ty:wr.y*T,run:()=>{SFX.err();say(p.x,p.y-22,'¡Ahí no!','#ff5c9d');}};
      return{label:'Soltar '+m.name+' ('+destWhere(dk)+')',run:dropHeld};
""")
rep("p.held=null;stats.cleaned++;toyHome=true;", "p.held=null;stats.cleaned++;markDone('raton');toyHome=true;")
rep("    if(h.kind==='lost'&&cat&&cat.c===h.owner)",
    "    if(h.kind==='milk'){if(cat&&cat.c.thirsty)return{label:'Darle leche a '+cat.c.def.name,tx:cat.c.x,ty:cat.c.y-16,run:()=>giveMilk(cat.c)};if(cat)return{label:'Hablar con '+cat.c.def.name,tx:cat.c.x,ty:cat.c.y-16,run:()=>openTalk(cat.c)};return{label:'Llevale la leche a un gato con sed (gota azul)',run:()=>{SFX.err();say(p.x,p.y-22,'¿Quién tiene sed?','#6fb3ff');}};}\n    if(h.kind==='lost'&&cat&&cat.c===h.owner)")
rep("(m.dest==='fridge'?' (va en la heladera)':m.dest==='cucha'?' (va en tu cucha)':' (va al tacho)')", "' ('+destWhere(destOf(o.type))+')'")
rep("  const hs=nearHide();\n", "  const chA=nearChore();if(chA&&(!cat||chA.d<cat.d))return chA;\n  const hs=nearHide();\n")
rep("  if(fr&&(!cat||fr.d<cat.d))return{label:'Sacar un pescado de la heladera'",
    "  if(fr&&lv.love&&(!cat||fr.d<cat.d))return{label:'Sacar una botella de leche',tx:fr.x*T+8,ty:fr.y*T,run:()=>{p.held={kind:'milk',type:'botella'};SFX.fish();say(fr.x*T+8,fr.y*T,'¡Leche!','#f4f4f8');}};\n  if(fr&&(!cat||fr.d<cat.d))return{label:'Sacar un pescado de la heladera'")

# ---------- actualización ----------
rep("  if(p.busy&&p.busy.search){", "  if(p.busy&&p.busy.fn){p.busy.t+=dt;p.moving=false;if(p.busy.t>=p.busy.dur){const f=p.busy.fn;p.busy=null;f();}return;}\n  if(p.busy&&p.busy.search){")
rep("stats.cleaned++;SFX.trash();puff(o.x,o.y-4,'#ffd23f',8);", "stats.cleaned++;markDone(o.type);SFX.trash();puff(o.x,o.y-4,'#ffd23f',8);")
rep("if(lv.impossible)startArrival();else lose();return;}", "if(lv.impossible)startArrival();else if(lv.love)loseLove();else lose();return;}")
rep("  updatePlayer(dt);\n  cats.forEach(c=>updateCat(c,dt));\n  if(lv.party){",
    "  updatePlayer(dt);\n  cats.forEach(c=>updateCat(c,dt));\n  if(lv.love){updateLove(dt);return;}\n  if(lv.party){")
rep("items.push({kind:'mess',type:MESS_KEYS[Math.floor(Math.random()*MESS_KEYS.length)],x:c.x,y:c.y})", "items.push({kind:'mess',type:pickParty(),x:c.x,y:c.y})")
rep("const k=MESS_KEYS[Math.floor(Math.random()*MESS_KEYS.length)];items.push", "const k=pickParty();items.push")
rep("hidden=hidden.filter(h=>!['gone','leaving','fleeing','boxed'].includes(h.owner.state));", "hidden=hidden.filter(h=>h.chore||!['gone','leaving','fleeing','boxed'].includes(h.owner.state));")
rep("  const messLeft=items.filter(i=>i.kind==='mess').length+(player.held&&player.held.kind==='mess'?1:0);\n  if(!lv.impossible&&messLeft===0&&",
    "  if(!lv.impossible&&tasksLeft()===0&&")
rep("function updateFx(dt){\n", "function updateFx(dt){\n  camShake=Math.max(0,camShake-dt*.5);flys.forEach(f=>f.t+=dt);flys=flys.filter(f=>f.t<.6);\n")
rep("const keysT=Object.keys(TYPES),", "const keysT=Object.keys(TYPES).filter(k=>k!=='perla'),")
rep("function cleanPct(){const left=items.filter(i=>i.kind==='mess').length+(player&&player.held&&player.held.kind==='mess'?1:0),tot=stats.cleaned+left;return tot?stats.cleaned/tot:1;}",
    "function cleanPct(){const left=tasksLeft(),done=stats.cleaned+choresDone(),tot=done+left;return tot?done/tot:1;}")

# ---------- luces ----------
rep("if(ch==='L')lights.push({x:x*T+8,y:y*T+4,r:70,a:.95,col:'255,190,110',flick:true});",
    "if(ch==='L')lights.push({x:x*T+8,y:y*T+4,r:70,a:.95,col:'255,190,110',flick:true,tile:x+','+y});\n    if(ch==='N')lights.push({x:x*T+8,y:y*T-1,r:42,a:.8,col:'255,200,130',flick:true});")
rep("const L=lights.map(l=>l.flick?", "const L=lights.filter(l=>!(l.tile&&lampsOff.has(l.tile))).map(l=>l.flick?")
rep("const dc=DISCO.get(map);if(dc)for(let i=0;i<3;i++){",
    "{const V=tilesOf('V');if(tvOn&&V.length&&lv&&lv.chores){const v=V.reduce((m,q)=>q[0]<m[0]?q:m,V[0]);L.push({x:v[0]*T+16,y:v[1]*T,r:40,a:.75,col:['111,160,255','255,120,200','95,224,176','255,210,120'][Math.floor(clock*2)%4]});}}\n  const nd=3+(lv&&lv.love?lampsOff.size*2+musicLvl:0);const dc=DISCO.get(map);if(dc)for(let i=0;i<nd;i++){")
rep("lg.fillStyle='rgba(12,9,38,.52)';", "lg.fillStyle='rgba(12,9,38,'+(.52+(lv&&lv.love?lampsOff.size*.07:0))+')';")

# ---------- música ----------
rep("  const bpm=musicMode==='fight'?152:118,sp=60/bpm/2;", "  MV=lv&&lv.love?.45+musicLvl*.35:1;const bpm=musicMode==='fight'?152:118+(lv&&lv.love?musicLvl*6:0),sp=60/bpm/2;")
rep("tone(mtof(MB[musicMode][s]),sp*.8,'triangle',.04,0,d);", "tone(mtof(MB[musicMode][s]),sp*.8,'triangle',.04*MV,0,d);")
rep("if(s%4===0)tone(120,.12,'sine',.11,-80,d);", "if(s%4===0)tone(120,.12,'sine',.11*MV,-80,d);")
rep("if(s%2===1)noise(.04,.016,d,6000);", "if(s%2===1)noise(.04,.016*MV,d,6000);")
rep("if(s%8===4)noise(.1,.03,d,1800);", "if(s%8===4)noise(.1,.03*MV,d,1800);")
rep("if(m)tone(mtof(m),sp*.7,'square',.016,0,d);", "if(m)tone(mtof(m),sp*.7,'square',.016*MV,0,d);")

# ---------- dibujo ----------
rep("function render(){\n  if(state==='fight'&&F){renderFight();return;}",
    "function render(){\n  if(state==='fight'&&F){renderFight();return;}\n  if(DZ&&lv&&lv.dance&&(state==='dance'||state==='win'||state==='lose')){renderDance();return;}")
rep("  ctx.drawImage(bg,0,0);\n  drawGarland();", "  ctx.drawImage(bg,0,0);drawChores();\n  drawGarland();")
rep("  drawDisco();\n  notes.forEach(drawNote);", "  drawDisco();drawChoresTop();\n  notes.forEach(drawNote);")

# ---------- caras ----------
rep("  retador:{eye:'fierce',brow:'angry',mouth:'grin'}\n};", "  retador:{eye:'fierce',brow:'angry',mouth:'grin'}\n};\nMOODS.love={eye:'happy',mouth:'smile',blush:1};")
rep("const DARKCATS=new Set(['carbon','rulo','sombra','oreo']);", "const DARKCATS=new Set(['carbon','rulo','sombra','oreo']);COAT.perla='solid';")
rep("  if(acc.includes('bowtie')){for(let y=34",
    "  if(acc.includes('bow')){tri([11,9],[5,4],[5,14],()=>'#ff5c9d');tri([11,9],[17,4],[17,14],()=>'#e2447f');for(let y=8;y<=10;y++)for(let x=10;x<=12;x++)put(x,y,'#ffd1e0');put(6,6,'#ff9ec4');put(7,7,'#ff9ec4');}\n  if(acc.includes('bowtie')){for(let y=34")
rep("happy:'heart',educado:'heart',", "happy:'heart',educado:'heart',love:'heart',")

# ---------- charlas ----------
rep("const l=D.queue.shift(),me=l.who==='carbon',c=D.cat;", "const l=D.queue.shift(),me=l.who==='carbon',c=l.as||D.cat;")
rep("    dlgName.textContent=me?'CARBÓN':c.def.name.toUpperCase();",
    "    tagR.textContent=c.def.name.toUpperCase();pR.style.setProperty('--pc',c.def.rolec||ROLEC[c.def.pers]||'#4a3a8e');\n    dlgName.textContent=me?'CARBÓN':c.def.name.toUpperCase();")
rep("(c.known||c.def.pers==='retador'||c.def.pers==='agresivo'?ROLE[c.def.pers]:'???')", "(c.def.role||(c.known||c.def.pers==='retador'||c.def.pers==='agresivo'?ROLE[c.def.pers]:'???'))")
rep("function greeting(c){\n", "function greeting(c){\n  if(lv&&lv.love)return loveGreeting(c);\n")
rep("function menuFor(c){\n", "function menuFor(c){\n  if(lv&&lv.love)return loveMenu(c);\n")
rep("  const pct=Math.round(cleanPct()*100),list=[];", "  const pct=Math.round(cleanPct()*100),list=[];choreHTML(list);")

# ---------- cinemáticas ----------
rep("const c=CINE;c.t+=dt;const t=c.t,F1=n=>{if(c.flags[n])return false;c.flags[n]=true;return true;};",
    "const c=CINE;c.t+=dt;const t=c.t,F1=n=>{if(c.flags[n])return false;c.flags[n]=true;return true;};\n  if(c.type==='wake'){updateWake(dt,t,F1);return;}")
rep("  if(c.type==='arrival'){\n    if(t>.25&&t<1.6)", "  if(c.type==='wake'){drawWake(t);return;}\n  if(c.type==='arrival'){\n    if(t>.25&&t<1.6)")
rep("  if(CINE.type==='arrival')return[doorT[0]*T+8,(doorT[1]-2)*T];", "  if(CINE.type==='wake')return[player.x,player.y-8];\n  if(CINE.type==='arrival')return[doorT[0]*T+8,(doorT[1]-2)*T];")

# ---------- HUD ----------
i0 = src.index('function updateHud(){')
i1 = src.index('function setHint(a){')
src = src[:i0] + r'''function updateHud(){
  if(!lv)return;
  const lbl=(a,b,c,d)=>{$('#lTime').textContent=a;$('#lMess').textContent=b;$('#lCats').textContent=c;$('#lHeld').textContent=d;};
  hRep.textContent=Math.round(rep);hRepFill.style.width=rep+'%';hRepFill.style.background=rep<REP_MIN?'var(--pink)':rep<65?'var(--amber)':'var(--mint)';hRep.classList.toggle('warn',state==='play'&&rep<REP_MIN);
  if(lv.dance){const a=danceAcc();hTime.textContent=Math.round(a*100)+'%';hTime.classList.toggle('warn',!!DZ&&a<.9);hMess.textContent=(DZ?DZ.hits:0)+' de '+DANCE_TOTAL;hCats.textContent=(DZ?Math.min(2,DZ.round)+1:1)+' de 3';hHeld.textContent='90%';lbl('Precisión','Pasos acertados','Ronda','Para ganar');return;}
  hTime.textContent=fmt(timeLeft);hTime.classList.toggle('warn',state==='play'&&timeLeft<15);
  hHeld.textContent=player&&player.held?HELD_NAME[player.held.type]:'nada';
  if(lv.love){hMess.textContent=Math.round(partyPct())+'%';hCats.textContent=cats.filter(c=>c.thirsty).length;lbl('Perla se aburre en','Fiesta','Gatos con sed','En la boca');return;}
  hMess.textContent=tasksLeft();
  hCats.textContent=cats.filter(c=>c.state!=='gone'&&c.state!=='boxed').length;
  const esc=!!lv.escape;
  lbl(esc?'Aguantá':'Tu humano llega en',esc?'Vidas':'Tareas pendientes',esc?'Gatos que faltan salir':'Invitados en casa',esc?'Salto':'En la boca');
  if(esc&&player){hMess.textContent='♥'.repeat(Math.max(0,player.hp||0))+'♡'.repeat(Math.max(0,3-(player.hp||0)));hHeld.textContent=player.jumpCd>0?'cargando':'listo';}
}
''' + src[i1:]

# ---------- pantallas ----------
rep("<h2>${last?'Casa impecable y Carbón sigue siendo el gato más querido del barrio.':'Todos se fueron y el barrio te sigue queriendo.'}</h2>",
    "<h2>${lv.doneText||'Todos se fueron y el barrio te sigue queriendo.'}</h2>")
rep(":'Tiempo: '+fmt(lv.time)+' · '+lv.cats.length+' invitados · '+lv.mess+' cosas tiradas · '+lv.boxes+' cajas · reputación mínima para ganar: '+REP_MIN}",
    ":lv.dance?'Tres rondas de baile · acertá el 90% de los pasos · ← ↓ ↑ → o W A S D':lv.love?'Tiempo: '+fmt(lv.time)+' · subí la música, apagá las luces y repartí leche':'Tiempo: '+fmt(lv.time)+' · '+lv.cats.length+' invitados · '+tasksLeft()+' tareas · '+lv.boxes+' '+(lv.boxes===1?'caja':'cajas')+' · reputación mínima para ganar: '+REP_MIN}")
rep("${lv.escape?'¡A esquivar!':'A la fiesta'}", "${lv.escape?'¡A esquivar!':lv.dance?'¡A bailar!':lv.love?'Que empiece la fiesta':'¡A ordenar!'}")
rep("function begin(){initAudio();state='play';", "function begin(){initAudio();if(lv.dance){hide();grabFocus();startDance();return;}state='play';")
rep("lastHint='x';}}\nfunction win(){", "lastHint='x';}if(lv.wake)startWake();if(lv.love)loveIntro();}\nfunction win(){")

# ---------- controles ----------
rep("  if(state==='talk'&&D){", "  if(state==='cine'&&CINE&&CINE.type==='wake'&&(e.code==='Space'||e.code==='Enter')){e.preventDefault();CINE.t=Math.max(CINE.t,5.1);return;}\n  if((state==='talk'||state==='dance')&&D){")
rep("  if(state==='fight'&&F){\n    if(e.code==='Space'",
    "  if(state==='dance'){const kd=KMAP[e.code];if(kd){e.preventDefault();if(!e.repeat)dancePress(LANES.indexOf(kd));}if(e.code==='Space')e.preventDefault();return;}\n  if(state==='fight'&&F){\n    if(e.code==='Space'")
rep("if(state==='talk'){if(k==='up')moveSel(-1);if(k==='down')moveSel(1);return;}",
    "if(state==='talk'||(state==='dance'&&D)){if(k==='up')moveSel(-1);if(k==='down')moveSel(1);return;}if(state==='dance'){dancePress(LANES.indexOf(k));b.classList.add('on');return;}")
rep("else if(state==='talk')advance();else doAction();",
    "else if(state==='talk'||(state==='dance'&&D))advance();else if(state==='cine'&&CINE&&CINE.type==='wake')CINE.t=Math.max(CINE.t,5.1);else doAction();", 3)
rep("  else if(state==='talk'){tickTalk(dt);", "  else if(state==='dance'){updateDance(dt);tickTalk(dt);}\n  else if(state==='talk'){tickTalk(dt);")

# ---------- CSS ----------
rep(".q.bad{border-color:var(--pink);color:var(--cream)}", ".q.bad{border-color:var(--pink);color:var(--cream)}\n.q.task{color:var(--cream)}\n.q.task b{color:var(--amber)}\n.q.ok{border-color:var(--mint);color:var(--mint);opacity:.75}")

# ---------- bloque nuevo ----------
rep("/* ---------- pantallas ---------- */", rooms + "\n/* ---------- pantallas ---------- */")

io.open(master, 'w', encoding='utf-8', newline='').write(src)
print('OK', len(src))
