import { connect } from "react-redux"
import { State } from "../../state"
import Section, { InputProps } from "../../components/Section/Section"

type Substate = { [key: string]: Substate }

function mapStateToProps(
  state: State,
  { path }: Pick<InputProps, "path">
): Pick<InputProps, "show"> {
  const reducedState = path.reduce(
    (
      currentState: Substate | undefined,
      property: string
    ): Substate | undefined => {
      if (currentState === null || currentState === undefined) {
        return
      }
      return currentState[property]
    },
    (state as unknown) as Substate
  )

  return {
    show: reducedState !== null && reducedState !== undefined,
  }
}

export default connect(mapStateToProps)(Section)
