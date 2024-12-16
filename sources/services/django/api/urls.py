from django.urls import path, re_path

from . import views

urlpatterns = [
	path("", views.index, name="index"),
	re_path(r'^frontend/(?P<path>.*)$', views.frontend, name="frontend-file"),
	path("users/", views.UserList.as_view(), name="user-list"),
	path("users/<int:pk>", views.UserDetail.as_view(), name="user-detail")
]