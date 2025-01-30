# api/authentication.py

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class DualCookieJWTAuthentication(JWTAuthentication):
	"""
	Custom authentication class that checks for 'user_access' and 'opponent_access' cookies.
	Determines which token to use based on the 'X-User-Type' header.
	"""

	def authenticate(self, request):
		user_type = request.headers.get('X-User-Type', 'user').lower()

		if user_type == 'user':
			token = request.COOKIES.get("user_access")
			if token:
				validated = self._validate_token(token)
				if validated:
					return validated
		elif user_type == 'opponent':
			token = request.COOKIES.get("opponent_access")
			if token:
				validated = self._validate_token(token)
				if validated:
					return validated
		else:
			raise AuthenticationFailed("Invalid X-User-Type header. Must be 'user' or 'opponent'.")

		# If no valid token found for the specified user type
		return None

	def _validate_token(self, raw_token):
		"""
		Validates the raw token and returns (user, token) if valid.
		Returns None if invalid.
		"""
		try:
			validated_token = self.get_validated_token(raw_token)
			user = self.get_user(validated_token)
		except (InvalidToken, TokenError, AuthenticationFailed):
			return None

		return (user, validated_token)