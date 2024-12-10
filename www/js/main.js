function	load_page(id)
{
	if (id == null)
		return
	const pages = document.querySelectorAll("section");
	pages.forEach(element => {
		element.classList.add("d-none");
	});
	document.getElementById(id).classList.remove("d-none");
	history.pushState(null, null, "#" + id);
}

window.addEventListener("popstate", (event) => {
	if (location.hash != "")
		load_page((location.hash).slice(1));
});