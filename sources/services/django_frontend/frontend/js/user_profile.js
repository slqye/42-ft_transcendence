function	format_winrate_value(rate)
{
	return (rate.toFixed(0) + "%");
}

async function	set_profile(template, pk = "me")
{
	try
	{
		const request = await new Api("/api/users/" + pk + "/", Api.USER).request();
		if (request.status == Api.ERROR)
			return (console.error(request.log));
		const request_stats = await new Api("/api/users/" + pk + "/stats/", Api.USER).request();
		if (request_stats.status == Api.ERROR)
			return (console.error(request_stats.log));
		const data = request.response;
		template.edit.id.set.content("profile_display_name", data.display_name);
		template.edit.id.set.content("profile_user_name", "@" + data.username);
		template.edit.id.set.attribute("profile_icon", "src", data.avatar_url);
		let pong_winrate = request_stats.response.pong_winrate;
		if (request_stats.response.pong_matches_played == 0)
			pong_winrate = 50;
		let pong_lose_rate = 100 - pong_winrate;
		let tictactoe_winrate = request_stats.response.tictactoe_winrate;
		if (request_stats.response.tictactoe_matches_played == 0)
			tictactoe_winrate = 50;
		let tictactoe_lose_rate = 100 - tictactoe_winrate;
		template.edit.id.set.style("pong_winrate", "width", pong_winrate + "%");
		template.edit.id.set.style("pong_lose_rate", "width", pong_lose_rate + "%");
		template.edit.id.set.style("tictactoe_winrate", "width", tictactoe_winrate + "%");
		template.edit.id.set.style("tictactoe_lose_rate", "width", tictactoe_lose_rate + "%");
		template.edit.id.set.content("pong_winrate_value", format_winrate_value(pong_winrate));
		template.edit.id.set.content("tictactoe_winrate_value", format_winrate_value(tictactoe_winrate));
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
	return ((time / 1000).toFixed(2) + " s");
}

function	format_number(number)
{
	if (number == 0)
		return ("N/A");
	return (number);
}

async function	set_profile_history(template, pk = "me")
{
	try
	{
		const request = await new Api("/api/users/" + pk + "/matches/", Api.USER).request();
		if (request.status == Api.ERROR)
			return (console.error(request.log));
		const request_profile = await new Api("/api/users/" + pk + "/", Api.USER).request();
		if (request_profile.status == Api.ERROR)
			return (console.error(request_profile.log));
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
			if (element.result == 2)
				template_history_item.edit.id.add.attribute("match_button", "class", " bg-warning");
			else if ((element.result == 0 && element.host_user.username == request_profile.response.username) || (element.result == 1 && element.opponent_user.username == request_profile.response.username))
				template_history_item.edit.id.add.attribute("match_button", "class", " bg-success");
			else
				template_history_item.edit.id.add.attribute("match_button", "class", " bg-danger");
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
				template_history_item.edit.id.set.content("pong_user_display_name", element.host_user.display_name);
				template_history_item.edit.id.set.content("pong_opponent_display_name", element.opponent_user.display_name);
				template_history_item.edit.id.set.content("pong_longest_bounce_streak", element.pong_game_stats.longest_bounce_streak);
				template_history_item.edit.id.set.content("pong_user_max_consecutive_goals", element.pong_game_stats.user_max_consecutive_goals);
				template_history_item.edit.id.set.content("pong_opponent_max_consecutive_goals", element.pong_game_stats.opponent_max_consecutive_goals);
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
				template_history_item.edit.id.set.content("tictactoe_user_display_name", element.host_user.display_name);
				template_history_item.edit.id.set.content("tictactoe_opponent_display_name", element.opponent_user.display_name);
				template_history_item.edit.id.set.content("tictactoe_user_max_consecutive_wins", element.tictactoe_game_stats.user_max_consecutive_wins);
				template_history_item.edit.id.set.content("tictactoe_opponent_max_consecutive_wins", element.tictactoe_game_stats.opponent_max_consecutive_wins);
				template_history_item.edit.id.set.content("tictactoe_user_wins_as_crosses", element.tictactoe_game_stats.user_wins_as_crosses);
				template_history_item.edit.id.set.content("tictactoe_opponent_wins_as_crosses", element.tictactoe_game_stats.opponent_wins_as_crosses);
				template_history_item.edit.id.set.content("tictactoe_user_wins_as_noughts", element.tictactoe_game_stats.user_wins_as_noughts);
				template_history_item.edit.id.set.content("tictactoe_opponent_wins_as_noughts", element.tictactoe_game_stats.opponent_wins_as_noughts);
				template_history_item.edit.id.set.content("tictactoe_user_quickest_win_as_moves", format_number(element.tictactoe_game_stats.user_quickest_win_as_moves));
				template_history_item.edit.id.set.content("tictactoe_opponent_quickest_win_as_moves", format_number(element.tictactoe_game_stats.opponent_quickest_win_as_moves));
			}
			history.appendChild(template_history_item.edit.id.get.element("match"));
		}
	}
	catch (error)
	{
		return (console.error(error));
	}
}

async function	set_profile_tournament_history(template, pk = "me")
{
	try
	{
		const request = await new Api("/api/users/" + pk + "/tournaments/", Api.USER).request();
		if (request.status == Api.ERROR)
			return (console.error(request.log));
		const request_profile = await new Api("/api/users/" + pk + "/", Api.USER).request();
		if (request_profile.status == Api.ERROR)
			return (console.error(request_profile.log));
		let user = await request_profile.response;
		const data = await request.response;
		const tournament_history = template.edit.id.get.element("history_tournaments");
		for (let index = 0; index < data.length; index++)
		{
			const element = data[index];
			let template_history_item = await new Template("frontend/html/pages/history_tournament_item.html").load();
			if (template_history_item == null)
				return console.error(ERROR_TEMPLATE);
			let ranking = element.participants_ranking;
			let winner = ranking[ranking.length];
			if (user.username == winner.username)
				template_history_item.edit.id.add.attribute("tournament_button", "class", " bg-success");
			else
				template_history_item.edit.id.add.attribute("tournament_button", "class", " bg-warning");
			template_history_item.edit.it.set.attribute("user_profile_icon", "src", winner.avatar_url);
			template_history_item.edit.id.set.content("user_name", winner.username);
			template_history_item.edit.id.set.content("tournament_name", element.name);
			for (let rank_index = 0; rank_index < ranking.length; rank_index++) {
				const user_ranked = ranking[ranking.length - rank_index];
				let line = `
					<tr>
						<td class="text-start">${user_ranked.username}</td>
						<td>#${rank_index}</td>
					</tr>
				`
				template_history_item.edit.id.set.content("user_ranking_container", line);
			}
	
			tournament_history.appendChild(template_history_item.edit.id.get.element("tournament"));
		}
	}
	catch (error)
	{
		return (console.error(error));
	}
}