from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add related_name to avoid clashes with the default auth.User model
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Change this to a unique related_name
        blank=True,
        help_text=('The groups this user belongs to. A user will get all permissions '
                   'granted to each of their groups.'),
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',  # Change this to a unique related_name
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='user',
    )

    # Add any additional fields or methods here
