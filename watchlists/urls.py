from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WatchlistViewSet, WatchlistDeleteView

router = DefaultRouter()
router.register(r'watchlists', WatchlistViewSet, basename='watchlist')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/watchlist/delete/', WatchlistDeleteView.as_view(), name='watchlist-delete'),
]
