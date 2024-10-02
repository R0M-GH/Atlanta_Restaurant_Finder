from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.hi, name='home-page'),
    path('accounts/login/', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    path('home/', views.homeView),
    path('map.html', views.mapView),
    path('accounts/logout/', views.logout_view, name='logout'),
]