const ERROR_TEMPLATE = "Template error.";

class	Template
{
	constructor(path)
	{
		this.parser	= new DOMParser();
		this.editor	= new Editor(this);
		this.path	= path;
		this.string	= null;
		this.html	= null;
	}

	async	load()
	{
		try
		{
			const response = await fetch(this.path);
			if (!(response.status >= 200 && response.status < 300))
				throw new Error;
			this.string = await response.text();
			this.html = this.parser.parseFromString(this.string, "text/html");

			const language = localStorage.getItem("preferred-language") || "en";

			const elements = this.html.querySelectorAll("[data-translate]");
			elements.forEach((element) => {
			  const key = element.getAttribute("data-translate");
			  if (translations[language] && translations[language][key]) {
				element.textContent = translations[language][key];
			  }
			});

			const placeholderElements = this.html.querySelectorAll("[data-translate-placeholder]");
			placeholderElements.forEach((element) => {
				const key = element.getAttribute("data-translate-placeholder");
				if (translations[language] && translations[language][key]) {
					element.setAttribute("placeholder", translations[language][key]);
				}
			});
	  
			this.string = this.html.documentElement.outerHTML;
			return (this);
		}
		catch
		{
			return (null);
		}
	}

	update()
	{
		if (this.html != null)
			this.string = this.html.documentElement.outerHTML;
	}

	get edit()
	{
		return (this.editor);
	}

	get value()
	{
		this.update();
		return (this.string);
	}
}