# Mamahelp
Working prototype for Beehelper project that covers authentication, help enrty creation, validation and list view. Form templates are Jade based and are served to the user with Django based backend. 

## Getting Started
### Prerequisites
Python 3.5

### Installing
Create new Python virtual environment \
In case you use Anaconda distribution this can be done with the following command:

```
conda create -n mamhelp python=3.5 anaconda
```
Activate virtual environmnet with command:
```
source activate mamhelp
```
Install requirements:
```
pip install -r requirements.txt
```
Setup database:
```
python manage.py migrate
```
### Running locally
```
python manage.py runserver
```

## Deployment to the live environment:
Using Heroku deployment with Git hooks. To deploy we need to add remote Heroku git repo and push there our master branch. 

## Built With
* Jade 
* Django

## Author
Iuliia Pishchulina
