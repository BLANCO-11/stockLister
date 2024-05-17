from django.core.management.base import BaseCommand
import requests
from django.conf import settings
from stocks.models import Stock

class Command(BaseCommand):
    help = 'Fetch initial stock data from Alpha Vantage API'

    def add_arguments(self, parser):
        parser.add_argument('symbol', nargs='+', type=str, help='Stock symbol(s) to fetch data for')

    def handle(self, *args, **kwargs):
        
        symbols = kwargs['symbol']
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
                meta_data = data.get('Meta Data', {})
                last_refreshed = meta_data.get('3. Last Refreshed')
                time_zone = meta_data.get('6. Time Zone')
                latest_data = data.get('Time Series (1min)', {})
                latest_timestamp = sorted(latest_data.keys())[-1]
                latest_entry = latest_data.get(latest_timestamp, {})
                latest_open = latest_entry.get('1. open')
                latest_volume = latest_entry.get('5. volume')

                stock, created = Stock.objects.get_or_create(symbol=symbol)

                # Update the 'data' dictionary with the latest values
                stock.data['latest_open'] = latest_open
                stock.data['latest_volume'] = latest_volume
                stock.data['latest_refreshed'] = last_refreshed
                stock.data['time_zone'] = time_zone

                stock.save()

                self.stdout.write(self.style.SUCCESS(f'Successfully fetched data for {symbol}'))
            else:
                self.stdout.write(self.style.ERROR(f'Failed to fetch data for {symbol}'))
