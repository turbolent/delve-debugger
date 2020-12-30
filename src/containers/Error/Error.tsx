import { connect } from "react-redux"
import { State } from "../../state"
import Error, { InputProps } from "../../components/Error/Error"

function mapStateToProps({ error }: State): InputProps {
  return {
    message: error || "",
  }
}

export default connect(mapStateToProps)(Error)
