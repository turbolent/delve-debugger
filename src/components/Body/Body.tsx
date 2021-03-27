import React, { ReactElement, ReactNode } from "react"
import "./Body.css"
import { Loadable, useRecoilValueLoadable } from "recoil"
import { parseQuery } from "../../state"
import Section from "../Section/Section"
import Error from "../Error/Error"
import Tokens from "../Tokens/Tokens"
import { Parse } from "../../types"
import Tree from "../Tree/Tree"

export default function Body(): ReactElement {

  const parseLoadable = useRecoilValueLoadable(parseQuery)

  return (
    <div className="Body">
      <BodyContents parseLoadable={parseLoadable}/>
    </div>
  )
}

function BodyContents(
  { parseLoadable }: { parseLoadable: Loadable<Parse | undefined> }
): ReactElement | null {

  switch (parseLoadable.state) {
    case 'loading':
      return <div>Loading ...</div>
    case 'hasError':
      return <Section title="Error">
        <Error message={parseLoadable.contents.message} />
      </Section>
    case 'hasValue': {
      const parse = parseLoadable.contents
      if (typeof parse === "undefined") {
        return null
      }
      return (
        <>
          {
            parse.tokens &&
            <Section title="Tokens">
              <Tokens tokens={parse.tokens} />
            </Section>
          }
          {
            parse.trees && parse.trees.map((tree, i) =>
              <Section key={`tree-${i}`} title={`Tree ${i + 1}`}>
                <Tree root={tree} />
              </Section>
            )
          }
        </>
      )
    }
  }
}