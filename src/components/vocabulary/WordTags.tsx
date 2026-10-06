import { Flag } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { PartOfSpeech, Register, VocabEntry } from "@/content/types";

const REGISTER_TONE: Record<Register, BadgeTone> = { standard: "neutral", informal: "sol", slang: "rosa", vulgar: "chili" };
export const REGISTER_LABEL: Record<Register, string> = { standard: "Standard", informal: "Informal", slang: "Slang", vulgar: "Vulgar" };

export const POS_LABEL: Record<PartOfSpeech, string> = {
  noun: "Noun",
  verb: "Verb",
  adjective: "Adjective",
  adverb: "Adverb",
  pronoun: "Pronoun",
  preposition: "Preposition",
  conjunction: "Conjunction",
  determiner: "Determiner",
  number: "Number",
  expression: "Expression",
};

const GENDER_LABEL = { m: "Masculine", f: "Feminine" } as const;

interface WordTagsProps {
  vocab: VocabEntry;
  /** Always show the register badge, even for "Standard". */
  showStandard?: boolean;
  showGender?: boolean;
  showPos?: boolean;
}

/** Part of speech, gender, and the register/regional labels learners need for real-world usage. */
export function WordTags({ vocab, showStandard = false, showGender = false, showPos = true }: WordTagsProps) {
  return (
    <>
      {showPos && <Badge tone="violet">{POS_LABEL[vocab.partOfSpeech]}</Badge>}
      {showGender && vocab.gender && <Badge tone="neutral">{GENDER_LABEL[vocab.gender]}</Badge>}
      {(showStandard || vocab.register !== "standard") && <Badge tone={REGISTER_TONE[vocab.register]}>{REGISTER_LABEL[vocab.register]}</Badge>}
      {vocab.regions?.includes("mx") && (
        <Badge tone="teal" icon={<Flag size={11} aria-hidden="true" />}>Regional — Mexico</Badge>
      )}
    </>
  );
}
