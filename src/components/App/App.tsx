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
import { LinearProgress } from "@material-ui/core";

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
    background: {
      default: '#f5f5f5',
      paper: '#fff'
    }
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "0.8rem",
      }
    }
  },
})

interface Props {
  updateSetState?: (setState: ((state: State) => void) | null) => void
  updateSetRequesting?: (setRequesting: ((requesting: boolean) => void) | null) => void
  updateSetQuestion?: (setQuestion: ((question: string) => void) | null) => void
}

export default function App({ updateSetState, updateSetRequesting, updateSetQuestion }: Props): ReactElement {

  const [state, setState] = useState<State>(undefined)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    updateSetState && updateSetState(setState)
    return () => updateSetState && updateSetState(null)
  }, [
    updateSetState
  ])

  useEffect(() => {
    updateSetRequesting && updateSetRequesting(setRequesting)
    return () => updateSetRequesting && updateSetRequesting(null)
  }, [
    updateSetRequesting
  ])

  async function setQuestion(question: string) {
    try {
      saveQuestion(question)
      setRequesting(true)
      const result = await parse(question)
      setRequesting(false)
      setState(result)
    } catch (e) {
      setState(e)
      setRequesting(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="sticky">
          <Toolbar>
            <Form
              setQuestion={setQuestion}
              updateSetQuestion={updateSetQuestion}
            />
          </Toolbar>
          {
            requesting
            ? <LinearProgress variant="indeterminate"/>
            : <LinearProgress variant="determinate"/>
          }
        </AppBar>
        <div className="App-body">
          <Body state={state}/>
        </div>
      </div>
    </ThemeProvider>
  )
}
