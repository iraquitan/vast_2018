from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from clean_data import clean_csv


# Create your views here.
def mc_1(request):
    csv = clean_csv("AllBirdsv4.csv")
    return HttpResponse(csv)
    # return csv
