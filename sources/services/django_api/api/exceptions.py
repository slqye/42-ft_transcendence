from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
	response = exception_handler(exc, context)
	request = context.get('request')
	if response is not None and isinstance(response.data, dict):
		detail_messages = []
		for key, value in response.data.items():
			if isinstance(value, list):
				detail_messages.extend(value)
			else:
				detail_messages.append(str(value))
				print(str(value))
		messages = translate_message(detail_messages, request)
		response.data = {"detail": " ".join(messages)}
	return response

def translate_message(error_messages, request):
	preferred_lang = request.headers.get("Preferred-Language", "en")
	if preferred_lang not in ("en", "fr", "de"):
		preferred_lang = "en"
	translations = {
		"user with this username already exists.": {
			"en": "user with this username already exists.",
			"fr": "Un utilisateur avec ce nom d'utilisateur existe déjà.",
			"de": "Ein Benutzer mit diesem Benutzernamen existiert bereits."
		},
		"user with this display name already exists.": {
			"en": "user with this display name already exists.",
			"fr": "Un utilisateur avec ce nom d'affichage existe déjà.",
			"de": "Ein Benutzer mit diesem Anzeigenamen existiert bereits."
		},
		"input contains too many characters.": {
			"en": "input contains too many characters.",
			"fr": "L'entrée contient trop de caractères.",
			"de": "Die Eingabe enthält zu viele Zeichen."
		}
	}
	translated_messages = []
	for message in error_messages:
		if message == "user with this username already exists.":
			localized_message = translations["user with this username already exists."].get(preferred_lang, message)
			translated_messages.append(localized_message)
		elif message == "user with this display name already exists.":
			localized_message = translations[message].get(preferred_lang, message)
			translated_messages.append(localized_message)
		elif message.startswith("Ensure this field has no more than"):
			localized_message = translations["input contains too many characters."].get(preferred_lang, message)
			translated_messages.append(localized_message)

				
	
	return translated_messages
