function	switch_theme()
{
	const body = document.querySelector("body");

	if (body.getAttribute("data-bs-theme") == "dark")
		switch_theme_light(body);
	else
		switch_theme_dark(body);
}

function	switch_theme_light(body)
{
	const icon_sun = document.getElementById("theme_icon_sun");
	const icon_moon = document.getElementById("theme_icon_moon");

	body.setAttribute("data-bs-theme", "light");
	body.classList.remove("bg-dark");
	body.classList.add("bg-light");
	icon_sun.classList.remove("d-lg-inline-block");
	icon_sun.classList.add("d-lg-none");
	icon_moon.classList.remove("d-lg-none");
	icon_moon.classList.add("d-lg-inline-block");
}
function	switch_theme_dark(body)
{
	const icon_sun = document.getElementById("theme_icon_sun");
	const icon_moon = document.getElementById("theme_icon_moon");

	body.setAttribute("data-bs-theme", "dark");
	body.classList.remove("bg-light");
	body.classList.add("bg-dark");
	icon_moon.classList.remove("d-lg-inline-block");
	icon_moon.classList.add("d-lg-none");
	icon_sun.classList.remove("d-lg-none");
	icon_sun.classList.add("d-lg-inline-block");
}

function isMobile()
{
	const userAgent = navigator.userAgent.toLowerCase();
	return (/iphone|ipod|android|webos|blackberry|iemobile|opera mini/.test(userAgent));
}