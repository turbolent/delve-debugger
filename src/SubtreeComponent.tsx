import { Token, Tree, TreeLeaf, TreeNode } from "./types";
import * as React from "react";
import "./SubtreeComponent.css";
import { ReactNode } from "react";
import TokenComponent from "./TokenComponent";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const types = ["list-question", "value", "query", "property", "filter"];

const scale = scaleOrdinal(schemeCategory10).domain(types);

interface Props {
  readonly name?: string;
  readonly type?: string;
  readonly subtype?: string;
  readonly children: (Tree | Token)[];
}

class SubtreeComponent extends React.Component<Props> {
  static renderTreeNode(node: TreeNode, key: number): ReactNode {
    return (
      <SubtreeComponent
        name={node.name}
        type={node.type}
        subtype={node.subtype}
        children={node.children}
        key={key}
      />
    );
  }

  static renderTreeLeaf(leaf: TreeLeaf, key: number): ReactNode {
    return (
      <SubtreeComponent name={leaf.name} children={leaf.tokens} key={key} />
    );
  }

  static renderToken(token: Token, key: number): ReactNode {
    return <TokenComponent token={token} key={key} />;
  }

  render() {
    const { name, type, subtype, children } = this.props;

    let nameNode;
    if (name) {
      nameNode = <div className="SubtreeName">{name}</div>;
    }

    let typeNode;
    if (type) {
      const color = scale(type);
      let style;
      if (color) {
        style = { color };
      }
      typeNode = (
        <div className="SubtreeType" style={style}>
          {type} {subtype}
        </div>
      );
    }

    const childNodes = children.map((child, key) => {
      if (child instanceof TreeNode) {
        return SubtreeComponent.renderTreeNode(child, key);
      } else if (child instanceof TreeLeaf) {
        return SubtreeComponent.renderTreeLeaf(child, key);
      } else if (child instanceof Token) {
        return SubtreeComponent.renderToken(child, key);
      }

      throw new Error("Unsupported child: " + child);
    });

    return (
      <div className="Subtree">
        {nameNode}
        {typeNode}
        <div className="SubtreeChildren">{childNodes}</div>
      </div>
    );
  }
}

export default SubtreeComponent;
