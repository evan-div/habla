import { entries } from "./helpers";

export const PRONOUNS = entries("pronouns", [
  { id: "yo", es: "yo", en: "I", pos: "pronoun", ex: ["Yo soy Ana.", "I'm Ana."], pron: "yoh", note: "Spanish often drops yo — the verb already says who's talking. “Soy Ana” is more natural than “Yo soy Ana”." },
  { id: "tu-pron", es: "tú", en: "you (informal)", pos: "pronoun", ex: ["Tú eres mi amigo.", "You are my friend."], pron: "too", note: "With the accent, tú means “you”. Without it, tu means “your”.", rel: ["usted"] },
  { id: "usted", es: "usted", en: "you (formal)", pos: "pronoun", ex: ["¿Cómo está usted?", "How are you?"], pron: "oos-TEHD", note: "Shows respect — use it with older people, strangers and in service situations. Mexicans use it more than many learners expect.", rel: ["tu-pron", "ustedes"] },
  { id: "el-pron", es: "él", en: "he", pos: "pronoun", ex: ["Él es mi hermano.", "He is my brother."], pron: "ehl", note: "With the accent, él means “he”. Without it, el means “the”." },
  { id: "ella", es: "ella", en: "she", pos: "pronoun", ex: ["Ella es mi hermana.", "She is my sister."], pron: "EH-yah" },
  { id: "nosotros", es: "nosotros", en: "we", pos: "pronoun", fem: "nosotras", ex: ["Nosotros somos amigos.", "We are friends."], pron: "noh-SOH-trohs", note: "Use nosotras for an all-female group." },
  { id: "ellos", es: "ellos", en: "they", pos: "pronoun", fem: "ellas", ex: ["Ellos son mis amigos.", "They are my friends."], pron: "EH-yohs", note: "Ellas is for an all-female group; a mixed group is ellos." },
  { id: "ustedes", es: "ustedes", en: "you all", pos: "pronoun", ex: ["¿Cómo están ustedes?", "How are you all?"], pron: "oos-TEH-dehs", note: "In Mexico — and all of Latin America — ustedes is the only “you all”, formal or not. That's why this course skips vosotros.", rn: [["es", "In Spain, the informal plural “you” is vosotros."]], rel: ["usted"] },
]);

export const INTRODUCTIONS = entries("introductions", [
  { id: "me-llamo", es: "me llamo", en: "my name is", pos: "expression", ex: ["Me llamo Ana.", "My name is Ana."], pron: "meh YAH-moh", note: "Literally “I call myself”. The ll sounds like the y in “yes”." },
  { id: "como-te-llamas", es: "¿cómo te llamas?", en: "what's your name?", pos: "expression", ex: ["Hola, ¿cómo te llamas?", "Hi, what's your name?"], pron: "KOH-moh teh YAH-mahs", note: "Literally “how do you call yourself?”. Formally: ¿Cómo se llama usted?" },
  { id: "encantado", es: "encantado", en: "pleased to meet you", pos: "adjective", fem: "encantada", ex: ["—Soy Ana. —Encantado.", "—I'm Ana. —Pleased to meet you."], pron: "ehn-kahn-TAH-doh", d: 2, note: "It's an adjective, so it matches the speaker: men say encantado, women say encantada." },
  { id: "soy", es: "soy", en: "I am", pos: "expression", ex: ["Soy Ana.", "I'm Ana."], pron: "soy", note: "A form of the verb ser (“to be”). You'll learn the full set in Unit 3.", rel: ["ser"] },
  { id: "soy-de", es: "soy de", en: "I'm from", pos: "expression", ex: ["Soy de México.", "I'm from Mexico."], pron: "soy deh" },
  { id: "de-donde-eres", es: "¿de dónde eres?", en: "where are you from?", pos: "expression", ex: ["Hola, ¿de dónde eres?", "Hi, where are you from?"], pron: "deh DOHN-deh EH-rehs", d: 2, note: "Formally: ¿De dónde es usted?" },
  { id: "vivo-en", es: "vivo en", en: "I live in", pos: "expression", ex: ["Vivo en Guadalajara.", "I live in Guadalajara."], pron: "BEE-boh ehn", rel: ["vivir"] },
  { id: "donde-vives", es: "¿dónde vives?", en: "where do you live?", pos: "expression", ex: ["¿Dónde vives? ¿En México?", "Where do you live? In Mexico?"], pron: "DOHN-deh BEE-behs", d: 2 },
  { id: "tengo-anos", es: "tengo ___ años", aud: "Tengo treinta años", en: "I'm ___ years old", pos: "expression", ex: ["Tengo treinta años.", "I'm thirty years old."], pron: "TEHN-goh … AH-nyohs", d: 2, note: "Spanish “has” years — it uses tener, not ser. Never “soy treinta años”!", rel: ["tener"] },
  { id: "cuantos-anos-tienes", es: "¿cuántos años tienes?", en: "how old are you?", pos: "expression", ex: ["Hola, ¿cuántos años tienes?", "Hi, how old are you?"], pron: "KWAHN-tohs AH-nyohs tee-EH-nehs", d: 3 },
  { id: "ano", es: "año", en: "year", pos: "noun", g: "m", pl: "años", ex: ["Tengo treinta años.", "I'm thirty (years old)."], pron: "AH-nyoh", note: "The ñ is its own letter, sounding like “ny”. Swap it for a plain n and you get a very different (and rude) word.", d: 2 },
  { id: "tambien", es: "también", en: "also / too", pos: "adverb", ex: ["Yo también.", "Me too."], pron: "tahm-BYEHN", note: "“Yo también” is one of the most useful two-word replies in Spanish." },
  { id: "y", es: "y", en: "and", pos: "conjunction", ex: ["Ana y Luis son amigos.", "Ana and Luis are friends."], pron: "ee" },
  { id: "de", es: "de", en: "of / from", pos: "preposition", ex: ["Soy de México.", "I'm from Mexico."], pron: "deh" },
  { id: "en", es: "en", en: "in / at / on", pos: "preposition", ex: ["Vivo en México.", "I live in Mexico."], pron: "ehn" },
]);

