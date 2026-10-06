import { entries } from "./helpers";

export const FAMILY = entries("family", [
  { id: "familia", es: "familia", en: "family", pos: "noun", g: "f", pl: "familias", ex: ["Mi familia es grande.", "My family is big."], pron: "fah-MEE-lyah", note: "Family is central in Mexican culture — you'll talk about yours a lot." },
  { id: "madre", es: "madre", en: "mother", pos: "noun", g: "f", pl: "madres", ex: ["Mi madre es maestra.", "My mother is a teacher."], pron: "MAH-dreh", note: "Madre is correct and warm, but day to day most people say mamá.", rel: ["mama"] },
  { id: "padre", es: "padre", en: "father", pos: "noun", g: "m", pl: "padres", ex: ["Mi padre es doctor.", "My father is a doctor."], pron: "PAH-dreh", note: "Padres (plural) means “parents”. Day to day most people say papá.", rel: ["papa"] },
  { id: "mama", es: "mamá", en: "mom", pos: "noun", g: "f", pl: "mamás", reg: "informal", ex: ["Mamá, te quiero.", "Mom, I love you."], pron: "mah-MAH", rel: ["madre"] },
  { id: "papa", es: "papá", en: "dad", pos: "noun", g: "m", pl: "papás", reg: "informal", ex: ["Mi papá es alto.", "My dad is tall."], pron: "pah-PAH", note: "Mind the accent: papá = dad, but papa = potato!", rel: ["padre"] },
  { id: "hermano", es: "hermano", en: "brother", pos: "noun", g: "m", pl: "hermanos", ex: ["Tengo un hermano.", "I have a brother."], pron: "ehr-MAH-noh", note: "Plural hermanos can mean “brothers” or “brothers and sisters” (siblings).", rel: ["hermana"] },
  { id: "hermana", es: "hermana", en: "sister", pos: "noun", g: "f", pl: "hermanas", ex: ["Mi hermana vive en Monterrey.", "My sister lives in Monterrey."], pron: "ehr-MAH-nah", rel: ["hermano"] },
  { id: "hijo", es: "hijo", en: "son", pos: "noun", g: "m", fem: "hija", pl: "hijos", ex: ["Mi hijo tiene cinco años.", "My son is five years old."], pron: "EE-hoh", note: "The h is silent. Hija = daughter; hijos can mean “sons” or “children”." },
  { id: "abuelo", es: "abuelo", en: "grandfather", pos: "noun", g: "m", fem: "abuela", pl: "abuelos", d: 2, ex: ["Mi abuela es muy simpática.", "My grandmother is very nice."], pron: "ah-BWEH-loh", note: "Abuelos can mean “grandparents”. Many people say abuelito / abuelita as a loving diminutive." },
]);

export const PEOPLE = entries("people", [
  { id: "amigo", es: "amigo", en: "friend (male)", pos: "noun", g: "m", pl: "amigos", ex: ["Mi amigo es mexicano.", "My friend is Mexican."], pron: "ah-MEE-goh", rel: ["amiga"] },
  { id: "amiga", es: "amiga", en: "friend (female)", pos: "noun", g: "f", pl: "amigas", ex: ["Ana es mi amiga.", "Ana is my friend."], pron: "ah-MEE-gah", rel: ["amigo"] },
  { id: "hombre", es: "hombre", en: "man", pos: "noun", g: "m", pl: "hombres", ex: ["El hombre es alto.", "The man is tall."], pron: "OHM-breh", note: "The h is silent. Also used as an exclamation, like “man!” or “come on!”: ¡Hombre!" },
  { id: "mujer", es: "mujer", en: "woman", pos: "noun", g: "f", pl: "mujeres", ex: ["La mujer es doctora.", "The woman is a doctor."], pron: "moo-HEHR" },
  { id: "nino", es: "niño", en: "boy / child", pos: "noun", g: "m", pl: "niños", ex: ["El niño tiene seis años.", "The boy is six years old."], pron: "NEE-nyoh", note: "Niños can also mean “children” in general.", rel: ["nina"] },
  { id: "nina", es: "niña", en: "girl", pos: "noun", g: "f", pl: "niñas", ex: ["La niña es mi hermana.", "The girl is my sister."], pron: "NEE-nyah", rel: ["nino"] },
  { id: "persona", es: "persona", en: "person", pos: "noun", g: "f", pl: "personas", ex: ["Luis es una persona muy simpática.", "Luis is a very nice person."], pron: "pehr-SOH-nah", note: "Persona is always feminine — even when it's a man: Luis es una persona simpática." },
]);

