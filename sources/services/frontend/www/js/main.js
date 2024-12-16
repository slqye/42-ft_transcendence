async function	main()
{
	const header	= document.getElementById("header");
	const content	= document.getElementById("content");

	var navbar = await new Template("html/navbar.html").load();
	if (!navbar)
		return (console.error("Template failed."));
	header.innerHTML = navbar.string;
	var home = await new Template("html/pages/home.html").load();
	if (!home)
		return (console.error("Template failed."));
	content.innerHTML = home.string;
}