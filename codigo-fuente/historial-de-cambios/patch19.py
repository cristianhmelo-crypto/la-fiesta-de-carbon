import io, os, sys
base = os.path.dirname(os.path.abspath(__file__))
master = os.path.join(base, '..', 'fiesta-carbon.html')
s = io.open(master, encoding='utf-8').read()
story = io.open(os.path.join(base, 'story.js'), encoding='utf-8').read()
rend = io.open(os.path.join(base, 'story_render.js'), encoding='utf-8').read()
i = story.index('function renderStory(){')
story = story[:i] + rend + '\n'
io.open(os.path.join(base, 'story.js'), 'w', encoding='utf-8', newline='').write(story)

def rep(a, b, c=1):
    global s
    n = s.count(a)
    if n != c:
        print('ANCHOR', n, a[:80]); sys.exit(1)
    s = s.replace(a, b)

rep("  if(M==='ouch'){", "  if(M==='smile'){put(hx+5,hy+3,eyeLine);put(hx+6,hy+4,eyeLine);put(hx+7,hy+4,eyeLine);put(hx+8,hy+3,eyeLine);}\n  if(M==='frown'){put(hx+5,hy+4,eyeLine);put(hx+6,hy+3,eyeLine);put(hx+7,hy+3,eyeLine);put(hx+8,hy+4,eyeLine);}\n  if(M==='ouch'){")
rep("  if(E==='hurt'){", """  if(E==='soft'){for(let y=hy-2;y<=hy;y++){put(hx+2,y,pal.e);put(hx+3,y,pal.p);put(hx+4,y,pal.e);put(hx-4,y,pal.e);put(hx-3,y,pal.p);}put(hx+2,hy-2,pal.G);put(hx-4,hy-2,pal.G);for(const a of [2,3,4,-4,-3])put(hx+a,hy-3,eyeLine);}
  if(E==='happy'){[[2,-1],[3,-2],[4,-2],[5,-1]].forEach(([a,b])=>put(hx+a,hy+b,eyeLine));[[-4,-1],[-3,-2],[-2,-1]].forEach(([a,b])=>put(hx+a,hy+b,eyeLine));put(hx+3,hy+1,tint(pal.i,.1));put(hx+4,hy+1,tint(pal.i,.1));}
  if(E==='sad'){for(let y=hy-1;y<=hy;y++){put(hx+2,y,pal.e);put(hx+3,y,pal.p);put(hx+4,y,pal.e);put(hx-4,y,pal.e);put(hx-3,y,pal.p);}put(hx+2,hy-1,pal.G);put(hx+2,hy-4,eyeLine);put(hx+3,hy-3,eyeLine);put(hx+4,hy-2,eyeLine);put(hx-3,hy-4,eyeLine);put(hx-4,hy-3,eyeLine);put(hx+5,hy+1,'#9fd8ff');}
  if(E==='hurt'){""")
rep("  if(a==='start')showIntro(0);", "  if(a==='start')startStory();")
rep("  if((state==='talk'||state==='dance')&&D){", "  if(state==='story'&&(e.code==='Escape'||e.code==='KeyS')&&!e.repeat){e.preventDefault();endStory();return;}\n  if((state==='talk'||state==='dance'||state==='story')&&D){")
rep("  if(state==='run'){const kr=KMAP[e.code];", "  if(state==='story'){if(e.code==='Space'||e.code==='Enter')e.preventDefault();return;}\n  if(state==='run'){const kr=KMAP[e.code];")
rep("(state==='dance'&&D)", "((state==='dance'||state==='story')&&D)", 4)
rep("  else if(state==='run')updateRun(dt);", "  else if(state==='run')updateRun(dt);\n  else if(state==='story'){updateStory(dt);tickTalk(dt);}")
rep("function render(){\n  if(state==='fight'&&F){renderFight();return;}", "function render(){\n  if(state==='story'&&ST){renderStory();return;}\n  if(state==='fight'&&F){renderFight();return;}")
rep("$('#stage').addEventListener('pointerdown',", "hint.addEventListener('click',()=>{if(state==='story')endStory();});\n$('#stage').addEventListener('pointerdown',")
rep("/* ---------- pantallas ---------- */", story + "\n/* ---------- pantallas ---------- */")
s = s.replace("showTitle();\n(document.fonts", "showTitle();\nwindow.__dbg={st:()=>state,S:()=>ST,ev:c=>eval(c)};/*DBG*/\n(document.fonts", 1)
io.open(master, 'w', encoding='utf-8', newline='').write(s)
a = s.index('<script>') + 8; b = s.rindex('</script>')
io.open(os.path.join(base, '..', '..', 'chk.js') if False else 'C:/Users/OLAS/AppData/Local/Temp/claude/D--WEB-PARA-MAMA-BEACH-Y-EVENTOS-CASA-FABRIC/5045cdf8-395f-4afa-88b4-3ec25ed0b3e7/scratchpad/chk.js', 'w', encoding='utf-8').write(s[a:b])
print('OK')
