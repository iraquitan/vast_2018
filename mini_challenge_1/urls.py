# -*- coding: utf-8 -*-
from django.urls import path

from . import views

urlpatterns = [
    path('all-birds', views.mc_1, name='api-allbirds'),
]
