import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(base, '..', 'fiesta-carbon.html')
s = io.open(p, encoding='utf-8').read()
def rep(a, b):
    global s
    n = s.count(a)
    if n != 1:
        print('ANCHOR', n, a[:80]); sys.exit(1)
    s = s.replace(a, b)
rep("  const st=SSTEPS[Z.step];if(!st)return;\n  if(st.upd)st.upd(Z,dt,Z.t);",
"""  {const c=sActor('carbon');let tg={x:240,y:156,z:1};
   if(D&&D.cur){const fr=Z.actors.filter(a=>a.key!=='carbon'&&a.a>0),avg=fr.length?fr.reduce((s2,a)=>s2+a.x,0)/fr.length:c.x,sp=spk&&spk!=='carbon'&&sActor(spk)?sActor(spk).x:avg;tg={x:Math.max(160,Math.min(320,(c.x+sp)/2)),y:218,z:1.5};}
   Z.cam=Z.cam||{x:240,y:156,z:1};const k=Math.min(1,dt*3.2);Z.cam.x+=(tg.x-Z.cam.x)*k;Z.cam.y+=(tg.y-Z.cam.y)*k;Z.cam.z+=(tg.z-Z.cam.z)*k;if(Math.abs(Z.cam.z-tg.z)<.008)Z.cam.z=tg.z;}
  const st=SSTEPS[Z.step];if(!st)return;
  if(st.upd)st.upd(Z,dt,Z.t);""")
rep("  const Z=ST;ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;\n  ctx.drawImage(storyBG(),0,0);",
"""  const Z=ST,cm=Z.cam||{x:240,y:156,z:1};ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.setTransform(2*cm.z,0,0,2*cm.z,Math.round(2*(240-cm.x*cm.z)),Math.round(2*(156-cm.y*cm.z)));ctx.imageSmoothingEnabled=false;
  ctx.drawImage(storyBG(),0,0);""")
rep("  if(Z.cap&&Z.step===0){ctx.globalAlpha=Math.max(0,Math.min(1,Z.t*1.5,(3.6-Z.t)*2));",
    "  ctx.setTransform(2,0,0,2,0,0);\n  if(Z.cap&&Z.step===0){ctx.globalAlpha=Math.max(0,Math.min(1,Z.t*1.5,(3.6-Z.t)*2));")
io.open(p, 'w', encoding='utf-8', newline='').write(s)
x = s.index('<script>') + 8; y = s.rindex('</script>')
io.open('C:/Users/OLAS/AppData/Local/Temp/claude/D--WEB-PARA-MAMA-BEACH-Y-EVENTOS-CASA-FABRIC/5045cdf8-395f-4afa-88b4-3ec25ed0b3e7/scratchpad/chk.js', 'w', encoding='utf-8').write(s[x:y])
print('OK')
