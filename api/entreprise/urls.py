from rest_framework import routers
from .views import EntrepriseViewSet
from django.urls import path, include
from .views import UserRegisterView
from .views import CustomUserAdminViewSet

router = routers.DefaultRouter()
router.register(r'entreprises', EntrepriseViewSet)

admin_router = routers.DefaultRouter()
admin_router.register(r'users', CustomUserAdminViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(admin_router.urls)),
    path('register/', UserRegisterView.as_view(), name='register'),
] 