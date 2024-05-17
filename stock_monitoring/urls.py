from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from watchlists.views import WatchlistViewSet
import users.urls
import stocks.urls
import watchlists.urls

# router = DefaultRouter()
# router.register(r'watchlists', WatchlistViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include(users.urls)),
    path('api/', include(stocks.urls)),
    path('', include(watchlists.urls)),
]
