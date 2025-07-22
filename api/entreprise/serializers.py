from .models import Entreprise, CustomUser
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

class EntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = '__all__'

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'numero_telephone', 'numero_carte', 'role', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            numero_telephone=validated_data.get('numero_telephone', ''),
            numero_carte=validated_data['numero_carte'],
            role=validated_data['role'],
            password=validated_data['password']
        )
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'numero_telephone', 'numero_carte', 'role', 'is_active', 'is_staff', 'date_joined')

class CustomUserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'numero_telephone', 'numero_carte', 'role', 'is_active', 'is_staff', 'date_joined') 