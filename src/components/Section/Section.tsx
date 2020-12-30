import * as React from "react"
import { ReactElement } from "react"
import { connect } from "react-redux"
import { State } from "../../state"
import Typography from "@material-ui/core/Typography"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import "./Section.css"

interface StateProps {
  readonly show: boolean
}

interface OwnProps {
  readonly children?: ReactElement
  readonly title: string
  readonly path: string[]
}

type Props = StateProps & OwnProps

function Section({
  title,
  show,
  children,
}: Props): ReactElement | null {
  if (!show) {
    return null
  }

  return (
    <Card className="Section">
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {children}
      </CardContent>
    </Card>
  )
}

type Substate = { [key: string]: Substate }

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  const reducedState = ownProps.path.reduce(
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
