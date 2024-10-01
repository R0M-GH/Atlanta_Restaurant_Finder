from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .forms import RegistrationForm, LoginForm # Import the form you just crea
from django.contrib.auth import authenticate, login, logout

@login_required
def hi(request):
    return render(request, 'Atlanta_Restaurant_Finder/index.html', {})


@login_required
def homeView(request):
    return render(request, 'Atlanta_Restaurant_Finder/home.html')


@login_required
def mapView(request):
    return render(request, 'Atlanta_Restaurant_Finder/map.html')

def login_view(request):
    if request.method == 'POST':
        user = authenticate(request, username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return redirect('home-page')
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

            if User.objects.filter(username=username).exists():
                return render(request, 'registration/register.html', {"form": form, 'error': True})

            user = User.objects.create_user(username=username, password=password)
            # Optionally, you can add more user attributes here
            return redirect("login")
    else:
        form = RegistrationForm()

    return render(request, 'registration/register.html', {"form": form})
