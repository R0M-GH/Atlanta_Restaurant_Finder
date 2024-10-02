from django.contrib import admin
from .models import Favorites, UserProfile

# Register your models here.
admin.site.register(Favorites)
admin.site.register(UserProfile)