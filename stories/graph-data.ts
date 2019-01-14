export const graph1 = {
  type: "node",
  edge: {
    type: "edge",
    subtype: "conjunction",
    edges: [
      {
        type: "edge",
        subtype: "outgoing",
        label: {
          type: "property",
          url: "http://wikidata.org/wiki/Property:P39",
          name: "holds position"
        },
        target: {
          type: "node",
          label: {
            type: "item",
            url: "http://wikidata.org/wiki/Q30461",
            name: "president"
          }
        }
      },
      {
        type: "edge",
        subtype: "outgoing",
        label: {
          type: "property",
          url: "http://wikidata.org/wiki/Property:P569",
          name: "has date of birth"
        },
        target: {
          type: "node",
          filter: {
            type: "less-than",
            node: {
              type: "node",
              label: {
                type: "value",
                subtype: "year",
                value: 1900
              }
            }
          },
          label: {
            type: "variable",
            id: 2
          }
        }
      }
    ]
  },
  label: {
    type: "variable",
    id: 1
  }
};

export const graph2 = {
  type: "node",
  edge: {
    type: "edge",
    subtype: "conjunction",
    edges: [
      {
        type: "edge",
        subtype: "outgoing",
        label: {
          type: "property",
          url: "http://wikidata.org/wiki/Property:P31",
          name: "is instance of"
        },
        target: {
          type: "node",
          label: {
            type: "item",
            url: "http://wikidata.org/wiki/Q571",
            name: "book"
          }
        }
      },
      {
        type: "edge",
        subtype: "outgoing",
        label: {
          type: "property",
          url: "http://wikidata.org/wiki/Property:P50",
          name: "has author"
        },
        target: {
          type: "node",
          edge: {
            type: "edge",
            subtype: "outgoing",
            label: {
              type: "other",
              name: "name"
            },
            target: {
              type: "node",
              label: {
                type: "value",
                subtype: "string",
                value: "George Orwell"
              }
            }
          },
          label: {
            type: "variable",
            id: 2
          }
        }
      }
    ]
  },
  label: {
    type: "variable",
    id: 1
  }
};
