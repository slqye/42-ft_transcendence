from django.urls import path, re_path, include
from . import views

urlpatterns = [
	path('register/', views.RegisterUser.as_view(), name='register'),
	path('token-auth/', views.CustomAuthToken.as_view(), name='api_token_auth'),

	path("users/", views.UserList.as_view(), name="user-list"),
	path("users/me/", views.CurrentUser.as_view(), name="current-user"),
	path("users/<int:pk>", views.UserDetail.as_view(), name="user-detail"),

	path("users/<str:pk>/matches/ttt/", views.UserTicTacToeMatches.as_view(), name="user-ttt-matches"),
    path("users/<str:pk>/matches/pong/", views.UserPongMatches.as_view(), name="user-pong-matches"),
    path("users/<str:pk>/tournaments/", views.UserTournaments.as_view(), name="user-tournaments"),
	path("users/<str:pk>/stats/", views.UserStats.as_view(), name="user-stats"),
	path("users/update/<str:field>/", views.UpdateUserField.as_view(), name="update-user-field"),

	path("match/", views.MatchList.as_view(), name="match-list"),
	path("match/<int:pk>", views.MatchDetail.as_view(), name="match-detail"),
	path('42oauth/callback/', views.OAuthCallbackView.as_view(), name='callback'),
	path('config/', views.FrontendConfigView.as_view(), name="config"),
]
