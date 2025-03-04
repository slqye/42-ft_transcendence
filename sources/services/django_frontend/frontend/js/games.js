let pong = null;
let tictactoe = null;

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
		return (new Toast(Toast.ERROR, str_host_player_must_be_logged_in_to_play_a_game()));
	}
	let selected_opponent = document.querySelector("input[name='options-outlined']:checked");
	let opponent = null;
	if (selected_opponent.id == "user-outlined")
	{
		try
		{
			opponent = await fetch_opponent();
			if (!opponent)
				throw new Error();
		}
		catch (error)
		{
			return (new Toast(Toast.ERROR, str_opponent_must_be_logged_in_to_play_a_game()));
		}
		if (user.username === opponent.username)
			return (new Toast(Toast.ERROR, str_cannot_play_against_yourself()));
	}
	if (win_condition < 3)
		return (new Toast(Toast.ERROR, str_win_condition_must_be_at_least_3()));
	else if (win_condition > 10)
		return (new Toast(Toast.ERROR, str_win_condition_must_be_at_most_10()));
	await load_pong_match();
	let game = document.getElementById("game");
	let score = document.getElementById("score");
	if (selected_opponent.id == "user-outlined")
		pong = new Pong(game, score, new Player(user.display_name), new Player(opponent.display_name), win_condition);
	else
		pong = new Pong(game, score, new Player(user.display_name), new Player("AI"), win_condition);
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
		return (new Toast(Toast.ERROR, str_host_player_must_be_logged_in_to_play_a_game()));
	}
	let selected_opponent = document.querySelector("input[name='options-outlined']:checked");
	let opponent = null;
	if (selected_opponent.id == "user-outlined")
	{
		try
		{
			opponent = await fetch_opponent();
			if (!opponent)
				throw new Error();
		}
		catch (error)
		{
			return (new Toast(Toast.ERROR, str_opponent_must_be_logged_in_to_play_a_game()));
		}
		if (user.username === opponent.username)
			return (new Toast(Toast.ERROR, str_cannot_play_against_yourself()));
	}
	if (win_condition < 3)
		return (new Toast(Toast.ERROR, str_win_condition_must_be_at_least_3()));
	else if (win_condition > 10)
		return (new Toast(Toast.ERROR, str_win_condition_must_be_at_most_10()));
	await load_tictactoe_match();
	if (selected_opponent.id == "user-outlined")
		tictactoe = new TicTacToe(new Player(user.display_name), new Player(opponent.display_name), win_condition);
	else
	tictactoe = new TicTacToe(new Player(user.display_name), new Player("AI"), win_condition);
	tictactoe.init();
}

async function	user_switch()
{
	const opponent_user = document.getElementById("opponent_user");
	const opponent_ia = document.getElementById("opponent_ia");
	const launch_btn = document.getElementById("start-game-button");

	opponent_user.classList.remove("d-none");
	opponent_ia.classList.add("d-none");
	if (await Api.is_opponent_login())
		launch_btn.classList.remove("d-none");
	else
		launch_btn.classList.add("d-none");
}

async function	ia_switch()
{
	const opponent_user = document.getElementById("opponent_user");
	const opponent_ia = document.getElementById("opponent_ia");
	const launch_btn = document.getElementById("start-game-button");

	opponent_user.classList.add("d-none");
	opponent_ia.classList.remove("d-none");
	if (!await Api.is_opponent_login())
		launch_btn.classList.remove("d-none");
	else
		launch_btn.classList.add("d-none");
}

function stop_all_games()
{
	if (pong)
	{
		pong.stop();
		pong = null;
	}
	else if (tictactoe)
	{
		tictactoe = null;
	}
}