from django.shortcuts import render
from .models import Post
from django.contrib.auth.decorators import login_required
from . import forms
from fitness.models import Gym, Cardio

# Create your views here.

#def posts_list(request):
    #posts = Post.objects.all().order_by('-date')
    #return render(request, 'posts/posts_list.html', {'posts': posts})


def post_page(request, slug):
     post = Post.objects.get(slug = slug)
     return render(request, 'posts/post_page.html', {'posts': post})


@login_required(login_url = "/users/login/")
def post_new(request):
     form = forms.CreatePost()
     return render(request, 'posts/post_new.html', {'form' : form})



@login_required(login_url = "/users/login/")
def workout_log(request):
    user = request.user
    cardio = Cardio.objects.all().order_by('-date')
    gym = Gym.objects.all().order_by('-date')
    workout_list = []
    workout_list.extend(cardio) #extend adds items form query to list, .append would add the entire query
    workout_list.extend(gym)
    workout_list = sorted(workout_list, key=lambda w: w.date, reverse=True)
    return render(request, 'fitness/workout_view.html', {'workouts': workout_list})