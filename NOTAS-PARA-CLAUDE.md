# La Fiesta de Carbón: notas para seguir en otra conversación

## Qué hay en esta carpeta

- `JUGAR - La Fiesta de Carbon.html`: el juego completo. Doble clic y se abre en
  el navegador. No necesita internet salvo para las tipografías.
- `codigo-fuente/fiesta-carbon.html`: **el archivo maestro.** Es el que se edita
  y el que se publica como Artifact. Arranca con `<title>` y no tiene
  `<html>/<head>/<body>` porque el Artifact agrega ese esqueleto al publicar.
- `codigo-fuente/serve.js`: servidor mínimo para probar el maestro en
  `http://localhost:4390` (configuración `juego-gato` en
  `.claude\launch.json` de esta misma carpeta).
- `codigo-fuente/historial-de-cambios/`: fragmentos y scripts de parche usados
  para construir el juego. Son solo historia: el maestro ya los incluye todos.

## Dónde está publicado

**Página pública (GitHub Pages):** https://cristianhmelo-crypto.github.io/la-fiesta-de-carbon/
Repositorio: https://github.com/cristianhmelo-crypto/la-fiesta-de-carbon (rama
`main`, carpeta raíz). La página sirve `index.html`, que es una copia de
`JUGAR - La Fiesta de Carbon.html`. Para actualizarla: regenerar el JUGAR,
copiarlo a `index.html`, `git commit` y `git push` (GitHub CLI en
`C:\Program Files\GitHub CLI\gh.exe`, sesión iniciada como
cristianhmelo-crypto). La página se actualiza sola en uno o dos minutos. Las
copias de `historial-de-cambios/respaldos/` no se suben (están en `.gitignore`).

Artifact privado de claude.ai: https://claude.ai/artifact/AZxdN7yrmhcPhZ6oBRPGGP
(versión 28: pantalla de carga, arreglos de niveles, baile con dificultad y pelea final con Rocco). Para publicar hay
que leer primero la versión publicada completa (el sistema lo exige). Para actualizarlo desde otra conversación:
leerlo con la acción `read` del Artifact y republicar con ese `url`.

## Cómo trabajar

1. Editar `codigo-fuente/fiesta-carbon.html`.
2. Verificar sintaxis: extraer lo que hay entre `<script>` y `</script>` a un
   `.js` y correr `node --check`.
3. Probar en el navegador con `preview_start` → `juego-gato`. Para probar partes
   concretas conviene agregar un gancho temporal `window.__dbg={...};/*DBG*/`
   justo después de `showTitle();` y **borrarlo antes de publicar**.
4. Publicar el maestro al Artifact (mismo `url`) y regenerar
   `JUGAR - La Fiesta de Carbon.html` envolviendo el maestro con
   `<!doctype html><html><head>…meta…` + todo hasta `</style>` + `</head><body>`
   + el resto + `</body></html>`.
5. Siempre avisarle a Cristian en castellano simple qué cambió y qué se probó.

## Cómo está armado el código (orden dentro del `<script>`)

- **mapas** (MAP1, MAP2, MAP3), **PALS** (paletas de cada gato), **TYPES**
  (nombre, personalidad `pers`, vida, velocidad, chistes, objeto perdido).
- **sprites** de la casa (FRONT/SIDE/BACK 16×16 con sombreado), baile y
  accesorios (ACC, HATC, drawAcc).
- **objetos** (ITEM_DRAW, MESS con destino tacho/heladera/cucha, LOST).
- **LEVELS**: 7 niveles (ver "Orden de los niveles" más abajo). Campos nuevos:
  `messList` (qué cosas hay tiradas), `partyMess` (qué tiran los gatos), `trash`
  (`'window'` = la basura va por la ventana), `chores` (`bed`, `pics`, `remote`),
  `room` (escondites "de la izquierda/derecha"), `bath`, `wake`, `dance`, `love`,
  `doneText`.
- **mapas nuevos**: MAP_BED (habitación), MAP_KIT (cocina), MAP_BAT (baño),
  MAP_LOVE (living con equipo de música `M`). Muebles nuevos: `A` ropero, `N`
  mesita de luz, `V` tele, `C` mesada, `W` pileta, `O` horno, `E` botiquín,
  `U` bañera, `I` inodoro, `Y` lavatorio, `M` equipo de música. Piso `;` = baño.
