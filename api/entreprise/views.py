from django.shortcuts import render
from rest_framework import viewsets
from .models import Entreprise
from .serializers import EntrepriseSerializer
from rest_framework import generics
from .serializers import UserRegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        username = attrs.get('username', None)
        password = attrs.get('password')
        user = None
        if username:
            user = authenticate(request=self.context.get('request'), username=username, password=password)
        if not user:
            from rest_framework.exceptions import AuthenticationFailed
            raise AuthenticationFailed('Aucun utilisateur trouvé avec ces identifiants.')
        refresh = self.get_token(user)
        data = {'refresh': str(refresh), 'access': str(refresh.access_token)}
        data['user'] = CustomUserSerializer(user).data
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class CustomUserAdminViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = CustomUserAdminSerializer
    permission_classes = [IsAdminUser]
