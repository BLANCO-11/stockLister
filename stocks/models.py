from django.db import models

class Stock(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    data = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)
