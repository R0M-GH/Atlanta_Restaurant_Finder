from django.db import models
from django.contrib.auth.models import User


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    place_id = models.CharField(max_length=255)  # Use place_id to uniquely identify the restaurant
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Favorite)"

    class Meta:
        unique_together = ('user', 'place_id')