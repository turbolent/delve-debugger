import React, { FormEvent, ReactElement, useState } from "react"
import "./Form.css"
import IconButton from "@material-ui/core/IconButton"
import BugReportIcon from "@material-ui/icons/BugReport"
import { useRecoilState } from "recoil"
import { questionState } from "../../state"

export default function Form(): ReactElement {

  const [question, setQuestion] = useRecoilState(questionState);

  const [value, setValue] = useState(question)

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
