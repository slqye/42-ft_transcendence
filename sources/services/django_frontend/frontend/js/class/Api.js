class	Api
{
	static SUCCESS = 0;
	static ERROR = 1;
	static USER = "user";
	static OPPONENT = "opponent";

	static DEFAULT_METHOD = "GET";
	static DEFAULT_HEADERS = { "Content-Type": "application/json" };
	static DEFAULT_CREDENTIALS = null;
	static DEFAULT_BODY = {};

	constructor(endpoint, type)
	{
		this.endpoint = endpoint;
		this.type = type;
		this.method = Api.DEFAULT_METHOD;
		this.headers = Api.DEFAULT_HEADERS;
		this.credentials = Api.DEFAULT_CREDENTIALS;
		this.body = Api.DEFAULT_BODY; 
		this.status = Api.SUCCESS;
		this.response = null;
		this.log = null;

		this.add_header("X-User-Type", this.type)
	}

	async request()
	{
		try
		{
			const response = await fetch(this.endpoint,
			{
				method: this.method,
				headers: this.headers,
				credentials: this.credentials,
				body: this.body
			});
			if (response.status == 401 && this.endpoint != "/api/refresh/")
			{
				const refresh_response = await new Api("/api/refresh/", this.type).set_credentials("include").request();
				if (refresh_response.status == Api.ERROR)
				{
					this.status = Api.ERROR;
					this.log = "Token refreshing failed.";
				}
				else if (refresh_response.status == Api.SUCCESS)
					this.request();
			}
			else if (!response.ok)
			{
				this.status = Api.ERROR;
				this.log = "Undefined network error.";
			}
			else
			{
				this.status = Api.SUCCESS;
				this.response = response.json();
			}
		}
		catch (error)
		{
			this.status = Api.ERROR;
			this.log = error;
		}
	}

	// Setters
	set_method(method) { this.method = method; }
	set_headers(headers) { this.header = headers; }
	set_credentials(credentials) { this.credentials = credentials; }
	set_body(body) { this.body = body; }

	// Adders
	add_header(key, value) { this.headers[key] = value; }
	add_body(key, value) { this.body[key] = value; }
}