/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */

export class Parse {
  readonly tokens?: Token[]
  readonly tree?: TreeNode
  readonly queries?: string[]
  readonly nodes?: GraphNode[]
  readonly expanded_nodes?: GraphNode[]
  readonly error?: string;

  [key: string]: unknown

  static decode(json: any): Parse {
    return new Parse(
      json.tokens && json.tokens.map(Token.decode),
      json.question && TreeNode.decode(json.question),
      json.queries,
      json.nodes &&
        json.nodes.map((nodeJSON: any) => GraphNode.decode(nodeJSON)),
      json.expanded_nodes &&
        json.expanded_nodes.map((nodeJSON: any) => GraphNode.decode(nodeJSON)),
      json.error
    )
  }

  private constructor(
    tokens: Token[],
    tree: TreeNode,
    queries?: string[],
    nodes?: GraphNode[],
    expanded_nodes?: GraphNode[],
    error?: string
  ) {
    this.tokens = tokens
    this.tree = tree
    this.queries = queries
    this.nodes = nodes
    this.expanded_nodes = expanded_nodes
    this.error = error
  }
}

export class Token {
  readonly lemma: string
  readonly tag: string
  readonly word: string

  static decode(json: any): Token {
    return new Token(json.lemma, json.tag, json.word)
  }

  constructor(lemma: string, tag: string, word: string) {
    this.lemma = lemma
    this.tag = tag
    this.word = word
  }
}

const tokenPropertyNames = new Set(["word", "tag", "lemma"])

function representsToken(json: any): boolean {
  if (typeof json !== "object") {
    return false
  }
  const propertyNames = new Set(Object.getOwnPropertyNames(json))
  if (propertyNames.size !== tokenPropertyNames.size) {
    return false
  }
  for (const propertyName of tokenPropertyNames.values()) {
    if (!propertyNames.has(propertyName)) {
      return false
    }
  }
  return true
}

export type Tree = TreeNode | TreeLeaf

export class TreeLeaf {
  readonly name: string
  readonly tokens: Token[]

  constructor(name: string, tokens: Token[]) {
    this.name = name
    this.tokens = tokens
  }
}

export class TreeNode {
  readonly type: string
  readonly children: Tree[]
  readonly name?: string

  private static ignoredProperties = new Set(["type"])

  private static isValidProperty(property: string) {
    return !TreeNode.ignoredProperties.has(property)
  }

  static decode(json: any, name?: string): TreeNode {
    const children = Object.keys(json)
      .filter(TreeNode.isValidProperty)
      .map((property: string): Tree[] => {
        const value = json[property]
        if (Array.isArray(value)) {
          if (!value.length) {
            return []
          }

          if (representsToken(value[0])) {
            const tokens = value.map((element) => Token.decode(element))
            return [new TreeLeaf(property, tokens)]
          } else {
            return value.map((element) => TreeNode.decode(element))
          }
        } else {
          if (representsToken(value)) {
            return [new TreeLeaf(property, [Token.decode(value)])]
          } else {
            return [TreeNode.decode(value, property)]
          }
        }
      })
      .reduce((a, b) => a.concat(b), [])

    return new TreeNode(json.type, children, name)
  }

  constructor(type: string, children: Tree[], name?: string) {
    this.type = type
    this.children = children
    this.name = name
  }
}

export class Item {
  readonly name: string
  readonly url?: string

  constructor(name: string, url?: string) {
    this.name = name
    this.url = url
  }
}

abstract class GraphValue {
  // shortened version of $value
  readonly _type: string

  constructor(_type: string) {
    this._type = _type
  }
}

export class GraphNode extends GraphValue {
  readonly label: GraphNodeLabel
  readonly edge?: GraphEdge
  readonly filter?: GraphFilter
  readonly order?: GraphOrder

  static decode(json: any): GraphNode {
    const label = GraphNodeLabel.decode(json.label)
    const edge = json.edge && GraphEdge.decode(json.edge)
    const filter = json.filter && GraphFilter.decode(json.filter)
    return new GraphNode(json.type, label, edge, filter)
  }

  constructor(
    _type: string,
    label: GraphNodeLabel,
    edge?: GraphEdge,
    filter?: GraphFilter
  ) {
    super(_type)
    this.label = label
    this.edge = edge
    this.filter = filter
  }
}

export abstract class GraphNodeLabel extends GraphValue {
  static decode(json: any): GraphNodeLabel {
    const constructor = graphNodeLabelConstructors[json.type]
    if (!constructor) {
      throw new Error(`Missing constructor for graph node label ${json.type}`)
    }
    return new constructor(json, json.type)
  }
}

export class GraphVarNodeLabel extends GraphNodeLabel {
  readonly id: string

  constructor(json: any, _type: string) {
    super(_type)
    this.id = json.id
  }
}

export class GraphItemNodeLabel extends GraphNodeLabel {
  readonly item: Item

  constructor(type: string, item: Item) {
    super(type)
    this.item = item
  }
}

export class GraphValueNodeLabel extends GraphNodeLabel {
  readonly value: string

  constructor(type: string, value: string) {
    super(type)
    this.value = value
  }
}

