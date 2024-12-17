function	launch(value)
{
	if (value == "pong")
	{
		var pong = new Pong(new Player("p1_test"), new Player("p2_test"));
		pong.start();
	}
	else if (value == "tictactoe")
	{
		var game = new TicTacToe(new Player("loupy"), new Player("slqye"));
		game.init();
	}
}