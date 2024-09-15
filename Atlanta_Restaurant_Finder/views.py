from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required


@login_required
def hi(request):
    return render(request, 'Atlanta_Restaurant_Finder/index.html',{})
@login_required
def homeView(request):
    return render(request, 'Atlanta_Restaurant_Finder/home.html')
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {"form": form})