interface GraphNodeLabelConstructor {
  new (json: any, _type: string): GraphNodeLabel
}

const graphNodeLabelConstructors: {
  [type: string]: GraphNodeLabelConstructor
} = {
  "node-label.variable": GraphVarNodeLabel,
}

export function registerGraphNodeLabelConstructor(
  type: string,
  constructor: GraphNodeLabelConstructor
) {
  if (graphNodeLabelConstructors[type]) {
    throw new Error(
      `Cannot register graph node label constructor for already registered type ${type}`
    )
  }
  graphNodeLabelConstructors[type] = constructor
}

export abstract class GraphEdgeLabel extends GraphValue {
  static decode(json: any): GraphEdgeLabel {
    const constructor = graphEdgeLabelConstructors[json.type]
    if (!constructor) {
      throw new Error(`Missing constructor for graph edge label ${json.type}`)
    }
    return new constructor(json, json.type)
  }
}

export class GraphItemEdgeLabel extends GraphEdgeLabel {
  readonly item: Item

  constructor(type: string, item: Item) {
    super(type)
    this.item = item
  }
}

interface GraphEdgeLabelConstructor {
  new (json: any, _type: string): GraphEdgeLabel
}

const graphEdgeLabelConstructors: {
  [type: string]: GraphEdgeLabelConstructor
} = {}

export function registerGraphEdgeLabelConstructor(
  type: string,
  constructor: GraphEdgeLabelConstructor
) {
  if (graphEdgeLabelConstructors[type]) {
    throw new Error(
      `Cannot register graph edge label constructor for already registered type ${type}`
    )
  }
  graphEdgeLabelConstructors[type] = constructor
}

export abstract class GraphEdge extends GraphValue {
  static decode(json: any): GraphEdge {
    const constructor = graphEdgeConstructors[json.type]
    if (!constructor) {
      throw new Error(`Missing constructor for graph edge ${json.type}`)
    }
    return new constructor(json, json.type)
  }
}

export class GraphInEdge extends GraphEdge {
  readonly source: GraphNode
  readonly label: GraphEdgeLabel

  constructor(json: any, _type: string) {
    super(_type)
    this.source = GraphNode.decode(json.source)
    this.label = GraphEdgeLabel.decode(json.label)
  }
}

export class GraphOutEdge extends GraphEdge {
  readonly label: GraphEdgeLabel
  readonly target: GraphNode

  constructor(json: any, _type: string) {
    super(_type)
    this.label = GraphEdgeLabel.decode(json.label)
    this.target = GraphNode.decode(json.target)
  }
}

export class GraphConjunctionEdge extends GraphEdge {
  readonly edges: GraphEdge[]

  constructor(json: any, _type: string) {
    super(_type)
    this.edges = json.edges.map((innerJSON: any) => GraphEdge.decode(innerJSON))
  }
}

export class GraphDisjunctionEdge extends GraphEdge {
  readonly edges: GraphEdge[]

  constructor(json: any, _type: string) {
    super(_type)
    this.edges = json.edges.map((innerJSON: any) => GraphEdge.decode(innerJSON))
  }
}

interface GraphEdgeConstructor {
  new (json: any, _type: string): GraphEdge
}

const graphEdgeConstructors: {
  [type: string]: GraphEdgeConstructor
} = {
  "edge.in": GraphInEdge,
  "edge.out": GraphOutEdge,
  "edge.conjunction": GraphConjunctionEdge,
  "edge.disjunction": GraphDisjunctionEdge,
  // TODO: aggregation
}

export abstract class GraphFilter extends GraphValue {
  static decode(json: any): GraphEdge {
    const constructor = filterConstructors[json.type]
    if (!constructor) {
      throw new Error(`Missing constructor for graph filter ${json.type}`)
    }
    return new constructor(json, json.type)
  }
}

export class GraphConjunctionFilter extends GraphFilter {
  readonly filters: GraphFilter[]

  constructor(json: any, _type: string) {
    super(_type)
    this.filters = json.filters.map((innerJSON: any) =>
      GraphFilter.decode(innerJSON)
    )
  }
}

export class GraphEqualsFilter extends GraphFilter {
  readonly node: GraphNode

  constructor(json: any, _type: string) {
    super(_type)
    this.node = GraphNode.decode(json.node)
  }
}

export class GraphLessThanFilter extends GraphFilter {
  readonly node: GraphNode

  constructor(json: any, _type: string) {
    super(_type)
    this.node = GraphNode.decode(json.node)
  }
}

export class GraphGreaterThanFilter extends GraphFilter {
  readonly node: GraphNode

  constructor(json: any, _type: string) {
    super(_type)
    this.node = GraphNode.decode(json.node)
  }
}

interface GraphFilterConstructor {
  new (json: any, _type: string): GraphEdge
}

const filterConstructors: {
  [type: string]: GraphFilterConstructor
} = {
  "filter.conjunction": GraphConjunctionFilter,
  "filter.equals": GraphEqualsFilter,
  "filter.less-than": GraphLessThanFilter,
  "filter.greater-than": GraphGreaterThanFilter,
}

export abstract class GraphAggregateFunction extends GraphValue {}

export abstract class GraphOrder extends GraphValue {}
