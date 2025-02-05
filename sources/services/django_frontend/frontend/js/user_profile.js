async function	set_profile(template)
{
	try
	{
		const request = await new Api("/api/users/me/", Api.USER).request();
		if (request.status == Api.ERROR)
			return (console.error(request.log));
		const data = request.response;
		template.edit.id.set.content("profile_display_name", data.display_name);
		template.edit.id.set.content("profile_user_name", "@" + data.username);
	}
	catch (error)
	{
		return (console.error(error));
	}
}

function	format_time(time)
{
	if (time == 0)
		return ("N/A");
	return (time + " ms");
}

async function	set_profile_history(template)
{
	try
	{
		const request = await new Api("/api/users/me/matches/", Api.USER).request();
		if (request.status == Api.ERROR)
			return (console.error(request.log));
		const data = await request.response;
		const history = template.edit.id.get.element("history");
		for (let index = 0; index < data.length; index++)
		{
			const element = data[index];
			let template_history_item = await new Template("frontend/html/pages/history_item.html").load();
			if (template_history_item == null)
				return console.error(ERROR_TEMPLATE);
			const new_id = "collapse" + index;
			template_history_item.edit.id.set.attribute("match_button", "data-bs-target", "#" + new_id);
			template_history_item.edit.id.set.attribute("match_button", "aria-controls", new_id);
			template_history_item.edit.id.set.attribute("collapseOne", "id", new_id);
			if (element.result == "WIN") // TODO: check if result is properly sent from API, and check whether the current user is the host or the opponent to set the correct background color
				template_history_item.edit.id.add.attribute("match", "class", "bg-success");
			else
				template_history_item.edit.id.add.attribute("match", "class", "bg-danger");
			template_history_item.edit.id.set.content("user_name", element.host_user.display_name);
			template_history_item.edit.id.set.content("opponent_name", element.opponent_user.display_name);
			template_history_item.edit.id.set.attribute("user_profile_icon", "src", element.host_user.avatar_url);
			template_history_item.edit.id.set.attribute("opponent_profile_icon", "src", element.opponent_user.avatar_url);
			if (element.is_pong)
			{
				template_history_item.edit.id.set.attribute("pong_game_stats", "class", "d-block");
				template_history_item.edit.id.set.attribute("game_icon", "src", "/frontend/assets/pong_icon.webp");
				template_history_item.edit.id.set.content("user_score", element.pong_game_stats.user_score);
				template_history_item.edit.id.set.content("opponent_score", element.pong_game_stats.opponent_score);
				template_history_item.edit.id.set.content("table_user_display_name", element.host_user.display_name);
				template_history_item.edit.id.set.content("table_opponent_display_name", element.opponent_user.display_name);
				template_history_item.edit.id.set.content("pong_longest_bounce_streak", element.pong_game_stats.longest_bounce_streak);
				template_history_item.edit.id.set.content("pong_user_max_consecutive_goals", format_time(element.pong_game_stats.user_max_consecutive_goals));
				template_history_item.edit.id.set.content("pong_opponent_max_consecutive_goals", format_time(element.pong_game_stats.opponent_max_consecutive_goals));
				template_history_item.edit.id.set.content("pong_user_average_time_to_score", format_time(element.pong_game_stats.user_average_time_to_score));
				template_history_item.edit.id.set.content("pong_opponent_average_time_to_score", format_time(element.pong_game_stats.opponent_average_time_to_score));
				template_history_item.edit.id.set.content("pong_user_fastest_time_to_score", format_time(element.pong_game_stats.user_fastest_time_to_score));
				template_history_item.edit.id.set.content("pong_opponent_fastest_time_to_score", format_time(element.pong_game_stats.opponent_fastest_time_to_score));
			}
			else
			{	
				template_history_item.edit.id.set.attribute("tictactoe_game_stats", "class", "d-block");
				template_history_item.edit.id.set.attribute("game_icon", "src", "/frontend/assets/tictactoe_icon.png");
				template_history_item.edit.id.set.content("user_score", element.tictactoe_game_stats.user_score);
				template_history_item.edit.id.set.content("opponent_score", element.tictactoe_game_stats.opponent_score);
				template_history_item.edit.id.set.content("table_user_display_name", element.host_user.display_name);
				template_history_item.edit.id.set.content("table_opponent_display_name", element.opponent_user.display_name);
				template_history_item.edit.id.set.content("tictactoe_user_max_consecutive_wins", element.tictactoe_game_stats.user_max_consecutive_wins);
				template_history_item.edit.id.set.content("tictactoe_opponent_max_consecutive_wins", element.tictactoe_game_stats.opponent_max_consecutive_wins);
				template_history_item.edit.id.set.content("tictactoe_user_wins_as_crosses", element.tictactoe_game_stats.user_wins_as_crosses);
				template_history_item.edit.id.set.content("tictactoe_opponent_wins_as_crosses", element.tictactoe_game_stats.opponent_wins_as_crosses);
				template_history_item.edit.id.set.content("tictactoe_user_wins_as_noughts", element.tictactoe_game_stats.user_wins_as_noughts);
				template_history_item.edit.id.set.content("tictactoe_opponent_wins_as_noughts", element.tictactoe_game_stats.opponent_wins_as_noughts);
				template_history_item.edit.id.set.content("tictactoe_user_quickest_win_as_moves", element.tictactoe_game_stats.user_quickest_win_as_moves);
				template_history_item.edit.id.set.content("tictactoe_opponent_quickest_win_as_moves", element.tictactoe_game_stats.opponent_quickest_win_as_moves);
			}
			history.appendChild(template_history_item.edit.id.get.element("match"));
		}
	}
	catch (error)
	{
		return (console.error(error));
	}
}