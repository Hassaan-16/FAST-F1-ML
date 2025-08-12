# FAST-F1-ML

## Prerequisites
- Node.js 16+

- Python 3.8+

- npm 8+

- pip 20+

## Backend Setup
Create and activate virtual environment ( first time use only * )

Backend will run at: http://localhost:8000

* python -m venv venv      *

* .\venv\Scripts\activate ( For Windows  *  )

- cd backend

* pip install      *

- pip install django

- pip install djangorestframework

- pip install django-cors-headers

- pip install fastf1

- python manage.py runserver ( or py manage.py runserver)

- run this to allow scripts in current terminal to run
  ( Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process )

## Frontend Setup
Install Node.js dependencies ( first time use only * )

Frontend will run at: http://localhost:3000

- cd frontend

( first time use only * )
* npm install      *
* npm install axios

* (npm install chart.js react-chartjs-2 @mui/material @emotion/react @emotion/styled) - not required rn

* npm install react-router-dom      *

- npm start

# First-Time Setup Checklist
1. Clone repository

2. Set up Python virtual environment

3. Install backend dependencies

4. Run database migrations

5. Install Node.js and npm

6. Install frontend dependencies

7. Start both servers
