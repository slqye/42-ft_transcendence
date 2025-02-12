from django.urls import path, re_path, include
from . import views

urlpatterns = [
	# USER registration and token management
	path('register/', views.RegisterUser.as_view(), name='register'),
	path('user/login/', views.UserLoginView.as_view(), name='user_login'),
	path('user/logout/', views.UserLogoutView.as_view(), name='user-logout'),
	path('user/refresh/', views.UserTokenRefreshView.as_view(), name='user-logout'),
	path('opponent/login/', views.OpponentLoginView.as_view(), name='opponent_login'),
	path('opponent/logout/', views.OpponentLogoutView.as_view(), name='opponent_logout'),
	path('opponent/refresh/', views.OpponentTokenRefreshView.as_view(), name='opponent_logout'),

	# User stuff
	path("users/", views.UserList.as_view(), name="user-list"),
	path("users/me/", views.CurrentUser.as_view(), name="current-user"),
	path("users/<int:pk>/", views.UserDetail.as_view(), name="user-detail"),
	path("users/update/<str:field>/", views.UpdateUserField.as_view(), name="update-user-field"),
	path('users/<str:username>/', views.UserFetchUsername.as_view(), name='user-detail-username'),

	# Friendships
	path('friendships/', views.FriendshipView.as_view(), name='friendship'),
	path('friendships/<str:pk>/', views.FriendshipView.as_view(), name='friendship-detail'),
	path('users/<str:pk>/friendships/', views.FriendListView.as_view(), name='user-friendship-list'),

	# Matches information
	path("users/<str:pk>/matches/", views.UserMatches.as_view(), name="user-matches"),
	path("users/<str:pk>/matches/ttt/", views.UserTicTacToeMatches.as_view(), name="user-ttt-matches"),
	path("users/<str:pk>/matches/pong/", views.UserPongMatches.as_view(), name="user-pong-matches"),
	path("users/<str:pk>/tournaments/", views.UserTournaments.as_view(), name="user-tournaments"),
	path("users/<str:pk>/stats/", views.UserStats.as_view(), name="user-stats"),

	# Match creation
	path('invitations/', views.InvitationCreateView.as_view(), name='invitation-create'),
	path('invitations/<int:pk>/accept/', views.InvitationAcceptView.as_view(), name='invitation-accept'),

	path('42oauth/callback/', views.OAuthCallbackView.as_view(), name='callback'),
	path('config/', views.FrontendConfigView.as_view(), name="config"),
]
