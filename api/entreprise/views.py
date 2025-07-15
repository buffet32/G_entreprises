from django.shortcuts import render
from rest_framework import viewsets
from .models import Entreprise
from .serializers import EntrepriseSerializer

# Create your views here.

class EntrepriseViewSet(viewsets.ModelViewSet):
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseSerializer
