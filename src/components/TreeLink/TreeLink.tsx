import { Link, Typography } from "@material-ui/core"
import React, { ReactElement } from "react"

interface Props {
  identifier: string
  url?: string
}

export default function TreeLink({ identifier, url }: Props): ReactElement {
  return <strong>
    {url
      ? <Link href={url} target="_blank" rel="noreferrer">{identifier}</Link>
      : <Typography variant="inherit" color="primary">{identifier}</Typography>
    }
  </strong>
}
