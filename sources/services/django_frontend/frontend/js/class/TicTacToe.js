class TicTacToe
{
	constructor(player1, player2)
	{
		this.board = Array(9).fill(null);
		this.player1 = player1;
		this.player2 = player2;
		this.roundActive = false;
		this.currentPlayer = this.player2.name;

		this.statusDisplay = document.getElementById('game-status');
		this.cells = document.querySelectorAll('.cell');
		this.handleGame = this.handleGame.bind(this);
	}

	init()
	{
		var gameButton = document.getElementById('game-button');
		gameButton.addEventListener('click', this.handleGame);
	}

	handleGame()
	{
		if (!this.roundActive)
		{
			this.startRound();
		}
	}

	startRound()
	{
		var gameButton = document.getElementById('game-button');
		this.roundActive = true;
		gameButton.setAttribute('class', 'd-none');
		gameButton.removeEventListener('click', this.handleGame);
		this.board = Array(9).fill(null);
		this.setupCells();
		this.switchPlayer();
	}

	setupCells()
	{
		this.cells.forEach(cell => {
			cell.addEventListener('click', (e) => this.handleCellClick(e));
			cell.setAttribute('class', 'cell col cursor-pointer mb-2');
			cell.textContent = '';
			cell.style.color = 'white';
		});
	}

	handleCellClick(clickedCellEvent)
	{
		const clickedCell = clickedCellEvent.target;
		const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

		if (this.board[clickedCellIndex] !== null || !this.roundActive) {
			return;
		}

		this.makeMove(clickedCell, clickedCellIndex);
	}

	makeMove(clickedCell, index)
	{
		this.board[index] = this.currentPlayer;
		clickedCell.textContent = this.currentPlayer === this.player1.name ? 'X' : 'O';
		clickedCell.style.color = this.currentPlayer === this.player1.name ? 'red' : 'blue';
		if (this.checkWin())
			return ;
		this.switchPlayer();
	}

	switchPlayer()
	{
		this.currentPlayer = this.currentPlayer === this.player1.name ? this.player2.name : this.player1.name;
		this.statusDisplay.textContent = this.currentPlayer + "'s turn";
	}

	checkWin()
	{
		const winningConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		];

		var win = false;
		console.clear();
		winningConditions.forEach(condition => {
			const [a, b, c] = condition;
			if (this.board[a] === this.currentPlayer && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
				this.endGame(this.currentPlayer + " wins!");
				win = true;
			}
		});
		return (win);
	}

	endGame(result)
	{
		this.roundActive = false;
		this.statusDisplay.textContent = result;
		this.cells.forEach(cell => {
			cell.removeEventListener('click', this.handleCellClick);
			cell.setAttribute('class', 'cell col mb-2');
		});
		var gameButton = document.getElementById('game-button');
		gameButton.setAttribute('class', 'btn btn-outline-primary');
		gameButton.textContent = 'Restart Game';
		gameButton.addEventListener('click', this.handleGame);

		// TODO : send result to server
	}
}
