import React, { ReactElement} from "react"
import "./Body.css"
import Section from "../Section/Section"
import Error from "../Error/Error"
import Tokens from "../Tokens/Tokens"
import { Parse, State } from "../../types"
import Tree from "../Tree/Tree"

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
        state.trees && state.trees.map((tree, i) =>
            <Section key={`tree-${i}`} title={`Tree ${i + 1}`}>
              <Tree root={tree} />
            </Section>
        )
      }
    </>
  )
}