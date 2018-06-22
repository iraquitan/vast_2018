from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from clean_data import clean_csv


# Create your views here.
def api_all_birds(request):
    csv = clean_csv("AllBirdsv4.csv")
    return HttpResponse(csv)


def mc1_home(request):
    return render(request, "mini_challenge_1/home.html")
