"""
Things to access from API:

Story A: none
Story B: restaurant search data with ID, name, cuisine, location, ratings, distance
Story C: interactive google map, restaurant markers
Story D: restaurant details, reviews, get directions
Story E: none
Story F: be able to write reviews/ratings (extra)

Maps APIs needed:
1. Places - search (with autocomplete), details (reviews, pictures, ??cuisine??)
2. Geocoding -
"""

import requests
from django.conf import settings

def