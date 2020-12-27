import * as React from "react"
import * as ReactDOM from "react-dom"

const ReversiBoard: React.FC = () => {
  const cells: number[] = []
  for (let i = 0; i < 8; i++) {
    cells.push(i)
  }

  return <article className="g-reversi-board">
    {cells.map(y => (<React.Fragment key={y}>
      {cells.map(x => (<div key={x} className="cell">
        <div className="stone" data-color={[null, "black", "white"][(y + x) % 3]} />
      </div>))}
    </React.Fragment>))}
  </article>
}

const Main: React.FC = () => {
  return <main id="main">
    <h1>Reversi</h1>
    <ReversiBoard />
  </main>
}

export const main = () => {
  const appContainerElement = document.getElementById("app-container")

  ReactDOM.render(<Main />, appContainerElement)
}
