import React, { ReactElement } from "react"
import "./Section.css"
import Typography from "@material-ui/core/Typography"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"

export interface InputProps {
  readonly show: boolean
  readonly children?: ReactElement
  readonly title: string
  readonly path: string[]
}

type Props = InputProps

export default function Section({
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
