from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.hi, name='home-page'),
    #path('accounts/', include("django.contrib.auth.urls")),
    path('login/', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    path('home/', views.homeView),
    path('map.html', views.mapView),
]

