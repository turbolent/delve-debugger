import * as React from "react"
import TokenComponent from "./TokenComponent"
import "./TokensComponent.css"
import { Token } from "./types"
import { State } from "./state"
import { connect } from "react-redux"
import { ReactElement } from "react"

interface StateProps {
  readonly tokens: Token[]
}

export function TokensComponent({ tokens }: StateProps): ReactElement {
  return (
    <div className="Tokens">
      {tokens.map((token, index) => (
        <TokenComponent token={token} key={index} />
      ))}
    </div>
  )
}

const mapStateToProps = (s: State): StateProps => ({
  tokens: (s.parse && s.parse.tokens) || [],
})

export default connect(mapStateToProps)(TokensComponent)
