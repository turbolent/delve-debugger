import React, { ReactElement } from "react"
import "./Tree.css"
import { TreeNode } from "../../types"
import Subtree from "../../components/Subtree/Subtree"

interface Props {
  readonly root?: TreeNode
}

export default function Tree({ root }: Props): ReactElement | null {
  if (!root) {
    return null
  }

  return (
    <div className="Tree">
      <Subtree type={root.type}>{root.children}</Subtree>
    </div>
  )
}
