const App = () => {
	return (
		<div className='conatiner'>
			<header>
				<h1>Dots &amp; Boxes</h1>
				<div className='flex-container'>
					<span className='flex-item'>Board size:</span>
					{/* buttons */}
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