- **bloque "tareas de cada cuarto"** (antes de "pantallas"): destinos de cada
  cosa (destOf/destTiles/deliver), lista de tareas visibles (choreRows), cama,
  cuadros, control de la tele escondido (hidden con `chore:true`), el nivel del
  amor (partyPct, leche, luces, música), el despertar (CINE tipo `wake`) y la
  **batalla de baile** (estado `dance`: startDance, rondas DPAT, dancePress,
  renderDance).
- **sonido y música** (tone, noise, SFX, musicTick).
- **pintado del mapa** (paintMap: madera, alfombras, ventanas, muebles).
- **carga de nivel, acciones (getAction), gatos (updateCat), actualización.**
- **dibujo de la casa**: iluminación nocturna (lightPass), cámara (updateCamera),
  render, burbujas de emoción, barras de cine.
- **luchadores**: buildFighter (poses paradas y en cuatro patas), fightSprites,
  drawFighter; **caras** (buildFace, MOODS, faceURL).
- **pelea**: ATK (rasguño, combo, uppercut, barrido bajo, salto felino,
  mordida, especiales), IA, rondas, remate; renderFight y renderVS.
- **reputación, escondites, charlas** (menú de 3 opciones, caras que hablan),
  desafíos de gatos que buscan pelea, encargos.
- **el humano, la llegada y el escape** (drawHuman, startArrival, updateEscape).
- **pantallas** (título, niveles, intro, victoria, derrota), HUD, controles.

## Decisiones de diseño que pidió Cristian

- Los gatos son los protagonistas; la casa sucia es secundaria.
- Cada gato reacciona distinto al pedirle que se vaya (educado, despistado con
  objeto perdido y chiste, glotón, fiestero, dormilón, patotero, okupa, retador).
- Reputación: pelear o echar baja; hacer favores sube. Si te desafían, solo baja
  si perdés. Ganar con menos de 50 es perder.
- Pelea estilo Street Fighter con postura de pelea, bloqueo, combo, cuatro
  patas, salto felino, especiales y fatality.
- Cinemáticas cuidadas (charlas con cámara y retratos, VS con caras grandes).
- Todos los niveles están desbloqueados (lo pidió para probar).

## Prólogo (cinemática inicial)

