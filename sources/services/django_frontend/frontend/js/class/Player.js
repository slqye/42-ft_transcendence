class Player
{
	constructor(name)
	{
		this.name = name;
		this.score = 0;

		// Pong game stats
		this.fastest_time_to_score = 0;
		this.consecutive_goals = 0;
		this.max_consecutive_goals = 0;
		this.goals_times = [];
		this.average_time_to_score = 0;

		// TicTacToe game stats
		this.symbol = null;
		this.consecutive_wins = 0;
		this.max_consecutive_wins = 0;
		this.wins_as_crosses = 0;
		this.wins_as_noughts = 0;
		this.quickest_win_moves = 0;
	}
}
