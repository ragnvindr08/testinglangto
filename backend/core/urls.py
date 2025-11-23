from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.get_dashboard, name='dashboard'),

    path('companies/', views.company_list, name='company-list'),
    path('companies/<int:pk>/', views.company_detail, name='company-detail'),

    path('internships/', views.internship_list, name='internship-list'),
    path('internships/<int:pk>/', views.internship_detail, name='internship-detail'),

    path('applications/', views.application_list, name='application-list'),
    path('applications/<int:pk>/', views.application_detail, name='application-detail'),

    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
]
