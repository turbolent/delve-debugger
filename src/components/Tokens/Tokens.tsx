import React, { ReactElement } from "react"
import "./Tokens.css"
import TokenComponent from "../Token/Token"
import { Token } from "../../types"

interface Props {
  readonly tokens: Token[]
}

export default function Tokens({ tokens }: Props): ReactElement {
  return (
    <div className="Tokens">
      {tokens.map((token, index) => (
        <TokenComponent token={token} key={index} />
      ))}
    </div>
  )
}
