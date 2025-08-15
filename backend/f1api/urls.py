#urls.py 
from django.urls import path
from . import views

# URL configuration for the F1 API app

urlpatterns = [
    path('upcoming-races/', views.upcoming_races, name='upcoming_races'),
    path('full-calendar/', views.full_calendar, name='full_calendar'),
    path('drivers/', views.drivers, name='drivers'),
    path('teams/', views.teams, name='teams'),

    path('schedule/', views.get_event_schedule, name='event-schedule'),
    path('schedule/<int:year>/', views.get_event_schedule, name='event-schedule-year'),
    path('results/<int:year>/<str:event>/<str:session>/', views.get_session_results, name='session-results'),
    
    
    path('standings/drivers/', views.get_standings, {'type': 'drivers'}, name='driver-standings'),
    path('standings/drivers/<int:year>/', views.get_standings, {'type': 'drivers'}, name='driver-standings-year'),
    path('standings/constructors/', views.get_standings, {'type': 'constructors'}, name='constructor-standings'),
    path('standings/constructors/<int:year>/', views.get_standings, {'type': 'constructors'}, name='constructor-standings-year'),
]