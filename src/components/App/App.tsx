import React, { ReactElement } from "react"
import "./App.css"

import Form from "../../containers/Form/Form"
import Body from "../Body/Body"
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

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

class App extends React.Component {
  render(): ReactElement {
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
            <Body />
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default App
