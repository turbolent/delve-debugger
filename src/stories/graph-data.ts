export const graph1 = {
  type: "node",
  edge: {
    type: "edge.conjunction",
    edges: [
      {
        type: "edge.out",
        label: {
          type: "edge-label.property",
          property: {
            identifier: "holds_position"
          }
        },
        target: {
          type: "node",
          label: {
            type: "node-label.class",
            class: {
              identifier: "president"
            }
          }
        }
      },
      {
        type: "edge.out",
        label: {
          type: "edge-label.property",
          property: {
            identifier: "date_of_birth"
          }
        },
        target: {
          type: "node",
          filter: {
            type: "filter.less-than",
            node: {
              type: "node",
              label: {
                type: "node-label.number",
                number: 1900
              }
            }
          },
          label: {
            type: "node-label.variable",
            id: 2
          }
        }
      }
    ]
  },
  label: {
    type: "node-label.variable",
    id: 1
  }
};

export const graph2 = {
  type: "node",
  edge: {
    type: "edge.conjunction",
    edges: [
      {
        type: "edge.out",
        label: {
          type: "edge-label.property",
          property: {
            identifier: "is_instance_of"
          }
        },
        target: {
          type: "node",
          label: {
            type: "node-label.class",
            class: {
              identifier: "book"
            }
          }
        }
      },
      {
        type: "edge.out",
        label: {
          type: "edge-label.property",
          property: {
            identifier: "has_author"
          }
        },
        target: {
          type: "node",
          edge: {
            type: "edge.out",
            label: {
              type: "edge-label.property",
              property: {
                identifier: "name"
              }
            },
            target: {
              type: "node",
              label: {
                type: "node-label.string",
                string: "George Orwell"
              }
            }
          },
          label: {
            type: "node-label.variable",
            id: 2
          }
        }
      }
    ]
  },
  label: {
    type: "node-label.variable",
    id: 1
  }
};
