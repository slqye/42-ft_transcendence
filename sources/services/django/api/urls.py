from django.urls import path

from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("users/", views.UserList.as_view(), name="user-list"),
	path("users/<int:pk>", views.UserDetail.as_view(), name="user-detail")
]