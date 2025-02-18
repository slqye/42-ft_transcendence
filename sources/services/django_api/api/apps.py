# api/apps.py
from django.apps import AppConfig

class ApiConfig(AppConfig):
	name = 'api'

	def ready(self):
		# Import signals so they are registered.
		import api.signals