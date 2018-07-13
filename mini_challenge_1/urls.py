# -*- coding: utf-8 -*-
from django.urls import path, register_converter

from . import converters, views

register_converter(converters.FourDigitYearConverter, 'yyyy')

urlpatterns = [
    path('api/all-birds', views.api_all_birds, name="api-allbirds"),
    path('api/all-birds/<yyyy:year>', views.api_all_birds_year, name="api-allbirds-year"),
    path('api/test-birds', views.api_test_birds, name="api-testbirds"),
    path('', views.mc1_home, name="mc1-home")
]
