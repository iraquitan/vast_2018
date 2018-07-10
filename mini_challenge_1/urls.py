# -*- coding: utf-8 -*-
from django.urls import path

from . import views

urlpatterns = [
    path('api/all-birds', views.api_all_birds, name="api-allbirds"),
    path('api/test-birds', views.api_test_birds, name="api-testbirds"),
    path('', views.mc1_home, name="mc1-home")
]
