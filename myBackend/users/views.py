from django.shortcuts import render, redirect
from .models import Users
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout

# Create your views here.

def users_list(request):
    users = Users.objects.all().order_by('-date')
    return render(request, 'users/users_list.html', {'users': users})


def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            login(request, form.save()) #form.save also returns a user value, like get_user
            return redirect("posts:list")
    else:
        form = UserCreationForm()
    return render(request, 'users/users_register.html', { "form" : form})

def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(data = request.POST)
        if form.is_valid():
            login(request, form.get_user()) #login uses a request and user value
            if 'next' in request.POST:
                return redirect(request.POST.get('next'))
            else:
                return redirect("posts:list")
    else:
        form = AuthenticationForm()
    return render(request, 'users/login.html', { "form" : form})

def logout_view(request):
    if request.method == "POST":
        logout(request)
        return redirect("posts:list")



#def register_view(request):
   # register = Users.objects.get

    #return render(request,'users/register_view.html', {'users' : user})
     
     
#def login_view(request):

   # return

#def logout_view(request):
    #return
     
#def profile_view(request):

 #   return
     

