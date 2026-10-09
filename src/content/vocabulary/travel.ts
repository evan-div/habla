import { entries, present } from "./helpers";

const reg = (inf: string, group: "ar" | "er" | "ir", forms: [string, string, string, string, string], translation: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: "regular" as const,
  group,
  conjugations: present(forms),
});

/** Trips, hotels, and Mexican celebrations (Unit 15). */
export const TRAVEL = entries("travel", [
  { id: "viaje", es: "viaje", en: "trip", pos: "noun", g: "m", pl: "viajes", ex: ["Mi viaje a Oaxaca fue increíble.", "My trip to Oaxaca was incredible."], pron: "BYAH-heh", note: "¡Buen viaje! = Have a good trip!", rel: ["viajar"] },
  { id: "vacaciones", es: "vacaciones", en: "vacation", pos: "noun", g: "f", d: 2, ex: ["Estoy de vacaciones.", "I'm on vacation."], pron: "bah-kah-SYOH-nehs", note: "Always plural: las vacaciones. De vacaciones = on vacation." },
  { id: "aeropuerto", es: "aeropuerto", en: "airport", pos: "noun", g: "m", pl: "aeropuertos", d: 2, ex: ["Estoy en el aeropuerto.", "I'm at the airport."], pron: "ah-eh-roh-PWEHR-toh" },
  { id: "vuelo", es: "vuelo", en: "flight", pos: "noun", g: "m", pl: "vuelos", ex: ["Mi vuelo sale a las ocho.", "My flight leaves at eight."], pron: "BWEH-loh" },
  { id: "maleta", es: "maleta", en: "suitcase", pos: "noun", g: "f", pl: "maletas", ex: ["Mi maleta es azul.", "My suitcase is blue."], pron: "mah-LEH-tah" },
  { id: "pasaporte", es: "pasaporte", en: "passport", pos: "noun", g: "m", pl: "pasaportes", ex: ["Tengo mi pasaporte.", "I have my passport."], pron: "pah-sah-POR-teh" },
  { id: "avion", es: "avión", en: "airplane", pos: "noun", g: "m", pl: "aviones", ex: ["El avión llega a las diez.", "The plane arrives at ten."], pron: "ah-BYOHN" },
  { id: "reservacion", es: "reservación", en: "reservation", pos: "noun", g: "f", pl: "reservaciones", d: 2, ex: ["Tengo una reservación a nombre de López.", "I have a reservation under López."], pron: "reh-sehr-bah-SYOHN", rn: [["es", "In Spain people say reserva."]] },
  { id: "habitacion", es: "habitación", en: "room (hotel)", pos: "noun", g: "f", pl: "habitaciones", d: 2, ex: ["Quiero una habitación para dos.", "I'd like a room for two."], pron: "ah-bee-tah-SYOHN", note: "Cuarto is the everyday word for a room; habitación sounds right in a hotel." },
  { id: "llave", es: "llave", en: "key", pos: "noun", g: "f", pl: "llaves", ex: ["¿Dónde está mi llave?", "Where is my key?"], pron: "YAH-beh" },
  { id: "playa", es: "playa", en: "beach", pos: "noun", g: "f", pl: "playas", ex: ["Me encanta la playa.", "I love the beach."], pron: "PLAH-yah" },
  { id: "museo", es: "museo", en: "museum", pos: "noun", g: "m", pl: "museos", ex: ["El museo abre a las nueve.", "The museum opens at nine."], pron: "moo-SEH-oh" },
  { id: "turista", es: "turista", en: "tourist", pos: "noun", ex: ["Soy turista en México.", "I'm a tourist in Mexico."], pron: "too-REES-tah", note: "Same form for men and women: el turista, la turista." },
  { id: "visitar", es: "visitar", en: "to visit", pos: "verb", ex: ["Quiero visitar el museo.", "I want to visit the museum."], pron: "bee-see-TAR", verb: reg("visitar", "ar", ["visito", "visitas", "visita", "visitamos", "visitan"], "to visit") },
  {
    id: "conocer", es: "conocer", en: "to know (a place/person) / to meet", pos: "verb", d: 3, ex: ["Conozco Oaxaca.", "I know Oaxaca."], pron: "koh-noh-SEHR",
    note: "Conocer is for people and places you're familiar with; saber is for facts. In the past, conocí means “I met”.",
    verb: { infinitive: "conocer", translation: "to know / meet", regularOrIrregular: "irregular", group: "er", stemChange: "yo conozco", conjugations: present(["conozco", "conoces", "conoce", "conocemos", "conocen"]) },
  },
  {
    id: "perder", es: "perder", en: "to lose / to miss", pos: "verb", d: 2, ex: ["Perdí mi maleta.", "I lost my suitcase."], pron: "pehr-DEHR", note: "Also “to miss” a bus or flight: perdí el vuelo.",
    verb: { infinitive: "perder", translation: "to lose / miss", regularOrIrregular: "stem-changing", group: "er", stemChange: "e → ie", conjugations: present(["pierdo", "pierdes", "pierde", "perdemos", "pierden"]) },
  },
  { id: "dia-de-muertos", es: "Día de Muertos", en: "Day of the Dead", pos: "noun", d: 2, regions: ["mx"], ex: ["El Día de Muertos es el primero y el dos de noviembre.", "Day of the Dead is on November first and second."], pron: "DEE-ah deh MWEHR-tohs", note: "A joyful celebration honoring loved ones who have died — with flowers, food, music and memories. It is not “Mexican Halloween”." },
  { id: "ofrenda", es: "ofrenda", en: "altar / offering", pos: "noun", g: "f", pl: "ofrendas", d: 2, regions: ["mx"], ex: ["Mi familia hace una ofrenda.", "My family makes an altar."], pron: "oh-FREHN-dah", note: "On Día de Muertos families build an ofrenda with photos, candles, marigolds and the favorite foods of those they remember." },
  { id: "posada", es: "posada", en: "posada (holiday party)", pos: "noun", g: "f", pl: "posadas", d: 2, regions: ["mx"], ex: ["Hay una posada en mi casa.", "There's a posada at my house."], pron: "poh-SAH-dah", note: "Parties held on the nine nights before Christmas (December 16–24), with food, piñatas and songs. Posada also means “inn”." },
  { id: "navidad", es: "Navidad", en: "Christmas", pos: "noun", g: "f", ex: ["En Navidad comemos en familia.", "At Christmas we eat as a family."], pron: "nah-bee-DAHD", note: "In Mexico the big meal is on Nochebuena, December 24th." },
  { id: "quinceanera", es: "quinceañera", en: "quinceañera (15th birthday)", pos: "noun", g: "f", pl: "quinceañeras", d: 3, ex: ["Mi prima tiene su quinceañera.", "My cousin is having her quinceañera."], pron: "keen-seh-ah-NYEH-rah", note: "The party for a girl's fifteenth birthday — the girl herself is also called the quinceañera." },
  { id: "cumpleanos", es: "cumpleaños", en: "birthday", pos: "noun", g: "m", d: 2, ex: ["Mañana es mi cumpleaños.", "Tomorrow is my birthday."], pron: "koom-pleh-AH-nyohs", note: "Singular and plural look the same: el cumpleaños, los cumpleaños. ¡Feliz cumpleaños!" },
  { id: "celebrar", es: "celebrar", en: "to celebrate", pos: "verb", ex: ["Celebramos la Navidad en familia.", "We celebrate Christmas with family."], pron: "seh-leh-BRAR", verb: reg("celebrar", "ar", ["celebro", "celebras", "celebra", "celebramos", "celebran"], "to celebrate") },
]);
