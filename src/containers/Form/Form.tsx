import { connect } from "react-redux"
import { parseQuestion, setQuestion } from "../../actions"
import { State } from "../../state"
import Form, { InputProps } from "../../components/Form/Form"

function mapStateToProps({ requesting, question }: State): InputProps {
  return {
    value: question,
    requesting,
  }
}

const mapDispatchToProps = {
  request: (question: string) => parseQuestion(question, true),
  update: (question: string) => setQuestion(question),
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)
