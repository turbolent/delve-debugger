import {
    GraphEdgeLabel,
    GraphItemEdgeLabel,
    GraphItemNodeLabel,
    GraphNodeLabel,
    GraphValueNodeLabel,
    Item,
    Parse,
    registerGraphEdgeLabelConstructor,
    registerGraphNodeLabelConstructor,
    registerTreeNodeDecoder, State,
    TreeElementLeaf,
} from "./types"
import TreeLink from "./components/TreeLink/TreeLink"
import { Wikidata } from "./wikidata"

export async function request(
    question: string,
    setRequesting?: (requesting: boolean) => void,
    setState?: (state: State) => void
): Promise<void> {
    setRequesting && setRequesting(true)
    try {
        const result = await parse(question)
        setRequesting && setRequesting(false)
        setState && setState(result)
    } catch (e) {
        setRequesting && setRequesting(false)
        setState && setState(e)
    }
}

async function parse(question: string): Promise<Parse | undefined> {
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
  ({class: { identifier, mapping }}) => {
    const url = mapping
      ? Wikidata.getItemURL(mapping.id)
      : undefined
    const identifier1 = mapping
      ? `${identifier} (${mapping.id})`
      : identifier
    return [
      new TreeElementLeaf(
        TreeLink({
          identifier: identifier1,
          url: url,
        }),
      ),
    ]
  }
)

registerTreeNodeDecoder(
  'entity.individual-mapping',
  ({ mapping, label }) =>
    [
      new TreeElementLeaf(
        TreeLink({
          identifier: `${label} (${mapping.id})`,
          url: Wikidata.getItemURL(mapping.id)
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
    constructor(json: { class: { identifier: string, mapping?: { id: number } } }, _type: string) {
      super(_type)
      const { identifier, mapping } = json.class
      const url = mapping
        ? Wikidata.getItemURL(mapping.id)
        : undefined
      const item = new Item(identifier, url)
      return new GraphItemNodeLabel(_type, item)
    }
  }
)

// Parse question ontology graph provider individual node label to an item node label

registerGraphNodeLabelConstructor(
  "node-label.individual",
  class extends GraphNodeLabel {
    constructor(json: { individual: { identifier: string, mapping?: { id: number } } }, _type: string) {
      super(_type)
      const { identifier, mapping } = json.individual
      const url = mapping
        ? Wikidata.getItemURL(mapping.id)
        : undefined
      const item = new Item(identifier, url)
      return new GraphItemNodeLabel(_type, item)
    }
  }
)

// Parse question ontology graph provider entity node label

registerGraphNodeLabelConstructor(
  "node-label.entity",
  class extends GraphNodeLabel {
    constructor(json: { string: string, entity: { id: number } }, _type: string) {
      super(_type)
      const { string, entity } = json
      const url = Wikidata.getItemURL(entity.id)
      const item = new Item(string, url)
      return new GraphItemNodeLabel(_type, item)
    }
  }
)

// Parse question ontology graph provider property edge label to an item edge label

registerGraphEdgeLabelConstructor(
  "edge-label.property",
  class extends GraphEdgeLabel {
    constructor(json: { property: { identifier: string, mapping?: { id: number } } }, _type: string) {
      super(_type)
      const { identifier, mapping } = json.property
      const url = mapping
        ? Wikidata.getPropertyURL(mapping.id)
        : undefined
      const item = new Item(identifier, url)
      return new GraphItemEdgeLabel(_type, item)
    }
  }
)
