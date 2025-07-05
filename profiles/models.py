import os
from dotenv import load_dotenv
from pymongo import MongoClient
from django.conf import settings

load_dotenv()

client = MongoClient(settings.MONGO_URL)
db = client.get_default_database('pathnova')

student_profile_collection = db['student_profiles']


STUDENT_PROFILE_SCHEMA = {
    'user_id': str,
    'college': str,
    'semester': str,
    'current_major': str,
    'batch_at_achievers': str,
    'intended_specialization': str,
    'skills': list,
    'upsklling_goals': list,
    'portfolio_url': str or "NA",
    'linkedin_url': str or "NA",
    'profile_building_duration': int,
    'profile_completion': float,
}