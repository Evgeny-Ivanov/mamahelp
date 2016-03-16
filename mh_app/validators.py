from django.core.validators import BaseValidator
from mh_app.models import CustomUser
from django.core.exceptions import ValidationError


class EmailAlreadyExistValidator(BaseValidator):
    def __init__(self, limit_value, message=None):
        super().__init__(limit_value, message)

    def __call__(self, value):
        users = CustomUser.objects.filter(email__exact=value.strip())
        exist = len(users) > 0
        if exist:
            raise ValidationError(message='Email already exist', code='email_already_exist')


class UsernameAlreadyExistValidator(BaseValidator):
    def __init__(self, limit_value, message=None):
        super().__init__(limit_value, message)

    def __call__(self, value):
        users = CustomUser.objects.filter(username_exact=value.strip())
        exist = len(users) > 0
        if exist:
            raise ValidationError(message='Username already exist', code='username_already_exist')
