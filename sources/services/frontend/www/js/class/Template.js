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
}