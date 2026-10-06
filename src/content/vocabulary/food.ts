import { entries } from "./helpers";

export const DRINKS = entries("drinks", [
  { id: "agua", es: "agua", en: "water", pos: "noun", g: "f", pl: "aguas", ex: ["Quiero agua, por favor.", "I want water, please."], pron: "AH-gwah", note: "It's a feminine noun — even though you'll see “el agua”. That's a sound rule we'll cover later." },
  { id: "jugo", es: "jugo", en: "juice", pos: "noun", g: "m", ex: ["Quiero un jugo, por favor.", "I'd like a juice, please."], pron: "HOO-goh", rn: [["es", "In Spain, juice is zumo."]] },
  { id: "refresco", es: "refresco", en: "soda / soft drink", pos: "noun", g: "m", ex: ["Un refresco, por favor.", "A soda, please."], pron: "reh-FREHS-koh", rn: [["mx", "In Mexico, refresco is the standard word. Elsewhere you may hear gaseosa or soda."]] },
  { id: "leche", es: "leche", en: "milk", pos: "noun", g: "f", ex: ["Café con leche, por favor.", "Coffee with milk, please."], pron: "LEH-cheh" },
  { id: "cerveza", es: "cerveza", en: "beer", pos: "noun", g: "f", pl: "cervezas", ex: ["Una cerveza, por favor.", "A beer, please."], pron: "sehr-BEH-sah", rel: ["chela"] },
  { id: "chela", es: "chela", en: "beer", pos: "noun", g: "f", reg: "slang", regions: ["mx"], d: 2, ex: ["¿Una chela?", "A beer?"], pron: "CHEH-lah", note: "Mexican slang for cerveza. You'll hear it with friends: ¿unas chelas?", rel: ["cerveza"] },
  { id: "cafe", es: "café", en: "coffee", pos: "noun", g: "m", pl: "cafés", ex: ["Un café, por favor.", "A coffee, please."], pron: "kah-FEH", note: "Café is both the drink and the place you drink it." },
]);

export const FOODS = entries("food", [
  { id: "comida", es: "comida", en: "food / meal", pos: "noun", g: "f", ex: ["La comida mexicana es muy rica.", "Mexican food is really good."], pron: "koh-MEE-dah", rn: [["mx", "La comida is also the main meal of the day, eaten mid-afternoon (around 2–4 p.m.) — and it's a big deal."]] },
  { id: "pan", es: "pan", en: "bread", pos: "noun", g: "m", ex: ["Quiero pan, por favor.", "I'd like some bread, please."], pron: "pahn" },
  { id: "pollo", es: "pollo", en: "chicken", pos: "noun", g: "m", ex: ["Quiero tacos de pollo.", "I want chicken tacos."], pron: "POH-yoh" },
  { id: "carne", es: "carne", en: "meat / beef", pos: "noun", g: "f", ex: ["Los tacos de carne son ricos.", "The beef tacos are tasty."], pron: "KAR-neh", note: "On a Mexican menu, plain carne usually means beef." },
  { id: "taco", es: "taco", en: "taco", pos: "noun", g: "m", pl: "tacos", ex: ["Quiero tres tacos de pollo.", "I want three chicken tacos."], pron: "TAH-koh", note: "In Mexico, you order tacos by the filling: tacos de pollo, de carne, al pastor…" },
  { id: "tortilla", es: "tortilla", en: "tortilla", pos: "noun", g: "f", pl: "tortillas", ex: ["Quiero tortillas de maíz.", "I want corn tortillas."], pron: "tor-TEE-yah", rn: [["es", "In Spain, a tortilla is an egg-and-potato omelet (tortilla española)."]] },
  { id: "frijoles", es: "frijoles", en: "beans", pos: "noun", g: "m", ex: ["Quiero arroz y frijoles.", "I want rice and beans."], pron: "free-HOH-lehs" },
  { id: "arroz", es: "arroz", en: "rice", pos: "noun", g: "m", ex: ["Arroz con pollo, por favor.", "Rice with chicken, please."], pron: "ah-RROHS", note: "The double r is a trill; a single r at the start of a word is trilled too." },
  { id: "queso", es: "queso", en: "cheese", pos: "noun", g: "m", ex: ["Quiero queso, por favor.", "I'd like some cheese, please."], pron: "KEH-soh" },
  { id: "salsa", es: "salsa", en: "salsa / sauce", pos: "noun", g: "f", ex: ["¿Quieres salsa?", "Do you want salsa?"], pron: "SAHL-sah", note: "In Spanish, salsa just means “sauce” — any sauce." },
]);

