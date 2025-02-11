async function	update_player_number()
{
	const select = document.getElementById("player_number_select");
	const player_number = parseInt(Array.from(select.selectedOptions).map(option => option.value), 10);
	const container = document.getElementById("players_input_container");
	const template = await new Template("frontend/html/pages/player_input.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	container.innerHTML = "";
	for (let index = 0; index < player_number; index++)
	{
		template.edit.id.set.attribute("player_input", "id", `player_input_${index}`);
		container.innerHTML += template.value;
	}
}