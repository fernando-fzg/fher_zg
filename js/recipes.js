/* =====================================================================
   BASE DE RECETAS (independiente de cualquier IA)
   ---------------------------------------------------------------------
   Formato de cada receta:
     [tipo, nombre, kcal, proteína(g), minutos, "ingredientes, separados", "paso 1 | paso 2 | paso 3"]
     tipo: "d" desayuno · "a" almuerzo · "c" cena
   Valores nutricionales aproximados por 1 porción estándar.
   Los ingredientes deben usar los nombres de INGREDIENTS (abajo).
   Para agregar recetas, copia una línea y edítala.
   ===================================================================== */

/* Nombre canónico → sinónimos que puedes escribir en la despensa */
window.INGREDIENTS = {
  "avena": ["hojuelas de avena", "quaker"],
  "leche": ["leche evaporada", "leche descremada", "leche fresca", "leche de vaca"],
  "plátano": ["platano", "banana", "plátano de seda", "guineo"],
  "canela": [],
  "huevo": ["huevos", "clara", "claras"],
  "espinaca": ["espinacas"],
  "queso fresco": ["queso", "quesillo", "queso light"],
  "tomate": ["tomates"],
  "pan integral": ["pan", "pan de molde", "pan francés"],
  "palta": ["aguacate"],
  "yogur griego": ["yogur", "yogurt", "yogurt griego"],
  "fresa": ["fresas", "frutilla"],
  "granola": [],
  "miel": [],
  "mantequilla de maní": ["mantequilla de mani", "crema de maní", "peanut butter"],
  "quinua": ["quinoa"],
  "manzana": ["manzanas"],
  "pollo": ["pechuga de pollo", "pechuga", "filete de pollo", "muslo de pollo", "gallina", "pavo"],
  "cebolla": ["cebolla roja", "cebolla blanca", "cebolla china"],
  "papaya": [],
  "atún": ["atun", "atún en lata", "conserva de atún"],
  "limón": ["limon", "limones"],
  "camote": ["batata"],
  "chía": ["chia", "semillas de chía"],
  "mango": [],
  "choclo": ["maíz", "maiz", "mazorca"],
  "lechuga": [],
  "carne de res": ["res", "carne", "bistec", "lomo", "lomo fino", "asado", "carne de vaca"],
  "carne molida": ["carne de res molida", "molida"],
  "arroz": ["arroz integral", "arroz blanco"],
  "sillao": ["salsa de soya", "soya", "salsa soya"],
  "ají amarillo": ["aji amarillo", "ají", "aji", "pasta de ají"],
  "papa": ["papas", "patata", "papa amarilla", "papa blanca"],
  "pescado": ["filete de pescado", "bonito", "merluza", "tilapia", "perico", "jurel", "caballa", "lenguado", "trucha"],
  "brócoli": ["brocoli"],
  "zanahoria": ["zanahorias"],
  "lentejas": ["lenteja"],
  "culantro": ["cilantro"],
  "arveja": ["arvejas", "guisantes"],
  "fideo": ["tallarín", "tallarines", "spaghetti", "espagueti", "pasta", "fideos"],
  "pimiento": ["pimentón", "morrón", "pimiento rojo"],
  "frejol": ["frejoles", "frijol", "frijoles", "porotos", "canario"],
  "champiñón": ["champiñones", "hongos"],
  "pepino": [],
  "garbanzo": ["garbanzos"],
  "apio": [],
  "zapallo": ["calabaza", "zapallo macre"],
  "vainita": ["vainitas", "ejotes", "judías verdes"],
  "tortilla de trigo": ["tortilla", "tortillas", "wrap", "pan árabe"],
  "nueces": ["frutos secos", "almendras", "maní", "mani", "pecanas"],
  "zapallito": ["zucchini", "calabacín", "zapallito italiano"],
  "aceite": ["aceite de oliva", "aceite vegetal"],
  "ajo": ["ajos", "ajo molido"]
};

/* Básicos que se pueden asumir en casa (opción en la página) */
window.STAPLES = ["aceite", "ajo"];

/* Proteína principal (para variar almuerzo y cena del mismo día) */
window.MAIN_PROTEINS = ["pollo", "carne de res", "carne molida", "pescado", "atún", "huevo", "lentejas", "frejol", "garbanzo", "queso fresco", "yogur griego"];

