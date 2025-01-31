async function	launch_pong_match()
{
	const user = await fetch_me();
	if (!user)
		return (new Toast("A host player must be logged in to play a game."));
	const opponent = await fetch_opponent();
	if (!opponent)
		return (new Toast("An opponent must be logged in to play a game."));
	// create game with API endpoint
	//
	// retrieve the data from the API endpoint
	//
	// create the game with the data
	var game = new Pong(new Player(user.display_name), new Player(opponent.display_name));
	// load the game page
	await load_pong_match();
	// initialize the game
}

async function	launch_tictactoe_match()
{
	let win_condition = document.getElementById("win-condition").value;
	let user = null;
	try
	{
		user = await fetch_me();
		if (!user)
			return (new Toast("A host player must be logged in to play a game."));
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
			return (new Toast("An opponent must be logged in to play a game."));
	}
	catch (error)
	{
		return (new Toast("An opponent must be logged in to play a game."));
	}
	if (user.username === opponent.username)
		return (new Toast("You cannot play against yourself!"));
	await load_tictactoe_match();
	var game = new TicTacToe(new Player(user.username), new Player(opponent.username), win_condition); //TODO: change to display_name once set up
	game.init();
}