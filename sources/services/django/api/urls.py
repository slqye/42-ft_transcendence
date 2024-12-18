from django.urls import path, re_path
from . import views

urlpatterns = [
    path('register/', views.RegisterUser.as_view(), name='register'),
    path('token-auth/', views.CustomAuthToken.as_view(), name='api_token_auth'),
	path("users/", views.UserList.as_view(), name="user-list"),
	path("users/<int:pk>", views.UserDetail.as_view(), name="user-detail"),
]