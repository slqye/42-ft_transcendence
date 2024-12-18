class Pong
{
	static UP			= "up";
	static DOWN			= "down";
	static P1_KEYS		= {[Pong.UP]: "w", [Pong.DOWN]: "s"};
	static P2_KEYS		= {[Pong.UP]: "ArrowUp", [Pong.DOWN]: "ArrowDown"};
	static PADDLE_SPEED	= 10;

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
		requestAnimationFrame(() => this.paddle_keyhook());
	}
	keyup_listener(event)
	{
		this.keys.delete(event.key);
		requestAnimationFrame(() => this.paddle_keyhook());
	}

	paddle_keyhook()
	{
		const user_agent = navigator.userAgent;
		const game_container = document.getElementById("game-container");
		const paddle_left = document.getElementById("paddle-left");
		const paddle_right = document.getElementById("paddle-right");

		if (this.keys.has(Pong.P1_KEYS[Pong.UP]))
		{
			var top = parseInt(window.getComputedStyle(paddle_left).top);
			var paddle_size = parseInt(window.getComputedStyle(paddle_left).height);
			var game_container_size = parseInt(window.getComputedStyle(game_container).height);
			var min_top = Pong.PADDLE_SPEED + (paddle_size / 2);
			top = Math.max(top - Pong.PADDLE_SPEED, min_top);
			paddle_left.style.top = `${top}px`;
		}
		if (this.keys.has(Pong.P1_KEYS[Pong.DOWN]))
		{
			var top = parseInt(window.getComputedStyle(paddle_left).top);
			var paddle_size = parseInt(window.getComputedStyle(paddle_left).height);
			var game_container_size = parseInt(window.getComputedStyle(game_container).height);
			var max_top = game_container_size - (paddle_size / 2) - Pong.PADDLE_SPEED;
			top = Math.min(top + Pong.PADDLE_SPEED, max_top);
			paddle_left.style.top = `${top}px`;
		}
		if (this.keys.has(Pong.P2_KEYS[Pong.UP]))
		{
			var top = parseInt(window.getComputedStyle(paddle_right).top);
			var paddle_size = parseInt(window.getComputedStyle(paddle_right).height);
			var game_container_size = parseInt(window.getComputedStyle(game_container).height);
			var min_top = Pong.PADDLE_SPEED + (paddle_size / 2);
			top = Math.max(top - Pong.PADDLE_SPEED, min_top);
			paddle_right.style.top = `${top}px`;
		}
		if (this.keys.has(Pong.P2_KEYS[Pong.DOWN]))
		{
			var top = parseInt(window.getComputedStyle(paddle_right).top);
			var paddle_size = parseInt(window.getComputedStyle(paddle_right).height);
			var game_container_size = parseInt(window.getComputedStyle(game_container).height);
			var max_top = game_container_size - (paddle_size / 2) - Pong.PADDLE_SPEED;
			top = Math.min(top + Pong.PADDLE_SPEED, max_top);
			paddle_right.style.top = `${top}px`;
		}
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