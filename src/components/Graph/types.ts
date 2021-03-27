import {
  GraphConjunctionEdge,
  GraphDisjunctionEdge,
  GraphEdge,
  GraphEdgeLabel,
  GraphFilter,
  GraphGreaterThanFilter,
  GraphInEdge,
  GraphItemEdgeLabel,
  GraphLessThanFilter,
  GraphNode,
  GraphNodeLabel,
  GraphItemNodeLabel,
  GraphOutEdge,
  GraphValueNodeLabel,
  GraphVarNodeLabel,
} from "../../../../delve-debugger/src/types"

// Nodes

export abstract class GraphComponentNode {
  private static nextID = 0

  x = 0
  y = 0

  fx?: number
  fy?: number

  readonly id: number
  readonly text: string
  readonly link?: string
  readonly isRoot?: boolean

  protected constructor(text: string, link?: string, isRoot?: boolean) {
    this.id = GraphComponentNode.nextID++
    this.text = text
    this.link = link
    this.isRoot = isRoot
  }
}

export class GraphComponentLabelNode extends GraphComponentNode {
  private static getText(nodeLabel: GraphNodeLabel) {
    if (nodeLabel instanceof GraphVarNodeLabel) {
      return `?${nodeLabel.id}`
    }

    if (nodeLabel instanceof GraphItemNodeLabel) {
      return nodeLabel.item.name
    }

    if (nodeLabel instanceof GraphValueNodeLabel) {
      return `${nodeLabel.value}`
    }

    return
  }

  private static getLink(nodeLabel: GraphNodeLabel): string | undefined {
    if (nodeLabel instanceof GraphItemNodeLabel) {
      return nodeLabel.item.url
    }

    return
  }

  static fromGraphNodeLabel(
    nodeLabel: GraphNodeLabel,
    isRoot = false
  ): GraphComponentLabelNode | undefined {
    const text = GraphComponentLabelNode.getText(nodeLabel)
    if (!text) {
      return
    }
    const link = GraphComponentLabelNode.getLink(nodeLabel)

    const type =
      nodeLabel instanceof GraphVarNodeLabel
        ? GraphComponentVarLabelNode
        : GraphComponentLabelNode

    return new type(text, link, isRoot)
  }
}

export class GraphComponentVarLabelNode extends GraphComponentLabelNode {}

export class GraphComponentConjunctionNode extends GraphComponentNode {
  constructor() {
    super("&")
  }
}

export class GraphComponentDisjunctionNode extends GraphComponentNode {
  constructor() {
    super("|")
  }
}

// Edges

export class GraphComponentEdge {
  readonly source: GraphComponentNode
  readonly target: GraphComponentNode
  readonly text?: string
  readonly link?: string

  constructor(
    source: GraphComponentNode,
    target: GraphComponentNode,
    text?: string,
    link?: string
  ) {
    this.source = source
    this.target = target
    this.text = text
    this.link = link
  }
}

export class GraphComponentDirectedEdge extends GraphComponentEdge {
  private static getText(edgeLabel: GraphEdgeLabel): string | undefined {
    if (edgeLabel instanceof GraphItemEdgeLabel) {
      return edgeLabel.item.name
    }

    return
  }

  private static getLink(edgeLabel: GraphEdgeLabel): string | undefined {
    if (edgeLabel instanceof GraphItemEdgeLabel) {
      return edgeLabel.item.url
    }

    return
  }

  static fromGraphEdgeLabel(
    edgeLabel: GraphEdgeLabel,
    source: GraphComponentNode,
    target: GraphComponentNode
  ): GraphComponentDirectedEdge | undefined {
    const text = GraphComponentDirectedEdge.getText(edgeLabel)
    if (!text) {
      return
    }
    const link = GraphComponentDirectedEdge.getLink(edgeLabel)
    return new GraphComponentDirectedEdge(source, target, text, link)
  }
}

export abstract class GraphComponentFilterEdge extends GraphComponentEdge {}

