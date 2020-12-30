import * as React from "react"
import { TreeNode } from "../../types"
import { State } from "../../state"
import { connect } from "react-redux"
import Subtree from "../Subtree/Subtree"
import "./Tree.css"
import { ReactElement } from "react"

interface StateProps {
  readonly root?: TreeNode
}

export function Tree({ root }: StateProps): ReactElement | null {
  if (!root) {
    return null
  }

  return (
    <div className="Tree">
      <Subtree type={root.type}>{root.children}</Subtree>
    </div>
  )
}

const mapStateToProps = (s: State): StateProps => ({
  root: s.parse && s.parse.tree,
})

export default connect(mapStateToProps)(Tree)
