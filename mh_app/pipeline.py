from django.shortcuts import redirect
from social.pipeline.partial import partial


@partial
def validate_form_inputs(strategy, details, user=None, is_new=False, *args, **kwargs):
    if user and user.email:
        return
    if is_new and not details.get('email'):
        email = strategy.request_data().get('email')
        if email:
            details['email'] = email
        else:
            details['email_required'] = True
            return redirect('mh_app:validate_form_inputs')



@partial
def create_user(strategy, details, backend, user=None, is_new=False, *args, **kwargs):
    if user:
        return
    if backend.name != 'username':
        return redirect('mh_app:create_user')
