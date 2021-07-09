import { useState } from 'react'

const boardBuilder = boardSize => {
	const state = {
		boardSize,
		numRed: 0,
		numBlue: 0,
		// nextTurn: 'red',
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

const getRandomPlayerTurn = () => {
	const turns = ['red', 'blue']
	return turns[Math.floor(Math.random() * turns.length)]
}

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const BoardRows = ({ children, ...props }) => (
	<div {...props} children={children} />
)

const BoardElement = ({ ...props }) => <div {...props} />

const App = () => {
	const [currentBoardSize, setCurrentBoardSize] = useState(boardSizes[0].size)
	const [board, setBoard] = useState(boardBuilder(currentBoardSize))
	const [currentTurn, setcurrentTurn] = useState(getRandomPlayerTurn())

	const changeBoardSize = boardSize => {
		if (window.confirm('Are you sure you would like to start a new game?')) {
			setCurrentBoardSize(boardSize)
			setBoard(boardBuilder(boardSize))
			setcurrentTurn(getRandomPlayerTurn())
		}
	}

	const makeWinMessage = state => {
		return state.numRed > state.numBlue
			? 'Red wins! Select a board size to start a new game.'
			: state.numRed < state.numBlue
			? 'Blue wins! Select a board size to start a new game.'
			: 'Draw! Select a board size to start a new game.'
	}

	const checkGameOver = () => {
		setBoard(prevBorad => ({
			...prevBorad,
			winMessage:
				prevBorad.numRed + prevBorad.numBlue === prevBorad.boardSize ** 2 ||
				prevBorad.numRed > prevBorad.boardSize ** 2 / 2 ||
				prevBorad.numBlue > prevBorad.boardSize ** 2 / 2
					? makeWinMessage(prevBorad)
					: '',
		}))
	}

	const checkSquare = (j, k) => {
		const checker1 = Math.abs(board.lineCoordinates[`0,${j},${k}`])
		const checker2 = Math.abs(
			parseFloat(j) + 1 > board.boardSize
				? 0
				: board.lineCoordinates[`0,${parseFloat(j) + 1},${k}`]
		)
		const checker3 = Math.abs(board.lineCoordinates[`1,${k},${j}`])
		const checker4 = Math.abs(
			parseFloat(k) + 1 > board.boardSize
				? 0
				: board.lineCoordinates[`1,${parseFloat(k) + 1},${j}`]
		)

		return checker1 + checker2 + checker3 + checker4
	}

	const fillLine = e => {
		const currentCoord = e.target.dataset.coord

		if (board.lineCoordinates[currentCoord] === 0) {
			e.target.style.backgroundColor = currentTurn
			const lineCoordinates = board.lineCoordinates
			lineCoordinates[currentCoord] = currentTurn === 'red' ? 1 : -1
			setBoard(prevBoard => ({ ...prevBoard, lineCoordinates }))

			const splitCoord = currentCoord.split(',')
			const i = splitCoord[0]
			const j = splitCoord[1]
			const k = splitCoord[2]

			let boxColors = board.boxColors
			let madeSquare = 0

			const boxBgColor = currentTurn === 'red' ? 'lightpink' : 'lightblue'

			if (i === '0') {
				if (checkSquare(j, k) === 4) {
					madeSquare = 1
					boxColors[`${j},${k}`] = boxBgColor
					setBoard(prevBoard => ({
						...prevBoard,
						boxColors,
						numBlue:
							currentTurn === 'blue'
								? prevBoard.numBlue + 1
								: prevBoard.numBlue,
						numRed:
							currentTurn === 'red' ? prevBoard.numRed + 1 : prevBoard.numRed,
					}))
				}
				if (checkSquare(parseFloat(j) - 1, k) === 4) {
					madeSquare = 1
					boxColors[`${parseFloat(j) - 1},${k}`] = boxBgColor
					setBoard(prevBoard => ({
						...prevBoard,
						boxColors,
						numBlue:
							currentTurn === 'blue'
								? prevBoard.numBlue + 1
								: prevBoard.numBlue,
						numRed:
							currentTurn === 'red' ? prevBoard.numRed + 1 : prevBoard.numRed,
					}))
				}
			} else {
				if (checkSquare(k, j) === 4) {
					madeSquare = 1
					boxColors[`${k},${j}`] = boxBgColor
					setBoard(prevBoard => ({
						...prevBoard,
						boxColors,
						numBlue:
							currentTurn === 'blue'
								? prevBoard.numBlue + 1
								: prevBoard.numBlue,
						numRed:
							currentTurn === 'red' ? prevBoard.numRed + 1 : prevBoard.numRed,
					}))
				}
				if (checkSquare(k, parseFloat(j) - 1) === 4) {
					madeSquare = 1
					boxColors[`${k},${parseFloat(j) - 1}`] = boxBgColor
					setBoard(prevBoard => ({
						...prevBoard,
						boxColors,
						numBlue:
							currentTurn === 'blue'
								? prevBoard.numBlue + 1
								: prevBoard.numBlue,
						numRed:
							currentTurn === 'red' ? prevBoard.numRed + 1 : prevBoard.numRed,
					}))
				}
			}
			if (madeSquare === 0) {
				const nextTurn = currentTurn === 'red' ? 'blue' : 'red'
				setcurrentTurn(nextTurn)
			} else {
				checkGameOver()
			}
		}
	}

	const tint = e => {
		const currentCoord = e.target.dataset.coord
		if (board.lineCoordinates[currentCoord] === 0) {
			e.target.style.backgroundColor = currentTurn === 'red' ? 'red' : 'blue'
		}
	}

	const untint = e => {
		const currentCoord = e.target.dataset.coord
		if (board.lineCoordinates[currentCoord] === 0) {
			e.target.style.backgroundColor = 'white'
		}
	}

	const selectColor = int => {
		switch (int) {
			case 1:
				return 'red'
			case -1:
				return 'blue'
			default:
				return 'white'
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
					<div className='flex-container'>
						<div className='flex-item'>Board size:</div>
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
					</div>
					<div className='flex-container'>
						<div className='flex-item'>Player&apos;s Score:</div>
						<div className='flex-item red'>{board.numRed}</div>
						<div className='flex-item blue'>{board.numBlue}</div>
					</div>
				</div>
			</header>
			<div className='message'>
				{board.winMessage
					? board.winMessage
					: `${capitalize(currentTurn)}'s turn`}
			</div>
			<div className='board'>{makeBoard(currentBoardSize)}</div>
			<div className='min-score-txt'>
				Board min. score to win: {Math.floor(board.boardSize ** 2 / 2) + 1}
			</div>
		</div>
	)
}

export default App
