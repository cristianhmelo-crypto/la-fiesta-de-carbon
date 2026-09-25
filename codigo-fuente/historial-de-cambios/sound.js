let NB=null;
function noise(d,vol=.05,delay=0,hp=1200){
  if(!ac||muted)return;
  if(!NB){NB=ac.createBuffer(1,Math.floor(ac.sampleRate*.5),ac.sampleRate);const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;}
  const t=ac.currentTime+delay,s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
  s.buffer=NB;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(f).connect(g).connect(ac.destination);s.start(t);s.stop(t+d+.02);
}
Object.assign(SFX,{
  swish:()=>noise(.09,.06,0,2500),
  hit:()=>{tone(160,.1,'square',.08,-80);noise(.06,.05,0,800);},
  bite:()=>{tone(90,.16,'sawtooth',.09,-40);noise(.1,.07,0,500);tone(700,.05,'square',.04,0,.05);},
  jump:()=>tone(300,.12,'square',.04,300),
  bell:()=>{tone(880,.4,'triangle',.07);tone(1320,.4,'triangle',.04);},
  ko:()=>{tone(200,.5,'sawtooth',.08,-150);noise(.3,.06,0,300);},
  vs:()=>{noise(.4,.06,0,400);tone(110,.5,'sawtooth',.07,40);},
  power:()=>{tone(200,.6,'sawtooth',.06,800);},
  fatality:()=>{noise(.6,.12,0,200);tone(70,.8,'sawtooth',.12,-30);[523,659,784,1046,1318].forEach((f,i)=>tone(f,.18,'square',.05,0,.4+i*.1));},
  fridge:()=>{tone(1200,.05,'triangle',.05);tone(900,.08,'triangle',.05,0,.05);}
});
const mtof=m=>440*Math.pow(2,(m-69)/12);
let mNext=0,mStep=0,musicMode='house';
const MB={house:[45,45,57,45,43,43,55,43,41,41,53,41,43,43,55,47],fight:[40,40,52,40,40,43,40,45,38,38,50,38,43,43,47,50]};
const MM={house:[69,0,72,0,76,0,74,72,0,69,0,67,69,0,0,0],fight:[64,0,64,67,0,64,71,0,69,0,67,0,64,0,62,0]};
function musicTick(){
  if(!ac||muted||!(state==='play'||state==='fight')){mNext=0;return;}
  const bpm=musicMode==='fight'?152:118,sp=60/bpm/2;
  if(mNext<ac.currentTime)mNext=ac.currentTime+.05;
  while(mNext<ac.currentTime+.15){
    const s=mStep%16,d=mNext-ac.currentTime;
    tone(mtof(MB[musicMode][s]),sp*.8,'triangle',.04,0,d);
    if(s%4===0)tone(120,.12,'sine',.11,-80,d);
    if(s%2===1)noise(.04,.016,d,6000);
    if(s%8===4)noise(.1,.03,d,1800);
    const m=MM[musicMode][s];if(m)tone(mtof(m),sp*.7,'square',.016,0,d);
    mNext+=sp;mStep++;
  }
}
setInterval(musicTick,40);
