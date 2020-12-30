import { connect } from "react-redux"
import { State } from "../../state"
import * as React from "react"
import Query from "../Query/Query"
import "./Queries.css"
import { ReactElement } from "react"

interface StateProps {
  readonly queries?: string[]
}

function Queries({ queries }: StateProps): ReactElement {
  return (
    <div className="Queries">
      {(queries || []).map((query: string, index: number) => (
        <Query query={query} key={index} />
      ))}
    </div>
  )
}

const mapStateToProps = (s: State): StateProps => ({
  queries: s.parse && s.parse.queries,
})

export default connect(mapStateToProps)(Queries)
