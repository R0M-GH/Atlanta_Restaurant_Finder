from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .forms import RegistrationForm  # Import the form you just crea
from .models import UserProfile
from django.contrib.auth.hashers import make_password

@login_required
def hi(request):
    return render(request, 'Atlanta_Restaurant_Finder/index.html', {})


@login_required
def homeView(request):
    return render(request, 'Atlanta_Restaurant_Finder/home.html')


@login_required
def mapView(request):
    return render(request, 'Atlanta_Restaurant_Finder/map.html')

def ForgetView(request):
    if request.method == 'POST':
        username = request.POST['username']
        birthday = request.POST['birthday']
        new_password1 = request.POST['new_password1']
        new_password2 = request.POST['new_password2']

        if new_password1 != new_password2:
            return render(request, 'registration/Forget.html', {'error': 'Passwords do not match'})

        try:
            user = User.objects.get(username=username)
            profile = UserProfile.objects.get(user=user)

            if str(profile.birthday) == birthday:  # Check if birthday matches
                user.password = make_password(new_password1)
                user.save()
                return redirect('login')
            else:
                return render(request, 'registration/Forget.html', {'error': 'Birthday does not match'})

        except User.DoesNotExist:
            return render(request, 'registration/Forget.html', {'error': 'User not found'})

    return render(request, 'registration/Forget.html')
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Extract the cleaned form data
            username = form.cleaned_data['username']
            password1 = form.cleaned_data['password1']
            birthday = form.cleaned_data['birthday']

            # Manually create the user
            user = User.objects.create(username=username, password=make_password(password1))
            user_profile = UserProfile.objects.create(user=user, birthday=birthday)

            return redirect("login")
    else:
        form = RegistrationForm()

    return render(request, 'registration/register.html', {"form": form})
