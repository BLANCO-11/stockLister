from django.urls import path
from .views import fetch_stock_data

urlpatterns = [
    path('get-stocks-list/', fetch_stock_data, name='get-stocks-list')
]
