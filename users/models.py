# users/models.py - Custom User Model
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    role = models.CharField(max_length=10, choices=[
        ('student', 'Student'),
        ('admin', 'Admin'),
    ])
    auth_provider = models.CharField(max_length=10, default='email')
    is_profile_complete = models.BooleanField(default=False)