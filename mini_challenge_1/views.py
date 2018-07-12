from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from clean_data import clean_csv, test_csv


# Create your views here.
def api_all_birds(request):
    csv = clean_csv("all-birds-v4.csv")
    return HttpResponse(csv)


def api_test_birds(request, proba=True):
    if proba:
        test_file = "test-birds-location-proba.csv"
    else:
        test_file = "test-birds-location.csv"
    csv = test_csv(test_file)
    return HttpResponse(csv)


def mc1_home(request):
    return render(request, "mini_challenge_1/home.html")
