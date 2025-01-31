class TicTacToe
{
	static CROSS = "X";
	static NOUGHT = "O";

	constructor(player1, player2, win_condition)
	{
		this.board = Array(9).fill(null);
		this.player1 = player1;
		this.player1_symbol = TicTacToe.NOUGHT;
		this.player1_score = 0;
		this.player1_consecutive_wins = 0;
		this.player1_max_consecutive_wins = 0;
		this.player1_wins_as_crosses = 0;
		this.player1_wins_as_noughts = 0;
		this.player1_quickest_win_moves = 0;

		this.player2 = player2;
		this.player2_symbol = TicTacToe.CROSS;
		this.player2_score = 0;
		this.player2_consecutive_wins = 0;
		this.player2_max_consecutive_wins = 0;
		this.player2_wins_as_crosses = 0;
		this.player2_wins_as_noughts = 0;
		this.player2_quickest_win_moves = 0;

		this.moves_count = 0;
		this.roundActive = false;
		this.currentPlayer = this.player2.name;
		this.win_condition = win_condition;
		this.handleGame = this.handleGame.bind(this);
	}

	init()
	{
		var gameButton = document.getElementById('game-button');
		gameButton.addEventListener('click', this.handleGame);
		document.getElementById('player1').textContent = this.player1.name;
		document.getElementById('player2').textContent = this.player2.name;
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
		if (this.player1_symbol === TicTacToe.CROSS)
		{
			this.player1_symbol = TicTacToe.NOUGHT;
			this.player2_symbol = TicTacToe.CROSS;
		}
		else
		{
			this.player1_symbol = TicTacToe.CROSS;
			this.player2_symbol = TicTacToe.NOUGHT;
		}
	}

	setupCells()
	{
		document.querySelectorAll('.cell').forEach(cell => {
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
		this.moves_count += 1;
		if (this.checkWin()) {
			return;
		}
		if (this.checkDraw()) {
			this.endGame(null, "It's a draw!");
			return;
		}
		this.switchPlayer();
	}

	switchPlayer()
	{
		this.currentPlayer = this.currentPlayer === this.player1.name ? this.player2.name : this.player1.name;
		document.getElementById('game-status').textContent = this.currentPlayer + "'s turn";
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
				this.endGame(this.currentPlayer, this.currentPlayer + " wins!");
				win = true;
			}
		});
		return (win);
	}

	checkDraw()
	{
		return this.board.every(cell => cell !== null);
	}
	
	resetMatch()
	{
		this.player1_score = 0;
		this.player2_score = 0;
		this.refreshScoreboard();
		this.startRound();
	}

	refreshScoreboard()
	{
		document.getElementById('player1-score').textContent = this.player1_score;
		document.getElementById('player2-score').textContent = this.player2_score;
	}

	terminateMatch()
	{
		// TODO : send result to server
		/*
		data to send :
			user_score : int
			opponent_score : int
			user_max_consecutive_wins : int
			opponent_max_consecutive_wins : int
			user_wins_as_crosses : int
			opponent_wins_as_crosses : int
			user_wins_as_noughts : int
			opponent_wins_as_noughts : int
			user_quickest_win_as_moves : int
			opponent_quickest_win_as_moves : int
		*/
	}
}
	endGame(winner, result)
	{
		this.roundActive = false;
		document.getElementById('game-status').textContent = result;
		document.querySelectorAll('.cell').forEach(cell => {
			cell.removeEventListener('click', this.handleCellClick);
			cell.setAttribute('class', 'cell col mb-2');
		});
		if (winner)
		{
			if (winner === this.player1.name)
			{
				this.player1_score += 1;
				this.player1_consecutive_wins += 1;
				this.player2_consecutive_wins = 0;
				if (this.player1_consecutive_wins > this.player1_max_consecutive_wins)
					this.player1_max_consecutive_wins = this.player1_consecutive_wins;
				if (this.player1_symbol === TicTacToe.CROSS)
					this.player1_wins_as_crosses += 1;
				else
					this.player1_wins_as_noughts += 1;
				if (this.moves_count < this.player1_quickest_win_moves)
					this.player1_quickest_win_moves = this.moves_count;
			}
			else if (winner === this.player2.name)
			{
				this.player2_score += 1;
				this.player2_consecutive_wins += 1;
				this.player1_consecutive_wins = 0;
				if (this.player2_consecutive_wins > this.player2_max_consecutive_wins)
					this.player2_max_consecutive_wins = this.player2_consecutive_wins;
				if (this.player2_symbol === TicTacToe.CROSS)
					this.player2_wins_as_crosses += 1;
				else
					this.player2_wins_as_noughts += 1;
				if (this.moves_count < this.player2_quickest_win_moves)
					this.player2_quickest_win_moves = this.moves_count;
			}
			this.refreshScoreboard();
		}
		else
		{
			this.player1_consecutive_wins = 0;
			this.player2_consecutive_wins = 0;
		}
		this.moves_count = 0;

		var gameButton = document.getElementById('game-button');
		if (this.player1_score >= this.win_condition || this.player2_score >= this.win_condition)
			{
			this.terminateMatch();
			gameButton.setAttribute('class', 'btn btn-outline-primary');
			gameButton.textContent = 'Play a new match';
			gameButton.addEventListener('click', this.resetMatch);
		}
		else
		{
			setTimeout(() => {
				this.startRound();
			}, 3000);
		}
	}
