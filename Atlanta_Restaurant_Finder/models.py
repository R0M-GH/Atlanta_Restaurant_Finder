from django.db import models
from Restaurant_Finder.db_connection import db
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.backends import BaseBackend

# Create your models here.
users_collection = db['users']



class User:
    @staticmethod
    def authenticate(username, password):
        user = users_collection.find_one({"username": username})
        if user is not None and check_password(password, user["password"]):
            return user
        return None