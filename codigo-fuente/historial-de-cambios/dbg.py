p='fiesta-carbon.html';s=open(p,encoding='utf-8').read()
import re
line=[l for l in s.split('\n') if '/*DBG*/' in l][0]
s=s.replace(line+'\n','',1)
s=s.replace('showTitle();\n(document.fonts','showTitle();\n'+line+'\n(document.fonts',1)
open(p,'w',encoding='utf-8').write(s)
print(s.count('/*DBG*/'))
