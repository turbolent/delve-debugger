import { Token, Tree, TreeLeaf, TreeNode } from "./types"
import * as React from "react"
import "./SubtreeComponent.css"
import { ReactElement } from "react"
import TokenComponent from "./TokenComponent"
import { scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3-scale-chromatic"

const types = ["list-question", "value", "query", "property", "filter"]

const scale = scaleOrdinal(schemeCategory10).domain(types)

interface Props {
  readonly name?: string
  readonly type?: string
  readonly children: (Tree | Token)[]
}

class SubtreeComponent extends React.Component<Props> {
  static renderTreeNode(node: TreeNode, key: number): ReactElement {
    return (
      <SubtreeComponent name={node.name} type={node.type} key={key}>
        {node.children}
      </SubtreeComponent>
    )
  }

  static renderTreeLeaf(leaf: TreeLeaf, key: number): ReactElement {
    return (
      <SubtreeComponent name={leaf.name} key={key}>
        {leaf.tokens}
      </SubtreeComponent>
    )
  }

  static renderToken(token: Token, key: number): ReactElement {
    return <TokenComponent token={token} key={key} />
  }

  render(): ReactElement {
    const { name, type, children } = this.props

    let nameNode
    if (name) {
      nameNode = <div className="SubtreeName">{name}</div>
    }

    let typeNode
    if (type) {
      const color = scale(type)
      let style
      if (color) {
        style = { color }
      }
      typeNode = (
        <div className="SubtreeType" style={style}>
          {type}
        </div>
      )
    }

    const childNodes = children.map((child, key) => {
      if (child instanceof TreeNode) {
        return SubtreeComponent.renderTreeNode(child, key)
      } else if (child instanceof TreeLeaf) {
        return SubtreeComponent.renderTreeLeaf(child, key)
      } else if (child instanceof Token) {
        return SubtreeComponent.renderToken(child, key)
      }

      throw new Error("Unsupported child: " + child)
    })

    return (
      <div className="Subtree">
        {nameNode}
        {typeNode}
        <div className="SubtreeChildren">{childNodes}</div>
      </div>
    )
  }
}

export default SubtreeComponent
