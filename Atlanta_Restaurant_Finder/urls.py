from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.hi, name='home-page'),
    #path('accounts/', include("django.contrib.auth.urls")),
    path('accounts/login/', views.login_view, name='login'),
    path('accounts/logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('map.html/', views.map_view),
    path('Forget/', views.ForgetView),
    path('map.html/api/save_favorite/<str:place_id>/', views.save_favorite, name='save_favorite'),
    path('map.html/api/load_favorites/', views.load_favorites, name='load_favorites'),
    path('map.html/api/get_cuisine/<str:place_details>/', views.get_cuisine, name='get_cuisine'),
]