import * as React from "react"
import TokenComponent from "../Token/Token"
import "./Tokens.css"
import { Token } from "../../types"
import { State } from "../../state"
import { connect } from "react-redux"
import { ReactElement } from "react"

interface StateProps {
  readonly tokens: Token[]
}

export function Tokens({ tokens }: StateProps): ReactElement {
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

export default connect(mapStateToProps)(Tokens)
