class Pong
{
	static UP			= "up";
	static DOWN			= "down";
	static P1_KEYS		= {[Pong.UP]: "w", [Pong.DOWN]: "s"};
	static P2_KEYS		= {[Pong.UP]: "ArrowUp", [Pong.DOWN]: "ArrowDown"};
	static PADDLE_SPEED	= 1;

	constructor(player1, player2)
	{
		this.player1 = player1;
		this.player2 = player2;
		this.paddles = {[player1.name]: {"x": 0, "y": 0}, [player2.name]: {"x": 0, "y": 0}};
		this.keys = new Set();
		this.key_listener = this.key_listener.bind(this);
		this.keyup_listener = this.keyup_listener.bind(this);
	}

	key_listener(event)
	{
		this.keys.add(event.key);
		this.paddle_keyhook();
	}
	keyup_listener(event)
	{
		this.keys.delete(event.key);
		this.paddle_keyhook();
	}

	paddle_keyhook()
	{
		if (this.keys.has(Pong.P1_KEYS[Pong.UP]))
			this.paddles[this.player1.name]["y"] += Pong.PADDLE_SPEED;
		if (this.keys.has(Pong.P1_KEYS[Pong.DOWN]))
			this.paddles[this.player1.name]["y"] -= Pong.PADDLE_SPEED;
		if (this.keys.has(Pong.P2_KEYS[Pong.UP]))
			this.paddles[this.player2.name]["y"] += Pong.PADDLE_SPEED;
		if (this.keys.has(Pong.P2_KEYS[Pong.DOWN]))
			this.paddles[this.player2.name]["y"] -= Pong.PADDLE_SPEED;
	}

	debug()
	{
		console.log(this.player1.name, ":", this.player1.score);
		console.log("\tPaddle:", this.paddles[this.player1.name]);
		console.log(this.player2.name, ":", this.player2.score);
		console.log("\tPaddle:", this.paddles[this.player2.name]);
	}

	start()
	{
		document.addEventListener("keydown", this.key_listener);
		document.addEventListener("keyup", this.keyup_listener);
	}

	stop()
	{
		document.removeEventListener("keydown", this.key_listener);
		document.removeEventListener("keyup", this.keyup_listener);
	}
}