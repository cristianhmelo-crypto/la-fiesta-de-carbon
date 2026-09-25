Object.assign(ITEM_DRAW,{
  queso(g,x,y){P(g,x+3,y+13,11,2,'rgba(0,0,0,.25)');P(g,x+3,y+9,10,5,'#ffd23f');P(g,x+3,y+8,7,1,'#ffd23f');P(g,x+3,y+7,4,1,'#ffe27a');P(g,x+5,y+10,2,1,'#e0a820');P(g,x+9,y+12,1,1,'#e0a820');P(g,x+11,y+10,1,1,'#e0a820');P(g,x+3,y+13,10,1,'#d49a18');P(g,x+4,y+8,2,1,'#fff2b0');},
  salchicha(g,x,y){P(g,x+2,y+13,12,2,'rgba(0,0,0,.25)');P(g,x+2,y+8,11,3,'#c8553d');P(g,x+3,y+8,9,1,'#e8866a');P(g,x+2,y+10,11,1,'#9a3a26');P(g,x+4,y+11,10,3,'#b84a34');P(g,x+5,y+11,8,1,'#dc7458');P(g,x+4,y+13,10,1,'#8e3322');P(g,x+13,y+10,1,1,'#f4ead5');},
  carton(g,x,y){P(g,x+4,y+13,9,2,'rgba(0,0,0,.25)');P(g,x+5,y+5,6,9,'#f4f4f8');P(g,x+5,y+4,6,1,'#dfe3ea');P(g,x+6,y+3,4,1,'#c9ced8');P(g,x+5,y+8,6,3,'#4f9bd9');P(g,x+6,y+9,2,1,'#ffffff');P(g,x+10,y+5,1,9,'#c9ced8');P(g,x+5,y+5,1,9,'#ffffff');},
  pollo(g,x,y){P(g,x+3,y+13,11,2,'rgba(0,0,0,.25)');P(g,x+3,y+8,8,5,'#c97a30');P(g,x+4,y+7,6,1,'#d9893a');P(g,x+4,y+8,4,2,'#f0b060');P(g,x+3,y+12,8,1,'#9a5a20');P(g,x+11,y+10,3,1,'#f4ead5');P(g,x+13,y+9,2,1,'#f4ead5');P(g,x+13,y+11,2,1,'#f4ead5');}
});
const MESS={
  queso:{name:'el queso',carry:true,dest:'fridge'},
  lata:{name:'la lata vacía',carry:true,dest:'bin'},
  confeti:{name:'el confeti',carry:false,verb:'Barrer'},
  salchicha:{name:'las salchichas',carry:true,dest:'fridge'},
  espina:{name:'la espina',carry:true,dest:'bin'},
  leche:{name:'la leche',carry:false,verb:'Secar'},
  carton:{name:'el cartón de leche',carry:true,dest:'fridge'},
  globo:{name:'el globo pinchado',carry:true,dest:'bin'},
  maceta:{name:'la maceta',carry:false,verb:'Acomodar'},
  pollo:{name:'el pollo',carry:true,dest:'fridge'}
};
const MESS_KEYS=Object.keys(MESS);
const HELD_NAME={lata:'lata',espina:'espina',globo:'globo',caja:'caja',pescado:'pescado',queso:'queso',salchicha:'salchichas',carton:'leche',pollo:'pollo'};
const cap=t=>t.charAt(0).toUpperCase()+t.slice(1);

