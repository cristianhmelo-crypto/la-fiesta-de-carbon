p='fiesta-carbon.html';s=open(p,encoding='utf-8').read()
line=[l for l in s.split('\n') if '/*DBG*/' in l][0]
s=s.replace(line+'\n','',1)
a="if(pc.scratch||pc.bite){f.phase='fatality';f.phaseT=0;f.p.face=f.e.x>f.p.x?1:-1;SFX.power();}"
assert a in s
s=s.replace(a,"if(pc.scratch||pc.bite){f.phase='fatality';f.phaseT=0;f.p.face=f.e.x>f.p.x?1:-1;SFX.power();hint.innerHTML='<b>PELEA</b><span>¡Golpe final de Carbón!</span>';}",1)
open(p,'w',encoding='utf-8').write(s)
print(s.count('__dbg'))
