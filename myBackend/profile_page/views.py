from django.shortcuts import render, redirect
from fitness.models import Cardio, Gym
from django.contrib.auth.decorators import login_required
from . import forms
from .models import Profile


# Create your views here.

@login_required(login_url="/users/login/")
def viewpage(request):
    user = request.user
    cardio = Cardio.objects.filter(user = user).order_by('-date')
    gym = Gym.objects.filter(user = user).order_by('-date')
    workout_list = []
    workout_list.extend(cardio) #extend adds items form query to list, .append would add the entire query
    workout_list.extend(gym)
    workout_list = sorted(workout_list, key=lambda w: w.date, reverse=True)
    return render(request, 'profile_page/profile.html', { "workouts" : workout_list, "user" : user})


@login_required(login_url = "/users/login/")
def editprofile(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == "POST":
        form = forms.EditProfile(request.POST, instance = profile)
        if form.is_valid():
            form.save()
            return redirect('profile_page:profile')
    else:
        form = forms.EditProfile(instance = profile)
    return render(request, 'profile_page/edit_profile.html', {'form' : form})

