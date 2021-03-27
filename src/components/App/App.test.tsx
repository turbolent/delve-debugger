import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"
import { RecoilRoot } from "recoil"

test("renders without crashing", () => {
  render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
  )

  const input = screen.getByRole("textbox")
  expect(input).toBeInTheDocument()

  const button = screen.getByRole("button")
  expect(button).toBeInTheDocument()
})
