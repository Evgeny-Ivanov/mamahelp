from django import forms
from mh_app.validators import UsernameAlreadyExistValidator
from mh_app.validators import EmailAlreadyExistValidator
from mh_app.models import CustomUser


class SignupForm(forms.Form):
    first_name = forms.CharField(label='First name', required=True)
    last_name = forms.CharField(label='Last name', required=True)
    username = forms.CharField(label='Nickname', required=True)
    username.validators.append(UsernameAlreadyExistValidator)
    email = forms.EmailField(label='Email', required=True)
    email.validators.append(EmailAlreadyExistValidator)
    password = forms.CharField(label='Password', widget=forms.PasswordInput, required=True)
    password_confirm = forms.CharField(label='Confirm password', widget=forms.PasswordInput, required=True)

    def clean_password_confirm(self):
        if self.data['password_confirm'] != self.data['password']:
            raise forms.ValidationError(message='Password doesn\'n match.', code='password_does_not_match')
        return super().clean()

    def clean_email(self):
        if CustomUser.objects.filter(email=self.cleaned_data['email']).exists():
            raise forms.ValidationError(message='Email already exist', code='email_already_exist')

    def clean_username(self):
        if CustomUser.objects.filter(username=self.cleaned_data['username']).exists():
            raise forms.ValidationError(message='Username already exist', code='usrname_already_exist')
