from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from datetime import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import fastf1
from fastf1 import events
import pandas as pd


def home(request):
    return JsonResponse({
        'message': 'Welcome to F1 API',
        'endpoints': {
            'upcoming_races': '/api/upcoming-races/',
            'full_calendar': '/api/full-calendar/',
            'admin': '/admin/'
        }
    })


# Race/Event APIs
@api_view(['GET'])
def upcoming_races(request):
    try:
        fastf1.Cache.enable_cache('fastf1_cache')
        current_year = pd.Timestamp.now().year
        
        try:
            schedule = fastf1.get_event_schedule(current_year)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
            
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


@api_view(['GET'])
def full_calendar(request):
    try:
        cache_path = 'fastf1_cache'
        fastf1.Cache.enable_cache(cache_path)
        current_year = datetime.now().year
        
        try:
            schedule = fastf1.get_event_schedule(current_year)
            if schedule is None or len(schedule) == 0:
                schedule = fastf1.get_event_schedule(current_year - 1)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f"Failed to fetch schedule: {str(e)}"
            }, status=500)

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
                continue

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
def get_event_schedule(request, year=None):
    try:
        year = int(year) if year else datetime.now().year
        schedule = fastf1.get_event_schedule(year)
        return Response({
            'status': 'success',
            'year': year,
            'events': schedule.to_dict('records')
        })
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
def get_session_results(request, year, event, session):
    try:
        session = fastf1.get_session(year, event, session)
        session.load()
        results = session.results
        return Response({
            'status': 'success',
            'session': session.name,
            'results': results.to_dict('records')
        })
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=500)


# Driver APIs
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
                headshot_url = getattr(info, 'HeadshotUrl', '') or info.get('HeadshotUrl', '')
                
                drivers_data.append({
                    'id': driver,
                    'number': info.get('DriverNumber', 'N/A'),
                    'name': f"{info.get('FirstName', '')} {info.get('LastName', '')}".strip(),
                    'team': info.get('TeamName', 'Unknown Team'),
                    'country': info.get('Country', 'Unknown'),
                    'code': info.get('Abbreviation', info.get('LastName', '')[:3].upper()),
                    'headshotUrl': headshot_url
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
def get_driver_standings(request, year=None):
    try:
        year = int(year) if year else datetime.now().year
        standings = fastf1.get_driver_standings(year)
        return Response({
            'status': 'success',
            'year': year,
            'standings': standings.to_dict('records')
        })
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=500)


# Team APIs
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


# Standings APIs
@api_view(['GET'])
def get_standings(request, type='drivers', year=None):
    try:
        year = int(year) if year else datetime.now().year
        session = fastf1.get_session(year, 1, 'R')  # Get first race
        session.load(telemetry=False, weather=False)  # Minimal data loading
        
        if type == 'drivers':
            # Process driver standings from results
            results = session.results
            standings = results[['Abbreviation', 'FullName', 'TeamName', 'Points']]
            standings = standings.rename(columns={
                'Abbreviation': 'Abbreviation',
                'FullName': 'Driver',
                'TeamName': 'Team',
                'Points': 'Points'
            })
            standings = standings.sort_values('Points', ascending=False)
            standings['Position'] = range(1, len(standings)+1)
            
        elif type == 'constructors':
            # Process constructor standings from results
            results = session.results
            standings = results.groupby('TeamName')['Points'].sum().reset_index()
            standings = standings.rename(columns={
                'TeamName': 'Team',
                'Points': 'Points'
            })
            standings = standings.sort_values('Points', ascending=False)
            standings['Position'] = range(1, len(standings)+1)
            
        else:
            return Response({'status': 'error', 'message': 'Invalid standings type'}, status=400)
        
        return Response({
            'status': 'success',
            'year': year,
            'type': type,
            'standings': standings.to_dict('records')
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e),
            'hint': 'Data might not be available yet for this year'
        }, status=500)


# Session/Lap Data APIs
@api_view(['GET'])
def get_lap_times(request, year, event, session, driver=None):
    try:
        session = fastf1.get_session(year, event, session)
        session.load()
        laps = session.laps
        
        if driver:
            laps = laps.pick_driver(driver)
            driver_info = session.get_driver(driver)
            
        result = {
            'status': 'success',
            'session': session.name,
            'year': year,
            'event': event,
            'laps': laps.to_dict('records'),
            'session_status': session.session_status,
            'session_start_time': session.session_start_time.isoformat() if session.session_start_time else None
        }
        
        if driver:
            result.update({
                'driver': {
                    'name': f"{driver_info['FirstName']} {driver_info['LastName']}",
                    'number': driver_info['DriverNumber'],
                    'team': driver_info['TeamName']
                }
            })
            
        return Response(result)
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=500)