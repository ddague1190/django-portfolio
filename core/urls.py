from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomePageList.as_view()),
]