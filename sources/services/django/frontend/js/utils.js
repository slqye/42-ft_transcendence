function	switch_theme()
{
	const body = document.querySelector("body");
	const icon = document.getElementById("theme_icon");
	if (body.getAttribute("data-bs-theme") == "dark")
	{
		body.setAttribute("data-bs-theme", "light");
		body.classList.remove("bg-dark");
		body.classList.add("bg-light");
		icon.src = "frontend/assets/moon-fill.svg";
		icon.style.filter = "invert(0%)";
	}
	else
	{
		body.setAttribute("data-bs-theme", "dark");
		body.classList.remove("bg-light");
		body.classList.add("bg-dark");
		icon.src = "frontend/assets/sun-fill.svg";
		icon.style.filter = "invert(100%)";
	}
}