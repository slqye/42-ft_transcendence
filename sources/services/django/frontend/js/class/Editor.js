class Editor
{
	constructor(template)
	{
		this.template = template;
		this.id = {
			get: {
				element: (_id) => {
					const element = this.template.html.getElementById(_id);
					if (element)
						return (element);
					return (null);
				},
				content: (_id) => {
					const element = this.template.html.getElementById(_id);
					if (element)
						return (element.innerHTML);
					return (null);
				},
				attribute: (_id, key) =>
				{
					const element = this.template.html.getElementById(_id);
					if (element)
						return (element.getAttribute(key));
					return (null);
				}
			},
			set: {
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
		};
		this.class = {
			get: {
				elements: (_class) => {
					const elements = this.template.html.getElementsByClassName(_class);
					if (elements)
						return (elements);
					return (null);
				},
				contents: (_class) => {
					const elements = this.template.html.getElementsByClassName(_class);
					var result = [];
					if (elements.length > 0)
					{
						Array.from(elements).forEach(element =>
						{
							result.push(element.innerHTML);
						});
						return (result);
					}
					return (null);
				},
				attributes: (_class, key) =>
				{
					const elements = this.template.html.getElementsByClassName(_class);
					var result = [];
					if (elements.length > 0)
					{
						Array.from(elements).forEach(element =>
						{
							result.push(element.getAttribute(key));
						});
						return (result);
					}
					return (null);
				}
			},
			set: {
				contents: (_class, content) => {
					const elements = this.template.html.getElementsByClassName(_class);
					elements.forEach(element =>
					{
						element.innerHTML = content;
					});
					this.template.update();
				},
				attributes: (_class, key, value) =>
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
}