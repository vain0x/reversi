import * as React from "react"
import * as M from "./reversi_model"
import {
  CellId,
  Color,
  Dim,
  GameStateDerived,
} from "./reversi_model"

interface ReversiContainerProps {
  dim?: Dim
}

export const ReversiContainer: React.FC<ReversiContainerProps> = props => {
  const dim = props.dim ?? M.DEFAULT_DIM

  const [active, setActive] = React.useState("BLACK" as Color)
  const [cells, setCells] = React.useState(M.newCells(dim))
  const [hoveredCell, setHoveredCell] = React.useState<CellId | null>(null)

  const state = React.useMemo(() =>
    M.compute({ dim, active, cells }),
    [dim, active, cells],
  )

  const hover = React.useCallback((id: CellId | null): void => {
    setHoveredCell(id)
  }, [])

  const put = React.useCallback((id: CellId): void => {
    const result = M.put(cells, id, active, dim)
    if (result != null) {
      setActive(result.updateActive)
      setCells(result.updateCells)
    }
  }, [dim, active, cells])

  const pass = React.useCallback(() => {
    const result = M.pass(state)
    if (result != null) {
      setActive(result.updateActive)
    }
  }, [dim, active, state])

  const { blackCount, whiteCount, passOnly, winner } = state

  return (
    <article className="g-reversi g-reversi-container">
      <Board
        state={state}
        hoveredCell={hoveredCell}
        hover={hover}
        put={put} />

      <div>黒: {blackCount}</div>
      <div>白: {whiteCount}</div>

      {winner == null ? (
        <div>
          手番: {active === "BLACK" ? "黒" : "白"}
        </div>
      ) : (
          <div className="winner">
            勝者: {winner === "BLACK" ? "黒" : "白"}
          </div>
        )}

      {passOnly ? (
        <>
          <div>
            石を置く場所がありません。
          </div>

          <button type="button" onClick={pass}>
            パス
          </button>
        </>
      ) : null}
    </article>
  )
}

interface ReversiBoardProps {
  state: GameStateDerived
  hoveredCell: CellId | null
  hover: (id: number | null) => void
  put: (id: number) => void
}

const Board: React.FC<ReversiBoardProps> = props => {
  const { state, hoveredCell, hover, put } = props
  const { active, cells, prediction } = state

  const onMouseLeave = React.useCallback(() => {
    hover(null)
  }, [hover])

  const predictionTargets = React.useMemo(() =>
    hoveredCell != null && prediction[hoveredCell] != null
      ? [
        ...prediction[hoveredCell]?.middles,
        ...prediction[hoveredCell]?.ends,
      ]
      : [],
    [hoveredCell, prediction],
  )

  return (
    <article className="board" onMouseLeave={onMouseLeave}>
      {cells.map((color, id) => {
        const isCandidate = (prediction[id]?.middles.length ?? 0) !== 0
        const isPredictionTarget = predictionTargets.includes(id)

        if (isCandidate && id === hoveredCell) {
          color = active
        }

        return (
          <Cell
            key={id}
            id={id}
            color={color}
            isCandidate={isCandidate}
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
