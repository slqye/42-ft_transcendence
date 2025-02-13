class TicTacToe
{
	static CROSS = "X";
	static NOUGHT = "O";

	constructor(player1, player2, win_condition, tournament_id = -1)
	{
		this.board = Array(9).fill(null);

		this.player1 = player1;
		this.player1.symbol = TicTacToe.NOUGHT;
		this.player2 = player2;
		this.player2.symbol = TicTacToe.CROSS;

		this.moves_count = 0;
		this.roundActive = false;
		this.currentPlayer = this.player2.name;
		this.win_condition = win_condition;
		this.tournament_id = tournament_id;
		this.match_id = -1;
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
		if (this.player1.symbol === TicTacToe.CROSS)
		{
			this.player1.symbol = TicTacToe.NOUGHT;
			this.player2.symbol = TicTacToe.CROSS;
		}
		else
		{
			this.player1.symbol = TicTacToe.CROSS;
			this.player2.symbol = TicTacToe.NOUGHT;
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
	
	resetPlayerVariables()
	{
		this.player1.score = 0;
		this.player1.consecutive_wins = 0;
		this.player1.max_consecutive_wins = 0;
		this.player1.wins_as_crosses = 0;
		this.player1.wins_as_noughts = 0;
		this.player1.quickest_win_moves = 0;
		this.player2.score = 0;
		this.player2.consecutive_wins = 0;
		this.player2.max_consecutive_wins = 0;
		this.player2.wins_as_crosses = 0;
		this.player2.wins_as_noughts = 0;
		this.player2.quickest_win_moves = 0;
	}

	resetMatch()
	{
		this.resetPlayerVariables();
		this.refreshScoreboard();
		this.startRound();
	}

	refreshScoreboard()
	{
		document.getElementById('player1-score').textContent = this.player1.score;
		document.getElementById('player2-score').textContent = this.player2.score;
	}

	setGameButtonToReplay()
	{
		var gameButton = document.getElementById('game-button');
		gameButton.setAttribute('class', 'btn btn-outline-primary');
		gameButton.textContent = 'Play a new match';
		gameButton.addEventListener('click', this.resetMatch);
	}

	async terminateMatch()
	{
		let opponent = null;
		try
		{
			opponent = await fetch_opponent();
			if (!opponent)
				throw new Error();
		}
		catch (error)
		{
			this.setGameButtonToReplay();
			return new Toast("An opponent must be logged in to play a game.");
		}
		let result = this.player1.score > this.player2.score ? 0 : 1;
		if (this.player1.score === this.player2.score)
			result = 2;
		const request_body = JSON.stringify({
			"opponent_user_id": opponent.id,
			"is_pong": false,
			"result": result,
			"tournament_id": this.tournament_id !== -1 ? this.tournament_id : null,
			"tictactoe_game_stats": {
				"user_score": this.player1.score,
				"opponent_score": this.player2.score,
				"user_max_consecutive_wins": this.player1.max_consecutive_wins,
				"opponent_max_consecutive_wins": this.player2.max_consecutive_wins,
				"user_wins_as_crosses": this.player1.wins_as_crosses,
				"opponent_wins_as_crosses": this.player2.wins_as_crosses,
				"user_wins_as_noughts": this.player1.wins_as_noughts,
				"opponent_wins_as_noughts": this.player2.wins_as_noughts,
				"user_quickest_win_as_moves": this.player1.quickest_win_moves,
				"opponent_quickest_win_as_moves": this.player2.quickest_win_moves
			}
		});
		const request = await new Api("/api/invitations/", Api.USER).set_method("POST").set_body(request_body).request();
		let match_id = -1;
		if (request.status === Api.ERROR || request.code !== 201)
		{
			new Toast(Toast.ERROR, "An error occurred while attempting to create a match.");
		}
		else
		{
			let invitation_id = request.response.id;
			const accept_request = await new Api(`/api/invitations/${invitation_id}/accept/`, Api.OPPONENT).set_method("POST").request();
			if (accept_request.status === Api.ERROR || accept_request.code !== 201)
			{
				new Toast(Toast.ERROR, "An error occurred while attempting to create a match.");
			}
			else
			{
				new Toast(Toast.SUCCESS, "Match has been successfully created.");
				match_id = accept_request.response.match.id;
			}
		}
		if (this.tournament_id !== -1)
		{
			const put_tournament_request_body = JSON.stringify({
				"match_id": match_id
			});
			const put_tournament_request = await new Api(`/api/tournaments/${this.tournament_id}/`, Api.USER)
				.set_credentials("omit")
				.set_method("PUT")
				.set_body(put_tournament_request_body)
				.request();
			if (put_tournament_request.status === Api.ERROR)
			{
				new Toast(Toast.ERROR, "An error occurred while attempting to update the tournament." + "<br/>" + put_tournament_request.log);
			}
			else
			{
				new Toast(Toast.SUCCESS, "Tournament has been successfully updated.");
				await load_tournament(this.tournament_id);
			}
		}
		else
		{
			this.setGameButtonToReplay();
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
				this.player1.score += 1;
				this.player1.consecutive_wins += 1;
				this.player2.consecutive_wins = 0;
				if (this.player1.consecutive_wins > this.player1.max_consecutive_wins)
					this.player1.max_consecutive_wins = this.player1.consecutive_wins;
				if (this.player1.symbol === TicTacToe.CROSS)
					this.player1.wins_as_crosses += 1;
				else
					this.player1.wins_as_noughts += 1;
				if (this.moves_count < this.player1.quickest_win_moves || this.player1.quickest_win_moves == 0)
					this.player1.quickest_win_moves = this.moves_count;
			}
			else if (winner === this.player2.name)
			{
				this.player2.score += 1;
				this.player2.consecutive_wins += 1;
				this.player1.consecutive_wins = 0;
				if (this.player2.consecutive_wins > this.player2.max_consecutive_wins)
					this.player2.max_consecutive_wins = this.player2.consecutive_wins;
				if (this.player2.symbol === TicTacToe.CROSS)
					this.player2.wins_as_crosses += 1;
				else
					this.player2.wins_as_noughts += 1;
				if (this.moves_count < this.player2.quickest_win_moves || this.player2.quickest_win_moves == 0)
					this.player2.quickest_win_moves = this.moves_count;
			}
			this.refreshScoreboard();
		}
		else
		{
			this.player1.consecutive_wins = 0;
			this.player2.consecutive_wins = 0;
		}
		this.moves_count = 0;

		if (this.player1.score >= this.win_condition || this.player2.score >= this.win_condition)
		{
			this.terminateMatch();
		}
		else
		{
			setTimeout(() => {
				this.startRound();
			}, 3000);
		}
	}
}
