from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from .serializers import RegisterSerializer, LoginSerializer
from .models import Company, Internship, Application
from .serializers import CompanySerializer, InternshipSerializer, ApplicationSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token 
from rest_framework.permissions import AllowAny

# 🧱 Dashboard Summary
@api_view(['GET'])
@permission_classes([AllowAny])
def get_dashboard(request):
    user = request.user if request.user.is_authenticated else None

    if user and user.is_staff:  # Admin
        data = {
            "role": "admin",
            "total_companies": Company.objects.count(),
            "total_internships": Internship.objects.count(),
            "total_applications": Application.objects.count(),
        }
    elif user:  # Regular user
        data = {
            "role": "user",
            "total_companies": Company.objects.count(),  # global counts
            "total_internships": Internship.objects.count(),
            "my_applications": Application.objects.filter(student=user).count(),
        }
    else:
        data = {"role": "guest"}
    
    return Response(data)

# 🏢 Companies CRUD
@api_view(['GET', 'POST'])
def company_list(request):
    if request.method == 'GET':
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def company_detail(request, pk):
    try:
        company = Company.objects.get(pk=pk)
    except Company.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CompanySerializer(company)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CompanySerializer(company, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# 💼 Internships CRUD
@api_view(['GET', 'POST'])
def internship_list(request):
    if request.method == 'GET':
        internships = Internship.objects.select_related('company').all()
        serializer = InternshipSerializer(internships, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = InternshipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def internship_detail(request, pk):
    try:
        internship = Internship.objects.get(pk=pk)
    except Internship.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InternshipSerializer(internship)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = InternshipSerializer(internship, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        internship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# 📝 Applications CRUD

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def application_list(request):
    if request.method == 'GET':
        # Admin sees all, students see only their own
        if request.user.is_staff:
            apps = Application.objects.all()
        else:
            apps = Application.objects.filter(student=request.user)
        serializer = ApplicationSerializer(apps, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        internship_id = request.data.get('internship')
        if not internship_id:
            return Response({'error': 'Internship is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            internship = Internship.objects.get(id=internship_id)
        except Internship.DoesNotExist:
            return Response({'error': 'Invalid internship ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
        app = Application(student=request.user, internship=internship)
        app.save()
        serializer = ApplicationSerializer(app)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def application_detail(request, pk):
    try:
        application = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ApplicationSerializer(application, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        login(request, user)
        # Create token for the user
        token, created = Token.objects.get_or_create(user=user)
        return Response({'message': 'Login successful!', 'token': token.key}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context    