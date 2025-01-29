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
		start_game_tictactoe();
	}
}

async function	start_game_tictactoe()
{
	let win_condition = document.getElementById("win-condition").value;
	// fetch user display name
	const user = await fetch_user();
	if (!user)
		return;
	var game = new TicTacToe(new Player(user.display_name), new Player("slqye"), win_condition);
	game.init();
}