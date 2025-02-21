from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import User

@receiver(post_migrate)
def create_ai_user(sender, **kwargs):
	if sender.name == 'api':
		ai_username = "AI"
		if not User.objects.filter(username=ai_username).exists():
			ai_user = User.objects.create_user(
				username=ai_username,
				display_name="AI",
				is_ai=True,
				avatar_url="frontend/assets/user_media/uploads/AI.png"
			)
			ai_user.set_unusable_password()
			ai_user.save()
			print("AI user created.")
		else:
			print("AI user already exists.")