function	launch(value)
{
	if (value == "pong")
	{
		let game = document.getElementById("game");
		let score = document.getElementById("score");
		let pong = new Pong(game, score, new Player("p1_test"), new Player("p2_test"));
		pong.start();
	}
	else if (value == "tictactoe")
	{
		console.warn("Tictactoe is not implemented yet.");
	}
}