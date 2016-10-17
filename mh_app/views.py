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


def done(request):
    return render(request, 'mh_app/reg_done.html', {})


# @csrf_protect
# @never_cache
# @sensitive_post_parameters()
# def login(request):
#     authentication_form = AuthenticationForm
#     if request.method == "POST":
#         form = authentication_form(request, data=request.POST)
#         if form.is_valid():
#             # Okay, security check complete. Log the user in.
#             auth_login(request, form.get_user())
#
#             return HttpResponseRedirect(reverse('mamahelp:index'))
#     else:
#         form = authentication_form(request)
#
#     context = {
#         'form': form,
#     }
#     return render(request, 'registration/login.html', context)
#
#
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


#
#
# @render_to('mh_app/home.html')
# def home(request):
#     """Home view, displays login mechanism"""
#     if request.user.is_authenticated():
#         return redirect('done')
#     return context()
#
#
# @login_required
# @render_to('mh_app/home.html')
# def done(request):
#     """Login complete view, displays user data"""
#     return context()
#
#
# @render_to('mh_app/home.html')
# def validation_sent(request):
#     return context(
#             validation_sent=True,
#             email=request.session.get('email_validation_address')
#     )
#
#
# @render_to('mh_app/signup.html')
def validate_form_inputs(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
    else:
        form = SignupForm()
    # details = request.session['partial_pipeline']['kwargs']['details']
    # details['form'] = form
    return render_to_response('mh_app/signup.html', {'form': form}, RequestContext(request))


def user_profile(request):
    return render(request, 'mh_app/user_profile.html', {})


def profile_need_help(request):
    return render(request, 'mh_app/profile_need_help.html', {})


def profile_general_info(request):
    return render(request, 'mh_app/profile_general_info.html', {})


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
