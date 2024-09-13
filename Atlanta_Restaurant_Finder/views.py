from django.shortcuts import render
from django.http import HttpResponse
def hi(request):
    return render(request, 'Atlanta_Restaurant_Finder/index.html')
def homeView(request):
    return render(request, 'Atlanta_Restaurant_Finder/home.html')