import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"
import { Provider } from "react-redux";
import createStore from "./store";

test("renders without crashing", () => {
  const store = createStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )

  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()
})
