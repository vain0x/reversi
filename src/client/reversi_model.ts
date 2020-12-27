// リバーシモデル

const EPS = 1e-6

const exhaust = (never: never): never => never

// -----------------------------------------------
// Dim
// -----------------------------------------------

/**
 * 盤面の大きさ (通常は 8)
 */
export type Dim = number & { [IS_DIM]: true }

declare const IS_DIM: unique symbol

export const DEFAULT_DIM: Dim = 8 as Dim

// -----------------------------------------------
// Color
// -----------------------------------------------

export type Color = "WHITE" | "BLACK"

export const flipColor = (color: Color): Color => {
  switch (color) {
    case "WHITE":
      return "BLACK"

    case "BLACK":
      return "WHITE"

    default:
      throw exhaust(color)
  }
}

// -----------------------------------------------
// Pos
// -----------------------------------------------

/**
 * セル番号 (左上から数える)
 */
export type CellId = number

/**
 * 位置 (行番号、列番号)
 */
export type Pos = [number, number]

const idToPos = (id: CellId, dim: Dim): Pos => {
  const y = Math.floor(id / dim + EPS)
  const x = id % dim
  return [y, x]
}

const posToId = (pos: Pos, dim: Dim): CellId => {
  const [y, x] = pos
  return y * dim + x
}

const posIsValid = (pos: Pos, dim: Dim): boolean => {
  const [y, x] = pos
  return 0 <= y && y < dim && 0 <= x && x < dim
}

const posAdd = (l: Pos, r: Pos): Pos => {
  const [l1, l2] = l
  const [r1, r2] = r
  return [l1 + r1, l2 + r2]
}

// -----------------------------------------------
// newCells
// -----------------------------------------------

export const newCells = (dim: Dim): Cells => {
  const cells: Cells = []
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      cells.push(null)
    }
  }

  const k = (dim - 2) / 2
  const initial: [CellId, Color][] = [
    [posToId([k + 0, k + 0], dim), "BLACK"],
    [posToId([k + 0, k + 1], dim), "WHITE"],
    [posToId([k + 1, k + 0], dim), "WHITE"],
    [posToId([k + 1, k + 1], dim), "BLACK"],
  ]
  for (const [i, color] of initial) {
    cells[i] = color
  }
  return cells
}

// -----------------------------------------------
// flip
// -----------------------------------------------

export type FlipResult = {
  middles: CellId[]
  ends: CellId[]
}

type Cells = Array<Color | null>

const EMPTY_FLIP_RESULT: FlipResult = {
  middles: [],
  ends: [],
}

/**
 * id に石を置いたときにひっくり返る石のリスト。
 */
const flippedCells = (cells: Cells, id: CellId, active: Color, dim: Dim): FlipResult | null => {
  const search = (d: Pos, middles: CellId[]): FlipResult | null => {
    let p = idToPos(id, dim)
    while (true) {
      p = posAdd(p, d)
      if (!posIsValid(p, dim)) {
        return null
      }

      const i = posToId(p, dim)
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

      middles.push(posToId(p, dim))
    }
  }

  if (cells[id] != null) {
    return null
  }

  const dx = [1, 1, 0, -1, -1, -1, 0, 1]
  const dy = [0, 1, 1, 1, 0, -1, -1, -1]
  const middles: CellId[] = []
  const ends: CellId[] = []
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
  return { middles, ends }
}

// -----------------------------------------------
// put
// -----------------------------------------------

interface PutResult {
  updateActive: (active: Color) => Color
  updateCells: (cells: Cells) => Cells
}

export const put = (cells: Cells, id: number, active: Color, dim: Dim): PutResult | null => {
  // すでに石があったら置けない
  if (cells[id] != null) {
    return null
  }

  const result = flippedCells(cells, id, active, dim)
  if (result == null) {
    return null
  }

  return {
    updateActive: flipColor,
    updateCells: cells => cells.map((color, i) => (
      i === id || result.middles.includes(i)
        ? active
        : color
    )),
  }
}

interface PassResult {
  updateActive: (active: Color) => Color
}

export const pass = (state: GameStateDerived): PassResult | null => {
  if (!state.passOnly) {
    return null
  }

  return {
    updateActive: flipColor,
  }
}

// -----------------------------------------------
// GameState
// -----------------------------------------------

interface GameState {
  dim: Dim
  active: Color
  cells: Cells
}

export interface GameStateDerived extends GameState {
  passOnly: boolean
  blackCount: number
  whiteCount: number
  winner: Color | null
  prediction: FlipResult[]
}

const getWinner = (blackCount: number, whiteCount: number, dim: Dim): Color | null => {
  if (blackCount == 0) {
    return "WHITE"
  }

  if (whiteCount === 0) {
    return "BLACK"
  }

  // 同数のときは後手の勝ち。
  if (blackCount + whiteCount === dim * dim) {
    return blackCount > whiteCount ? "BLACK" : "WHITE"
  }

  return null
}

export const compute = (state: GameState): GameStateDerived => {
  const { dim, active, cells } = state

  const blackCount = cells.filter(c => c === "BLACK").length
  const whiteCount = cells.filter(c => c === "WHITE").length

  const winner = getWinner(blackCount, whiteCount, dim)

  const prediction: GameStateDerived["prediction"] = winner == null
    ? cells.map((_, i) => flippedCells(cells, i, active, dim) ?? EMPTY_FLIP_RESULT)
    : cells.map(() => EMPTY_FLIP_RESULT)

  const passOnly =
    winner == null
    && prediction.every(result => result.middles.length === 0 && result.ends.length === 0)

  return {
    ...state,
    blackCount,
    whiteCount,
    prediction,
    passOnly,
    winner,
  }
}