Al apretar "Jugar desde el nivel 1" arranca startStory() (estado `story`):
Carbón y sus amigos (Humo, Manchita, Tigre, Chispa) frente a su casa al
atardecer. Le dicen aburrido, él dice que siempre le hacen desastre, se van
tristes, Carbón se arrepiente ("¡era una broma! ¿fiesta en casa ahora?"),
festejan, entran a la casa y aparece el título. Pasos en SSTEPS (charla o
acción con tiempos), poses de cuerpo entero en SPOSE (ojos nuevos soft, happy,
sad; bocas smile y frown en buildFighter), fondo en storyBG, dibujo en
renderStory. ESC o tocar la ayuda saltea la intro.
La cinemática se dibuja en pixel art a 480×312 con gatos propios en alta:
catHD(key,pose,sombrero,ladoDelSol) con ojos grandes con brillo, bigotes, pecho
claro, manchas por pelaje y contorno de color. Durante las charlas la cámara se
acerca (zoom 1.5). Dientes siempre blancos.
**Versión 24 (intro cinematográfica):** los gatos se arman con formas blandas
(uniones suaves de elipses, función `blob`) sombreadas por su normal, sin
tramado, con rampas de 5 tonos que cambian de color (`hsRamp`: sombras frías,
luces cálidas), sombras de contacto, línea interna donde se superponen partes,
luz de borde cálida del lado del sol y relleno frío del otro. El escenario
(`storyBG`) se pinta en colores base y después se ilumina píxel por píxel:
luz ambiente violeta, ventanas, farolito, farol de la calle en cono, contraluz
del atardecer en los bordes contra el cielo, bruma por distancia y vereda
mojada con reflejos verticales de las luces. En `renderStory` todo se dibuja en
un lienzo del mundo (`storyCanvases`): rayos de sol, sombras largas de los gatos
hacia la cámara, capa de luces aparte, reflejos ondulados en charcos
(`PUDDLES`), resplandor solo de lo emisivo, destellos anamórficos, pasto
desenfocado en primer plano con paralaje, etalonaje, viñeta y grano. Plano de
apertura: la cámara baja desde el cielo (paso 0 dura 5,6 s) y el texto va en la
franja negra de arriba. Cada gato tarda ~10 ms en generarse; se preparan con un
límite de 7 ms por cuadro.
**Versión 25 (gatos rediseñados):** Cristian dijo que la panza apuntaba a un
lado y la cabeza al otro, y que los ojos eran raros. Ahora todo el cuerpo va
sobre un eje (`BX=50`): cuello, pecho, panza y cadera centrados; la cara está
centrada en `fx=hx+2` (apenas girada hacia donde mira) con orejas, mejillas,
ojos, hocico, rubor, bigotes y accesorios simétricos alrededor de `fx`. Ojos
del mismo tamaño con contorno completo (más grueso arriba), iris con degradé,
pupila vertical y dos brillos. Boca en forma de "w". El ambiente quedó igual
(le gustó mucho).
**Versión 26 (cuerpo de gato de verdad):** Cristian mandó una imagen de
referencia: gato negro de frente, sentado, con pecho alto, patas delanteras
rectas y largas hasta el piso, muslos traseros a los costados, cola enroscada
desde atrás, cabeza redonda con orejas altas, ojos grandes redondos con pupila
negra grande, nariz rosa, boca "w" y collar con cascabel en rombo. Así quedó:
ya NO hay brazos humanos. En `hdPose`, `np`/`fp` son las patas delanteras
(cerca/lejos) y `nf`/`ff` las traseras; hablar = levantar una pata, señalar =
pata estirada, festejar/saltar = parado en dos patas con las delanteras arriba,
caminar = patas alternadas. Cabeza en `hy=34`, hombros en `sh=63`.
**Versión 27 (perfil al caminar):** con otra imagen de referencia (gato negro
caminando de perfil al atardecer), las poses walk/swalk/run usan `drawSide()`
dentro de catHD: cuerpo alargado con cuello, cuatro patas que salen de hombro
y muslo (las de atrás más oscuras, las de adelante con línea de contorno),
pata trasera con rodilla y garrón, cabeza de perfil con un ojo, hocico y
nariz adelante, cola levantada con la punta enroscada (caída si está triste,
estirada si corre). Tabla de pasos `SP` (fn/ff patas delanteras, hn/hf
traseras). El dibujo se corre 5 px a la izquierda para que entren los
bigotes. Parado, hablando o festejando sigue la vista de frente.
OJO: se probó una versión
ilustrada lisa (vectorial) y otra pixelada de esa ilustración; a Cristian NO
le gustaron ("no parece el mismo juego") y se volvió a esta. Las copias
quedaron en historial-de-cambios/respaldos (v21 y v22). Durante las
charlas la cámara se acerca (zoom 1.5) a los personajes para que no los tape
el cuadro de diálogo. Dientes siempre blancos (lo pidió Cristian).

## Orden de los niveles (lo definió Cristian)

1. **La habitación**: Carbón se despierta y ve la hora (cinemática). Tender la
   cama, almohadas a la cama, enderezar 3 cuadros, encontrar el control de la
   tele (escondido en un mueble) y tirar la mugre por la ventana. Más los gatos.
2. **La cocina**: comida a la heladera, platos y vasos a la pileta, secar
   charcos, basura al tacho.
3. **El baño**: cosas del baño al botiquín, patito a la bañera, papel y espuma,
   basura al cesto.
4. **El balcón**: batalla de baile (flechas o WASD, el rival hace los pasos y
   Carbón los repite). Ganar = reputación 100. Se elige la dificultad en la
   tarjeta del nivel (`DDIFF`: FÁCIL 80%, NORMAL 88%, DIFÍCIL 93%, con distinta
   velocidad y cantidad de pasos; `DLEV` guarda la elegida). Cada ronda tiene dos
   tandas de "mirá y repetí" (`DPH=[0,24]`, termina en el pulso `DEND=51`).
   Música con bombo en negras, palmas, charles, bajo en corcheas, acordes y
   arpegio (`DCHORD`: La menor, Fa, Do, Sol).
