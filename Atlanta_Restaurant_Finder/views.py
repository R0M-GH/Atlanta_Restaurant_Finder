from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .forms import RegistrationForm
from django.http import JsonResponse
from .models import Favorites


@login_required
def hi(request):
    return render(request, 'Atlanta_Restaurant_Finder/index.html', {})


@login_required
def map_view(request):
    return render(request, 'Atlanta_Restaurant_Finder/map.html')


def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = User.objects.create_user(username=username, password=password)
            return redirect("login")
    else:
        form = RegistrationForm()

    return render(request, 'registration/register.html', {"form": form})


@csrf_exempt
@login_required
def save_favorite(request, place_id):
    fav, created = Favorites.objects.get_or_create(user=request.user, place_id=place_id)
    if not created:
        fav.delete()
        return JsonResponse({"message": "Removed from favorites", "status": "removed"})
    else:
        return JsonResponse({"message": "Added to favorites", "status": "added"})


@csrf_exempt
@login_required
def load_favorites(request):
    favorites = Favorites.objects.filter(user=request.user)
    return JsonResponse([fav.place_id for fav in favorites], safe=False)

