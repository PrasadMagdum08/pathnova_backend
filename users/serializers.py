from rest_framework import serializers



class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    role = serializers.CharField(max_length=20, default='student')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ProfileSerializer(serializers.Serializer):
    id = serializers.CharField(required=False)
    username = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    role = serializers.CharField(max_length=20, required=False)
    is_profile_complete = serializers.BooleanField(required=False)