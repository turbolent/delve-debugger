import { State } from "../../state"
import { connect } from "react-redux"
import Tokens, { InputProps } from "../../components/Tokens/Tokens"

function mapStateToProps({ parse }: State): InputProps {
  return {
    tokens: (parse && parse.tokens) || [],
  }
}

export default connect(mapStateToProps)(Tokens)
