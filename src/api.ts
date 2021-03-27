import {
  GraphEdgeLabel,
  GraphItemEdgeLabel,
  GraphItemNodeLabel,
  GraphNodeLabel,
  GraphValueNodeLabel,
  Item,
  Parse,
  registerGraphEdgeLabelConstructor,
  registerGraphNodeLabelConstructor, registerTreeNodeDecoder, TreeElementLeaf,
} from "./types"
import TreeLink from "./components/TreeLink/TreeLink"

export async function parse(question: string): Promise<Parse | undefined> {
  if (!question) {
    return
  }

  const searchParams = new URLSearchParams({
    sentence: question,
  })

  const response = await fetch("/api/parse?" + searchParams)
  if (!response.ok) {
    throw new Error(await response.text())
  }

  const data = await response.json()
  return Parse.decode(data)
}

registerTreeNodeDecoder(
  'entity.class',
  ({class: { identifier, mapping }}) =>
    [
      new TreeElementLeaf(
        TreeLink({
          identifier: `${identifier} (${mapping.id})`,
          url: `https://www.wikidata.org/wiki/Q${mapping.id}`
        })
      )
    ]
)

registerTreeNodeDecoder(
  'entity.individual-mapping',
  ({ mapping, label }) =>
    [
      new TreeElementLeaf(
        TreeLink({
          identifier: `${label} (${mapping.id})`,
          url: `https://www.wikidata.org/wiki/Q${mapping.id}`
        })
      )
    ]
)

// Parse question ontology graph provider string node label to a value node label

registerGraphNodeLabelConstructor(
  "node-label.string",
  class extends GraphNodeLabel {
    constructor(json: { string: string }, _type: string) {
      super(_type)
      return new GraphValueNodeLabel(_type, json.string)
    }
  }
)

// Parse question ontology graph provider number node label to a value node label

registerGraphNodeLabelConstructor(
  "node-label.number",
  class extends GraphNodeLabel {
    constructor(json: { number: number; unit?: string }, _type: string) {
      super(_type)
      let value = `${json.number}`
      if (json.unit) {
        value += ` ${json.unit}`
      }
      return new GraphValueNodeLabel(_type, value)
    }
  }
)

// Parse question ontology graph provider class node label to an item node label

registerGraphNodeLabelConstructor(
  "node-label.class",
  class extends GraphNodeLabel {
    constructor(json: { class: { identifier: string } }, _type: string) {
      super(_type)
      // TODO: URL
      const item = new Item(json.class.identifier)
      return new GraphItemNodeLabel(_type, item)
    }
  }
)

// Parse question ontology graph provider individual node label to an item node label

registerGraphNodeLabelConstructor(
  "node-label.individual",
  class extends GraphNodeLabel {
    constructor(json: { individual: { identifier: string } }, _type: string) {
      super(_type)
      const item = new Item(json.individual.identifier)
      return new GraphItemNodeLabel(_type, item)
    }
  }
)

// Parse question ontology graph provider entity node label

registerGraphNodeLabelConstructor(
  "node-label.entity",
  class extends GraphNodeLabel {
    constructor(json: {}, _type: string) {
      super(_type)
      // TODO:
      return new GraphValueNodeLabel(_type, "")
    }
  }
)

// Parse question ontology graph provider property edge label to an item edge label

registerGraphEdgeLabelConstructor(
  "edge-label.property",
  class extends GraphEdgeLabel {
    constructor(json: { property: { identifier: string } }, _type: string) {
      super(_type)
      const item = new Item(json.property.identifier)
      return new GraphItemEdgeLabel(_type, item)
    }
  }
)
