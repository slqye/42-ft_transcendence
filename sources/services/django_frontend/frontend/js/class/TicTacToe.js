class TicTacToe
{
	static CROSS = "X";
	static NOUGHT = "O";
	static STATE_DONE_WIN = 2;
	static STATE_DONE_DRAW = 1;
	static STATE_NOT_DONE = 0;

	constructor(player1, player2, win_condition)
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
		this.handleGame = this.handleGame.bind(this);
		this.cell_board = Array(9).fill(null);
		this.is_ia = false;
		this.first_player = this.player1;
		this.second_player = this.player2;
		this.is_player_order_set = false;
	}

	async init()
	{
		var gameButton = document.getElementById('game-button');
		gameButton.addEventListener('click', this.handleGame);
		document.getElementById('player1').textContent = this.player1.name;
		document.getElementById('player2').textContent = this.player2.name;
		this.is_ia = !await Api.is_opponent_login();
		if (this.is_ia)
		{
			const progress = document.getElementById("progress_win_chance");
			progress.classList.remove("d-none");
		}
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
		this.is_player_order_set = false;
		this.switchPlayer();
	}

	setupCells()
	{
		let index = 0;
		document.querySelectorAll('.cell').forEach(cell => {
			cell.addEventListener('click', (e) => this.handleCellClick(e));
			cell.setAttribute('class', 'cell col cursor-pointer mb-2');
			cell.textContent = '';
			cell.style.color = 'white';
			this.cell_board[index] = cell;
			index += 1;
		});
	}

	handleCellClick(clickedCellEvent)
	{
		const clickedCell = clickedCellEvent.target;
		const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

		if (this.board[clickedCellIndex] !== null || !this.roundActive) return ;
		this.makeMove(clickedCell, clickedCellIndex);
	}

	static get_terminate_state(board)
	{
		const wins = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		];
		let win_status = false;
		wins.forEach(condition => {
			const [a, b, c] = condition;
			if (board[a] !== null && board[a] === board[b] && board[b] === board[c])
				return (win_status = true);
		});
		if (win_status == true)
			return (TicTacToe.STATE_DONE_WIN);
		if (board.every(cell => cell !== null))
			return (TicTacToe.STATE_DONE_DRAW);
		return (TicTacToe.STATE_NOT_DONE);
	}

	get_player_turn(board)
	{
		let player1_moves = 0;
		let player2_moves = 0;

		board.forEach(cell => {
			if (cell == this.first_player.name)
				player1_moves += 1;
			else if (cell == this.second_player.name)
				player2_moves += 1;
		});
		if (player1_moves == 0 && player2_moves == 0) return (this.first_player);
		else if (player1_moves > player2_moves) return (this.second_player);
		else return (this.first_player)
	}

	play_ai()
	{
		let moves_values = this.make_minimax_move(this.board, this.board);
		this.board[moves_values[0]] = this.player2.name;
		this.cell_board[moves_values[0]].textContent = this.currentPlayer === this.player1.name ? 'X' : 'O';
		this.cell_board[moves_values[0]].style.color = this.currentPlayer === this.player1.name ? 'red' : 'blue';
	}

	make_minimax_move(static_board, board)
	{
		const player = this.get_player_turn(board);
		const state = TicTacToe.get_terminate_state(board);
		let board_copy = null;
		let index = 0;
		let moves = [];

		if (this.player1.name == player.name && state == TicTacToe.STATE_DONE_WIN) return (1);
		else if (this.player2.name == player.name && state == TicTacToe.STATE_DONE_WIN) return (-1);
		else if (state == TicTacToe.STATE_DONE_DRAW) return (0);
		board.forEach(cell => {
			if (cell == null)
			{
				board_copy = JSON.parse(JSON.stringify(board));
				board_copy[index] = player.name;
				moves.push([index, this.make_minimax_move(static_board, board_copy)]);
			}
			index += 1;
		});
		if (board == static_board)
		{
			this.set_game_win_chance_progress_bar(moves);
			let max = moves[0];
			moves.forEach(element => {
				if (element[1] > max[1])
					max = element;
			});
			return (max);
		}
		if (this.player1.name == player.name)
		{
			let min = moves[0];
			moves.forEach(element => {
				if (element[1] < min[1])
					min = element;
			});
			return (min[1]);
		}
		let max = moves[0];
		moves.forEach(element => {
			if (element[1] > max[1])
				max = element;
		});
		return (max[1]);
	}

	set_game_win_chance_progress_bar(moves)
	{
		let wins = 0;
		let looses = 0;
		let draw = 0;

		moves.forEach(element => {
			if (element[1] == 1)
				wins += 1;
			else if (element[1] == -1)
				looses += 1;
			else
				draw += 1;

		});
		const progress_value = document.getElementById("progress_win_chance_value");
		progress_value.setAttribute("style", `width: ${looses * 100 / moves.length}%;`);
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
		if (this.is_ia && this.currentPlayer == this.player2.name && !this.is_player_order_set)
		{
			this.first_player = this.player2;
			this.second_player = this.player1;
			this.is_player_order_set = true;
		}
		else if (!this.is_player_order_set)
		{
			this.first_player = this.player1;
			this.second_player = this.player2;
			this.is_player_order_set = true;
		}
		if (this.is_ia && this.currentPlayer == this.player2.name)
		{
			this.play_ai();
			if (this.checkWin()) {
				return;
			}
			if (this.checkDraw()) {
				this.endGame(null, "It's a draw!");
				return;
			}
			this.switchPlayer();
		}
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
		if (!this.is_ia)
		{
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
		}
		let result = this.player1.score > this.player2.score ? 0 : 1;
		if (this.player1.score === this.player2.score)
			result = 2;
		let request_body = JSON.stringify({
			"is_pong": false,
			"result": result,
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
		if (this.is_ia)
		{
			let request_object = JSON.parse(request_body);
			request_object.opponent_user_id = null;
			request_object.versus_ai = true;
			request_body = JSON.stringify(request_object);
		}
		else
		{
			let request_object = JSON.parse(request_body);
			request_object.opponent_user_id = opponent.id;
			request_body = JSON.stringify(request_object);
		}
		const request = await new Api("/api/invitations/", Api.USER).set_method("POST").set_body(request_body).request();
		if (request.status === Api.ERROR || request.code !== 201)
			new Toast(Toast.ERROR, request.log);
		else
		{
			let invitation_id = request.response.id;
			const accept_request = await new Api(`/api/invitations/${invitation_id}/accept/`, Api.OPPONENT).set_method("POST").request();
			if (accept_request.status === Api.ERROR || accept_request.code !== 201)
				new Toast(Toast.ERROR, request.log);
			else
				new Toast(Toast.SUCCESS, request.log);
		}
		this.setGameButtonToReplay();
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
