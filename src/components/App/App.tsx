import React, { ReactElement } from "react"

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

import "./App.css"
import Form from "../Form/Form"
import Body from "../Body/Body"

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

export default function App(): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="sticky">
          <Toolbar>
            <Form />
          </Toolbar>
        </AppBar>
        <div className="App-body">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Body/>
          </React.Suspense>
        </div>
      </div>
    </ThemeProvider>
  )
}
