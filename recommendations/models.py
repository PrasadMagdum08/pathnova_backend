from django.db import models

# recommendations/models.py
### COURSE 
class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    provider = models.CharField(max_length=100)
    url = models.URLField()
    duration = models.CharField(max_length=50)
    skill_category = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)

### WORKSHOP
class Workshop(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.CharField(max_length=100)
    date = models.DateTimeField()
    duration = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    skill_category = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)

### RESEARCH TOPIC
class ResearchTopic(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=[
        ('research_paper', 'Research Paper'),
        ('case_study', 'Case Study'),
        ('review_paper', 'Review Paper'),
    ])
    field = models.CharField(max_length=100)
    difficulty_level = models.CharField(max_length=20)
    resources = models.JSONField(default=list)

### INTERNSHIP
class Internship(models.Model):
    company = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    stipend = models.CharField(max_length=50)
    application_url = models.URLField()
    deadline = models.DateTimeField()
    skills_required = models.JSONField(default=list)