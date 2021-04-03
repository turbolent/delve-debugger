import React, { ReactElement} from "react"
import "./Body.css"
import Section from "../Section/Section"
import Error from "../Error/Error"
import Tokens from "../Tokens/Tokens"
import { Parse, State } from "../../types"
import Tree from "../Tree/Tree"
import Queries from "../Queries/Queries"
import Graphs from "../Graphs/Graphs"

interface Props {
  state: State
}

export default function Body({ state }: Props): ReactElement {
  return (
    <div className="Body">
      <BodyContents state={state} />
    </div>
  )
}

function BodyContents({ state }: Props): ReactElement | null {

  if (typeof(state) === "undefined") {
    return null
  }

  if (!(state instanceof Parse)) {
    return <Section title="Error">
      <Error message={state.message} />
    </Section>
  }

  return (
    <>
      {
        state.tokens &&
        <Section
          title="Tokens"
          info={
            "The result of part-of-speech tagging the input using spaCy. "
            + "Shows lemma, position, and tag. "
            + "Hover for a description of the tag. "
          }
        >
          <Tokens tokens={state.tokens} />
        </Section>
      }
      {
        state.trees &&
        <Section
          title="Trees"
          info={
            "The result of syntactic analysis, i.e., parsing the tokens into a query. "
            + "Types are colored. "
            + "Entity and ontology class lookup results are linked if they map to a Wikidata item."
          }
        >
          {
            state.trees.map((tree, i) =>
              <Tree key={`tree-${i}`} root={tree} />)
          }
        </Section>
      }
      {
        state.nodes &&
        <Section
          title="Graphs"
          info={
            "The result of semantic analysis and compilation, "
            + "i.e., translating the query tree into a high-level graph compatible with the ontology. "
            + "The ontology is used to produce nodes and edges. "
          }
        >
          <Graphs graphNodes={state.nodes} />
        </Section>
      }
      {
        state.expanded_nodes &&
        <Section
          title="Expanded Graphs"
          info={
            "The result of expanding the high-level query graph "
            + " into a low-level graph that is compatible with the target data source."
            + "The ontology is used to find equivalents for nodes and edges."
          }
        >
          <Graphs graphNodes={state.expanded_nodes} />
        </Section>
      }
      {
        state.queries &&
        <Section
          title="Queries"
          info={
            "The result of compiling the low-level query graph to SPARQL."
          }
        >
          <Queries queries={state.queries} />
        </Section>
      }
      {

        state.error &&
        <Section
          title="Error"
          info="Something went wrong"
        >
          <Error message={state.error} />
        </Section>
      }
    </>
  )
}