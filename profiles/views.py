from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from .serializers import StudentProfileSerializer
from .models import student_profile_collection
from bson import ObjectId


class StudentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_user_id(self, request):
        if 'user_id' in request.query_params:
            return request.query_params.get('user_id')
        
        if 'user_id' in request.data:
            return request.data.get('user_id')
        

        if hasattr(request.user, '_id'):
            return str(request.user._id)
        elif isinstance(request.user, dict) and '_id' in request.user:
            return str(request.user['_id'])
        elif hasattr(request.user, 'id'):
            return str(request.user.id)
        return None

    def get(self, request):
        try:
            user_id = self.get_user_id(request)
            if not user_id:
                return Response({"error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

            profile = student_profile_collection.find_one({'user_id': user_id})

            if profile:
                profile['_id'] = str(profile['_id'])
                return Response({
                    "message": "Profile fetched successfully",
                    "profile": profile
                }, status=status.HTTP_200_OK)

            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "error": f"Failed to fetch profile: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def post(self, request):
        try:
            user_id = self.get_user_id(request)
            if not user_id:
                return Response({"error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

            existing_profile = student_profile_collection.find_one({'user_id': user_id})

            if existing_profile:
                return Response({"error": "Profile already exists"}, status=status.HTTP_400_BAD_REQUEST)

            data = request.data.copy()
            data['user_id'] = user_id

            serializer = StudentProfileSerializer(data=data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            result = student_profile_collection.insert_one(serializer.validated_data)

            if result.inserted_id:
                data['_id'] = str(result.inserted_id)
                return Response({
                    "message": "Profile created successfully",
                    "data": data
                }, status=status.HTTP_201_CREATED)

            return Response({"error": "Profile creation failed"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "error": f"Failed to create profile: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def put(self, request):
        user_id = self.get_user_id(request)

        if not user_id:
            return Response({"error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        
        profile = student_profile_collection.find_one({'user_id': user_id})

        if not profile:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        update_data = request.data
        result = student_profile_collection.update_one(
            {'user_id': user_id},
            {'$set': update_data}
        )

        if result.modified_count > 0:
            updated_profile = student_profile_collection.find_one({'user_id': user_id})
            updated_profile['_id'] = str(updated_profile['_id'])
            return Response(updated_profile)
        return Response({"error": "Update failed"}, status=status.HTTP_400_BAD_REQUEST)
