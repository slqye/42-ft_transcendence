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
	const signin_42_btn = document.getElementById("signin_42");
	const logo_42 = document.getElementById("logo_42");

	body.setAttribute("data-bs-theme", "light");
	body.classList.remove("bg-dark");
	body.classList.add("bg-light");
	icon_sun.classList.remove("d-lg-inline-block");
	icon_sun.classList.add("d-lg-none");
	icon_moon.classList.remove("d-lg-none");
	icon_moon.classList.add("d-lg-inline-block");

	if (logo_42) {
		logo_42.src = "/frontend/assets/42logo_light.svg";
	}

	if (signin_42_btn) {
		signin_42_btn.classList.remove("btn-outline-light");
		signin_42_btn.classList.add("btn-outline-dark");
	}
}

function	switch_theme_dark(body)
{
	const icon_sun = document.getElementById("theme_icon_sun");
	const icon_moon = document.getElementById("theme_icon_moon");
	const logo_42 = document.getElementById("logo_42");
	const signin_42_btn = document.getElementById("signin_42");
	body.setAttribute("data-bs-theme", "dark");
	body.classList.remove("bg-light");
	body.classList.add("bg-dark");
	icon_moon.classList.remove("d-lg-inline-block");
	icon_moon.classList.add("d-lg-none");
	icon_sun.classList.remove("d-lg-none");
	icon_sun.classList.add("d-lg-inline-block");

	if (logo_42) {
		logo_42.src = "/frontend/assets/42logo_dark.svg";
	}

	if (signin_42_btn) {
		signin_42_btn.classList.remove("btn-outline-dark");
		signin_42_btn.classList.add("btn-outline-light");
	}
}

function	isMobile()
{
	const userAgent = navigator.userAgent.toLowerCase();
	return (/iphone|ipod|android|webos|blackberry|iemobile|opera mini/.test(userAgent));
}

async function	fetch_me()
{
	const response = await fetch("/api/users/me/", {
		method: "GET",
		headers: {
		"Content-Type": "application/json"
		},
			credentials: 'include'
		});
	if (!response.ok)
		return null;
	return await response.json();
}

async function	fetch_opponent()
{
	if (document.cookie.includes("opponent_access"))
	{
		const response = await fetch("/api/opponent/me/", {
			method: "GET",
			headers: {
			"Content-Type": "application/json"
			},
			credentials: 'include'
		});
		if (!response.ok)
			return null;
		return await response.json();
	}
	return null;
}