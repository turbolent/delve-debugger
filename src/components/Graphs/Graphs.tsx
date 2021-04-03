import React, { ReactElement } from "react"
import Graph from "../Graph/Graph"
import { GraphNode } from "../../types"
import { parseGraphNode } from "../Graph/types"

interface Props {
  readonly graphNodes?: GraphNode[]
}

export default function Graphs({ graphNodes }: Props): ReactElement {
  return (
    <div>
      {(graphNodes || []).map((node: GraphNode, index: number) => {
        const [nodes, edges] = parseGraphNode(node, true)
        return <Graph nodes={nodes} links={edges} key={index} />
      })}
    </div>
  )
}
