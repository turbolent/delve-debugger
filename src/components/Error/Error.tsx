import React, { ReactElement } from "react"
import "./Error.css"

export interface InputProps {
  readonly message: string
}

type Props = InputProps

export default function Error({ message }: Props): ReactElement {
  return <div className="Error">{message}</div>
}
