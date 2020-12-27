import * as React from "react"
import * as ReactDOM from "react-dom"

const ReversiContainer: React.FC = () => {
  const whiteCount = 2
  const blackCount = 2

  return <article className="g-reversi g-reversi-container">
    <ReversiBoard />

    <div>白石 {whiteCount}</div>
    <div>黒石 {blackCount}</div>
  </article>
}

const ReversiBoard: React.FC = () => {
  const cells: number[] = []
  for (let i = 0; i < 8; i++) {
    cells.push(i)
  }

  return <article className="board">
    {cells.map(y => (
      <React.Fragment key={y}>
        {cells.map(x => (
          <div key={x} className="cell">
            <div className="stone" data-color={[null, "black", "white"][(y + x) % 3]} />
          </div>
        ))}
      </React.Fragment>
    ))}
  </article>
}

const Main: React.FC = () => {
  return <main id="main">
    <h1>Reversi</h1>
    <ReversiContainer />
  </main>
}

export const main = () => {
  const appContainerElement = document.getElementById("app-container")

  ReactDOM.render(<Main />, appContainerElement)
}
