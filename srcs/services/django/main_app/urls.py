from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
	path("create_user/", views.create_user, name="create_user"),
	path("display_first_user/", views.display_first_user, name="display_first_user"),
]
