import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./components/App/App"
import reportWebVitals from "./reportWebVitals"
import { State } from "./types"
import { getSavedQuestion } from "./history"
import { parse } from "./api"

let setState: ((state: State) => void) | null = null
let setRequesting: ((requesting: boolean) => void) | null = null
let setQuestion: ((question: string) => void) | null = null

ReactDOM.render(
  <React.StrictMode>
    <App
      updateSetState={(f) => { setState = f }}
      updateSetRequesting={(f) => { setRequesting = f }}
      updateSetQuestion={(f) => { setQuestion = f }}
    />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

async function loadState(state: { question: string }) {
  const question = (state && state.question) || getSavedQuestion()
  setQuestion && setQuestion(question)
  setRequesting && setRequesting(true)
  const result = await parse(question)
  setRequesting && setRequesting(false)
  setState && setState(result)
}

window.addEventListener("load", () => {
  loadState(window.history.state)
})

window.addEventListener("popstate", (event: PopStateEvent) => {
  loadState(event.state)
})

