import { useState } from 'react'

const boardBuilder = boardSize => {
	const state = {
		boardSize,
		numRed: 0,
		numBlue: 0,
		nextTurn: 'red',
		winMessage: '',
		lineCoordinates: {},
		boxColors: {},
	}

	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < state.boardSize + 1; j++) {
			for (let k = 0; k < state.boardSize; k++) {
				state.lineCoordinates[`${i},${j},${k}`] = 0
			}
		}
	}

	for (let i = 0; i < state.boardSize; i++) {
		for (let j = 0; j < state.boardSize; j++) {
			state.boxColors[`${i},${j}`] = 'white'
		}
	}

	return state
}

const boardSizes = [
	{ size: 5, text: '5x5' },
	{ size: 10, text: '10x10' },
	{ size: 15, text: '15x15' },
]

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const BoardRows = ({ children, ...props }) => (
	<div {...props} children={children} />
)

const BoardElement = ({ ...props }) => <div {...props} />

const App = () => {
	const [currentBoardSize, setCurrentBoardSize] = useState(boardSizes[0].size)
	const [board, setBoard] = useState(boardBuilder(currentBoardSize))
	const [currentTurn, setcurrentTurn] = useState(board.nextTurn)

	const changeBoardSize = boardSize => {
		if (window.confirm('Are you sure you would like to start a new game?')) {
			setCurrentBoardSize(boardSize)
			setBoard(boardBuilder(boardSize))
		}
	}

	const makeBoard = boardSize => {
		const cols = []
		for (let i = 0; i <= 2 * boardSize; i++) {
			const rows = []
			for (let j = 0; j <= 2 * boardSize; j++) {
				let elementId
				if (i % 2 === 0) {
					if (j % 2 === 0) {
						elementId = `dot${Math.floor(i / 2)},${Math.floor(j / 2)}`
						rows.push(<BoardElement key={elementId} className='dot' />)
					} else {
						elementId = `0,${Math.floor(i / 2)},${Math.floor(j / 2)}`
						rows.push(
							<BoardElement
								key={elementId}
								data-coord={elementId}
								className='horizontalLine'
								style={{
									backgroundColor: selectColor(
										board.lineCoordinates[elementId]
									),
								}}
								onClick={fillLine}
								onMouseEnter={tint}
								onMouseLeave={untint}
							/>
						)
					}
				} else {
					if (j % 2 === 0) {
						elementId = `1,${Math.floor(j / 2)},${Math.floor(i / 2)}`
						rows.push(
							<BoardElement
								key={elementId}
								data-coord={elementId}
								className='verticalLine'
								style={{
									backgroundColor: selectColor(
										board.lineCoordinates[elementId]
									),
								}}
								onClick={fillLine}
								onMouseEnter={tint}
								onMouseLeave={untint}
							/>
						)
					} else {
						elementId = `box${Math.floor(i / 2)},${Math.floor(j / 2)}`
						rows.push(
							<BoardElement
								key={elementId}
								className='box'
								style={{
									backgroundColor:
										board.boxColors[
											`${Math.floor(i / 2)},${Math.floor(j / 2)}`
										],
								}}
							/>
						)
					}
				}
			}
			cols.push(<BoardRows key={i} className='row' children={rows} />)
		}
	
		return <div key='game-board' children={cols} />
	}

	return (
		<div className='conatiner'>
			<header>
				<h1>Dots &amp; Boxes</h1>
				<div className='flex-container'>
					<span className='flex-item'>Board size:</span>
					{boardSizes.map(({ size, text }, idx) => (
						<button
							key={idx}
							className={`flex-item ${
								currentBoardSize === size ? 'selected' : ''
							}`}
							onClick={() => changeBoardSize(size)}
						>
							{text}
						</button>
					))}
					<div className='flex-item'>Player&apos;s Score:</div>
					<div className='flex-item red'>{board.numRed}</div>
					<div className='flex-item blue'>{board.numBlue}</div>
				</div>
			</header>
			<div className='message'>
				{board.winMessage
					? board.winMessage
					: `${capitalize(currentTurn)}'s turn`}
			</div>
			<div className='board'>{makeBoard(currentBoardSize)}</div>
		</div>
	)
}

export default App
