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

type FlipResult = {
  middles: number[]
  ends: number[]
}

// id に石を置いたときにひっくり返る石のリスト。
const flippedCells = (cells: Array<Color | null>, id: number, active: Color): FlipResult | null => {
  const search = (d: Pos, middles: number[]): FlipResult | null => {
    let p = idToPos(id)
    while (true) {
      p = posAdd(p, d)
      if (!posIsValid(p)) {
        return null
      }

      const i = posToId(p)
      const c = cells[i]
      if (c == null) {
        return null
      }

      if (c === active) {
        if (middles.length == 0) {
          return null
        }
        return { middles, ends: [i] }
      }

      middles.push(posToId(p))
    }
  }

  if (cells[id] != null) {
    return null
  }

  const dx = [1, 1, 0, -1, -1, -1, 0, 1]
  const dy = [0, 1, 1, 1, 0, -1, -1, -1]
  const middles: number[] = []
  const ends: number[] = []
  for (let i = 0; i < 8; i++) {
    const result = search([dy[i], dx[i]], [])
    if (result != null) {
      middles.push(...result.middles)
      ends.push(...result.ends)
    }
  }

  if (middles.length === 0) {
    return null
  }
  return { middles: middles, ends }
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

  const [hoveredCell, setHoveredCell] = React.useState<number | null>(null)

  const hover = React.useCallback((id: number | null): void => {
    setHoveredCell(id)
  }, [])

  const put = React.useCallback((id: number): void => {
    // すでに石があったら置けない
    if (cells[id] != null) {
      return
    }

    const result = flippedCells(cells, id, active)
    if (result == null) {
      return
    }

    setCells(cells => cells.map((color, i) => (
      i === id || result.middles.includes(i)
        ? active
        : color)))
    setActive(flipColor(active))
  }, [active, cells])

  const whiteCount = React.useMemo(() =>
    cells.filter(c => c === "WHITE").length,
    [cells],
  )

  const blackCount = React.useMemo(() =>
    cells.filter(c => c === "BLACK").length,
    [cells],
  )

  const prediction = React.useMemo(() =>
    cells.map((_, i) => flippedCells(cells, i, active)),
    [active, cells],
  )

  const passOnly = React.useMemo(() =>
    prediction.every(result => result == null),
    [prediction],
  )

  const pass = React.useCallback(() => {
    if (passOnly) {
      setActive(flipColor(active))
    }
  }, [active, passOnly])

  return <article className="g-reversi g-reversi-container">
    <Board
      active={active}
      cells={cells}
      prediction={prediction}
      hoveredCell={hoveredCell}
      hover={hover}
      put={put} />

    <div>白石 {whiteCount}</div>
    <div>黒石 {blackCount}</div>
    <div>手番: {active === "BLACK" ? "黒" : "白"}</div>

    {passOnly ? (
      <>
        <div>
          石を置く場所がありません。
        </div>

        <button type="button" onClick={pass}>
          パス
        </button>
      </>
    ) : null }
  </article>
}

interface ReversiBoardProps {
  active: Color
  cells: Array<Color | null>
  prediction: (FlipResult | null)[]
  hoveredCell: number | null
  hover: (id: number | null) => void
  put: (id: number) => void
}

const Board: React.FC<ReversiBoardProps> = props => {
  const { active, cells, prediction, hoveredCell, hover, put } = props

  const onMouseLeave = React.useCallback(() => {
    hover(null)
  }, [hover])

  const hoveredMiddles = React.useMemo(() =>
    hoveredCell != null && prediction[hoveredCell] != null
      ? prediction[hoveredCell]?.middles ?? []
      : [],
    [hoveredCell, prediction],
  )

  const hoveredEnds = React.useMemo(() =>
    hoveredCell != null && prediction[hoveredCell] != null
      ? prediction[hoveredCell]?.ends ?? []
      : [],
    [hoveredCell, prediction],
  )

  return (
    <article className="board" onMouseLeave={onMouseLeave}>
      {cells.map((color, id) => {
        const isPredictionTarget = hoveredMiddles.includes(id) || hoveredEnds.includes(id)

        return (
          <Cell
            key={id}
            id={id}
            color={color}
            isCandidate={(prediction[id]?.middles.length ?? 0) !== 0}
            isPredictionTarget={isPredictionTarget}
            hover={hover}
            put={put} />
        )
      })}
    </article>
  )
}

interface ReversiCellProps {
  id: number
  color: Color | null
  isCandidate: boolean
  isPredictionTarget: boolean
  hover: (id: number | null) => void
  put: (id: number) => void
}

const Cell: React.FC<ReversiCellProps> = props => {
  const { id, color, isCandidate, isPredictionTarget, hover, put } = props

  const onClick = React.useCallback(() => {
    put(id)
  }, [id, put])

  const onMouseEnter = React.useCallback(() => {
    hover(id)
  }, [id, hover])

  return (
    <div
      key={id}
      className="cell"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      data-is-candidate={isCandidate}
      data-is-prediction-target={isPredictionTarget}>
      <div
        className="stone"
        data-color={color} />
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
