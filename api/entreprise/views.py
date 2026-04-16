from django.shortcuts import render
from rest_framework import viewsets
from .models import Entreprise
from .serializers import EntrepriseSerializer
from rest_framework import generics
from .serializers import UserRegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, IsAdminUser
from .serializers import CustomUserSerializer
from django.contrib.auth import authenticate
from .serializers import CustomUserAdminSerializer
from .models import CustomUser

# Create your views here.

class IsAdminOrResponsable(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and (user.role == 'admin' or user.role == 'responsable')

class EntrepriseViewSet(viewsets.ModelViewSet):
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrResponsable()]
        return []

class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


class CustomUserAdminViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = CustomUserAdminSerializer
    permission_classes = [IsAdminUser]
