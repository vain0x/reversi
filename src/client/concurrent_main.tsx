import * as React from "react"
import * as ReactDOM from "react-dom"
import { Dim } from "./reversi_model"
import * as M from "./reversi_model"
import { ReversiBoard } from "./reversi_view"

const DIM: Dim = 6 as Dim

const newDivisions = (): Array<M.Color | null> => {
  const divisions = []
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      divisions.push(null)
    }
  }
  return divisions
}

const getWinner = (divisions: Array<M.Color | null>): M.Color | null => {
  const at = (pos: M.Pos) => {
    const [y, x] = pos
    return divisions[y * 3 + x]
  }

  const straight = (posArray: M.Pos[]) => {
    const [p1, p2, p3] = posArray
    const color = at(p1)
    return color != null && [p2, p3].every(p => at(p) === color) ? color : null
  }

  const filterMap = <T, U>(array: T[], f: (value: T) => U): U | null => {
    for (let i = 0; i < array.length; i++) {
      const value = f(array[i])
      if (value != null) {
        return value
      }
    }
    return null
  }

  const a = [0, 1, 2]
  return filterMap(a, y => straight(a.map(x => [y, x])))
    || filterMap(a, x => straight(a.map(y => [y, x])))
    || straight(a.map(i => [i, i]))
    || straight(a.map(i => [i, 2 - i]))
}

const ConcurrentReversiContainer = () => {
  const [active, setActive] = React.useState("BLACK" as M.Color)
  const [divisions, setDivisions] = React.useState(newDivisions)

  const setDivision = React.useCallback((id: number, color: M.Color) => {
    if (divisions[id] != null) {
      return
    }

    setDivisions(divisions => divisions.map((c, i) => i == id ? color : c))
  }, [])

  const winner = React.useMemo(() =>
    getWinner(divisions),
    [divisions],
  )

  return (
    <article className="g-concurrent-reversi g-concurrent-reversi-container">
      <div className="grid">
        {divisions.map((color, id) => (
          color == null ? (
            <Division
              id={id}
              active={active}
              readonly={winner != null}
              setActive={setActive}
              setDivision={setDivision} />
          ) : (
              <div className="division">
                <div className="division-stone" data-color={color} />
              </div>
            )
        ))}
      </div>

      {winner == null ? (
        <div>
          手番: {active}
        </div>
      ) : (
          <div style={{ fontWeight: "bold" }}>
            勝者: {winner}
          </div>
        )}
    </article>
  )
}

interface DivisionProps {
  id: number
  active: M.Color
  readonly: boolean
  setActive: (update: (active: M.Color) => M.Color) => void
  setDivision: (id: number, color: M.Color) => void
}

const Division: React.FC<DivisionProps> = props => {
  const { id, active, readonly, setActive, setDivision } = props

  const [cells, setCells] = React.useState(() => M.newCells(DIM))
  const state = React.useMemo(() => {
    let s = M.compute({ dim: DIM, active, cells })

    if (readonly) {
      s = M.freeze(s)
    }

    return s
  }, [active, readonly, cells])

  const [hoveredCell, setHoveredCell] = React.useState<M.CellId | null>(null)
  const hover = React.useCallback((id: M.CellId | null) => {
    setHoveredCell(id)
  }, [])

  const put = React.useCallback((id: M.CellId) => {
    const result = M.put(cells, id, active, DIM)
    if (result != null) {
      setActive(result.updateActive)
      setCells(result.updateCells)
    }
  }, [active, cells])

  React.useEffect(() => {
    if (state.winner != null) {
      setDivision(id, state.winner)
    }
  }, [state.winner])

  return (
    <article className="g-reversi g-reversi-container">
      <ReversiBoard hoveredCell={hoveredCell} state={state} hover={hover} put={put}>
      </ReversiBoard>
    </article>
  )
}

const Main: React.FC = () => {
  return (
    <main id="main">
      <h1>Concurrent Reversi</h1>
      <ConcurrentReversiContainer />
    </main>
  )
}

export const main = () => {
  const appContainerElement = document.getElementById("app-container")

  ReactDOM.render(<Main />, appContainerElement)
}
