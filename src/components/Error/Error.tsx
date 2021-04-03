import React, { ReactElement } from "react"
import "./Error.css"

interface Props {
  readonly message: string
}

export default function Error({ message }: Props): ReactElement {
  return <div className="Error">{message}</div>
}
