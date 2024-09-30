from django.db import models
from Restaurant_Finder.db_connection import db
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.backends import BaseBackend

# Create your models here.
users_collection = db['users']



class User:
    @staticmethod
    def authenticate(username, password):
        user_check = users_collection.find_one({"username": username})
        if user_check is not None and check_password(password, user_check["password"]):
            return user_check
        return None
