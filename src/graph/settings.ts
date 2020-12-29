import { hsl, HSLColor } from "d3-color"

function generateShadow(
  x: number,
  y: number,
  blur: number,
  color: string
): string {
  const offsets = [
    ` ${x}px  ${y}px`,
    ` ${x}px -${y}px`,
    `-${x}px  ${y}px`,
    `-${x}px -${y}px`,
  ]

  return offsets.map((offset) => offset + ` ${blur}px ${color}`).join(", ")
}

const settings = {
  size: {
    baseWidth: 140,
    baseHeight: 100,
    adjustValue(value: number, nodeCount: number, edgeCount: number): number {
      const totalCount = nodeCount + edgeCount
      return Math.round(value * (2 + 0.2 * Math.pow(totalCount, 1.2)))
    },
  },
  layout: {
    manyBodyForceStrength: -100,
    getCollisionRadius(): number {
      return settings.node.radius * 6
    },
    initialForwardPercentage: 0.4,
    relayoutAlpha: 0.8,
    alphaDecay: 0.1,
    dragAlphaTarget: 0.1,
    scaleExtent: [0.2, 3] as [number, number],
  },
  node: {
    radius: 14,
    backgroundColor: {
      getRoot(): HSLColor {
        return hsl("#bcdd9f")
      },
      getVariable(): HSLColor {
        return hsl("#c8e4fa")
      },
      getLabel(): HSLColor {
        return hsl("#fde699")
      },
      getOther(): HSLColor {
        return hsl("#ddd")
      },
      getFilter(): HSLColor {
        return hsl("#ffc0cb")
      },
      getAggregate(): HSLColor {
        return hsl("#CE93D8").brighter(0.5)
      },
    },
    textColor: {
      getRoot(): HSLColor {
        return settings.node.backgroundColor.getRoot().darker(2)
      },
      getVariable(): HSLColor {
        return settings.node.backgroundColor.getVariable().darker(1.4)
      },
      getConjunction(): HSLColor {
        return settings.node.backgroundColor.getOther().darker(2)
      },
      getLink(): HSLColor {
        return hsl("#1e7aad")
      },
      getOther(): HSLColor {
        return hsl("#555")
      },
    },
    stroke: {
      width: 2,
      color: {
        getRoot(): HSLColor {
          return settings.node.backgroundColor.getRoot().darker(1)
        },
        getVariable(): HSLColor {
          return settings.node.backgroundColor.getVariable().darker(0.6)
        },
        getLabel(): HSLColor {
          return settings.node.backgroundColor.getLabel().darker(0.6)
        },
        getOther(): HSLColor {
          return settings.node.backgroundColor.getOther().darker(0.4)
        },
      },
    },
  },
  edge: {
    strokeWidth: 3,
    labelOffsetX: "54%",
    labelOffsetY: -4.6,
    color: {
      getDirected(): HSLColor {
        return hsl("#6abceb")
      },
      getFilter(): HSLColor {
        return settings.node.backgroundColor.getFilter().darker(0.3)
      },
      getAggregate(): HSLColor {
        return settings.node.backgroundColor.getAggregate().darker(0.3)
      },
      getOther(): HSLColor {
        return settings.node.backgroundColor.getOther().darker(0.2)
      },
    },
    textColor: {
      getLink(): HSLColor {
        return settings.node.textColor.getLink()
      },
      getOther(): HSLColor {
        return settings.node.textColor.getOther()
      },
    },
    distance: {
      getLabeled(length: number): number {
        return Math.max(100, length * 14)
      },
      getLong(): number {
        return 80
      },
    },
  },
  marker: {
    size: 12,
    color: {
      getFilter(): HSLColor {
        return settings.edge.color.getFilter()
      },
      getDirected(): HSLColor {
        return settings.edge.color.getDirected()
      },
    },
  },
  textShadow: {
    normal: generateShadow(2, 2, 4, "rgba(255, 255, 255, 0.4)"),
    strong: generateShadow(2, 2, 3, "white"),
  },
  fadeInDuration: 100,
  fadeOutDuration: 100,
  secondaryDashArray: "7,3",
}

export default settings
