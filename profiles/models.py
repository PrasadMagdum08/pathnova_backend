from django.db import models
from users.models import User

# profiles/models.py - Student Profile
class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    college = models.CharField(max_length=100)
    semester = models.IntegerField()
    current_major = models.CharField(max_length=100)
    batch_at_achievers = models.CharField(max_length=50)
    intended_specialization = models.CharField(max_length=100)
    skills = models.JSONField(default=list)
    upskilling_goals = models.JSONField(default=list)
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    profile_building_duration = models.IntegerField(help_text="Duration in months")
    profile_completion = models.FloatField(default=0)


# profiles/models.py - Admin Profile
class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, blank=True)


# profiles/models.py
class Activity(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default='pending')
    deadline = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


# profiles/models.py
class ResumeFeedback(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    resume_url = models.URLField()
    ats_score = models.FloatField()
    feedback = models.TextField()
    improvement_suggestions = models.JSONField(default=list)