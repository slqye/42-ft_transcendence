class Toast
{
	static SUCCESS	= "frontend/html/toasts/success.html";
	static ERROR	= "frontend/html/toasts/error.html";
	static WARNING	= "frontend/html/toasts/warning.html";

	constructor(type, content)
	{
		this.type = type;
		this.content = content;

		this.load();
	}

	async load()
	{
		const container = document.getElementById("toasts");
		let toast = await new Template(this.type).load();

		if (toast == null)
			return (new Toast(Toast.ERROR, str_template_error()));
		toast.edit.class.set.contents("toast-body", this.content);
		container.innerHTML = toast.string;
		let toast_bootstrap = bootstrap.Toast.getOrCreateInstance(document.getElementById("liveToast"));
		toast_bootstrap.show();
	}
}