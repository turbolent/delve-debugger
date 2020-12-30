import * as React from "react"
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceSimulation,
  Simulation,
} from "d3-force"
import { forceManyBodyReuse } from "d3-force-reuse"
import {
  GraphComponentConjunctionNode,
  GraphComponentDirectedEdge,
  GraphComponentEdge,
  GraphComponentFilterEdge,
  GraphComponentLabelNode,
  GraphComponentNode,
  GraphComponentVarLabelNode,
} from "./types"
import settings from "./settings"
import { HSLColor } from "d3-color"
import "./Graph.css"
import { Key, ReactElement } from "react"
import { select } from "d3-selection"
import { D3DragEvent, drag } from "d3-drag"
import { D3ZoomEvent, zoom } from "d3-zoom"
import Button from "@material-ui/core/Button"

interface Props {
  nodes: GraphComponentNode[]
  links: GraphComponentEdge[]
}

interface ComponentState {
  nodes: GraphComponentNode[]
  links: GraphComponentEdge[]
  width: number
  height: number
  transform?: string
}

export default class Graph extends React.Component<
  Props,
  ComponentState
> {
  private static getNextId = (() => {
    let nextId = 0
    return () => nextId++
  })()

  private force?: Simulation<GraphComponentNode, GraphComponentEdge>
  private readonly id: number

  private static getLinkDistance(edge: GraphComponentEdge): number {
    const { getLabeled, getLong } = settings.edge.distance

    const length = (edge.text && edge.text.length) || 0

    if (
      edge instanceof GraphComponentDirectedEdge ||
      edge instanceof GraphComponentFilterEdge
    ) {
      return getLabeled(length)
    }

    return getLong()
  }

  private static getEdgeStroke(edge: GraphComponentEdge): HSLColor {
    const { getDirected, getFilter, getOther } = settings.edge.color

    if (edge instanceof GraphComponentDirectedEdge) {
      return getDirected()
    }

    if (edge instanceof GraphComponentFilterEdge) {
      return getFilter()
    }

    return getOther()
  }

  private static getLinkOffset(edge: GraphComponentEdge): [number, number] {
    if (
      !(edge instanceof GraphComponentDirectedEdge) &&
      !(edge instanceof GraphComponentFilterEdge)
    ) {
      return [0, 0]
    }

    const diffX = edge.target.x - edge.source.x
    const diffY = edge.target.y - edge.source.y

    const pathLength = Math.sqrt(diffX * diffX + diffY * diffY)
    if (!pathLength) {
      return [0, 0]
    }

    const offset = settings.node.radius + settings.marker.size

    return [(diffX * offset) / pathLength, (diffY * offset) / pathLength]
  }

  private static edgePath(edge: GraphComponentEdge): string {
    const [offsetX, offsetY] = Graph.getLinkOffset(edge)
    return (
      "M" +
      [edge.source.x, edge.source.y].join(",") +
      "L" +
      [edge.target.x - offsetX, edge.target.y - offsetY].join(",")
    )
  }

  private static getNodeFill(node: GraphComponentNode): HSLColor {
    const {
      getRoot,
      getVariable,
      getLabel,
      getOther,
    } = settings.node.backgroundColor

    if (node.isRoot) {
      return getRoot()
    }

    if (node instanceof GraphComponentVarLabelNode) {
      return getVariable()
    }

    if (node instanceof GraphComponentLabelNode) {
      return getLabel()
    }

    return getOther()
  }

  private static getNodeStroke(node: GraphComponentNode): HSLColor {
    const {
      getRoot,
      getVariable,
      getLabel,
      getOther,
    } = settings.node.stroke.color

    if (node.isRoot) {
      return getRoot()
    }

    if (node instanceof GraphComponentVarLabelNode) {
      return getVariable()
    }

    if (node instanceof GraphComponentLabelNode) {
      return getLabel()
    }

    return getOther()
  }

  private static getNodeTextFill(node: GraphComponentNode): HSLColor {
    const {
      getRoot,
      getVariable,
      getConjunction,
      getLink,
      getOther,
    } = settings.node.textColor

    if (node.isRoot) {
      return getRoot()
    }

    if (node instanceof GraphComponentVarLabelNode) {
      return getVariable()
    }

    if (node instanceof GraphComponentConjunctionNode) {
      return getConjunction()
    }

    if (node.link) {
      return getLink()
    }

    return getOther()
  }

  private static getNodeTextFontWeight(
    node: GraphComponentNode
  ): string | undefined {
    if (node instanceof GraphComponentLabelNode) {
      return "bold"
    }

    return
  }

  private static getTextShadow(
    element: GraphComponentNode | GraphComponentEdge
  ): string {
    const { normal, strong } = settings.textShadow

    if (element instanceof GraphComponentLabelNode) {
      return strong
    }

    return normal
  }

  private static getEdgeStrokeDashArray(
    edge: GraphComponentEdge
  ): string | undefined {
    if (edge instanceof GraphComponentFilterEdge) {
      return settings.secondaryDashArray
    }

    return
  }

  private static getEdgeLabelFill(edge: GraphComponentEdge): HSLColor {
    const { getLink, getOther } = settings.edge.textColor

    if (edge.link) {
      return getLink()
    }

    return getOther()
  }

  private static getEdgeLabelTransform(
    edge: GraphComponentEdge,
    element: SVGGraphicsElement
  ): string {
    if (edge.target.x >= edge.source.x) {
      return "rotate(0)"
    }

    const { x, y, width, height } = element.getBBox()
    const rx = x + width / 2
    const ry = y + height / 2
    return `rotate(180 ${rx} ${ry})`
  }

  private static getNextState(props: Props): ComponentState {
    const { nodes, links } = props
    const { baseWidth, baseHeight } = settings.size
    const nodeCount = nodes.length
    const linkCount = links.length
    const width = settings.size.adjustValue(baseWidth, nodeCount, linkCount)
    const height = settings.size.adjustValue(baseHeight, nodeCount, linkCount)

    return {
      nodes,
      links,
      width,
      height,
    }
  }

  private static linkify(
    link: string | undefined,
    content: ReactElement,
    key: Key | undefined
  ): ReactElement {
    if (!link) {
      return content
    }

    return (
      <a href={link} target="_blank" rel="noreferrer" key={key}>
        {content}
      </a>
    )
  }

  constructor(props: Props) {
    super(props)

    this.id = Graph.getNextId()
    this.state = Graph.getNextState(props)
  }

  componentDidMount(): void {
    this.startForceSimulation()
  }

  componentWillUnmount(): void {
    this.stopForceSimulation()
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (
      nextProps.nodes === this.props.nodes &&
      nextProps.links === this.props.links
    ) {
      return
    }

    const nextState = Graph.getNextState(nextProps)
    this.setState(nextState, () => {
      this.stopForceSimulation()
      this.startForceSimulation()
    })
  }

  render(): ReactElement {
    const { width, height, transform } = this.state
    return (
      <div className="Graph">
        <div className="GraphBorder">
          <Button color="primary" size="small" onClick={this.relayout}>
            Improve
          </Button>
          <svg width={width} height={height} ref={(svg) => this.applyDrag(svg)}>
            <rect
              fill="none"
              pointerEvents="all"
              width={width}
              height={height}
              ref={(rect) => this.applyZoom(rect)}
            />
            <g transform={transform}>
              {this.renderEdges()}
              {this.renderMarkers()}
              {this.renderNodes()}
              {this.renderEdgeLabels()}
            </g>
          </svg>
        </div>
      </div>
    )
  }

  private getEdgePathIdentifier(index: number): string {
    return `edgepath-${this.id}-${index}`
  }

  private getMarkerId(type: string): string {
    return `end-arrow-${this.id}-${type}`
  }

  private startForceSimulation() {
    this.force = forceSimulation(this.state.nodes)
      .force(
        "charge",
        forceManyBodyReuse().strength(settings.layout.manyBodyForceStrength)
      )
      .force(
        "link",
        forceLink<GraphComponentNode, GraphComponentEdge>()
          .distance(Graph.getLinkDistance)
          .links(this.state.links)
      )
      .force("center", forceCenter(this.state.width / 2, this.state.height / 2))
      .force("collide", forceCollide(settings.layout.getCollisionRadius()))
      .alphaDecay(settings.layout.alphaDecay)

    this.forwardForceSimulation(settings.layout.initialForwardPercentage)

    this.force.on("tick", () =>
      this.setState({
        links: this.state.links,
        nodes: this.state.nodes,
      })
    )
  }

  private forwardForceSimulation(percentage = 1) {
    const { force } = this
    if (!force) {
      return
    }

    // from https://bl.ocks.org/mbostock/01ab2e85e8727d6529d20391c0fd9a16
    const n =
      Math.ceil(Math.log(force.alphaMin()) / Math.log(1 - force.alphaDecay())) *
      percentage
    for (let i = 0; i < n; ++i) {
      force.tick()
    }
  }

  private stopForceSimulation() {
    const { force } = this
    if (!force) {
      return
    }
    force.stop()
  }

  private relayout = () => {
    const { force } = this
    if (!force) {
      return
    }
    force.alpha(settings.layout.relayoutAlpha)
    force.restart()
  }

  private applyDrag(container: SVGSVGElement | null) {
    if (!container) {
      return
    }

    const component = this

    function dragStarted(
      event: D3DragEvent<SVGElement, GraphComponentNode, unknown>,
      d: GraphComponentNode
    ) {
      if (!event.active && component.force) {
        component.force.alphaTarget(settings.layout.dragAlphaTarget).restart()
      }
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(
      event: D3DragEvent<SVGElement, GraphComponentNode, unknown>,
      d: GraphComponentNode
    ) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragEnded(
      event: D3DragEvent<SVGElement, GraphComponentNode, unknown>,
      d: GraphComponentNode
    ) {
      if (!event.active && component.force) {
        component.force.alphaTarget(0)
      }
      delete d.fx
      delete d.fy
    }

    const dragBehaviour = drag<SVGGElement, GraphComponentNode>()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded)

    select(container)
      .selectAll<SVGGElement, GraphComponentNode>(".GraphNode")
      .data(this.state.nodes)
      .call(dragBehaviour)
  }

  private transformEdgeLabels(container: SVGGElement | null) {
    if (!container) {
      return
    }

    for (let index = 0; index < container.childNodes.length; index++) {
      const child = container.childNodes.item(index)
      if (!(child instanceof SVGGraphicsElement)) {
        continue
      }

      const edge = this.state.links[index]
      if (!edge) {
        continue
      }

      const transform = Graph.getEdgeLabelTransform(edge, child)
      child.setAttribute("transform", transform)
    }
  }

  private renderEdgeLabels() {
    const { labelOffsetX, labelOffsetY } = settings.edge

    return (
      <g ref={(container) => this.transformEdgeLabels(container)}>
        {this.state.links.map((edge, index) => {
          const text = (
            <text
              className="GraphEdgeLabel"
              dy={labelOffsetY}
              fontWeight="bold"
              style={{ textShadow: Graph.getTextShadow(edge) }}
              fill={Graph.getEdgeLabelFill(edge).toString()}
              key={index}
            >
              <textPath
                xlinkHref={"#" + this.getEdgePathIdentifier(index)}
                startOffset={labelOffsetX}
              >
                {edge.text}
              </textPath>
            </text>
          )
          return Graph.linkify(edge.link, text, index)
        })}
      </g>
    )
  }

  private renderMarkers() {
    const {
      color,
      size,
    }: {
      color: { [key: string]: () => HSLColor }
      size: number
    } = settings.marker
    return Object.keys(color).map((type, index) => {
      const id = this.getMarkerId(type)

      const colorFactory = color[type]

      return (
        <marker
          id={id}
          viewBox="0 -5 10 10"
          markerWidth={size}
          markerHeight={size}
          orient="auto"
          markerUnits="userSpaceOnUse"
          key={index}
        >
          <path d="M0,-5L10,0L0,5" fill={colorFactory().formatHex()} />
        </marker>
      )
    })
  }

  private renderEdges() {
    const { strokeWidth } = settings.edge

    return this.state.links.map((edge, index) => {
      const stroke = Graph.getEdgeStroke(edge)
      return (
        <path
          id={this.getEdgePathIdentifier(index)}
          d={Graph.edgePath(edge)}
          key={`line-${index}`}
          stroke={stroke.toString()}
          strokeWidth={strokeWidth}
          strokeDasharray={Graph.getEdgeStrokeDashArray(edge)}
          markerEnd={this.getEdgeMarkerEnd(edge)}
        />
      )
    })
  }

  private getEdgeMarkerEnd(edge: GraphComponentEdge): string | undefined {
    const isDirected = edge instanceof GraphComponentDirectedEdge
    const isFilter = edge instanceof GraphComponentFilterEdge
    if (!isDirected && !isFilter) {
      return
    }

    const type = isDirected ? "getDirected" : "getFilter"
    const id = this.getMarkerId(type)
    return `url(#${id})`
  }

  private renderNodes() {
    const { radius, stroke } = settings.node

    return this.state.nodes.map((node, index) => {
      const transform = `translate(${node.x}, ${node.y})`
      const text = (
        <text
          fill={Graph.getNodeTextFill(node).toString()}
          fontWeight={Graph.getNodeTextFontWeight(node)}
          style={{ textShadow: Graph.getTextShadow(node) }}
        >
          {node.text}
        </text>
      )
      return (
        <g className="GraphNode" transform={transform} key={index}>
          <circle
            r={radius}
            fill={Graph.getNodeFill(node).toString()}
            strokeWidth={stroke.width}
            stroke={Graph.getNodeStroke(node).toString()}
          />
          {Graph.linkify(node.link, text, undefined)}
        </g>
      )
    })
  }

  private applyZoom(rect: SVGRectElement | null) {
    if (!rect) {
      return
    }

    const component = this

    function zoomed(event: D3ZoomEvent<SVGRectElement, unknown>) {
      const transform = event.transform.toString()
      component.setState({ transform })
    }

    const zoomBehaviour = zoom<SVGRectElement, unknown>()
      .scaleExtent(settings.layout.scaleExtent)
      .on("zoom", zoomed)
    select(rect).call(zoomBehaviour)
  }
}
