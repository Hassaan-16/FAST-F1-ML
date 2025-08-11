from django.shortcuts import render
# an endpoint to fetch upcoming F1 races.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import fastf1
import pandas as pd

@api_view(['GET'])
def upcoming_races(request):
    try:
        fastf1.Cache.enable_cache('fastf1_cache')
        
        # Get current year's schedule
        current_year = pd.Timestamp.now().year
        
        try:
            schedule = fastf1.get_event_schedule(current_year)  # Add year parameter
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        # Filter upcoming races
        upcoming = schedule[schedule['EventDate'] >= pd.Timestamp.now()]
        
        return Response({
            'status': 'success',
            'year': current_year,
            'races': upcoming.to_dict('records')
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Create your views here.

from django.http import JsonResponse

def home(request):
    return JsonResponse({
        'message': 'Welcome to F1 API',
        'endpoints': {
            'upcoming_races': '/api/upcoming-races/',
            'admin': '/admin/'
        }
    })