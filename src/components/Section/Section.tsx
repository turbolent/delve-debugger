import React, { PropsWithChildren, ReactElement } from "react"
import "./Section.css"
import Typography from "@material-ui/core/Typography"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"

export interface Props {
  readonly title: string
}

export default function Section(
  { title, children }: PropsWithChildren<Props>
): ReactElement {
  return (
    <Card className="Section">
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {children}
      </CardContent>
    </Card>
  )
}
