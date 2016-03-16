from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import hashers


# Create your models here.


class CustomUser(AbstractUser):
    def validate_password(self, password):
        return hashers.check_password(password, self.password)
