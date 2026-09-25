import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
master = os.path.join(base, '..', 'fiesta-carbon.html')
src = io.open(master, encoding='utf-8').read()
run = io.open(os.path.join(base, 'run.js'), encoding='utf-8').read()

def rep(old, new, count=1):
    global src
    n = src.count(old)
    if n != count:
        print('ANCHOR COUNT', n, 'expected', count, '::', old[:90]); sys.exit(1)
    src = src.replace(old, new)

# nivel 7: carrera
i0 = src.index("  {name:'¡Sálvese quien pueda!'")
i1 = src.index("}", src.index("tip:", i0)) + 1
src = src[:i0] + """  {name:'¡Sálvese quien pueda!',map:MAP3,time:50,escape:true,run:true,cats:['humo','rulo','sombra','luna','bigotes','tigre','pelusa','mostaza','pirata','garra','manchita','canela'],mess:0,boxes:0,party:0,
   story:'Tu humano abrió la puerta y vio todo. Agarró la escoba y viene atrás tuyo. Los invitados huyen por todos lados y la única salida es la ventana del fondo del pasillo.',
   tip:'← → para cambiar de carril. ↑ o ESPACIO para saltar a los gatos dormidos y las cajas. ↓ para agacharte debajo de las mesas y de lo que te tiran. Si chocás, tu humano se acerca.'}""" + src[i1:]

rep("<p class=\"facts\">Aguantá ${fmt(lv.time)} · 3 vidas · ESPACIO: saltar</p>\n    <div class=\"row\"><button class=\"btn\" data-act=\"escbegin\">¡A esquivar!</button></div>",
    "<p class=\"facts\">Llegá a la ventana del fondo · ← → carril · ↑ saltar · ↓ agacharse</p>\n    <div class=\"row\"><button class=\"btn\" data-act=\"escbegin\">¡A correr!</button></div>")
rep("${lv.escape?'Aguantá '+fmt(lv.time)+' · 3 vidas · ESPACIO: saltar':", "${lv.escape?'Llegá a la ventana del fondo · ← → carril · ↑ saltar · ↓ agacharse':")
rep("${lv.escape?'¡A esquivar!':lv.dance", "${lv.escape?'¡A correr!':lv.dance")
rep("function begin(){initAudio();if(lv.dance){", "function begin(){initAudio();if(lv.run){hide();grabFocus();startRun();return;}if(lv.dance){")
rep("if(!ac||muted||!(state==='play'||state==='fight')){mNext=0;return;}", "if(!ac||muted||!(state==='play'||state==='fight'||state==='run')){mNext=0;return;}")
rep("  if(DZ&&lv&&lv.dance&&(state==='dance'||state==='win'||state==='lose')){renderDance();return;}",
    "  if(DZ&&lv&&lv.dance&&(state==='dance'||state==='win'||state==='lose')){renderDance();return;}\n  if(RN&&lv&&lv.run&&(state==='run'||state==='win'||state==='lose')){renderRun();return;}")
rep("DZ=null;\n  TILES={};", "DZ=null;RN=null;\n  TILES={};")
rep("  if(state==='dance'){const kd=KMAP[e.code];",
    "  if(state==='run'){const kr=KMAP[e.code];if(kr){e.preventDefault();if(!e.repeat)runKey(kr);}if(e.code==='Space'){e.preventDefault();if(!e.repeat)runKey('up');}return;}\n  if(state==='dance'){const kd=KMAP[e.code];")
rep("if(state==='dance'){dancePress(LANES.indexOf(k));b.classList.add('on');return;}",
    "if(state==='dance'){dancePress(LANES.indexOf(k));b.classList.add('on');return;}if(state==='run'){runKey(k);b.classList.add('on');return;}")
rep("else if(state==='talk'||(state==='dance'&&D))advance();", "else if(state==='run')runKey('up');else if(state==='talk'||(state==='dance'&&D))advance();", 3)
rep("  else if(state==='dance'){updateDance(dt);tickTalk(dt);}", "  else if(state==='dance'){updateDance(dt);tickTalk(dt);}\n  else if(state==='run')updateRun(dt);")
rep("  if(lv.dance){const a=danceAcc();",
    "  if(lv.run){const R=RN;hTime.textContent=R?Math.max(0,Math.ceil((RWIN-R.pz)/2.4))+' m':'—';hTime.classList.remove('warn');hMess.textContent=R?(R.close>.72?'¡encima!':R.close>.45?'cerca':'lejos'):'lejos';hCats.textContent=R?R.dodged:0;hHeld.textContent=R?R.hits:0;lbl('Hasta la ventana','Tu humano','Cosas esquivadas','Choques');return;}\n  if(lv.dance){const a=danceAcc();")
rep("/* ---------- pantallas ---------- */", run + "\n/* ---------- pantallas ---------- */")
io.open(master, 'w', encoding='utf-8', newline='').write(src)
print('OK')
