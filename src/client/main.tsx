import * as React from "react"
import * as ReactDOM from "react-dom"

type Color = "WHITE" | "BLACK"

const newCells = (): Array<Color | null> => {
  const cells: Array<Color | null> = []
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      cells.push(null)
    }
  }

  const initial: [number, Color][] = [
    [27, "BLACK"],
    [28, "WHITE"],
    [35, "WHITE"],
    [36, "BLACK"],
  ]
  for (const [i, color] of initial) {
    cells[i] = color
  }
  return cells
}

const ReversiContainer: React.FC = () => {
  const whiteCount = 2
  const blackCount = 2

  const active: Color = "BLACK"

  const [cells, setCells] = React.useState(newCells())

  return <article className="g-reversi g-reversi-container">
    <Board cells={cells} />

    <div>白石 {whiteCount}</div>
    <div>黒石 {blackCount}</div>
    <div>手番: {active === "BLACK" ? "黒" : "白"}</div>
  </article>
}

interface ReversiBoardProps {
  cells: Array<Color | null>
}

const Board: React.FC<ReversiBoardProps> = props => {
  const { cells } = props

  return (
    <article className="board">
      {cells.map((color, id) => (
        <Cell key={id} id={id} color={color} />
      ))}
    </article>
  )
}

interface ReversiCellProps {
  id: number
  color: Color | null
}

const Cell: React.FC<ReversiCellProps> = props => {
  const { id, color } = props
  return (
    <div key={id} className="cell">
      <div className="stone" data-color={color} />
    </div>
  )
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
