import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { Provider } from "react-redux"
import createStore from "./store"
import { parseQuestion, setQuestion, parseActionCreator } from "./actions"
import { getSavedState, SavedState } from "./history"
import { Parse } from "./types"
import reportWebVitals from "./reportWebVitals"

const store = createStore()
const root = document.getElementById("root")

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    ,
  </React.StrictMode>,
  root
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

function loadState(state: SavedState) {
  const { question: savedQuestion, parse: savedParse } = getSavedState()

  const question = (state && state.question) || savedQuestion
  if (question) {
    store.dispatch(setQuestion(question))
  }

  if (savedParse) {
    const parse = Parse.decode(savedParse)
    store.dispatch(parseActionCreator.succeeded(parse))
  } else if (question) {
    store.dispatch(parseQuestion(question, false))
  }
}

window.addEventListener("load", () => {
  loadState(window.history.state)
})

window.addEventListener("popstate", (event: PopStateEvent) => {
  loadState(event.state)
})
