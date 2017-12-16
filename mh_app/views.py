from django.shortcuts import render, redirect, render_to_response
from django.conf import settings
from django.contrib.auth import logout as auth_logout
from social.backends.google import GooglePlusAuth
from social.backends.utils import load_backends
from mh_app.decorators import render_to
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from mh_app.models import CustomUser
from mh_app.forms import SignupForm
from django.template import RequestContext

# Create your views here.
def index(request):
    return render(request, 'mh_app/home.html', {})


def logout(request):
    """Logs out user"""
    auth_logout(request)
    return redirect('/')


def context(**extra):
    return dict({
        'plus_id': getattr(settings, 'SOCIAL_AUTH_GOOGLE_PLUS_KEY', None),
        'plus_scope': ' '.join(GooglePlusAuth.DEFAULT_SCOPE),
        'available_backends': load_backends(settings.AUTHENTICATION_BACKENDS)
    }, **extra)


def validate_form_inputs(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
    else:
        form = SignupForm()
    return render_to_response('mh_app/signup.html', {'form': form}, RequestContext(request))



def profile_need_help(request):
    return render(request, 'mh_app/profile_need_help.html', {})


def profile_can_help(request):
    return render(request, 'mh_app/profile_can_help.html', {})



@render_to('mh_app/signup.html')
def create_user(request):
    details = request.session['partial_pipeline']['kwargs']['details']
    return details


@api_view(['GET'])
def verify_email(request):
    email = request.query_params['email']
    exist = False
    if email is not None and email.strip() != '':
        users = CustomUser.objects.filter(email__exact=email.strip())
        exist = len(users) > 0

    return Response({'exist': exist})


@api_view(['GET'])
def verify_username(request):
    username = request.query_params['username']
    exist = False
    if username is not None and username.strip() != '':
        users = CustomUser.objects.filter(username__exact=username.strip())
        exist = len(users) > 0

    return Response({'exist': exist})


@api_view(['POST'])
def check_login(request):
    if 'email' in request.POST and 'password' in request.POST:
        username = request.POST.get('email')
        password = request.POST.get('password')
        user = CustomUser.objects.filter(email=username)
        if len(user) > 0:
            return Response({'valid': user[0].validate_password(password)})
    return Response({'valid': False})


def signup(request):
    if request.method == 'GET':
        form = SignupForm()
    else:
        form = SignupForm(request.POST)
        if not form.is_valid():
            print('Signup form is invalid')
    return render(request, 'mh_app/signup.html', {'form': form})
