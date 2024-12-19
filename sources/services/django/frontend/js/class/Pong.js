class Pong {
	static UP = "up";
	static DOWN = "down";
	static P1_KEYS = { [Pong.UP]: "z", [Pong.DOWN]: "s" };
	static P2_KEYS = { [Pong.UP]: "ArrowUp", [Pong.DOWN]: "ArrowDown" };
	static ASPECT_RATIO = 500 / 400;
	static PADDLE_SIZE = { "width": 5, "height": 100 };
	static PADDLE_SPEED = 2;

	constructor(canvas, player1, player2) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.player1 = player1;
		this.player2 = player2;
		this.canvas.width = 600;
		this.canvas.height = 400;
		this.paddles = {
			[player1.name]: {
				x: 0,
				y: canvas.height / 2 - Pong.PADDLE_SIZE["height"] / 2,
				width: Pong.PADDLE_SIZE["width"],
				height: Pong.PADDLE_SIZE["height"],
				dy: 0,
			},
			[player2.name]: {
				x: canvas.width - Pong.PADDLE_SIZE["width"],
				y: canvas.height / 2 - Pong.PADDLE_SIZE["height"] / 2,
				width: Pong.PADDLE_SIZE["width"],
				height: Pong.PADDLE_SIZE["height"],
				dy: 0,
			}
		};

		this.keys = new Set();
		this.key_listener = this.key_listener.bind(this);
		this.keyup_listener = this.keyup_listener.bind(this);
		this.update = this.update.bind(this);
	}

	paddle()
	{
		var p1_paddle = this.paddles[this.player1.name];
		var p2_paddle = this.paddles[this.player2.name];

		if (this.keys.has(Pong.P1_KEYS[Pong.UP]) && p1_paddle.y > 0)
			p1_paddle.y -= Pong.PADDLE_SPEED;
		if (this.keys.has(Pong.P1_KEYS[Pong.DOWN]) && p1_paddle.y < this.canvas.height - Pong.PADDLE_SIZE["height"])
			p1_paddle.y += Pong.PADDLE_SPEED;
		if (this.keys.has(Pong.P2_KEYS[Pong.UP]) && p2_paddle.y > 0)
			p2_paddle.y -= Pong.PADDLE_SPEED;
		if (this.keys.has(Pong.P2_KEYS[Pong.DOWN]) && p2_paddle.y < this.canvas.height - Pong.PADDLE_SIZE["height"])
			p2_paddle.y += Pong.PADDLE_SPEED;
	}

	draw()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(this.paddles[this.player1.name].x, this.paddles[this.player1.name].y, this.paddles[this.player1.name].width, this.paddles[this.player1.name].height);
		this.ctx.fillRect(this.paddles[this.player2.name].x, this.paddles[this.player2.name].y, this.paddles[this.player2.name].width, this.paddles[this.player2.name].height);
	}

	start()
	{
		document.addEventListener("keydown", this.key_listener);
		document.addEventListener("keyup", this.keyup_listener);
		this.update();
	}

	update()
	{
		this.paddle();
		this.draw();
		requestAnimationFrame(this.update);
	}

	stop()
	{
		document.removeEventListener("keydown", this.key_listener);
		document.removeEventListener("keyup", this.keyup_listener);
	}

	key_listener(event) { this.keys.add(event.key); }
	keyup_listener(event) { this.keys.delete(event.key); }
}
