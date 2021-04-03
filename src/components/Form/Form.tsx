import React, { FormEvent, ReactElement, useEffect, useState } from "react"
import "./Form.css"
import IconButton from "@material-ui/core/IconButton"
import BugReportIcon from "@material-ui/icons/BugReport"

interface Props {
  setQuestion: (question: string) => void,
  updateSetQuestion?: (setQuestion: ((question: string) => void) | null) => void
}

export default function Form({ setQuestion, updateSetQuestion }: Props): ReactElement {

  const [value, setValue] = useState("")

  useEffect(() => {
    updateSetQuestion && updateSetQuestion(setValue)
    return () => updateSetQuestion && updateSetQuestion(null)
  }, [
    updateSetQuestion
  ])

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setQuestion(value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="FormInput"
        type="text"
        value={value}
        placeholder="Query"
        onChange={e => setValue(e.target.value)}
      />
      <IconButton type="submit">
        <BugReportIcon htmlColor="white" />
      </IconButton>
    </form>
  )
}