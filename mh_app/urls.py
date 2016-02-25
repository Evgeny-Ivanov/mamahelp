from django.conf.urls import url
from . import views

app_name = 'mh_app'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^done/$', views.done, name='done'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^email/$', 'mh_app.views.require_email', name='require_email'),
    url(r'^signup/$', 'mh_app.views.create_user', name='create_user'),

]
