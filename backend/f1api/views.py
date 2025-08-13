from django.shortcuts import render
# an endpoint to fetch upcoming F1 races.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import fastf1
import pandas as pd
from datetime import datetime

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

@api_view(['GET'])
def full_calendar(request):
    try:
        # Configure cache (new method in FastF1 v3+)
        cache_path = 'fastf1_cache'  # Relative to your Django project root
        fastf1.Cache.enable_cache(cache_path)
        
        # Get current year
        current_year = datetime.now().year
        
        # Get schedule with error handling
        try:
            schedule = fastf1.get_event_schedule(current_year)
            if schedule is None or len(schedule) == 0:
                # Try previous year if current year fails
                schedule = fastf1.get_event_schedule(current_year - 1)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f"Failed to fetch schedule: {str(e)}"
            }, status=500)

        # Process the schedule
        races = []
        for _, event in schedule.iterrows():
            try:
                races.append({
                    'round': int(event['RoundNumber']),
                    'raceName': str(event['EventName']),
                    'date': event['EventDate'].strftime('%Y-%m-%d'),
                    'Location': str(event['Location']),
                    'Country': str(event['Country']),
                    'EventFormat': str(event.get('EventFormat', 'Conventional'))
                })
            except Exception as e:
                continue  # Skip invalid entries

        return Response({
            'status': 'success',
            'year': current_year,
            'races': races
        })

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e),
            'type': type(e).__name__,
            'hint': 'Ensure FastF1 is properly installed and internet connection is active'
        }, status=500)

def home(request):
    return JsonResponse({
        'message': 'Welcome to F1 API',
        'endpoints': {
            'upcoming_races': '/api/upcoming-races/',
            'full_calendar': '/api/full-calendar/',
            'admin': '/admin/'
        }
    })