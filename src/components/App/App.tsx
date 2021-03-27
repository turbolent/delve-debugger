import React, { ReactElement, useEffect, useState } from "react"

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

import "./App.css"
import Form from "../Form/Form"
import Body from "../Body/Body"
import { State } from "../../types"
import { parse } from "../../api"
import { saveQuestion } from "../../history"

const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  palette: {
    primary: {
      light: "#6ab7ff",
      main: "#1e88e5",
      dark: "#005cb2",
      contrastText: "#fff",
    },
  },
})

interface Props {
  updateSetState: (setState: ((state: State) => void) | null) => void
  updateSetQuestion: (setQuestion: ((question: string) => void) | null) => void
}

export default function App({ updateSetState, updateSetQuestion }: Props): ReactElement {

  const [state, setState] = useState<State>(undefined)

  useEffect(() => {
    updateSetState(setState)
    return () => updateSetState(null)
  }, [
    updateSetState
  ])

  async function setQuestion(question: string) {
    try {
      saveQuestion(question)
      setState(await parse(question))
    } catch (e) {
      setState(e)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="sticky">
          <Toolbar>
            <Form setQuestion={setQuestion} updateSetQuestion={updateSetQuestion}/>
          </Toolbar>
        </AppBar>
        <div className="App-body">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Body state={state}/>
          </React.Suspense>
        </div>
      </div>
    </ThemeProvider>
  )
}
