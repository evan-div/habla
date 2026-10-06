import type { Unit } from "../../types";
import { ask, blank, buildEn, buildEs, dictate, grammarNote, gq, heard, intro, lesson, match, meaning, natural, sayIt, toEn, toEs } from "../builders";

const unitId = "unit-01-hello";

export const unit01: Unit = {
  id: unitId,
  sectionId: "section-1-foundations",
  number: 1,
  title: "Hello",
  description: "Greet people, ask how they are, and be polite the Mexican way.",
  accent: "teal",
  icon: "hand",
  lessons: [
    lesson(
      { id: "u1-l1-hello", unitId, title: "Hello!", subtitle: "Greet anyone, at any time of day." },
      [
        intro(["hola", "buenos-dias", "buenas-tardes", "buenas-noches"], "Say hello at any time of day", "Spanish greetings change with the time of day. Tap each card to hear it."),
        meaning("hola", "Hello", ["Goodbye", "Please", "Thanks"], { v: "hola" }),
        meaning("buenos días", "Good morning", ["Good night", "Good afternoon", "Thank you"], {
          v: "buenos-dias",
          fb: { "Good night": "That's buenas noches. Días means “days” — a morning greeting." },
        }),
        match([["hola", "hello"], ["buenos-dias", "good morning"], ["buenas-tardes", "good afternoon"], ["buenas-noches", "good night"]]),
        sayIt("Good afternoon", "buenas tardes", ["buenos días", "buenas noches", "hola"], { v: "buenas-tardes" }),
        heard("buenos días", "What did you hear?", "Good morning", ["Good afternoon", "Good night", "Hello"], { v: "buenos-dias", translation: "Good morning" }),
        natural(
          "Walking into a shop in Mexico",
          ["Buenos días", "Good morning"],
          [["¡Hola!", "Hi!", "Standard"], ["¡Buenas!", "Hey! (any time of day)", "Informal", "mx"]],
          ["buenas"],
          "Textbooks teach three greetings by time of day. In real life people also say ¡Buenas! as a quick, friendly shortcut — you'll hear it every time you walk into a shop in Mexico.",
        ),
        ask("Which one is an afternoon greeting?", "Buenas tardes", ["Buenos días", "Buenas noches"], { v: "buenas-tardes" }),
        blank("Buenas ___.", "tardes", "Good afternoon.", { options: ["tardes", "días", "noches"], v: "buenas-tardes", why: "Buenas goes with tardes and noches; buenos goes with días." }),
        dictate("buenas tardes", { v: "buenas-tardes", translation: "Good afternoon" }),
        toEs("Good morning", ["buenos días"], { v: "buenos-dias" }),
        ask("It's 10 p.m. and you say goodnight to a friend. What do you say?", "Buenas noches", ["Buenos días", "Buenas tardes"], { v: "buenas-noches" }),
      ],
    ),

    lesson(
      { id: "u1-l2-how-are-you", unitId, title: "How are you?", subtitle: "Ask how someone is — and answer." },
      [
        intro(["como-estas", "bien", "muy-bien", "mas-o-menos", "mal", "y-tu", "gracias"], "Ask and answer “How are you?”"),
        meaning("¿cómo estás?", "How are you?", ["What's your name?", "Where are you?", "How old are you?"], { v: "como-estas" }),
        meaning("muy bien", "Very well", ["Not well", "So-so", "Good morning"], { v: "muy-bien" }),
        meaning("mal", "Bad / not well", ["Very well", "So-so", "Thank you"], { v: "mal" }),
        match([["bien", "good / fine"], ["mal", "bad"], ["muy-bien", "very well"], ["mas-o-menos", "so-so"]]),
        grammarNote("tu-vs-usted"),
        gq("You're talking to your friend's grandmother. Which is more polite?", "¿Cómo está usted?", ["¿Cómo estás?", "¿Cómo estás usted?"], {
          g: "tu-vs-usted",
          v: "como-estas",
          why: "Use usted — with the matching verb form está — to show respect.",
          fb: { "¿Cómo estás usted?": "Usted pairs with está, not estás. The -s ending belongs to tú." },
        }),
        heard("¿Cómo estás?", "What did the speaker ask?", "How are you?", ["Where are you?", "What's your name?", "How old are you?"], { v: "como-estas", translation: "How are you?" }),
        buildEs("Very well, and you?", "Muy bien, ¿y tú?", ["mal", "estás", "gracias"], { v: ["muy-bien", "y-tu"] }),
        ask("How is Ana feeling?", "So-so", ["Very well", "Bad"], {
          v: "mas-o-menos",
          context: [
            { speaker: "Luis", es: "¡Hola, Ana! ¿Cómo estás?", en: "Hi, Ana! How are you?" },
            { speaker: "Ana", es: "Más o menos. ¿Y tú?", en: "So-so. And you?" },
          ],
        }),
        natural(
          "Asking how someone is",
          ["¿Cómo estás?", "How are you?"],
          [["¿Qué tal?", "How's it going?", "Informal"], ["¿Qué onda?", "What's up?", "Slang", "mx"]],
          ["que-tal", "que-onda"],
          "Textbooks stop at ¿Cómo estás?. Real conversations use ¿Qué tal? almost everywhere, and ¿Qué onda? with Mexican friends — literally “what wave?”. In Spain you'd hear ¿Qué pasa?",
        ),
        toEs("Fine, thank you.", ["Bien, gracias"], { v: ["bien", "gracias"] }),
        blank("Bien, ¿y ___?", "tú", "Fine, and you?", { v: "y-tu", accepted: ["tu"] }),
        dictate("Muy bien, gracias.", { v: ["muy-bien", "gracias"], translation: "Very well, thanks." }),
        toEn("Más o menos, ¿y tú?", ["So-so, and you?", "So so, and you?", "More or less, and you?"], { v: ["mas-o-menos", "y-tu"] }),
        toEn("Mal, pero gracias.", ["Bad, but thanks.", "Bad, but thank you.", "Not well, but thanks.", "Not well, but thank you."], { v: ["mal", "gracias"] }),
      ],
    ),

    lesson(
      { id: "u1-l3-polite", unitId, title: "Please & thank you", subtitle: "Be polite — the Mexican way." },
      [
        intro(["muchas-gracias", "de-nada", "por-favor", "perdon", "si", "no", "mucho-gusto"], "Words that open doors", "Politeness matters in Mexico. These small words go a long way."),
        meaning("de nada", "You're welcome", ["Thank you", "Please", "Sorry"], { v: "de-nada" }),
        meaning("por favor", "Please", ["Sorry", "You're welcome", "Thank you very much"], { v: "por-favor" }),
        match([["gracias", "thank you"], ["de-nada", "you're welcome"], ["por-favor", "please"], ["perdon", "sorry"]]),
        heard("muchas gracias", "What did you hear?", "Thank you very much", ["You're welcome", "Please", "Nice to meet you"], { v: "muchas-gracias", translation: "Thank you very much" }),
        natural(
          "You didn't catch what someone said",
          ["¿Perdón?", "Pardon?"],
          [["¿Cómo?", "What? / Pardon?", "Standard"], ["¿Mande?", "Pardon? / Yes?", "Standard", "mx"]],
          ["mande"],
          "In Mexico ¿mande? is a polite “pardon?” — and the answer when someone calls your name. It sounds old-fashioned to some learners, but you'll hear it everywhere.",
        ),
        ask("Someone says “Gracias.” What do you reply?", "De nada", ["Por favor", "Perdón"], { v: ["gracias", "de-nada"] }),
        ask("You bump into someone in a crowd. What do you say?", "Perdón", ["De nada", "Mucho gusto"], { v: "perdon" }),
        gq("Which spelling means “yes”?", "sí", ["si"], { v: "si", why: "The accent matters: sí = yes, but si (no accent) means “if”." }),
        buildEs("Yes, please.", "Sí, por favor.", ["no", "gracias"], { v: ["si", "por-favor"] }),
        toEs("No, thank you.", ["No, gracias"], { v: ["no", "gracias"] }),
        ask("Someone offers you more food, but you're full. What do you say?", "No, gracias", ["Sí, por favor", "De nada"], { v: ["no", "gracias", "si"] }),
        meaning("mucho gusto", "Nice to meet you", ["Thank you very much", "See you later", "How are you?"], { v: "mucho-gusto" }),
        dictate("Mucho gusto.", { v: "mucho-gusto", translation: "Nice to meet you." }),
        toEn("Sí, por favor. Muchas gracias.", ["Yes, please. Thank you very much."], { v: ["si", "por-favor", "muchas-gracias"] }),
      ],
    ),

    lesson(
      { id: "u1-l4-goodbye", unitId, title: "Goodbye & checkpoint", subtitle: "Say goodbye — then put Unit 1 together.", kind: "checkpoint" },
      [
        intro(["adios", "hasta-luego", "hasta-manana", "nos-vemos"], "Ways to say goodbye"),
        meaning("hasta mañana", "See you tomorrow", ["See you later", "Goodbye", "Good night"], { v: "hasta-manana" }),
        meaning("hasta luego", "See you later", ["See you tomorrow", "Good morning", "Nice to meet you"], { v: "hasta-luego" }),
        match([["adios", "goodbye"], ["hasta-luego", "see you later"], ["hasta-manana", "see you tomorrow"], ["nos-vemos", "see you (around)"]]),
        heard("hasta luego", "What did you hear?", "See you later", ["See you tomorrow", "Goodbye", "Good night"], { v: "hasta-luego", translation: "See you later" }),
        natural(
          "Leaving a friend's place",
          ["Adiós", "Goodbye"],
          [["Hasta luego", "See you later", "Standard"], ["Nos vemos", "See you around", "Informal"]],
          ["nos-vemos"],
          "Adiós sounds final — it's the one you say when you won't see someone for a while. Day to day, Mexicans say hasta luego or the casual nos vemos.",
        ),
        ask("Which goodbye means you'll see the person again tomorrow?", "Hasta mañana", ["Adiós", "Nos vemos"], { v: ["hasta-manana", "adios"] }),
        // ---- checkpoint: everything from Unit 1 ----
        ask("What does Luis say to Ana at 9 a.m.?", "Buenos días", ["Buenas noches", "Hasta luego"], {
          v: ["buenos-dias"],
          context: [
            { speaker: "Luis", es: "¡___, Ana! ¿Cómo estás?", en: "___, Ana! How are you?" },
            { speaker: "Ana", es: "Muy bien, gracias. ¿Y tú?", en: "Very well, thanks. And you?" },
          ],
        }),
        buildEs("Good night. See you tomorrow.", "Buenas noches. Hasta mañana.", ["buenos", "adiós", "tardes"], { v: ["buenas-noches", "hasta-manana"] }),
        buildEn("Hola, ¿qué tal?", "Hi, how's it going?", ["goodbye", "please", "you"], { v: ["hola", "que-tal"] }),
        toEs("Please. Thank you very much.", ["Por favor. Muchas gracias.", "Por favor, muchas gracias."], { v: ["por-favor", "muchas-gracias"] }),
        dictate("Hasta mañana, buenas noches.", { v: ["hasta-manana", "buenas-noches"], translation: "See you tomorrow, good night." }),
        toEn("¡Adiós! Hasta luego.", ["Goodbye! See you later.", "Bye! See you later."], { v: ["adios", "hasta-luego"] }),
        ask("Which reply fits? — “¿Cómo estás?”", "Muy bien, gracias. ¿Y tú?", ["De nada", "Hasta mañana"], { v: ["como-estas", "muy-bien", "y-tu"] }),
        ask("You meet someone new. What do you say?", "Mucho gusto", ["Hasta luego", "De nada"], { v: "mucho-gusto" }),
        toEs("Sorry!", ["Perdón", "¡Perdón!"], { v: "perdon" }),
        blank("Muy ___, gracias.", "bien", "Very well, thanks.", { options: ["bien", "tardes", "luego"], v: ["bien", "muy-bien"] }),
      ],
    ),
  ],
};
