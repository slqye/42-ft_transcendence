function	launch(value)
{
	if (value == "pong")
	{
		var pong = new Pong(document.getElementById("game"), new Player("p1_test"), new Player("p2_test"));
		pong.start();
	}
	else if (value == "tictactoe")
	{
		console.warn("Tictactoe is not implemented yet.");
	}
}