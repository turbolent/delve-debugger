import React, { ReactElement } from "react"
import "./Queries.css"
import Query from "../Query/Query"

interface Props {
  readonly queries?: string[]
}

export default function Queries({ queries }: Props): ReactElement {
  return (
    <div className="Queries">
      {(queries || []).map((query: string, index: number) => (
        <Query query={query} key={index} />
      ))}
    </div>
  )
}