5. **El amor**: aparece Perla (gata blanca, su amor platónico) y le pide la mejor
   fiesta: subir la música, apagar las lámparas y llevarle leche a cada gato.
6. **El matón de la fiesta** (`boss:true`, mismo mapa MAP_LOVE con las luces
   apagadas y la música al máximo): arranca con Carbón y Perla bailando
   (`player.dance`), la puerta se abre de una patada y entra **Rocco** (clave
   `maton`: atigrado gris con campera de cuero `J`, cierre `Z` y anteojos).
   Charla y **pelea final** (`startFight(c,'boss')` → `bossSetup`): una sola
   ronda de 99 s, Rocco con 170 de vida; Carbón usa con C el **Corazón de
   Carbón** (tres corazones que vuelan, `kind:'heart'` en `F.proj`) y su
   especial se carga solo (`bossTick`); Perla lo cura +30 una vez si le queda
   poca vida; a la mitad de la vida Rocco se saca los anteojos (`maton2`),
   se pone más rápido y alterna PISOTÓN MOTOQUERO y FURIA DE CUERO. Si gana →
   charla con Perla → llega el humano (`startArrival`) → nivel 7. Si pierde →
   tarjeta "Revancha".
7. **¡Sálvese quien pueda!**: carrera en primera persona (se ven las patas de
   Carbón) por un pasillo hasta la ventana del fondo, con el humano atrás. ← →
   carril, ↑ saltar (gatos dormidos, cajas, gatos que cruzan), ↓ agacharse (mesas,
   cosas que tiran), sillones se esquivan de carril. Cada choque acerca al humano.
   Código en el bloque "la huida" (estado `run`, startRun/updateRun/renderRun).
   Al llegar: escena en el techo y Carbón pierde todo el prestigio. El código
   viejo del escape (updateEscape) quedó pero ya no se usa.
   Gráficos: el pasillo se dibuja con un rayo por píxel (rcRender) usando
   texturas generadas (floorTex, wallTex, ceilTex, endTex), luces por píxel
   (rlights: apliques, guirnaldas, luna de la ventana), niebla y tramado Bayer.
   Sprites iluminados con litDraw; gatos dormidos en alta (sleeperImg), patas
   (pawImg), manos del humano (handImg), humano a contraluz (drawHumanSil).
   Tarda ~8 ms por cuadro. Regla de perspectiva: nada con tamaño mínimo fijo
   (se ve más grande de lejos); todo se dibuja en coordenadas del mundo. Las
   patas de Carbón siempre se ven desde arriba: al estirarse hacia adelante
   suben y se achican (nunca mostrar las almohadillas).

## Otros detalles (versión 28)

- **Pantalla de carga** (`startLoading`): antes del título prepara el escenario
  de la intro y los gatos, con barra y Carbón caminando. Usa `setTimeout` (no
  `requestAnimationFrame`) para no trabarse si la pestaña no está al frente.
- **Salidas de los gatos** (`catExits`, `bfsTo`, `catGone`): se van por la
  puerta o saltando por una ventana, la que les quede más cerca. En el
  dormitorio había una planta delante de la puerta y los gatos no podían salir.
- **Adónde va cada cosa** (`drawDestHints`): mientras Carbón lleva algo, el
  destino se ilumina con un recuadro verde y un cartel con el objeto.
  Heladera, pileta, botiquín y tacho se dibujan más grandes al final de
  `paintMap`; las ventanas ocupan tres baldosas de ancho.
- Charcos de leche y agua con contorno y brillo (antes casi no se veían).
  Cuando quedan 3 tareas o menos, aparece un "!" sobre lo que falta.
- `drawHuman(h,g=ctx)`: antes decía `g=g` y el humano no se dibujaba en la
  llegada.

## Lo que sigue

**LA MEGA FIESTA**: un nivel nuevo para que Carbón recupere el prestigio que
pierde al final del nivel 7. Todavía no está diseñado.
