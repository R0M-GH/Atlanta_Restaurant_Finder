from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.hi, name='home-page'),
    path('accounts/', include("django.contrib.auth.urls")),
    path('register/', views.register, name='register'),
    path('home/', views.homeView),
    path('map.html', views.mapView),
    path('api/save_favorite', views.save_favorite, name='save_favorite'),
    path('api/load_favorites', views.load_favorites, name='load_favorites'),
]