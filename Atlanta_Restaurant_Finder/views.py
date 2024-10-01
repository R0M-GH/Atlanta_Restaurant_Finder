from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .forms import RegistrationForm
from django.http import JsonResponse
from .models import Favorite


@login_required
def hi(request):
    return render(request, 'Atlanta_Restaurant_Finder/index.html', {})


@login_required
def homeView(request):
    return render(request, 'Atlanta_Restaurant_Finder/home.html')


@login_required
def mapView(request):
    return render(request, 'Atlanta_Restaurant_Finder/map.html')


def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Create user with validated data
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = User.objects.create_user(username=username, password=password)
            # Optionally, you can add more user attributes here
            return redirect("login")
    else:
        form = RegistrationForm()

    return render(request, 'registration/register.html', {"form": form})


def save_favorite(request):
    print("save_favorite called")
    if request.method == 'POST':
        user = request.user
        place_id = request.POST.get('place_id')

        if not Favorite.objects.filter(user=user, place_id=place_id).exists():
            favorite = Favorite(user=user, place_id=place_id)
            favorite.save()
            return JsonResponse({'status': 'saved'}, status=200)
        else:
            return JsonResponse({'status': 'already_exists'}, status=400)

    return JsonResponse({'status': 'error'}, status=400)


def load_favorites(request):
    print("load_favorite called")
    if request.method == 'GET':
        user = request.user
        favorites = Favorite.objects.filter(user=user).values_list('place_id', flat=True)
        return JsonResponse({'favorites': list(favorites)}, status=200)
