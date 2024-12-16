class Editor
{
	constructor(template)
	{
		this.template = template;
		this.id = {
			content: (_id, content) => {
				const element = this.template.html.getElementById(_id);
				if (element)
					element.innerHTML = content;
				this.template.update();
			},
			attribute: (_id, key, value) =>
			{
				const element = this.template.html.getElementById(_id);
				if (element)
					element.setAttribute(key, value);
				this.template.update();
			}
		}
		this.class = {
			content: (_class, content) =>
			{
				const elements = this.template.html.getElementsByClassName(_class);
				elements.forEach(element =>
				{
					element.innerHTML = content;
				});
				this.template.update();
			},
			attribute: (_class, key, value) =>
			{
				const elements = this.template.html.getElementsByClassName(_class);
				elements.forEach(element =>
				{
					element.setAttribute(key, value);
				});
				this.template.update();
			}
		}
	}
}