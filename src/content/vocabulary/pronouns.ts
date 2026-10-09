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

/** Verbs and nouns that go with object pronouns (Unit 17). */
export const PRONOUN_WORDS = entries("pronouns", [
  { id: "regalo", es: "regalo", en: "gift", pos: "noun", g: "m", pl: "regalos", ex: ["Este regalo es para ti.", "This gift is for you."], pron: "reh-GAH-loh" },
  { id: "regalar", es: "regalar", en: "to give (as a gift)", pos: "verb", ex: ["Te regalo un libro.", "I'm giving you a book as a gift."], pron: "reh-gah-LAR", note: "In Mexican markets, “¿me regalas…?” (literally “will you gift me…”) is a friendly way to ask for a little extra.", verb: verb("regalar", "ar", "regular", ["regalo", "regalas", "regala", "regalamos", "regalan"], "to give as a gift") },
  { id: "dar", es: "dar", en: "to give", pos: "verb", d: 2, ex: ["Te doy mi número.", "I'll give you my number."], pron: "dar", note: "Only yo is irregular: doy. The others are regular: das, da, damos, dan.", verb: verb("dar", "ar", "irregular", ["doy", "das", "da", "damos", "dan"], "to give", "yo doy") },
  { id: "decir", es: "decir", en: "to say / to tell", pos: "verb", d: 3, ex: ["Te digo la verdad.", "I'm telling you the truth."], pron: "deh-SEER", note: "Irregular: digo, and a boot-like e → i: dices, dice, dicen.", verb: verb("decir", "ir", "irregular", ["digo", "dices", "dice", "decimos", "dicen"], "to say / tell", "yo digo, e → i") },
  { id: "mandar", es: "mandar", en: "to send", pos: "verb", ex: ["Te mando un mensaje.", "I'll send you a message."], pron: "mahn-DAR", note: "Also “to order”. Don't confuse it with ¿mande? (“pardon?”).", rel: ["mande"], verb: verb("mandar", "ar", "regular", ["mando", "mandas", "manda", "mandamos", "mandan"], "to send") },
  { id: "mensaje", es: "mensaje", en: "message / text", pos: "noun", g: "m", pl: "mensajes", ex: ["Te mando un mensaje.", "I'll text you."], pron: "mehn-SAH-heh" },
  { id: "traer", es: "traer", en: "to bring", pos: "verb", d: 3, ex: ["¿Me trae la cuenta?", "Could you bring me the check?"], pron: "trah-EHR", note: "Only yo is irregular: traigo.", verb: verb("traer", "er", "irregular", ["traigo", "traes", "trae", "traemos", "traen"], "to bring", "yo traigo") },
  { id: "prestar", es: "prestar", en: "to lend", pos: "verb", ex: ["¿Me prestas tu libro?", "Can you lend me your book?"], pron: "prehs-TAR", note: "Prestar = to lend. To borrow, say pedir prestado.", verb: verb("prestar", "ar", "regular", ["presto", "prestas", "presta", "prestamos", "prestan"], "to lend") },
  { id: "numero", es: "número", en: "number", pos: "noun", g: "m", pl: "números", ex: ["¿Me das tu número?", "Can you give me your number?"], pron: "NOO-meh-roh" },
]);
