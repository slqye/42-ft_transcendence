from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class DualCookieJWTAuthentication(JWTAuthentication):
    """
    A custom authentication class that looks in two separate cookies:
      - 'user_access'
      - 'opponent_access'
    It returns the first valid token it finds.
    """

    def authenticate(self, request):
        # 1) Look for user_access cookie
        user_token = request.COOKIES.get("user_access", None)
        if user_token:
            validated = self._validate_token(user_token)
            if validated is not None:  # if valid, return it
                return validated

        # 2) If not found or invalid, look for opponent_access cookie
        opponent_token = request.COOKIES.get("opponent_access", None)
        if opponent_token:
            validated = self._validate_token(opponent_token)
            if validated is not None:
                return validated

        # If neither token is provided or both invalid, no authentication is done
        return None

    def _validate_token(self, raw_token):
        """
        Helper to validate a raw token string using JWTAuthentication's methods.
        If valid, returns (user, token); if not valid, returns None.
        """
        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
        except (InvalidToken, TokenError, AuthenticationFailed):
            return None

        return (user, validated_token)