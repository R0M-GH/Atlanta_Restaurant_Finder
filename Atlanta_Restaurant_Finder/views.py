from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Favorites
from .models import UserProfile
from django.contrib.auth.hashers import make_password
from .forms import RegistrationForm, LoginForm
from django.contrib.auth import authenticate, login, logout

@login_required
def hi(request):
    return render(request, 'Atlanta_Restaurant_Finder/index.html', {})


@login_required
def map_view(request):
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
            username = form.cleaned_data['username']
            password1 = form.cleaned_data['password1']
            birthday = form.cleaned_data['birthday']

            # Manually create the user
            user = User.objects.create(username=username, password=make_password(password1))
            user_profile = UserProfile.objects.create(user=user, birthday=birthday)

            password = form.cleaned_data['password1']

            if User.objects.filter(username=username).exists():
                return render(request, 'registration/register.html', {"form": form, 'error': True})

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

