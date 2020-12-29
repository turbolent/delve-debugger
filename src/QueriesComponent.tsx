import { connect } from "react-redux"
import { State } from "./state"
import * as React from "react"
import QueryComponent from "./QueryComponent"
import "./QueriesComponent.css"
import { ReactElement } from "react"

interface StateProps {
  readonly queries?: string[]
}

function QueriesComponent({ queries }: StateProps): ReactElement {
  return (
    <div className="Queries">
      {(queries || []).map((query: string, index: number) => (
        <QueryComponent query={query} key={index} />
      ))}
    </div>
  )
}

const mapStateToProps = (s: State): StateProps => ({
  queries: s.parse && s.parse.queries,
})

export default connect(mapStateToProps)(QueriesComponent)
