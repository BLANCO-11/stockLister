from django.apps import AppConfig

class StocksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stocks'
    
    def ready(self):
        from .views import CACHE, fetch_and_cache_stock_data  # Assuming CACHE is defined in your views file
        fetch_and_cache_stock_data()
