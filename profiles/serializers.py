from rest_framework import serializers


class StudentProfileSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    college = serializers.CharField()
    semester = serializers.CharField()
    current_major = serializers.CharField()
    batch_at_achievers = serializers.CharField()
    intended_specialization = serializers.CharField()
    skills = serializers.ListField(child=serializers.CharField())
    upskilling_goals = serializers.ListField(child=serializers.CharField())
    portfolio_url = serializers.CharField(allow_blank=True, required=False)  
    linkedin_url = serializers.CharField(allow_blank=True, required=False) 
    profile_building_duration = serializers.IntegerField()
