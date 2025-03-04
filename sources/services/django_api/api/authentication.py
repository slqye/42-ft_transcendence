from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.utils import timezone


class DualCookieJWTAuthentication(JWTAuthentication):
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
		return None

	def _validate_token(self, raw_token):
		try:
			validated_token = self.get_validated_token(raw_token)
			user = self.get_user(validated_token)
			if user.is_authenticated:
				user.last_active = timezone.now()
				user.save(update_fields=["last_active"])
		except (InvalidToken, TokenError, AuthenticationFailed):
			return None

		return (user, validated_token)