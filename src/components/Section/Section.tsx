import React, { PropsWithChildren, ReactElement } from "react"
import "./Section.css"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core"
import { SectionInfo } from "../SectionInfo/SectionInfo"

export interface Props {
  readonly title: string
  readonly info?: string
}

export default function Section(
  { title, children, info }: PropsWithChildren<Props>
): ReactElement {
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h6" style={{flexGrow: 1}}>{title}</Typography>
        {info && <SectionInfo info={info} />}
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}
