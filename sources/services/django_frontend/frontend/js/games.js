async function	launch_pong_match()
{
	let win_condition = document.getElementById("win-condition").value;
	let user = null;
	try
	{
		user = await fetch_me();
		if (!user)
			throw new Error();
	}
	catch (error)
	{
		return (new Toast("A host player must be logged in to play a game."));
	}
	let opponent = null;
	try
	{
		opponent = await fetch_opponent();
		if (!opponent)
			throw new Error();
	}
	catch (error)
	{
		return (new Toast("An opponent must be logged in to play a game."));
	}
	if (user.username === opponent.username)
		return (new Toast("You cannot play against yourself!"));
	if (win_condition < 3)
		return (new Toast("The win condition must be at least 3!"));
	else if (win_condition > 10)
		return (new Toast("The win condition must be at most 10!"));
	await load_pong_match();
	let game = document.getElementById("game");
	let score = document.getElementById("score");
	var pong = new Pong(game, score, new Player(user.display_name), new Player(opponent.display_name), win_condition);
	pong.init();
}

async function	launch_tictactoe_match()
{
	let win_condition = document.getElementById("win-condition").value;
	let user = null;
	try
	{
		user = await fetch_me();
		if (!user)
			throw new Error();
	}
	catch (error)
	{
		return (new Toast("A host player must be logged in to play a game."));
	}
	let opponent = null;
	try
	{
		opponent = await fetch_opponent();
		if (!opponent)
			throw new Error();
	}
	catch (error)
	{
		return (new Toast("An opponent must be logged in to play a game."));
	}
	if (user.username === opponent.username)
		return (new Toast("You cannot play against yourself!"));
	if (win_condition < 3)
		return (new Toast("The win condition must be at least 3!"));
	else if (win_condition > 10)
		return (new Toast("The win condition must be at most 10!"));
	await load_tictactoe_match();
	var game = new TicTacToe(new Player(user.display_name), new Player(opponent.display_name), win_condition);
	game.init();
}