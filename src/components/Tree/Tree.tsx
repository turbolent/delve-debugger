import React, { ReactElement } from "react"
import "./Tree.css"
import { TreeNode } from "../../types"
import Subtree from "../../components/Subtree/Subtree"

export interface InputProps {
  readonly root?: TreeNode
}

type Props = InputProps

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
