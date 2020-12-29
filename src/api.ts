import axios from "axios"
import {
  GraphEdgeLabel,
  GraphItemEdgeLabel,
  GraphNodeLabel,
  GraphValueNodeLabel,
  GraphItemNodeLabel,
  Item,
  Parse,
  registerGraphEdgeLabelConstructor,
  registerGraphNodeLabelConstructor,
} from "./types"

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

export type Cancel = (message?: string) => void

export const parse = (question: string): [Promise<Parse>, Cancel] => {
  const source = axios.CancelToken.source()

  const promise = axios
    .get("/api/parse", {
      params: { sentence: question },
      cancelToken: source.token,
    })
    .then((response) => Parse.decode(response.data))
    .catch((e) => {
      if (axios.isCancel(e)) {
        return
      }

      throw e
    }) as Promise<Parse>

  return [promise, source.cancel.bind(source)]
}
