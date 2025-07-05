from django.urls import path
from .views import (
    StudentProfileView,
)

urlpatterns = [
    path('student_profile/', StudentProfileView.as_view(), name='student-profile'),
    
]