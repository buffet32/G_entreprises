from django.urls import path
from . import views

urlpatterns = [
    path('', views.liste_entreprises, name='liste_entreprises'),
    path('ajouter/', views.ajouter_entreprise, name='ajouter_entreprise'),
    path('modifier/<int:id>/', views.modifier_entreprise, name='modifier_entreprise'),
    path('supprimer/<int:id>/', views.supprimer_entreprise, name='supprimer_entreprise'),
]