window.RECIPES = [
  /* ---------------- DESAYUNOS ---------------- */
  ["d", "Avena cocida con plátano y canela", 380, 15, 10, "avena, leche, plátano, canela", "Hierve la leche con la canela | Agrega 1/2 taza de avena y cocina 5 min | Sirve con el plátano en rodajas"],
  ["d", "Omelette de espinaca y queso fresco", 320, 24, 10, "huevo, espinaca, queso fresco, tomate, aceite", "Bate 3 huevos con sal y pimienta | Saltea la espinaca 1 min y agrega el huevo | Añade el queso, dobla y sirve con tomate"],
  ["d", "Tostadas integrales con palta y huevo", 400, 20, 10, "pan integral, palta, huevo", "Tuesta 2 rebanadas de pan | Machaca la palta con sal y limón opcional | Cubre con huevo duro o pochado"],
  ["d", "Yogur griego con fresas y granola", 350, 22, 5, "yogur griego, fresa, granola, miel", "Sirve 1 taza de yogur | Agrega fresas picadas | Termina con 3 cdas de granola y un hilo de miel"],
  ["d", "Batido proteico de plátano y maní", 450, 22, 5, "leche, plátano, avena, mantequilla de maní", "Licúa 1 taza de leche, 1 plátano y 3 cdas de avena | Añade 1 cda de mantequilla de maní | Sirve frío"],
  ["d", "Pancakes de avena y huevo", 360, 21, 15, "huevo, avena, plátano, fresa", "Licúa 2 huevos, 1/2 taza de avena y 1/2 plátano | Cocina en sartén antiadherente por ambos lados | Sirve con fresas"],
  ["d", "Quinua con leche y manzana", 360, 14, 25, "quinua, leche, manzana, canela", "Cocina 1/3 taza de quinua en agua 15 min | Agrega leche y canela, hierve 5 min | Sirve con manzana picada"],
  ["d", "Sándwich de pollo y palta", 420, 30, 10, "pan integral, pollo, palta, tomate", "Deshilacha pollo cocido | Unta palta en el pan | Arma con pollo y tomate"],
  ["d", "Huevos revueltos a la criolla con pan", 380, 21, 10, "huevo, tomate, cebolla, pan integral, aceite", "Saltea cebolla y tomate picados | Agrega 3 huevos batidos y revuelve | Sirve con 1 pan integral"],
  ["d", "Pan con queso fresco y papaya", 350, 17, 5, "pan integral, queso fresco, papaya", "Arma el pan con 2 tajadas de queso | Sirve con 1 taza de papaya picada"],
  ["d", "Tostadas con atún y tomate", 360, 28, 5, "pan integral, atún, tomate, limón", "Escurre el atún y mézclalo con limón | Tuesta el pan | Cubre con atún y rodajas de tomate"],
  ["d", "Camote con huevo y espinaca", 350, 16, 20, "camote, huevo, espinaca, aceite", "Sancocha o asa 1 camote mediano | Saltea la espinaca | Sirve con 2 huevos a la plancha"],
  ["d", "Overnight oats con chía y mango", 380, 18, 5, "avena, yogur griego, chía, mango", "Mezcla avena, yogur, chía y un chorro de agua o leche | Refrigera toda la noche | Sirve con mango picado"],
  ["d", "Choclo con queso y huevo", 400, 20, 15, "choclo, queso fresco, huevo", "Sancocha el choclo 10 min | Sirve con 1 tajada de queso | Acompaña con 1 huevo duro"],
  ["d", "Yogur con avena, manzana y nueces", 380, 19, 5, "yogur griego, avena, manzana, nueces", "Sirve el yogur | Agrega avena y manzana picada | Termina con un puñado pequeño de nueces"],

  /* ---------------- ALMUERZOS ---------------- */
  ["a", "Pollo a la plancha con quinua y ensalada", 550, 45, 25, "pollo, quinua, lechuga, tomate, limón, aceite", "Cocina 1/2 taza de quinua | Sazona y dora la pechuga a la plancha | Sirve con ensalada aliñada con limón"],
  ["a", "Lomo saltado ligero con arroz", 600, 40, 25, "carne de res, cebolla, tomate, arroz, sillao, ajo, aceite", "Saltea la carne en tiras a fuego alto | Agrega cebolla y tomate en gajos con sillao | Sirve con 3/4 taza de arroz (sin papas fritas)"],
  ["a", "Ají de gallina light", 580, 38, 35, "pollo, ají amarillo, leche, pan integral, cebolla, papa, ajo, aceite", "Sancocha y deshilacha el pollo | Haz un aderezo con cebolla, ajo y ají; licúa con leche y pan | Mezcla con el pollo y sirve con papa"],
  ["a", "Pescado al vapor con camote y verduras", 500, 40, 25, "pescado, camote, brócoli, zanahoria, limón", "Sancocha el camote | Cocina el pescado y las verduras al vapor 10 min | Sirve con limón"],
  ["a", "Lentejas con arroz y huevo", 600, 30, 40, "lentejas, arroz, huevo, cebolla, ajo, aceite", "Cocina las lentejas con un aderezo de cebolla y ajo | Prepara el arroz | Sirve con 1 huevo frito en poco aceite"],
  ["a", "Arroz con pollo", 620, 40, 45, "arroz, pollo, culantro, arveja, zanahoria, cebolla, ajo, aceite", "Dora el pollo y retíralo | Haz un aderezo con culantro licuado, cebolla y ajo | Cocina el arroz con verduras y el pollo"],
  ["a", "Tallarín saltado de pollo", 600, 40, 25, "fideo, pollo, pimiento, cebolla, sillao, aceite", "Cocina 80 g de fideo | Saltea el pollo con pimiento y cebolla | Agrega el fideo y el sillao, saltea 2 min"],
  ["a", "Seco de res con frejoles", 650, 42, 60, "carne de res, frejol, culantro, cebolla, arroz, ajo, aceite", "Dora la carne y haz un aderezo con culantro licuado | Cocina a fuego lento 45 min | Sirve con frejoles y poco arroz"],
  ["a", "Quinotto de champiñones con pollo", 560, 40, 30, "quinua, champiñón, pollo, queso fresco, leche, cebolla", "Cocina la quinua | Saltea cebolla, champiñones y pollo en cubos | Agrega la quinua, leche y queso, mezcla hasta que espese"],
  ["a", "Ceviche de pescado con camote y choclo", 450, 38, 20, "pescado, limón, cebolla, camote, choclo, ají amarillo", "Corta el pescado en cubos y sazona | Agrega limón, ají y cebolla en pluma | Sirve con camote y choclo sancochados"],
  ["a", "Bowl de atún, arroz y palta", 550, 35, 15, "atún, arroz, palta, pepino, tomate", "Prepara el arroz | Arma el bowl con atún, palta, pepino y tomate | Aliña con limón o sillao"],
  ["a", "Pollo al horno con papa y ensalada", 560, 42, 45, "pollo, papa, lechuga, tomate, ajo, aceite", "Marina el pollo con ajo y especias | Hornea con las papas en gajos 35–40 min | Sirve con ensalada"],
  ["a", "Garbanzos guisados con espinaca y huevo", 520, 26, 30, "garbanzo, espinaca, tomate, huevo, cebolla, ajo, aceite", "Haz un aderezo de cebolla, ajo y tomate | Agrega los garbanzos cocidos y la espinaca | Sirve con 1 huevo duro"],
  ["a", "Estofado de pollo con arroz", 580, 40, 40, "pollo, papa, zanahoria, arveja, tomate, arroz, cebolla", "Dora el pollo | Agrega cebolla, tomate, zanahoria y arveja con un poco de agua | Añade la papa y cocina 20 min; sirve con poco arroz"],
  ["a", "Picante de quinua con queso", 520, 25, 30, "quinua, queso fresco, papa, ají amarillo, leche, cebolla", "Cocina la quinua | Haz un aderezo de cebolla y ají | Mezcla con la quinua, leche y queso; sirve con papa"],
  ["a", "Hamburguesa casera con ensalada", 580, 40, 25, "carne molida, pan integral, lechuga, tomate, cebolla, huevo", "Mezcla la carne con huevo, cebolla picada, sal y pimienta | Forma la hamburguesa y cocínala a la plancha | Arma en pan integral con lechuga y tomate"],
  ["a", "Pescado a la plancha con papa y ensalada", 520, 42, 25, "pescado, papa, lechuga, tomate, limón, aceite", "Sancocha la papa | Cocina el pescado a la plancha | Sirve con ensalada y limón"],
  ["a", "Frejoles con pollo y arroz", 620, 42, 40, "frejol, pollo, arroz, cebolla, ajo, aceite", "Cocina los frejoles con un aderezo | Haz el pollo a la plancha | Sirve con 1/2 taza de arroz"],

  /* ---------------- CENAS ---------------- */
  ["c", "Ensalada de pollo con palta", 420, 38, 15, "pollo, lechuga, palta, tomate, pepino, limón", "Cocina y corta el pollo | Mezcla las verduras | Aliña con limón, sal y pimienta"],
  ["c", "Tortilla de verduras", 320, 22, 15, "huevo, espinaca, cebolla, pimiento, zanahoria, aceite", "Saltea las verduras picadas | Agrega 3 huevos batidos | Cocina a fuego bajo tapado y voltea"],
  ["c", "Sopa de quinua con pollo", 400, 32, 35, "quinua, pollo, zanahoria, papa, apio, cebolla", "Hierve el pollo con apio y cebolla | Agrega la quinua, zanahoria y papa | Cocina 20 min"],
  ["c", "Pescado a la plancha con ensalada", 380, 38, 15, "pescado, lechuga, tomate, limón, aceite", "Sazona el filete | Cocina a la plancha 3–4 min por lado | Sirve con ensalada"],
  ["c", "Wrap de pollo", 430, 35, 15, "tortilla de trigo, pollo, lechuga, tomate, yogur griego", "Cocina el pollo en tiras | Mezcla el yogur con limón y sal como salsa | Arma el wrap"],
  ["c", "Ensalada de quinua con atún", 400, 34, 20, "atún, quinua, tomate, pepino, limón", "Cocina la quinua y enfríala | Mezcla con atún, tomate y pepino | Aliña con limón"],
  ["c", "Huevos con brócoli y camote", 380, 20, 20, "huevo, brócoli, camote", "Sancocha el camote | Cocina el brócoli al vapor | Sirve con 2–3 huevos duros o pochados"],
  ["c", "Crema de zapallo con pollo", 380, 30, 30, "zapallo, pollo, cebolla, leche", "Cocina el zapallo con cebolla | Licúa con un poco de leche | Sirve con pollo deshilachado encima"],
  ["c", "Saltado de vainitas con carne", 420, 34, 20, "vainita, carne de res, cebolla, tomate, sillao, aceite", "Blanquea las vainitas | Saltea la carne a fuego alto | Agrega cebolla, tomate, vainitas y sillao"],
  ["c", "Ensalada de lentejas con queso", 400, 24, 15, "lentejas, tomate, cebolla, pepino, limón, queso fresco", "Usa lentejas cocidas y frías | Mezcla con verduras picadas y queso en cubos | Aliña con limón"],
  ["c", "Omelette de champiñones", 340, 26, 10, "huevo, champiñón, queso fresco, aceite", "Saltea los champiñones | Agrega 3 huevos batidos | Rellena con queso y dobla"],
  ["c", "Sopa de pollo con verduras", 380, 30, 35, "pollo, zanahoria, apio, fideo, papa", "Hierve el pollo con apio | Agrega zanahoria y papa | Añade un puñado de fideo al final"],
  ["c", "Pollo al horno con verduras asadas", 400, 40, 35, "pollo, zapallito, pimiento, cebolla, zanahoria, aceite", "Corta las verduras en trozos | Hornea todo con especias a 200 °C por 30 min | Sirve caliente"],
  ["c", "Causa ligera de atún", 450, 28, 30, "papa, atún, ají amarillo, limón, palta", "Sancocha y prensa la papa con ají, limón y sal | Arma capas con atún y palta | Refrigera 10 min"],
  ["c", "Tortilla de atún con ensalada", 380, 34, 15, "huevo, atún, cebolla, lechuga, tomate, aceite", "Mezcla 2 huevos con atún y cebolla | Cocina en sartén como tortilla | Sirve con ensalada"],
  ["c", "Yogur griego con nueces y huevo duro", 350, 28, 10, "yogur griego, nueces, huevo", "Sirve 1 taza de yogur con nueces | Acompaña con 2 huevos duros"]
].map(([type, name, kcal, p, min, ing, steps], i) => {
  const ingredients = ing.split(",").map((s) => s.trim());
  return {
    id: "r" + i, type, name, kcal, p, min,
    ing: ingredients,
    steps: steps.split("|").map((s) => s.trim()),
    main: ingredients.find((x) => window.MAIN_PROTEINS.includes(x)) || null
  };
});
