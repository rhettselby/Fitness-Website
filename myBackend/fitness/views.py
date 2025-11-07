from django.shortcuts import render, redirect
from .models import Cardio, Gym, Comment, Like
from django.contrib.auth.decorators import login_required
from .forms import GymForm, CardioForm, CommentForm
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from django.shortcuts import get_object_or_404 #attemps to get an object, if it cant, then it raises an http 404 instead of server crashing

# Create your views here.


@login_required(login_url = "/users/login/")
def workout_log(request):
    user = request.user
    cardio = Cardio.objects.filter(user = user).order_by('-date')
    gym = Gym.objects.filter(user = user).order_by('-date')
    workout_list = []
    workout_list.extend(cardio) #extend adds items form query to list, .append would add the entire query
    workout_list.extend(gym)
    workout_list = sorted(workout_list, key=lambda w: w.date, reverse=True)
    return render(request, 'fitness/workout_view.html', {'workouts': workout_list})


@login_required(login_url = "/users/login/")
def add_workout(request):
    return render(request, 'fitness/choose_workout.html')

@login_required(login_url = "/users/login/")
def add_gym(request):
    if request.method == "POST":
        form = GymForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.user = request.user
            obj.save()
            return redirect('fitness:workout_log')
    else:
        form = GymForm()
    return render(request, 'fitness/add_workout.html', {'form' : form, 'type' : 'Gym'})


@login_required(login_url = "/users/login/")
def add_cardio(request):
    if request.method == "POST":
        form = CardioForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.user = request.user
            obj.save()
            return redirect('fitness:workout_log')
    else:
        form = CardioForm()
    return render(request, 'fitness/add_workout.html', {'form' : form, 'type' : 'Cardio'})


@login_required(login_url = "/user/login/")
def add_comment(request, workout_type, workout_id):
    if workout_type == 'cardio':
        model = Cardio
    elif workout_type == 'gym':
        model = Gym
    else:
        return redirect('fitness:workout_log')#invalid workout
    
    workout = get_object_or_404(model, pk = workout_id) #pk = "Primary Key" (fetch the row in model whose primary key equals workout_id)

    ct = ContentType.objects.get_for_model(workout)

    like_count = Like.objects.filter(content_type = ct, object_id = workout.id).count()
    user_liked = Like.objects.filter(content_type = ct, object_id = workout.id, user=request.user).exists()
    
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user
            comment.workout = workout
            comment.save()
            return redirect('fitness:workout_log')
    else:
        form = CommentForm()
        comments = Comment.objects.filter(content_type = ContentType.objects.get_for_model(workout), object_id = workout.id)
        context = {
        'workout': workout,
        'workout_type': workout_type,
        'form': form,
        'comments': comments,
        'like_count' : like_count, 
        'user_liked' : user_liked }

        return render(request, 'fitness/details.html', context )
    

@login_required(login_url = "/users/login/") #check what the @ does
def add_like(request, workout_type, workout_id):
    if workout_type == 'cardio':
        model = Cardio
    else:
        model = Gym
    workout = get_object_or_404(model, pk = workout_id)

    ct = ContentType.objects.get_for_model(workout)
    like, created = Like.objects.get_or_create(user = request.user, content_type = ct, object_id = workout.id)

    if created:
        liked = True
    else:
        like.delete() # Unlikes when user taps Like
        liked = False

    return redirect('fitness:add_comment', workout_type=workout_type, workout_id=workout.id
    )

    
    






    