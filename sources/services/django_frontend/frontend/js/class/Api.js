class	Api
{
	static SUCCESS = 0;
	static ERROR = 1;
	static USER = "user";
	static OPPONENT = "opponent";

	static DEFAULT_METHOD = "GET";
	static DEFAULT_HEADERS = { "Content-Type": "application/json" };
	static DEFAULT_CREDENTIALS = "include";
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
		this.omit_refresh = false;
		this.code = 0;
		this.response = null;
		this.log = null;
		this.depth = 0;

		this.add_header("X-User-Type", this.type)
	}

	async request()
	{
		this.depth++;
		if (this.depth > 2)
		{
			this.status = Api.ERROR;
			this.log = "Network error.";
			return (this);
		}
		try
		{
			const options = {
				method: this.method,
				headers: this.headers,
				credentials: this.credentials,
			};
			if (this.body != Api.DEFAULT_BODY)
				options.body = this.body;
			const response = await fetch(this.endpoint, options);
			this.code = response.status;
			if (this.credentials == "include" && response.status == 401 && this.endpoint != "/api/refresh/" && !this.omit_refresh)
			{
				let endpoint = "/api/user/refresh/";
				if (this.type == Api.OPPONENT)
					endpoint = "/api/opponent/refresh/";
				const refresh_response = await new Api(endpoint, this.type).set_credentials("include").set_method("POST").request();
				if (refresh_response.status == Api.ERROR)
				{
					this.status = Api.ERROR;
					this.log = "Token refreshing failed.";
				}
				else if (refresh_response.status == Api.SUCCESS)
				{
					return (this.request());
				}
			}
			else if (!response.ok)
			{
				this.status = Api.ERROR;
				this.log = response.status + " network error.";
			}
			else
			{
				this.status = Api.SUCCESS;
				this.response = await response.json();
			}
		}
		catch (error)
		{
			this.status = Api.ERROR;
			this.log = error;
		}
		return (this);
	}

	static async is_login()
	{
		if (localStorage.getItem("user_authenticated") == "true")
		{
			const request = await new Api("/api/users/me/", Api.USER).request();
			if (request.status != Api.ERROR)
				return (true);
		}
		localStorage.removeItem("user_authenticated");
		return (false);
	}

	static async is_opponent_login()
	{
		if (localStorage.getItem("opponent_authenticated") == "true")
		{
			const request = await new Api("/api/users/me/", Api.OPPONENT).request();
			if (request.status != Api.ERROR)
				return (true);
		}
		localStorage.removeItem("opponent_authenticated");
		return (false);
	}

	// Setters
	set_method(method) { this.method = method; return (this); }
	set_headers(headers) { this.header = headers; return (this); }
	set_credentials(credentials) { this.credentials = credentials; return (this); }
	set_body(body) { this.body = body; return (this); }
	set_omit_refresh(omit_refresh) { this.omit_refresh = omit_refresh; return (this); }

	// Adders
	add_header(key, value) { this.headers[key] = value; return (this); }
	add_body(key, value) { this.body[key] = value; return (this); }
}