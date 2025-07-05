from pymongo import MongoClient
from .settings import MONGO_URL


class MongoConfig:
    def __init__(self):
        try:
            if MONGO_URL:
                self.mongo_client = MongoClient(MONGO_URL)
                self.mongo_db = self.mongo_client.get_database()

            else:
                self.mongo_client = MongoClient('mongodb://localhost:27017/')
                self.mongo_db = self.mongo_client['pathnova']

        except Exception as e:
            print(f"MongoDB connection error: {e}")
            self.mongo_db = None