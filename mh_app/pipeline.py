from django.shortcuts import redirect, render
from social.pipeline.partial import partial
from mh_app.forms import SignupForm
from django.contrib.auth import hashers


def validate_form_inputs(strategy, details, backend, user=None, is_new=False, *args, **kwargs):
    if not user and (backend.name == 'email' or backend.name == 'username'):
        form = SignupForm(strategy.request.POST)
        if form.is_valid():
            for key in form.fields:
                if 'password' == key:
                    details[key] = hashers.make_password(strategy.request_data().get(key))
                else:
                    details[key] = strategy.request_data().get(key)
        else:
            return render(strategy.request, 'mh_app/signup.html', {'form': form})


def user_password(strategy, user, backend, is_new=False, *args, **kwargs):
    if backend.name != 'email' and backend.name != 'username' or not user:
        return

    password = strategy.request_data()['password']
    if is_new:
        user.set_password(password)
        user.save()
    elif not user.validate_password(password):
        return {'user': None, 'social': None}
        # raise AuthException(strategy.backend)

