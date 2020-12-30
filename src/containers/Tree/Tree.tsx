import { State } from "../../state"
import { connect } from "react-redux"
import Tree, { InputProps } from "../../components/Tree/Tree"

function mapStateToProps({ parse }: State): InputProps {
  return {
    root: parse && parse.tree,
  }
}

export default connect(mapStateToProps)(Tree)
