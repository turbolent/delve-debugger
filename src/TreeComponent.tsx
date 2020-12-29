import * as React from "react"
import { TreeNode } from "./types"
import { State } from "./state"
import { connect } from "react-redux"
import SubtreeComponent from "./SubtreeComponent"
import "./TreeComponent.css"
import { ReactElement } from "react"

interface StateProps {
  readonly root?: TreeNode
}

export function TreeComponent({ root }: StateProps): ReactElement | null {
  if (!root) {
    return null
  }

  return (
    <div className="Tree">
      <SubtreeComponent type={root.type}>
        {root.children}
      </SubtreeComponent>
    </div>
  )
}

const mapStateToProps = (s: State): StateProps => ({
  root: s.parse && s.parse.tree,
})

export default connect(mapStateToProps)(TreeComponent)
