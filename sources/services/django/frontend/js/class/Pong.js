class Pong
{
	static UP = "up";
	static DOWN = "down";
	static P1_KEYS = { [Pong.UP]: "w", [Pong.DOWN]: "s" };
	static P2_KEYS = { [Pong.UP]: "ArrowUp", [Pong.DOWN]: "ArrowDown" };
	static ASPECT_RATIO = 0.5;
	static PADDLE_SIZE_RATIO = { width: 1/100, height: 1/4 };
	static PADDLE_SPEED_RATIO = 1/100;
	static PADDLE_OFFSET = 10;
	static BALL_RADIUS_RATIO = 1/100;
	static BALL_SPEED_RATIO = 1/75;

	constructor(canvas, score, player1, player2) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.score = score;
		this.player1 = player1;
		this.player2 = player2;
		this.paddles = {
			[player1.name]: {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				dy: 0,
			},
			[player2.name]: {
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
		this.paddle_speed = 0;
		this.p1_paddle = this.paddles[this.player1.name];
		this.p2_paddle = this.paddles[this.player2.name];
		this.keys = new Set();
		this.key_listener = this.key_listener.bind(this);
		this.keyup_listener = this.keyup_listener.bind(this);
		this.resize_handler = this.resize_handler.bind(this);
		this.update = this.update.bind(this);
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
		this.p1_paddle.x = Pong.PADDLE_OFFSET;
		this.p2_paddle.x = this.canvas.width - this.p2_paddle.width - Pong.PADDLE_OFFSET;
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
		if (this.keys.has(Pong.P1_KEYS[Pong.UP]) && this.p1_paddle.y > 0)
			this.p1_paddle.y -= this.paddle_speed;
		if (this.keys.has(Pong.P1_KEYS[Pong.DOWN]) && this.p1_paddle.y < this.canvas.height -this.p1_paddle.height)
			this.p1_paddle.y += this.paddle_speed;
		if (this.keys.has(Pong.P2_KEYS[Pong.UP]) && this.p2_paddle.y > 0)
			this.p2_paddle.y -= this.paddle_speed;
		if (this.keys.has(Pong.P2_KEYS[Pong.DOWN]) && this.p2_paddle.y < this.canvas.height - this.p2_paddle.height)
			this.p2_paddle.y += this.paddle_speed;
	}

	ball_movements()
	{
		this.ball.x += (this.canvas.height * Pong.BALL_SPEED_RATIO) * this.ball.dx;
		this.ball.y += (this.canvas.height * Pong.BALL_SPEED_RATIO) * this.ball.dy;
		let ball_x_radius = this.ball.dx == 1 ? this.ball.x + this.ball.radius : this.ball.x - this.ball.radius;
		let ball_y_radius = this.ball.dy == 1 ? this.ball.y + this.ball.radius : this.ball.y - this.ball.radius;

		if (ball_x_radius <= Pong.PADDLE_OFFSET + this.p1_paddle.width)
		{
			if (ball_y_radius >= this.p1_paddle.y && ball_y_radius <= this.p1_paddle.y + this.p1_paddle.height)
				this.ball.dx = -this.ball.dx;
		}
		if (ball_x_radius >= this.canvas.width - Pong.PADDLE_OFFSET - this.p2_paddle.width)
		{
			if (ball_y_radius >= this.p2_paddle.y && ball_y_radius <= this.p2_paddle.y + this.p2_paddle.height)
				this.ball.dx = -this.ball.dx;
		}
		if (ball_y_radius < 0 || ball_y_radius > this.canvas.height)
			this.ball.dy = -this.ball.dy;
		if (this.ball.x < 0 || this.ball.x > this.canvas.width)
		{
			this.ball.x < 0 ? this.player2.score += 1 : this.player1.score += 1;
			this.ball.x = this.canvas.width / 2;
			this.ball.y = this.canvas.height / 2;
			this.ball.dx = Math.random() < 0.5 ? 1 : -1;
			this.ball.dy = Math.random() < 0.5 ? 1 : -1;
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

	start()
	{
		window.addEventListener("resize", this.resize_handler);
		document.addEventListener("keydown", this.key_listener);
		document.addEventListener("keyup", this.keyup_listener);
		this.resize_handler();
		this.update();
	}

	update()
	{
		this.paddle_movements();
		this.ball_movements();
		this.draw();
		this.score.innerHTML = this.player1.score + " - " + this.player2.score;
		requestAnimationFrame(this.update);
	}

	stop()
	{
		document.removeEventListener("resize", this.key_listener);
		document.removeEventListener("keydown", this.key_listener);
		document.removeEventListener("keyup", this.keyup_listener);
	}

	resize_handler()
	{
		this.canvas.width = document.querySelector("#game-container").offsetWidth;
		this.canvas.height = this.canvas.width * Pong.ASPECT_RATIO;
		this.resize_paddle();
		this.resize_ball();
	}
	
	key_listener(event) { this.keys.add(event.key); }
	keyup_listener(event) { this.keys.delete(event.key); }
}
