#from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .forms import RegistrationForm, LoginForm  # Import the form you just crea
from django.contrib.auth.hashers import make_password
from .models import users_collection, User
from django.http import HttpResponseRedirect
from django.urls import reverse


def custom_login_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if 'username' in request.session:
            return view_func(request, *args, **kwargs)
        else:
            return redirect("login") # Redirect to login page
    return _wrapped_view

@custom_login_required
def home_view(request):
    return render(request, 'Atlanta_Restaurant_Finder/index.html',{})

@custom_login_required
def map_view(request):
    return render(request, 'Atlanta_Restaurant_Finder/map.html')

def login_view(request):
    request.session.flush()
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        #user = users_collection.find_one({'username': username})


        user = User.authenticate(username, password)
        if user is not None:

            request.session['username'] = username
            #login(request, user)
            return redirect("home_page")
        else:
            form = LoginForm()
            return render(request, 'registration/login.html', {'form': form, 'error': True})
    else:
        form = LoginForm()
    return render(request, 'registration/login.html', {'form': form})

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Create user with validated data
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            securityAnswer = form.cleaned_data['securityAnswer']

            #security feature provided by django
            hashed_password = make_password(password)

            #more user identifiers/info can be added here
            user_date = ({
                'username': username,
                'password': hashed_password,
                'securityAnswer': securityAnswer
            })

            #This will save one user to the users collection in the mongo database
            users_collection.insert_one(user_date)

            return redirect("login")
    else:
        form = RegistrationForm()

    return render(request, 'registration/register.html', {"form": form})

