from django.urls import path
from . import views

app_name = 'profile_page'

urlpatterns = [
    path('', views.viewpage, name = 'profile'),
    path('edit_profile/', views.editprofile, name = 'edit_profile'),

]