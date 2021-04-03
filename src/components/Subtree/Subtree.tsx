import { Token, Tree, TreeTokensLeaf, TreeNode, TreeElementLeaf } from "../../types"
import React from "react"
import "./Subtree.css"
import { ReactElement } from "react"
import TokenComponent from "../Token/Token"
import { scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3-scale-chromatic"

const types = ["list-question", "value", "query", "property", "filter"]

const scale = scaleOrdinal(schemeCategory10).domain(types)

interface Props {
  readonly name?: string
  readonly type?: string
  readonly children: (Tree | Token)[]
}

class Subtree extends React.Component<Props> {
  static renderTreeNode(node: TreeNode, key: number): ReactElement {
    return (
      <Subtree name={node.name} type={node.type} key={key}>
        {node.children}
      </Subtree>
    )
  }

  static renderTreeTokensLeaf(leaf: TreeTokensLeaf, key: number): ReactElement {
    return (
      <Subtree name={leaf.name} key={key}>
        {leaf.tokens}
      </Subtree>
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
        return Subtree.renderTreeNode(child, key)
      } else if (child instanceof TreeTokensLeaf) {
        return Subtree.renderTreeTokensLeaf(child, key)
      } else if (child instanceof TreeElementLeaf) {
        return <div key={key}>{child.element}</div>
      } else {
        return Subtree.renderToken(child, key)
      }
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

export default Subtree
