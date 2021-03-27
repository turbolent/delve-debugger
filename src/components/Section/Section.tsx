import React, { PropsWithChildren, ReactElement } from "react"
import "./Section.css"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core"

export interface Props {
  readonly title: string
}

export default function Section(
  { title, children }: PropsWithChildren<Props>
): ReactElement {
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}
