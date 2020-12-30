import { connect } from "react-redux"
import { State } from "../../state"
import Graphs, { InputProps } from "../../components/Graphs/Graphs"
import { GraphNode } from "../../types"

function mapStateToProps(
  { parse }: State,
  { parseProperty }: Pick<InputProps, "parseProperty">
): Pick<InputProps, "graphNodes"> {
  return {
    graphNodes: parse && (parse[parseProperty] as GraphNode[]),
  }
}

export default connect(mapStateToProps)(Graphs)
