import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"

test("renders without crashing", () => {
  render(<App />)

  const input = screen.getByRole("textbox")
  expect(input).toBeInTheDocument()

  const button = screen.getByRole("button")
  expect(button).toBeInTheDocument()
})
