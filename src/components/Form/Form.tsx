import React, { ReactElement } from "react"
import "./Form.css"
import IconButton from "@material-ui/core/IconButton"
import BugReportIcon from "@material-ui/icons/BugReport"

export interface InputProps {
  readonly value: string
  readonly requesting: boolean
}

export interface OutputProps {
  readonly request: (question: string) => void
  readonly update: (question: string) => void
}

type Props = InputProps & OutputProps

export default class Form extends React.Component<Props> {
  private readonly handleChange = (
    event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement
    this.props.update(target.value)
  }

  private readonly handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.request(this.props.value)
  }

  render(): ReactElement {
    const { value } = this.props
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="FormInput"
          type="text"
          value={value}
          placeholder="Query"
          onChange={this.handleChange}
        />
        <IconButton type="submit">
          <BugReportIcon htmlColor="white" />
        </IconButton>
      </form>
    )
  }
}
