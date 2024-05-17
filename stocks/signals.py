# stocks/signals.py
import requests
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.conf import settings
from .models import Stock

@receiver(post_migrate)
def fetch_initial_stock_data(sender, **kwargs):
    symbols = ["AAPL", "GOOGL", "MSFT"]  # Add more stock symbols as needed
    api_key = settings.API_KEY
    base_url = "https://www.alphavantage.co/query"

    for symbol in symbols:
        params = {
            "function": "TIME_SERIES_INTRADAY",
            "symbol": symbol,
            "interval": "1min",
            "apikey": api_key
        }
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            data = response.json()
            Stock.objects.update_or_create(
                symbol=symbol,
                defaults={"data": data}
            )
