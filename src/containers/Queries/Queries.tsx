import { connect } from "react-redux"
import { State } from "../../state"
import Queries, { InputProps } from "../../components/Queries/Queries"

function mapStateToProps({ parse }: State): InputProps {
  return {
    queries: parse && parse.queries,
  }
}

export default connect(mapStateToProps)(Queries)