export const PLACES = entries("places", [
  { id: "mexico", es: "México", en: "Mexico", pos: "noun", ex: ["Soy de México.", "I'm from Mexico."], pron: "MEH-hee-koh", note: "The x sounds like an English h — a pronunciation inherited from Nahuatl." },
  { id: "estados-unidos", es: "Estados Unidos", en: "the United States", pos: "noun", ex: ["Vivo en Estados Unidos.", "I live in the United States."], pron: "ehs-TAH-dohs oo-NEE-dohs", d: 2, note: "You'll also see los Estados Unidos, and EE. UU. in writing." },
  { id: "canada", es: "Canadá", en: "Canada", pos: "noun", ex: ["Ella es de Canadá.", "She's from Canada."], pron: "kah-nah-DAH" },
  { id: "espana", es: "España", en: "Spain", pos: "noun", ex: ["Él es de España.", "He's from Spain."], pron: "ehs-PAH-nyah" },
  { id: "mexicano", es: "mexicano", en: "Mexican", pos: "adjective", fem: "mexicana", ex: ["Soy mexicano.", "I'm Mexican."], pron: "meh-hee-KAH-noh", note: "Nationalities are lowercase in Spanish, and the ending changes: mexicano (m) / mexicana (f)." },
  { id: "estadounidense", es: "estadounidense", en: "American (from the U.S.)", pos: "adjective", ex: ["Soy estadounidense.", "I'm American."], pron: "ehs-tah-doh-oo-nee-DEHN-seh", d: 3, note: "Ends in -e, so it's the same for men and women. In Mexico people also say americano, but estadounidense is more precise — “America” is a whole continent!" },
  { id: "canadiense", es: "canadiense", en: "Canadian", pos: "adjective", ex: ["Ella es canadiense.", "She's Canadian."], pron: "kah-nah-DYEHN-seh", note: "Ends in -e, so it doesn't change for gender." },
]);

const num = (id: string, es: string, en: string, pron: string, ex: [string, string], d: 1 | 2 | 3 = 1, note?: string) => ({
  id,
  es,
  en,
  pron,
  ex,
  d,
  note,
  pos: "number" as const,
});

export const NUMBERS = entries("numbers", [
  num("uno", "uno", "one", "OO-noh", ["Uno, dos, tres.", "One, two, three."]),
  num("dos", "dos", "two", "dohs", ["Tengo dos amigos.", "I have two friends."]),
  num("tres", "tres", "three", "trehs", ["Tres tacos, por favor.", "Three tacos, please."]),
  num("cuatro", "cuatro", "four", "KWAH-troh", ["Somos cuatro.", "There are four of us."]),
  num("cinco", "cinco", "five", "SEEN-koh", ["Mi hijo tiene cinco años.", "My son is five years old."]),
  num("seis", "seis", "six", "says", ["Somos seis amigos.", "We are six friends."]),
  num("siete", "siete", "seven", "SYEH-teh", ["Mi hermana tiene siete años.", "My sister is seven years old."]),
  num("ocho", "ocho", "eight", "OH-choh", ["Son las ocho.", "It's eight o'clock."]),
  num("nueve", "nueve", "nine", "NWEH-beh", ["Mi hija tiene nueve años.", "My daughter is nine years old."]),
  num("diez", "diez", "ten", "dyehs", ["Tengo diez pesos.", "I have ten pesos."]),
  num("once", "once", "eleven", "OHN-seh", ["Mi hijo tiene once años.", "My son is eleven years old."]),
  num("doce", "doce", "twelve", "DOH-seh", ["Son doce tacos.", "That's twelve tacos."]),
  num("trece", "trece", "thirteen", "TREH-seh", ["Mi hermana tiene trece años.", "My sister is thirteen years old."]),
  num("catorce", "catorce", "fourteen", "kah-TOR-seh", ["Ella tiene catorce años.", "She is fourteen years old."]),
  num("quince", "quince", "fifteen", "KEEN-seh", ["Ella tiene quince años.", "She is fifteen years old."], 1, "Turning fifteen is a big deal in Mexico — a girl's quinceañera is celebrated with a huge party."),
  num("dieciseis", "dieciséis", "sixteen", "dyeh-see-SAYS", ["Mi hermano tiene dieciséis años.", "My brother is sixteen years old."], 2, "From 16 to 19, the numbers are one word: diez + y + seis → dieciséis."),
  num("diecisiete", "diecisiete", "seventeen", "dyeh-see-SYEH-teh", ["Él tiene diecisiete años.", "He is seventeen years old."], 2),
  num("dieciocho", "dieciocho", "eighteen", "dyeh-see-OH-choh", ["Tengo dieciocho años.", "I'm eighteen years old."], 2),
  num("diecinueve", "diecinueve", "nineteen", "dyeh-see-NWEH-beh", ["Tengo diecinueve años.", "I'm nineteen years old."], 2),
  num("veinte", "veinte", "twenty", "BAYN-teh", ["Tengo veinte años.", "I'm twenty years old."]),
  num("treinta", "treinta", "thirty", "TRAYN-tah", ["Tengo treinta años.", "I'm thirty years old."]),
  num("cuarenta", "cuarenta", "forty", "kwah-REHN-tah", ["Mi padre tiene cuarenta años.", "My father is forty years old."]),
]);