export const RESTAURANT = entries("restaurant", [
  { id: "tengo-hambre", es: "tengo hambre", en: "I'm hungry", pos: "expression", d: 2, ex: ["Tengo hambre. ¿Y tú?", "I'm hungry. And you?"], pron: "TEHN-goh AHM-breh", note: "Spanish “has” hunger: tener hambre. Never “soy hambre” or “estoy hambre”!", rel: ["tener"] },
  { id: "tengo-sed", es: "tengo sed", en: "I'm thirsty", pos: "expression", d: 2, ex: ["Tengo sed. Quiero agua.", "I'm thirsty. I want water."], pron: "TEHN-goh sehd", rel: ["tener"] },
  { id: "que-quieres-comer", es: "¿qué quieres comer?", en: "what do you want to eat?", pos: "expression", d: 2, ex: ["¿Qué quieres comer hoy?", "What do you want to eat today?"], pron: "keh KYEH-rehs koh-MEHR" },
  { id: "que-quieres-tomar", es: "¿qué quieres tomar?", en: "what do you want to drink?", pos: "expression", d: 2, ex: ["¿Qué quieres tomar?", "What do you want to drink?"], pron: "keh KYEH-rehs toh-MAR" },
  { id: "rico", es: "rico", en: "tasty / delicious", pos: "adjective", fem: "rica", ex: ["La comida es muy rica.", "The food is really tasty."], pron: "RREE-koh", note: "Also means “rich” (wealthy). With food, it's the everyday Mexican word for “delicious”.", rn: [["mx", "In Mexico, rico is the go-to word for tasty food."]] },
  { id: "que-rico", es: "¡qué rico!", en: "how delicious!", pos: "expression", ex: ["¡Mmm, qué rico!", "Mmm, how delicious!"], pron: "keh RREE-koh", rel: ["rico"] },
  { id: "quisiera", es: "quisiera", en: "I would like (polite)", pos: "expression", d: 3, ex: ["Quisiera un café, por favor.", "I'd like a coffee, please."], pron: "kee-SYEH-rah", note: "Politer than quiero — perfect for restaurants. It's a special form of querer you'll study later; for now, treat it as a ready-made phrase.", rel: ["quiero", "querer"] },
  { id: "para-mi", es: "para mí", en: "for me", pos: "expression", d: 2, ex: ["Para mí, un café.", "For me, a coffee."], pron: "PAH-rah mee", note: "Note the accent on mí. Without it, mi = “my”." },
  { id: "con", es: "con", en: "with", pos: "preposition", ex: ["Café con leche, por favor.", "Coffee with milk, please."], pron: "kohn" },
  { id: "mesa", es: "mesa", en: "table", pos: "noun", g: "f", ex: ["Una mesa para dos, por favor.", "A table for two, please."], pron: "MEH-sah" },
  { id: "que-desea", es: "¿qué desea?", en: "what would you like? (formal)", pos: "expression", d: 3, ex: ["Buenas tardes. ¿Qué desea?", "Good afternoon. What would you like?"], pron: "keh deh-SEH-ah", note: "What a waiter says to you — note the formal (usted) form. Mexican waiters also say ¿Qué van a tomar?" },
  { id: "algo-mas", es: "¿algo más?", en: "anything else?", pos: "expression", d: 2, ex: ["Un café. ¿Algo más?", "One coffee. Anything else?"], pron: "AHL-goh mahs" },
  { id: "para-llevar", es: "para llevar", en: "to go / takeout", pos: "expression", d: 2, ex: ["Dos tacos para llevar, por favor.", "Two tacos to go, please."], pron: "PAH-rah yeh-BAR" },
  { id: "la-cuenta", es: "la cuenta", en: "the check / the bill", pos: "expression", d: 2, ex: ["La cuenta, por favor.", "The check, please."], pron: "lah KWEHN-tah", note: "In Mexico, waiters won't bring the check until you ask for it — rushing you out would be rude." },
  { id: "buen-provecho", es: "¡buen provecho!", en: "enjoy your meal!", pos: "expression", d: 2, ex: ["¡Buen provecho!", "Enjoy your meal!"], pron: "bwehn proh-BEH-choh", note: "A lovely custom: say it to anyone who's about to eat — even strangers at the next table." },
]);
