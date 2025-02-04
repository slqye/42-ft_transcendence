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
	const request = await new Api("/api/users/me/", Api.USER).request();
	if (request.status == Api.ERROR)
		return null;
	return request.response;
}

async function	fetch_opponent()
{
	const request = await new Api("/api/users/me/", Api.OPPONENT).request();
	if (request.status == Api.ERROR)
		return null;
	return request.response;
}

async function createInvitation(toUserId, tournamentId = null) {
	const url = '/api/invitations/';
	toUserId = 2
	const pongGameStats = {
		user_score: 0,
		opponent_score: 0,
		user_fastest_time_to_score: 0,
		opponent_fastest_time_to_score: 0,
		user_max_consecutive_goals: 0,
		opponent_max_consecutive_goals: 0,
		user_average_time_to_score: 0,
		opponent_average_time_to_score: 0,
		longest_bounce_streak: 0
	  };
	// Build the request payload.
	const payload = {
	  to_user: toUserId,
	  is_pong: true, // set true if invitation is for a Pong game.
	};
  
	// Include pong game stats if provided.
	if (pongGameStats) {
	  payload.pong_game_stats = pongGameStats;
	}
  
	try {
	  const response = await fetch(url, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		  // Set the required header for creating an invitation.
		  'X_User_Type': 'user',
		  // Add other headers like Authorization if needed.
		},
		body: JSON.stringify(payload)
	  });
  
	  if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`Failed to create invitation: ${JSON.stringify(errorData)}`);
	  }
  
	  const data = await response.json();
	  console.log('Invitation created successfully:', data);
	  return data;
	} catch (error) {
	  console.error('Error creating invitation:', error);
	  throw error;
	}
  }

  async function acceptInvitation() {
	const url = `/api/invitations/2/accept/`;
  
	try {
	  const response = await fetch(url, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		  'X_User_Type': 'opponent',
		},
		// The accept endpoint does not require a body per your description.
	  });
  
	  if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`Failed to accept invitation: ${JSON.stringify(errorData)}`);
	  }
  
	  const data = await response.json();
	  console.log('Invitation accepted successfully:', data);
	  return data;
	} catch (error) {
	  console.error('Error accepting invitation:', error);
	  throw error;
	}
  }