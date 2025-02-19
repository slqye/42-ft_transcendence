"""
URL configuration for website project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from api import views

urlpatterns = [
	# Admin URLs
	path('admin/', admin.site.urls),

	# API URLs
	path('api/', include('api.urls')),

	# Prometheus
	path('', include('django_prometheus.urls')),

	# Catch-all for any other URL -> index view
	path('', views.index, name='index'),
	path('<path:path>', views.index, name='catch-all-index'),


]
