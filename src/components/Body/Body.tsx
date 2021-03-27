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
        <Section title="Tokens">
          <Tokens tokens={state.tokens} />
        </Section>
      }
      {
        state.trees &&
        <Section title="Trees">
          {
            state.trees.map((tree, i) =>
              <Tree key={`tree-${i}`} root={tree} />)
          }
        </Section>
      }
      {
        state.nodes &&
        <Section title="Graphs">
          <Graphs graphNodes={state.nodes} />
        </Section>
      }
      {
        state.expanded_nodes &&
        <Section title="Expanded Graphs">
          <Graphs graphNodes={state.expanded_nodes} />
        </Section>
      }
      {
        state.queries &&
        <Section title="Queries">
          <Queries queries={state.queries} />
        </Section>
      }
      {

        state.error &&
        <Section title="Error">
          <Error message={state.error} />
        </Section>
      }
    </>
  )
}