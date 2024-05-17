from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Watchlist, Stock
from .serializers import WatchlistSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.response import Response
from django.core.management import call_command
from rest_framework import status


class WatchlistViewSet(viewsets.ModelViewSet):
    queryset = Watchlist.objects.all()
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WatchlistDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        stock_symbol = request.data.get('stock_symbol')
        stock = get_object_or_404(Stock, symbol=stock_symbol)
        watchlist_item = get_object_or_404(Watchlist, user=user, stock=stock)
        watchlist_item.delete()
        return JsonResponse({'message': 'Watchlist item deleted successfully'})