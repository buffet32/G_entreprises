from rest_framework import routers
from .views import EntrepriseViewSet
from django.urls import path, include
from .views import UserRegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import MyTokenObtainPairView
from .views import CustomUserAdminViewSet

router = routers.DefaultRouter()
router.register(r'entreprises', EntrepriseViewSet)

admin_router = routers.DefaultRouter()
admin_router.register(r'users', CustomUserAdminViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(admin_router.urls)),
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 