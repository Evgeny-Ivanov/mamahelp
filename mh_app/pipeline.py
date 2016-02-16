from django.shortcuts import redirect

from social.pipeline.partial import partial


@partial
def require_email(strategy, details, user=None, is_new=False, *args, **kwargs):
    if user and user.email:
        return
    if is_new and not details.get('email'):
        email = strategy.request_data().get('email')
        if email:
            details['email'] = email
        else:
            return redirect('mh_app:require_email')
