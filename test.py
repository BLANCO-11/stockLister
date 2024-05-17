# RLDRV7XK15XWSC06
import requests

def fetch_stock_data(symbol):
    API_KEY = 'RLDRV7XK15XWSC06'
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={API_KEY}'
    response = requests.get(url)
    return response.json()
