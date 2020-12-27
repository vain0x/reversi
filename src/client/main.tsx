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

const EPS = 1e-6

const idToPos = (id: number): Pos => [Math.floor(id / 8 + EPS), id % 8]

const posToId = (pos: Pos): number => {
  const [y, x] = pos
  return y * 8 + x
}

const posIsValid = (pos: Pos): boolean => {
  const [y, x] = pos
  return 0 <= y && y < 8 && 0 <= x && x < 8
}

type Pos = [number, number]

const posAdd = (l: Pos, r: Pos): Pos => {
  const [l1, l2] = l
  const [r1, r2] = r
  return [l1 + r1, l2 + r2]
}

// id に石を置いたときにひっくり返る石のリスト。
const turn = (cells: Array<Color | null>, id: number, active: Color): number[] => {
  const search = (d: Pos, hit: number[]): number[] => {
    let p = idToPos(id)
    while (true) {
      p = posAdd(p, d)
      if (!posIsValid(p)) {
        return []
      }

      const i = posToId(p)
      const c = cells[i]
      if (c == null) {
        return []
      }

      if (c === active) {
        return hit
      }

      hit.push(posToId(p))
    }
  }

  if (cells[id] != null) {
    return []
  }

  const dx = [1, 1, 0, -1, -1, -1, 0, 1]
  const dy = [0, 1, 1, 1, 0, -1, -1, -1]
  const hits: number[] = []
  for (let i = 0; i < 8; i++) {
    const hit = search([dy[i], dx[i]], [])
    hits.push(...hit)
  }
  return hits
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

    const hits = turn(cells, id, active)
    if (hits.length === 0) {
      return
    }

    setCells(cells => cells.map((color, i) => (
      i === id || hits.includes(i)
        ? active
        : color)))
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

  const prediction = React.useMemo(() =>
    cells.map((_, i) => turn(cells, i, active)),
    [cells],
  )

  return <article className="g-reversi g-reversi-container">
    <Board cells={cells} prediction={prediction} put={put} />

    <div>白石 {whiteCount}</div>
    <div>黒石 {blackCount}</div>
    <div>手番: {active === "BLACK" ? "黒" : "白"}</div>
  </article>
}

interface ReversiBoardProps {
  cells: Array<Color | null>
  prediction: number[][]
  put: (id: number) => void
}

const Board: React.FC<ReversiBoardProps> = props => {
  const { cells, prediction, put } = props

  return (
    <article className="board">
      {cells.map((color, id) => (
        <Cell key={id} id={id} color={color} prediction={prediction[id]} put={put} />
      ))}
    </article>
  )
}

interface ReversiCellProps {
  id: number
  color: Color | null
  prediction: number[]
  put: (id: number) => void
}

const Cell: React.FC<ReversiCellProps> = props => {
  const { id, color, prediction, put } = props

  const onClick = React.useCallback(() => {
    put(id)
  }, [id, put])

  return (
    <div key={id} className="cell" onClick={onClick} data-can-put={prediction.length !== 0}>
      <div className="stone" data-color={color}  />
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
