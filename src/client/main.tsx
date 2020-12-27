import * as React from "react"
import * as ReactDOM from "react-dom"

type Color = "WHITE" | "BLACK"

const ReversiContainer: React.FC = () => {
  const whiteCount = 2
  const blackCount = 2

  const active: Color = "BLACK"





  return <article className="g-reversi g-reversi-container">
    <ReversiBoard />

    <div>白石 {whiteCount}</div>
    <div>黒石 {blackCount}</div>
    <div>手番: {active === "BLACK" ? "黒" : "白"}</div>
  </article>
}

const ReversiBoard: React.FC = () => {
  const cells: number[] = []
  for (let i = 0; i < 8; i++) {
    cells.push(i)
  }

  return (
    <article className="board">
      {cells.map(y => (
        <React.Fragment key={y}>
          {cells.map(x => {
            const id = y * 3 + x
            const color = [null, "BLACK", "WHITE"][(y + x) % 3] as Color | null
            return (<Cell id={id} color={color} />)
          })}
        </React.Fragment>
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
