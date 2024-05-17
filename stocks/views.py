from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, JsonResponse
import requests, pandas as pd, json
from io import StringIO
from .models import Stock
# Global cache dictionary
CACHE = {}

def fetch_stock_data(request):
    global CACHE  # Declare global variable
    search_term = request.GET.get('search', '')
    # print(CACHE)
    # Only fetch data from the API if the cache is empty
    if not CACHE:
        url = 'https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo'
        response = requests.get(url)
        data = StringIO(response.content.decode('utf8'))
        df = pd.read_csv(data)
        df = df[['symbol', 'name', 'exchange']]
        df.fillna('Null', inplace=True)

        # Populate the cache with the fetched data
        for _, row in df.iterrows():
            symbol = row['symbol']
            name = row['name']
            exchange = row['exchange']
            CACHE[symbol] = {'name': name, 'exchange': exchange}
            try:
                stock = Stock.objects.get(symbol=symbol)
                stock.data['name'] = name  # Add the name value to the data JSON field
                stock.data['exchange'] = exchange  # Add the name value to the data JSON field
                stock.save()  # Save the updated Stock object
            except:
                pass
            
    # Filter the cache based on the search term
    filtered_cache = {symbol: info for symbol, info in CACHE.items()
                      if search_term.lower() in info['name'].lower() or search_term.lower() in symbol.lower()}

    symbol_dict = {}
    for symbol, info in filtered_cache.items():
        name = info['name']
        exchange = info['exchange']
        symbol_dict[name] = (symbol, exchange)
    
    

        # symbol_dict[name] = (symbol, exchange)

    return HttpResponse(json.dumps(symbol_dict), content_type='application/json')


def fetch_and_cache_stock_data():
    global CACHE  # Assuming CACHE is defined outside this function

    if not CACHE:
        url = 'https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo'
        response = requests.get(url)
        data = StringIO(response.content.decode('utf8'))
        df = pd.read_csv(data)
        df = df[['symbol', 'name', 'exchange']]
        df.fillna('Null', inplace=True)

        for _, row in df.iterrows():
            symbol = row['symbol']
            name = row['name']
            exchange = row['exchange']
            CACHE[symbol] = {'name': name, 'exchange': exchange}
            try:
                stock = Stock.objects.get(symbol=symbol)
                stock.data['name'] = name
                stock.data['exchange'] = exchange
                stock.save()
            except:
                pass