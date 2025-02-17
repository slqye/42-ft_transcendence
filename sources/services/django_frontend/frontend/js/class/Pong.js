class Pong
{
	static UP = "up";
	static DOWN = "down";
	static P1_KEYS = { [Pong.UP]: "w", [Pong.DOWN]: "s" };
	static P2_KEYS = { [Pong.UP]: "ArrowUp", [Pong.DOWN]: "ArrowDown" };
	static ASPECT_RATIO = 0.5;
	static PADDLE_SIZE_RATIO = { width: 1/100, height: 1/4 };
	static PADDLE_SPEED_RATIO = 1/100;
	static PADDLE_OFFSET_RATIO = 1/25;
	static BALL_RADIUS_RATIO = 1/100;
	static BALL_SPEED_RATIO = 1/75;
	
	constructor(canvas, score, player1, player2, win_condition, tournament_id = -1) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.sliders = document.getElementsByClassName("form-range");
		this.score = score;
		this.win_condition = win_condition;
		this.roundActive = false;
		this.tournament_id = tournament_id;
		this.match_id = -1;
		this.player1 = player1;
		this.player2 = player2;
		this.current_bounce_streak = 0;
		this.game_longest_bounces_streak = 0;
		this.game_timer_start = 0;
		this.game_timer_end = 0;
		
		this.paddle_speed = 0;
		this.paddles = {
			[this.player1.name]: {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				dy: 0,
			},
			[this.player2.name]: {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				dy: 0,
			}
		};
		this.ball = {
			x: 0,
			y: 0,
			dx: 1,
			dy: 1,
			radius: 0,
		}
		
		this.p1_paddle = this.paddles[this.player1.name];
		this.p2_paddle = this.paddles[this.player2.name];
		this.keys = new Set();
		this.key_listener = this.key_listener.bind(this);
		this.keyup_listener = this.keyup_listener.bind(this);
		this.resize_handler = this.resize_handler.bind(this);
		this.update = this.update.bind(this);
		this.handleGame = this.handleGame.bind(this);
		this.resetMovingObjectsPositions = this.resetMovingObjectsPositions.bind(this);
		this.resetPlayerVariables = this.resetPlayerVariables.bind(this);
		this.start = this.start.bind(this);
		this.update = this.update.bind(this);
		this.stop = this.stop.bind(this);
		this.resize_handler = this.resize_handler.bind(this);
		this.terminateMatch = this.terminateMatch.bind(this);
		this.resetMovingObjectsPositions();
	}
	
	resetMovingObjectsPositions()
	{
		this.p1_paddle.x = 0;
		this.p1_paddle.y = 0;
		this.p1_paddle.width = 0;
		this.p1_paddle.height = 0;
		this.p2_paddle.x = 0;
		this.p2_paddle.y = 0;
		this.p2_paddle.width = 0;
		this.p2_paddle.height = 0;
		this.ball.x = 0;
		this.ball.y = 0;
		this.ball.dx = 1;
		this.ball.dy = 1;
		this.ball.radius = 0;
		this.ball.x = 0;
		this.ball.y = 0;
		this.ball.dx = 1;
		this.ball.dy = 1;
		this.ball.radius = 0;
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
			this.start();
		}
	}

	refreshScoreboard()
	{ 
		document.getElementById('player1-score').textContent = this.player1.score;
		document.getElementById('player2-score').textContent = this.player2.score;
	}

	resize_paddle()
	{
		this.paddle_speed = this.canvas.height * Pong.PADDLE_SPEED_RATIO;
		this.p1_paddle.width = this.canvas.width * Pong.PADDLE_SIZE_RATIO.width;
		this.p2_paddle.width = this.canvas.width * Pong.PADDLE_SIZE_RATIO.width;
		this.p1_paddle.height = this.canvas.height * Pong.PADDLE_SIZE_RATIO.height;
		this.p2_paddle.height = this.canvas.height * Pong.PADDLE_SIZE_RATIO.height;
		this.p1_paddle.y = this.canvas.height / 2 - this.p1_paddle.height / 2;
		this.p2_paddle.y = this.canvas.height / 2 - this.p2_paddle.height / 2;
		this.p1_paddle.x = this.canvas.width * Pong.PADDLE_OFFSET_RATIO;
		this.p2_paddle.x = this.canvas.width - this.p2_paddle.width - this.canvas.width * Pong.PADDLE_OFFSET_RATIO;
	}

	resize_ball()
	{
		this.ball.speed = this.canvas.height * Pong.BALL_SPEED_RATIO;
		this.ball.radius = this.canvas.height * Pong.BALL_RADIUS_RATIO;
		this.ball.x = this.canvas.width / 2;
		this.ball.y = this.canvas.height / 2;
	}

	paddle_movements()
	{
		if (isMobile())
		{
			const top_range = document.getElementById("top-range");
			const bottom_range = document.getElementById("bottom-range");
			this.p1_paddle.y = top_range.value * this.canvas.height;
			this.p2_paddle.y = -bottom_range.value * this.canvas.height;
		}
		else
		{
			if (this.keys.has(Pong.P1_KEYS[Pong.UP]) && this.p1_paddle.y > 0)
				this.p1_paddle.y -= this.paddle_speed;
			if (this.keys.has(Pong.P1_KEYS[Pong.DOWN]) && this.p1_paddle.y < this.canvas.height -this.p1_paddle.height)
				this.p1_paddle.y += this.paddle_speed;
			if (this.keys.has(Pong.P2_KEYS[Pong.UP]) && this.p2_paddle.y > 0)
				this.p2_paddle.y -= this.paddle_speed;
			if (this.keys.has(Pong.P2_KEYS[Pong.DOWN]) && this.p2_paddle.y < this.canvas.height - this.p2_paddle.height)
				this.p2_paddle.y += this.paddle_speed;
		}
	}

	ball_movements()
	{
		this.ball.x += (this.canvas.height * Pong.BALL_SPEED_RATIO) * this.ball.dx;
		this.ball.y += (this.canvas.height * Pong.BALL_SPEED_RATIO) * this.ball.dy;
		let ball_x_radius = this.ball.dx == 1 ? this.ball.x + this.ball.radius : this.ball.x - this.ball.radius;
		let ball_y_radius = this.ball.dy == 1 ? this.ball.y + this.ball.radius : this.ball.y - this.ball.radius;

		if (ball_x_radius <= Pong.PADDLE_OFFSET_RATIO * this.canvas.width + this.p1_paddle.width && ball_x_radius >= Pong.PADDLE_OFFSET_RATIO * this.canvas.width)
		{
			if (ball_y_radius >= this.p1_paddle.y && ball_y_radius <= this.p1_paddle.y + this.p1_paddle.height) {
				this.ball.dx = -this.ball.dx;
				this.current_bounce_streak++;
				if (this.current_bounce_streak > this.game_longest_bounces_streak) {
					this.game_longest_bounces_streak = this.current_bounce_streak;
				}
			}
		}
		if (ball_x_radius >= this.canvas.width - Pong.PADDLE_OFFSET_RATIO * this.canvas.width - this.p2_paddle.width && ball_x_radius <= this.canvas.width - Pong.PADDLE_OFFSET_RATIO * this.canvas.width)
		{
			if (ball_y_radius >= this.p2_paddle.y && ball_y_radius <= this.p2_paddle.y + this.p2_paddle.height) {
				this.ball.dx = -this.ball.dx;
				this.current_bounce_streak++;
				if (this.current_bounce_streak > this.game_longest_bounces_streak) {
					this.game_longest_bounces_streak = this.current_bounce_streak;
				}
			}
		}
		if (ball_y_radius < 0 || ball_y_radius > this.canvas.height)
			this.ball.dy = -this.ball.dy;
		if (this.ball.x < 0 || this.ball.x > this.canvas.width)
		{
			this.game_timer_end = Date.now();
			var diff = this.game_timer_end - this.game_timer_start;
			if (this.ball.x < 0)
			{
				this.player2.score += 1;
				this.player2.consecutive_goals += 1;
				this.player1.consecutive_goals = 0;
				if (this.player2.consecutive_goals > this.player2.max_consecutive_goals)
					this.player2.max_consecutive_goals = this.player2.consecutive_goals;
				if (diff < this.player2.fastest_time_to_score || this.player2.fastest_time_to_score == 0)
					this.player2.fastest_time_to_score = diff;
				this.player2.goals_times.push(diff);
			}
			else
			{
				this.player1.score += 1;
				this.player1.consecutive_goals += 1;
				this.player2.consecutive_goals = 0;
				if (this.player1.consecutive_goals > this.player1.max_consecutive_goals)
					this.player1.max_consecutive_goals = this.player1.consecutive_goals;
				if (diff < this.player1.fastest_time_to_score || this.player1.fastest_time_to_score == 0)
					this.player1.fastest_time_to_score = diff;
				this.player1.goals_times.push(diff);
			}
			this.refreshScoreboard();
			this.ball.x = this.canvas.width / 2;
			this.ball.y = this.canvas.height / 2;
			this.ball.dx = Math.random() < 0.5 ? 1 : -1;
			this.ball.dy = Math.random() < 0.5 ? 1 : -1;
			if (this.player1.score >= this.win_condition || this.player2.score >= this.win_condition)
			{
				this.stop();
				var gameStatus = document.getElementById('game-status');
				if (this.player1.score >= this.win_condition)
					gameStatus.textContent = this.player1.name + ' wins!';
				else
					gameStatus.textContent = this.player2.name + ' wins!';
				this.terminateMatch();
			}
			this.game_timer_start = Date.now();
			this.current_bounce_streak = 0;
		}
	}

	draw()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(this.p1_paddle.x, this.p1_paddle.y, this.p1_paddle.width, this.p1_paddle.height);
		this.ctx.fillRect(this.p2_paddle.x, this.p2_paddle.y, this.p2_paddle.width, this.p2_paddle.height);
		this.ctx.beginPath();
		this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 2 * Math.PI, false);
		this.ctx.stroke();
		this.ctx.fill();
	}

	resetPlayerVariables()
	{
		this.current_bounce_streak = 0;
		this.game_longest_bounces_streak = 0;
		this.game_timer_start = 0;
		this.game_timer_end = 0;

		this.player1.score = 0;
		this.player1.fastest_time_to_score = 0;
		this.player1.consecutive_goals = 0;
		this.player1.max_consecutive_goals = 0;
		this.player1.goals_times = [];
		this.player1.average_time_to_score = 0;

		this.player2.score = 0;
		this.player2.fastest_time_to_score = 0;
		this.player2.consecutive_goals = 0;
		this.player2.max_consecutive_goals = 0;
		this.player2.goals_times = [];
		this.player2.average_time_to_score = 0;
	}

	start()
	{
		var gameButton = document.getElementById('game-button');
		var gameStatus = document.getElementById('game-status');
		this.roundActive = true;
		gameButton.setAttribute('class', 'd-none');
		gameButton.removeEventListener('click', this.handleGame);
		gameStatus.textContent = '';
		this.resetPlayerVariables();
		this.resetMovingObjectsPositions();
		this.refreshScoreboard();
		window.addEventListener("resize", this.resize_handler);
		document.addEventListener("keydown", this.key_listener);
		document.addEventListener("keyup", this.keyup_listener);
		this.resize_handler();
		this.sliders[0].setAttribute("value", this.sliders[0].getAttribute("max") / 2);
		this.sliders[1].setAttribute("value", this.sliders[1].getAttribute("min") / 2);
		this.game_timer_start = Date.now();
		this.update();
	}

	update()
	{
		if (this.roundActive)
		{
			this.paddle_movements();
			this.ball_movements();
			this.draw();
			requestAnimationFrame(this.update);
		}
	}

	stop()
	{
		this.roundActive = false;
		window.removeEventListener("resize", this.resize_handler);
		document.removeEventListener("keydown", this.key_listener);
		document.removeEventListener("keyup", this.keyup_listener);
		this.resetMovingObjectsPositions();
		this.draw();
	}

	resize_handler()
	{		
		this.canvas.width = document.querySelector("#game-container").offsetWidth;
		this.canvas.height = this.canvas.width * Pong.ASPECT_RATIO;
		this.resize_paddle();
		this.resize_ball();
		this.sliders[0].setAttribute("max", 1 - this.p1_paddle.height / this.canvas.height);
		this.sliders[1].setAttribute("min", -1 + this.p2_paddle.height / this.canvas.height);
	}

	setGameButtonToReplay()
	{
		var gameButton = document.getElementById('game-button');
		gameButton.setAttribute('class', 'btn btn-outline-primary');
		gameButton.textContent = 'Play a new match';
		gameButton.addEventListener('click', this.start);
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
			return (new Toast("An opponent must be logged in to play a game."));
		}
		this.player1.average_time_to_score = 0;
		this.player2.average_time_to_score = 0;
		if (this.player1.goals_times.length > 0)
			this.player1.average_time_to_score = parseInt(this.player1.goals_times.reduce((acc, time) => acc + time, 0) / this.player1.goals_times.length);
		if (this.player2.goals_times.length > 0)
			this.player2.average_time_to_score = parseInt(this.player2.goals_times.reduce((acc, time) => acc + time, 0) / this.player2.goals_times.length);
		let result = this.player1.score > this.player2.score ? 0 : 1;
		if (this.player1.score === this.player2.score)
			result = 2;
		const request_body = JSON.stringify(
		{
			"opponent_user_id": opponent.id,
			"is_pong": true,
			"result": result,
			"tournament": this.tournament_id !== -1 ? this.tournament_id : null,
			"pong_game_stats": {
				"user_score": this.player1.score,
				"opponent_score": this.player2.score,
				"user_fastest_time_to_score": this.player1.fastest_time_to_score,
				"opponent_fastest_time_to_score": this.player2.fastest_time_to_score,
				"user_max_consecutive_goals": this.player1.max_consecutive_goals,
				"opponent_max_consecutive_goals": this.player2.max_consecutive_goals,
				"user_average_time_to_score": this.player1.average_time_to_score,
				"opponent_average_time_to_score": this.player2.average_time_to_score,
				"longest_bounce_streak": this.game_longest_bounces_streak
				}
		});
		const request = await new Api("/api/invitations/", Api.USER).set_method("POST").set_body(request_body).request();
		if (request.status == Api.ERROR || request.code != 201)
		{
			new Toast(Toast.ERROR, "An error occured while attempting to create a match.");
		}
		else
		{
			let invitation_id = request.response.id;
			const accept_request = await new Api("/api/invitations/" + invitation_id + "/accept/", Api.OPPONENT).set_method("POST").request();
			if (accept_request.status == Api.ERROR || accept_request.code != 201)
			{
				new Toast(Toast.ERROR, "An error occured while attempting to create a match.");
			}
			else
			{
				new Toast(Toast.SUCCESS, "Match has been successfully created.");
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

	key_listener(event) { this.keys.add(event.key); }
	keyup_listener(event) { this.keys.delete(event.key); }
}