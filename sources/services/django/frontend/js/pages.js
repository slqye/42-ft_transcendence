const ERROR_TEMPLATE = "Template error.";

async function	load_navbar()
{
	const header	= document.getElementById("header");
	var navbar		= await new Template("frontend/html/navbar.html").load();

	if (navbar == null)
		return (console.error(ERROR_TEMPLATE));
	header.innerHTML = navbar.string;
}

async function	load_home()
{
	const body	= document.getElementById("body");
	var content	= await new Template("frontend/html/pages/home.html").load();

	if (content == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	body.innerHTML = content.string;
}

async function	load_pong()
{
	const body	= document.getElementById("body");
	var content	= await new Template("frontend/html/pages/pong.html").load();

	if (content == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	body.innerHTML = content.string;
}

async function	load_tictactoe()
{
	const body	= document.getElementById("body");
	var content	= await new Template("frontend/html/pages/tictactoe.html").load();

	if (content == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	body.innerHTML = content.string;
}

async function	load_about()
{
	const body	= document.getElementById("body");
	var content	= await new Template("frontend/html/pages/about.html").load();

	if (content == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	body.innerHTML = content.string;
}

async function	load_signin()
{
	const body	= document.getElementById("body");
	var content	= await new Template("frontend/html/pages/signin.html").load();

	if (content == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	body.innerHTML = content.string;
}

async function	load_signup()
{
	const body	= document.getElementById("body");
	var content	= await new Template("frontend/html/pages/signup.html").load();

	if (content == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	body.innerHTML = content.string;
}