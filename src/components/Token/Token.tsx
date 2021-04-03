import React from "react"
import "./Token.css"
import { scaleOrdinal } from "d3-scale"
import { schemePaired } from "d3-scale-chromatic"
import { Token } from "../../types"
import { ReactElement } from "react"
import { Typography } from "@material-ui/core"

// POS tags (English)
// OntoNotes 5 / Penn Treebank
// https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
//
const tagDescriptions: { [tag: string]: string | undefined } = {
  "CC": "conjunction, coordinating",
  "CD": "cardinal number",
  "DT": "determiner",
  "EX": "existential 'there'",
  "FW": "foreign word",
  "IN": "conjunction, subordinating or preposition",
  "JJ": "adjective",
  "JJR": "adjective, comparative",
  "JJS": "adjective, superlative",
  "NN": "noun, singular or mass",
  "NNP": "noun, proper singular",
  "NNPS": "noun, proper plural",
  "NNS": "noun, plural",
  "PDT": "predeterminer",
  "POS": "possessive ending",
  "PRP": "pronoun, personal",
  "PRP$": "pronoun, possessive",
  "RB": "adverb",
  "RBR": "adverb, comparative",
  "RBS": "adverb, superlative",
  "RP": "adverb, particle",
  "TO": 'infinitival "to"',
  "UH": "interjection",
  "VB": "verb, base form",
  "VBD": "verb, past tense",
  "VBG": "verb, gerund or present participle",
  "VBN": "verb, past participle",
  "VBP": "verb, non-3rd person singular present",
  "VBZ": "verb, 3rd person singular present",
  "WDT": "wh-determiner",
  "WP": "wh-pronoun, personal",
  "WP$": "wh-pronoun, possessive",
  "WRB": "wh-adverb",
}

const coloredTags = ["JJ", "NN", "VB", "W", "DT", "IN", "POS", "RB", "CD", "CC"]
const scale = scaleOrdinal(schemePaired).domain(coloredTags)
const fallbackColor = "#ddd"

interface Props {
  readonly token: Token
}

function color(tag: string): string {
  const category = coloredTags.find((prefix) => tag.startsWith(prefix))
  return category ? scale(category) : fallbackColor
}

export default function TokenComponent({ token }: Props): ReactElement {
  const { tag } = token
  return (
    <div className="Token">
      <Typography variant="body2">{token.word}</Typography>
      <div>{token.lemma} ({token.offset}&ndash;{token.offset + token.length})</div>
      <div style={{ color: color(tag) }} title={ tagDescriptions[tag] }>{tag}</div>
    </div>
  )
}
