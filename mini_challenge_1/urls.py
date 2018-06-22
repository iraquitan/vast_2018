# -*- coding: utf-8 -*-
from django.urls import path

from . import views

urlpatterns = [
    path('api/all-birds', views.api_all_birds, name="api-allbirds"),
    path('', views.mc1_home, name="mc1-home")
]