export const DETERMINERS = entries("grammar-words", [
  { id: "el-art", es: "el", en: "the (masc. singular)", pos: "determiner", ex: ["El niño es mi hermano.", "The boy is my brother."], pron: "ehl", note: "No accent on the article. With an accent, él = “he”." },
  { id: "la", es: "la", en: "the (fem. singular)", pos: "determiner", ex: ["La mujer es mi madre.", "The woman is my mother."], pron: "lah" },
  { id: "los", es: "los", en: "the (masc. plural)", pos: "determiner", ex: ["Los niños son simpáticos.", "The kids are nice."], pron: "lohs" },
  { id: "las", es: "las", en: "the (fem. plural)", pos: "determiner", ex: ["Las niñas son mis amigas.", "The girls are my friends."], pron: "lahs" },
  { id: "un", es: "un", en: "a / an (masc.)", pos: "determiner", ex: ["Tengo un hermano.", "I have a brother."], pron: "oon" },
  { id: "una", es: "una", en: "a / an (fem.)", pos: "determiner", ex: ["Tengo una hermana.", "I have a sister."], pron: "OO-nah" },
  { id: "mi", es: "mi", en: "my", pos: "determiner", pl: "mis", ex: ["Mi madre es maestra.", "My mother is a teacher."], pron: "mee", note: "Mi / mis don't change for gender — only for singular vs plural: mi amigo, mis amigos." },
  { id: "tu-poss", es: "tu", en: "your (informal)", pos: "determiner", pl: "tus", ex: ["Tu hermano es simpático.", "Your brother is nice."], pron: "too", note: "No accent for “your”. With an accent, tú = “you”." },
  { id: "su", es: "su", en: "his / her / their / your (formal)", pos: "determiner", pl: "sus", d: 2, ex: ["Su madre es maestra.", "His (or her) mother is a teacher."], pron: "soo", note: "One word, many owners — context tells you whose it is." },
  { id: "pero", es: "pero", en: "but", pos: "conjunction", ex: ["Es simpático, pero está cansado.", "He's nice, but he's tired."], pron: "PEH-roh" },
]);

export const SLANG = entries("slang", [
  { id: "cuate", es: "cuate", en: "buddy / pal", pos: "noun", g: "m", fem: "cuata", reg: "slang", regions: ["mx"], d: 2, ex: ["Carlos es mi cuate.", "Carlos is my buddy."], pron: "KWAH-teh", note: "From Nahuatl for “twin”. A friendly, very Mexican word for a close friend.", rel: ["amigo"] },
  { id: "chavo", es: "chavo", en: "guy / kid / dude", pos: "noun", g: "m", fem: "chava", reg: "slang", regions: ["mx"], d: 2, ex: ["Ese chavo es muy simpático.", "That guy is really nice."], pron: "CHAH-boh", note: "The casual Mexican word for a young guy; chava for a young woman. Elsewhere you'd hear chico/chica or muchacho/muchacha.", rel: ["hombre", "nino"] },
  { id: "guey", es: "güey", en: "dude / bro", pos: "noun", g: "m", reg: "slang", regions: ["mx"], d: 3, ex: ["¿Qué onda, güey?", "What's up, dude?"], pron: "weh (rhymes with “day”)", note: "Said constantly between friends — like “dude”. Careful: in the wrong tone, or with someone you don't know, it can be an insult (it literally means “ox”). Also spelled wey.", rel: ["cuate"] },
  { id: "chido", es: "chido", en: "cool / awesome", pos: "adjective", fem: "chida", reg: "slang", regions: ["mx"], d: 2, ex: ["Tu casa está muy chida.", "Your house is really cool."], pron: "CHEE-doh", rel: ["que-padre"] },
  { id: "que-padre", es: "¡qué padre!", en: "how cool!", pos: "expression", reg: "slang", regions: ["mx"], d: 2, ex: ["¡Qué padre!", "How cool!"], pron: "keh PAH-dreh", note: "Padre literally means “father” — but in Mexican slang it means “cool”. Textbooks skip this one, but you'll hear it every day.", rel: ["chido"] },
  { id: "la-neta", es: "la neta", en: "honestly / the truth", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["La neta, estoy cansado.", "Honestly, I'm tired."], pron: "lah NEH-tah", note: "Also a question: ¿La neta? = “For real?”" },
  { id: "no-mames", es: "no mames", en: "no way! / you're kidding!", pos: "expression", reg: "vulgar", regions: ["mx"], d: 3, ex: ["¡No mames, qué padre!", "No way, that's awesome!"], pron: "noh MAH-mehs", note: "Extremely common among friends in Mexico, but it's vulgar — the verb it comes from is crude. Fine with close friends; avoid it with family elders, bosses, or anyone you've just met." },
]);
