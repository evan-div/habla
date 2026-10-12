import { entries, present } from "./helpers";

type Forms = [string, string, string, string, string];
const verb = (inf: string, group: "ar" | "er" | "ir", kind: "regular" | "irregular" | "stem-changing", forms: Forms, translation: string, stemChange?: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: kind,
  group,
  stemChange,
  conjugations: present(forms),
});

/** Signs, recipes and the Mexican "se me…" (Unit 27). */
export const SE_WORDS = entries("se", [
  { id: "vender", es: "vender", en: "to sell", pos: "verb", ex: ["Se vende una casa.", "A house is for sale."], pron: "behn-DEHR", verb: verb("vender", "er", "regular", ["vendo", "vendes", "vende", "vendemos", "venden"], "to sell") },
  { id: "rentar", es: "rentar", en: "to rent", pos: "verb", d: 2, ex: ["Se renta departamento.", "Apartment for rent."], pron: "rehn-TAR", note: "Mexican Spanish says rentar / se renta. In Spain it's alquilar.", rn: [["es", "In Spain: alquilar / se alquila."]], verb: verb("rentar", "ar", "regular", ["rento", "rentas", "renta", "rentamos", "rentan"], "to rent") },
  { id: "prohibido", es: "prohibido", en: "forbidden / not allowed", pos: "adjective", fem: "prohibida", d: 2, ex: ["Prohibido fumar.", "No smoking."], pron: "proh-ee-BEE-doh", note: "Signs say Prohibido + infinitive: Prohibido estacionarse (No parking)." },
  { id: "permitido", es: "permitido", en: "allowed", pos: "adjective", fem: "permitida", d: 2, ex: ["Se permite la entrada.", "Entry is allowed."], pron: "pehr-mee-TEE-doh" },
  { id: "usar", es: "usar", en: "to use", pos: "verb", ex: ["Se usa mucho la salsa en México.", "Salsa is used a lot in Mexico."], pron: "oo-SAR", verb: verb("usar", "ar", "regular", ["uso", "usas", "usa", "usamos", "usan"], "to use") },
  { id: "costumbre", es: "costumbre", en: "custom / habit", pos: "noun", g: "f", pl: "costumbres", d: 2, ex: ["Es una costumbre mexicana.", "It's a Mexican custom."], pron: "kohs-TOOM-breh" },
  { id: "receta", es: "receta", en: "recipe", pos: "noun", g: "f", pl: "recetas", ex: ["Esta receta es muy fácil.", "This recipe is very easy."], pron: "reh-SEH-tah", note: "Receta also means a doctor's prescription." },
  { id: "cortar", es: "cortar", en: "to cut", pos: "verb", ex: ["Se corta la cebolla.", "The onion is cut."], pron: "kor-TAR", verb: verb("cortar", "ar", "regular", ["corto", "cortas", "corta", "cortamos", "cortan"], "to cut") },
  { id: "cebolla", es: "cebolla", en: "onion", pos: "noun", g: "f", pl: "cebollas", ex: ["Se corta la cebolla.", "The onion is cut."], pron: "seh-BOH-yah" },
  { id: "agregar", es: "agregar", en: "to add", pos: "verb", d: 2, ex: ["Se agrega sal.", "Salt is added."], pron: "ah-greh-GAR", note: "Yo form in the preterite: agregué (g → gu).", verb: verb("agregar", "ar", "regular", ["agrego", "agregas", "agrega", "agregamos", "agregan"], "to add") },
  { id: "servir", es: "servir", en: "to serve", pos: "verb", d: 2, ex: ["Se sirve caliente.", "It's served hot."], pron: "sehr-BEER", note: "A stem-changing verb (e → i): sirvo, sirves, sirve… but servimos.", verb: verb("servir", "ir", "stem-changing", ["sirvo", "sirves", "sirve", "servimos", "sirven"], "to serve", "e → i") },
  { id: "caliente", es: "caliente", en: "hot (to the touch)", pos: "adjective", pl: "calientes", ex: ["El café está caliente.", "The coffee is hot."], pron: "kah-LYEHN-teh", note: "Caliente is for things you can touch. Weather is hace calor." },
  { id: "sal", es: "sal", en: "salt", pos: "noun", g: "f", ex: ["Se agrega sal.", "Salt is added."], pron: "sahl" },
  { id: "caer", es: "caer", en: "to fall / to drop", pos: "verb", d: 3, ex: ["Se me cayó el teléfono.", "I dropped my phone (it fell on me)."], pron: "kah-EHR", note: "Irregular yo: caigo. In Mexico “se me cayó” is how you say you dropped something.", verb: verb("caer", "er", "irregular", ["caigo", "caes", "cae", "caemos", "caen"], "to fall", "yo caigo") },
  { id: "descomponerse", es: "descomponerse", en: "to break down", pos: "verb", d: 3, ex: ["Se me descompuso el coche.", "My car broke down."], pron: "dehs-kohm-poh-NEHR-seh", note: "Very common in Mexico for anything mechanical that stops working.", verb: verb("descomponerse", "er", "irregular", ["me descompongo", "te descompones", "se descompone", "nos descomponemos", "se descomponen"], "to break down", "yo descompongo") },
  { id: "se-me-olvido", es: "se me olvidó", en: "I forgot (it slipped my mind)", pos: "expression", d: 3, ex: ["Se me olvidó la llave.", "I forgot my key."], pron: "seh meh ohl-bee-DOH", note: "Literally “it forgot itself to me”. The thing forgotten is the subject: se me olvidaron las llaves.", rel: ["olvidar"] },
  { id: "se-me-antoja", es: "se me antoja", en: "I feel like having…", pos: "expression", reg: "informal", regions: ["mx"], d: 3, ex: ["Se me antoja un taco.", "I'm craving a taco."], pron: "seh meh ahn-TOH-hah", note: "A beautiful Mexican verb, antojarse: a sudden craving. Un antojito is a small snack." },
  { id: "se-me-hizo-tarde", es: "se me hizo tarde", en: "I ran late", pos: "expression", reg: "informal", regions: ["mx"], d: 3, ex: ["Perdón, se me hizo tarde.", "Sorry, I ran late."], pron: "seh meh EE-soh TAR-deh", note: "The all-purpose Mexican excuse: literally “it made itself late on me”." },
]);
