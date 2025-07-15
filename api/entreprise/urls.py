from rest_framework import routers
from .views import EntrepriseViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'entreprises', EntrepriseViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 