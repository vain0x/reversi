import * as React from "react"
import * as ReactDOM from "react-dom"

const Main: React.FC = () => {
  return <>
    Hello, world!
  </>
}

export const main = () => {
  const appContainerElement = document.getElementById("app-container")

  ReactDOM.render(<Main />, appContainerElement)
}
