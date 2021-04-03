import React, { ReactElement } from "react"
import { Tooltip } from "@material-ui/core"
import InfoIcon from "@material-ui/icons/InfoOutlined"
import "./SectionInfo.css"

export function SectionInfo({ info }: { info: string}): ReactElement {
  return <div className="SectionInfo">
    <Tooltip title={info}>
      <InfoIcon color="action"/>
    </Tooltip>
  </div>
}