export class GraphComponentLessThanFilterEdge extends GraphComponentFilterEdge {
  constructor(source: GraphComponentNode, target: GraphComponentNode) {
    super(source, target, "is less than")
  }
}

export class GraphComponentGreaterThanFilterEdge extends GraphComponentFilterEdge {
  constructor(source: GraphComponentNode, target: GraphComponentNode) {
    super(source, target, "is greater than")
  }
}

type GraphComponentNodesAndEdges = [GraphComponentNode[], GraphComponentEdge[]]

export function parseGraphNode(
  graphNode: GraphNode,
  isRoot = false
): GraphComponentNodesAndEdges {
  const { label, edge, filter } = graphNode

  const source = GraphComponentLabelNode.fromGraphNodeLabel(label, isRoot)
  if (!source) {
    return [[], []]
  }

  const [edgeNodes, edgeEdges] =
    (edge && parseGraphEdge(edge, source)) || [[], []]

  const [filterNodes, filterEdges] =
    (filter && parseGraphFilter(filter, source)) || [[], []]

  const allNodes = [source].concat(edgeNodes).concat(filterNodes)

  const allEdges = edgeEdges.concat(filterEdges)

  return [allNodes, allEdges]
}

function parseGraphFilter(
  filter: GraphFilter,
  source: GraphComponentNode
): GraphComponentNodesAndEdges | undefined {
  if (filter instanceof GraphLessThanFilter) {
    const [nodes, edges] = parseGraphNode(filter.node)
    const edge = new GraphComponentLessThanFilterEdge(source, nodes[0])
    return [nodes, [edge].concat(edges)]
  }

  if (filter instanceof GraphGreaterThanFilter) {
    const [nodes, edges] = parseGraphNode(filter.node)
    const edge = new GraphComponentGreaterThanFilterEdge(source, nodes[0])
    return [nodes, [edge].concat(edges)]
  }

  return
}

function parseGraphEdge(
  edge: GraphEdge,
  source: GraphComponentNode
): GraphComponentNodesAndEdges | undefined {
  if (edge instanceof GraphConjunctionEdge) {
    const componentNode = new GraphComponentConjunctionNode()
    const componentEdge = new GraphComponentEdge(source, componentNode)
    const [componentNodes, componentEdges] = parseEdges(
      edge.edges,
      componentNode
    )
    return [
      [componentNode].concat(componentNodes),
      [componentEdge].concat(componentEdges),
    ]
  }

  if (edge instanceof GraphDisjunctionEdge) {
    const componentNode = new GraphComponentDisjunctionNode()
    const componentEdge = new GraphComponentEdge(source, componentNode)
    const [componentNodes, componentEdges] = parseEdges(
      edge.edges,
      componentNode
    )
    return [
      [componentNode].concat(componentNodes),
      [componentEdge].concat(componentEdges),
    ]
  }

  if (edge instanceof GraphOutEdge) {
    const [componentNodes, componentEdges] = parseGraphNode(edge.target)
    const componentEdge = GraphComponentDirectedEdge.fromGraphEdgeLabel(
      edge.label,
      source,
      componentNodes[0]
    )
    if (!componentEdge) {
      return [[], []]
    }
    return [componentNodes, [componentEdge].concat(componentEdges)]
  }

  if (edge instanceof GraphInEdge) {
    const [componentNodes, componentEdges] = parseGraphNode(edge.source)
    const componentEdge = GraphComponentDirectedEdge.fromGraphEdgeLabel(
      edge.label,
      componentNodes[0],
      source
    )
    if (!componentEdge) {
      return [[], []]
    }
    return [componentNodes, [componentEdge].concat(componentEdges)]
  }

  return
}

function parseEdges(
  edges: GraphEdge[],
  source: GraphComponentNode
): GraphComponentNodesAndEdges {
  return edges.reduce<GraphComponentNodesAndEdges>(
    ([currentNodes, currentEdges], edge: GraphEdge) => {
      const [newNodes, newEdges] = parseGraphEdge(edge, source) || [[], []]
      return [currentNodes.concat(newNodes), currentEdges.concat(newEdges)]
    },
    [[], []]
  )
}
