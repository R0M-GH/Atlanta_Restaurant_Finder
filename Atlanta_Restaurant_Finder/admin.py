from django.contrib import admin
from Atlanta_Restaurant_Finder.models.Favorites import Favorites
from Atlanta_Restaurant_Finder.models.UserProfile import UserProfile

# Register your models here.
admin.site.register(Favorites)
admin.site.register(UserProfile)