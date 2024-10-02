from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Atlanta_Restaurant_Finder.models.Favorites import Favorites
from Atlanta_Restaurant_Finder.models.UserProfile import UserProfile
from django.contrib.auth.hashers import make_password
from .forms import RegistrationForm, LoginForm
from django.contrib.auth import authenticate, login, logout

from openai import OpenAI


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



            # Check if username already exists
            if User.objects.filter(username=username).exists():
                return render(request, 'registration/register.html', {"form": form, 'error': True})

            # Create user and user profile
            user = User.objects.create_user(username=username, password=password1)
            user_profile = UserProfile.objects.create(user=user, birthday=birthday)

            return redirect("login")
    else:
        form = RegistrationForm()

    return render(request, 'registration/register.html', {"form": form})


def logout_view(request):
    logout(request)
    return redirect('login')


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


@csrf_exempt
@login_required
def get_cuisine(request, place_details):
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key="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"
    )
    completion = client.chat.completions.create(
        model="meta/llama-3.1-405b-instruct",
        messages=[{"role": "user",
                   "content": f"What kind of cuisine is served at {place_details}? Make sure your response takes up only 1 token."}],
        temperature=0.2,
        top_p=0.7,
        max_tokens=1024,
        stream=True
    )
    cuisine = ''
    for chunk in completion:
        if chunk.choices[0].delta.content:
            cuisine += chunk.choices[0].delta.content
    return JsonResponse({'cuisine': cuisine})
