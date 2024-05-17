from rest_framework import serializers
from .models import Watchlist, Stock
from django.core.management import call_command
from stocks.views import CACHE

class StockSerializer(serializers.Serializer):
    data = serializers.JSONField(required=False, default={})
    symbol = serializers.CharField()

    def create(self, validated_data):
        global CACHE
        data = validated_data.pop('data')
        symbol = validated_data.get('symbol')
        
        stock, stock_created = Stock.objects.get_or_create(symbol=symbol, defaults={'data': {}})
        if stock_created:
            # If the stock is created, save additional data
            print(CACHE[symbol])
            stock.data['name'] = CACHE[symbol]['name']  # Add the name value to the data JSON field
            stock.data['exchange'] = CACHE[symbol]['exchange']
            stock.save()
            call_command('fetch_data', symbol)
        return stock

class WatchlistSerializer(serializers.ModelSerializer):
    stock = StockSerializer()

    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'stock', 'created_at']
        read_only_fields = ['user']

    def create(self, validated_data):
        stock_data = validated_data.pop('stock')
        stock_serializer = StockSerializer(data=stock_data)
        stock_serializer.is_valid(raise_exception=True)
        stock = stock_serializer.save()
        
        watchlist, watchlist_created = Watchlist.objects.get_or_create(stock=stock, user=validated_data['user'])
        if not watchlist_created:
            # If the watchlist already exists, return it
            return watchlist
        return watchlist
