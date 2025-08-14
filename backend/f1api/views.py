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

@api_view(['GET'])
def drivers(request):
    try:
        year = datetime.now().year
        session = fastf1.get_session(year, 1, 'R')
        session.load(telemetry=False, weather=False)
        
        drivers_data = []
        for driver in session.drivers:
            try:
                info = session.get_driver(driver)
                # Get headshot URL - different methods for different FastF1 versions
                headshot_url = getattr(info, 'HeadshotUrl', '') or info.get('HeadshotUrl', '')
                
                drivers_data.append({
                    'id': driver,
                    'number': info.get('DriverNumber', 'N/A'),
                    'name': f"{info.get('FirstName', '')} {info.get('LastName', '')}".strip(),
                    'team': info.get('TeamName', 'Unknown Team'),
                    'country': info.get('Country', 'Unknown'),
                    'code': info.get('Abbreviation', info.get('LastName', '')[:3].upper()),
                    'headshotUrl': headshot_url  # Add this
                })
            except Exception as e:
                continue
        
        return Response({
            'status': 'success',
            'year': year,
            'drivers': drivers_data
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

@api_view(['GET'])
def teams(request):
    try:
        # Hardcoded 2024 team data with all required information
        teams_data = [
            {
                'name': "Red Bull",
                'fullName': "Oracle Red Bull Racing",
                'constructor': "Red Bull",
                'color': "#0600EF",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png",
                'nationality': "Austrian",
                'drivers': [[1, "Max Verstappen"], [11, "Sergio Perez"]]
            },
            {
                'name': "Ferrari",
                'fullName': "Scuderia Ferrari",
                'constructor': "Ferrari",
                'color': "#DC0000",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png",
                'nationality': "Italian",
                'drivers': [[16, "Charles Leclerc"], [55, "Carlos Sainz"]]
            },
            {
                'name': "Mercedes",
                'fullName': "Mercedes-AMG Petronas F1 Team",
                'constructor': "Mercedes",
                'color': "#00D2BE",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes.png",
                'nationality': "German",
                'drivers': [[44, "Lewis Hamilton"], [63, "George Russell"]]
            },
            {
                'name': "McLaren",
                'fullName': "McLaren F1 Team",
                'constructor': "McLaren",
                'color': "#FF8700",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png",
                'nationality': "British",
                'drivers': [[4, "Lando Norris"], [81, "Oscar Piastri"]]
            },
            {
                'name': "Aston Martin",
                'fullName': "Aston Martin Aramco F1 Team",
                'constructor': "Aston Martin",
                'color': "#006F62",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png",
                'nationality': "British",
                'drivers': [[14, "Fernando Alonso"], [18, "Lance Stroll"]]
            },
            {
                'name': "Alpine",
                'fullName': "BWT Alpine F1 Team",
                'constructor': "Alpine",
                'color': "#0090FF",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/alpine-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/alpine.png",
                'nationality': "French",
                'drivers': [[10, "Pierre Gasly"], [31, "Esteban Ocon"]]
            },
            {
                'name': "RB",
                'fullName': "Visa Cash App RB F1 Team",
                'constructor': "RB",
                'color': "#6692FF",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/rb-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/rb.png",
                'nationality': "Italian",
                'drivers': [[3, "Daniel Ricciardo"], [22, "Yuki Tsunoda"]]
            },
            {
                'name': "Williams",
                'fullName': "Williams Racing",
                'constructor': "Williams",
                'color': "#005AFF",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/williams-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/williams.png",
                'nationality': "British",
                'drivers': [[2, "Logan Sargeant"], [23, "Alexander Albon"]]
            },
            {
                'name': "Stake",
                'fullName': "Stake F1 Team Kick Sauber",
                'constructor': "Stake",
                'color': "#52E252",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber.png",
                'nationality': "Swiss",
                'drivers': [[24, "Zhou Guanyu"], [77, "Valtteri Bottas"]]
            },
            {
                'name': "Haas",
                'fullName': "MoneyGram Haas F1 Team",
                'constructor': "Haas",
                'color': "#B6BABD",
                'logoUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/haas-logo.png",
                'carUrl': "https://media.formula1.com/content/dam/fom-website/teams/2024/haas.png",
                'nationality': "American",
                'drivers': [[20, "Kevin Magnussen"], [27, "Nico Hülkenberg"]]
            }
        ]
        
        return Response({
            'status': 'success',
            'year': 2024,
            'teams': teams_data
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
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