# models.py
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birthday = models.DateField()

    def __str__(self):
        return self.user.username


class Favorites(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    place_id = models.TextField()

    class Meta:
        unique_together = ('user', 'place_id')

    def __str__(self):
        return f"{self.user.username} - {self.place_id}"
