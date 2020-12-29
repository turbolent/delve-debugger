import { connect } from "react-redux"
import { State } from "./state"
import * as React from "react"
import GraphComponent from "./graph/GraphComponent"
import { GraphNode } from "./types"
import { parseGraphNode } from "./graph/types"

interface StateProps {
  readonly graphNodes?: GraphNode[]
}

type Props = {
  readonly parseProperty: string
} & StateProps

function GraphsComponent({ graphNodes }: Props) {
  return (
    <div>
      {(graphNodes || []).map((node: GraphNode, index: number) => {
        const [nodes, edges] = parseGraphNode(node, true)
        return <GraphComponent nodes={nodes} links={edges} key={index} />
      })}
    </div>
  )
}

const mapStateToProps = (s: State, ownProps: Props): StateProps => ({
  graphNodes: s.parse && s.parse[ownProps.parseProperty] as GraphNode[],
})

export default connect(mapStateToProps)(GraphsComponent)
