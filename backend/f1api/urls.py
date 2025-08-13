from django.urls import path
from . import views

# URL configuration for the F1 API app

urlpatterns = [
    path('upcoming-races/', views.upcoming_races, name='upcoming_races'),
    path('full-calendar/', views.full_calendar, name='full_calendar'),
    path('drivers/', views.drivers, name='drivers'),
]