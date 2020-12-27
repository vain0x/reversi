import * as React from "react"
import * as ReactDOM from "react-dom"

type Color = "WHITE" | "BLACK"

const exhaust = (never: never): never => never

const flipColor = (color: Color): Color => {
  switch (color) {
    case "WHITE":
      return "BLACK"

    case "BLACK":
      return "WHITE"

    default:
      throw exhaust(color)
  }
}

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

  const [active, setActive] = React.useState("BLACK" as Color)
  const [cells, setCells] = React.useState(newCells())

  const put = React.useCallback((id: number): void => {
    // すでに石があったら置けない
    if (cells[id] != null) {
      return
    }

    setCells(cells => cells.map((color, i) => i === id ? active : color))
    setActive(flipColor(active))
  }, [cells])

  const whiteCount = React.useMemo(() =>
    cells.filter(c => c === "WHITE").length,
    [cells],
  )

  const blackCount = React.useMemo(() =>
    cells.filter(c => c === "BLACK").length,
    [cells],
  )

  return <article className="g-reversi g-reversi-container">
    <Board cells={cells} put={put} />

    <div>白石 {whiteCount}</div>
    <div>黒石 {blackCount}</div>
    <div>手番: {active === "BLACK" ? "黒" : "白"}</div>
  </article>
}

interface ReversiBoardProps {
  cells: Array<Color | null>
  put: (id: number) => void
}

const Board: React.FC<ReversiBoardProps> = props => {
  const { cells, put } = props

  return (
    <article className="board">
      {cells.map((color, id) => (
        <Cell key={id} id={id} color={color} put={put} />
      ))}
    </article>
  )
}

interface ReversiCellProps {
  id: number
  color: Color | null
  put: (id: number) => void
}

const Cell: React.FC<ReversiCellProps> = props => {
  const { id, color, put } = props

  const onClick = React.useCallback(() => {
    put(id)
  }, [id, put])

  return (
    <div key={id} className="cell" onClick={onClick}>
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
