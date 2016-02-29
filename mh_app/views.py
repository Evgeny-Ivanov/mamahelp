from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import logout as auth_logout
from social.backends.google import GooglePlusAuth
from social.backends.utils import load_backends
from mh_app.decorators import render_to
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


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
@render_to('mh_app/signup.html')
def require_email(request):
    details = request.session['partial_pipeline']['kwargs']['details']
    details['email_required'] = True
    return details


@render_to('mh_app/signup.html')
def create_user(request):
    details = request.session['partial_pipeline']['kwargs']['details']
    return details


@api_view(['GET'])
def verify_email(request):
    return Response({'exist': True})


@api_view(['GET'])
def verify_username(request):
    return Response({'exist': True})

#
#
# @psa('social:complete')
# def ajax_auth(request, backend):
#     if isinstance(request.backend, BaseOAuth1):
#         token = {
#             'oauth_token': request.REQUEST.get('access_token'),
#             'oauth_token_secret': request.REQUEST.get('access_token_secret'),
#         }
#     elif isinstance(request.backend, BaseOAuth2):
#         token = request.REQUEST.get('access_token')
#     else:
#         raise HttpResponseBadRequest('Wrong backend type')
#     user = request.backend.do_auth(token, ajax=True)
#     login(request, user)
#     data = {'id': user.id, 'username': user.username}
#     return HttpResponse(json.dumps(data), mimetype='application/json')
