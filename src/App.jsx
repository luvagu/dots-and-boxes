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

const App = () => {
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
