from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer
from pathnova_backend.config import MongoConfig
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
import os
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()


client = MongoClient(settings.MONGO_URL)
db = client.get_default_database('pathnova')
users_collection = db['users']


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            data = serializer.validated_data

            if users_collection.find_one({'email': data['email']}):
                return Response({
                    'error': 'Email already exists',
                    }, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            hashed_pw = bcrypt.hashpw(data['password'].encode('UTF-8'), bcrypt.gensalt())

            user_doc = {
                'username': data['username'],
                'email': data['email'],
                'password': hashed_pw.decode('utf-8'),
                'role': data.get('role', 'student'),
                'is_profile_complete': False
            }

            result = users_collection.insert_one(user_doc)
            user_doc['_id'] = str(result.inserted_id)
            user_doc.pop('password')

            return Response({
                'message': 'Registration successful', 
                'user': user_doc,
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({
            'error': f'Registration failed: {str(e)}',
            }, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class LoginView(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)

            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            data = serializer.validated_data
            user = users_collection.find_one({
                'email': data['email'],
            })

            if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
                user['_id'] = str(user['_id'])
                user.pop('password', None)

                return Response({
                    'message': 'Login successful',
                    'user': user,
                    },
                    status=status.HTTP_200_OK,
                )
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': f'Registration failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ProfileView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('_id')

        if not user_id:
            return Response({
                'error': 'user_id required'
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            object_id = ObjectId(user_id)
        except Exception:
            return Response({
                'error': 'Invalid user_id'
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = users_collection.find_one({'_id': object_id})

        if user:
            user['_id'] = str(user['_id'])
            user.pop('password', None)
            return Response({
                'message': 'User found',
                'user': user,
                },
                status=status.HTTP_200_OK
            )

        return Response({
            'error': 'User not found'
            }, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    def put(self, request):
        pass
