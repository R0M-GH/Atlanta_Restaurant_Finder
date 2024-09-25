"""
Things to access from API:

Story A: none
Story B: restaurant search data with ID, name, cuisine, distance
Story C: interactive google map, restaurant markers
Story D: restaurant details, reviews, get directions
Story E: none
Story F: be able to write reviews/ratings (extra)

extra: add location

Maps APIs needed:
1. Places - search (with autocomplete), details (reviews, pictures, ??cuisine??)
2. Geocoding -
"""

import requests
import googlemaps.places
from django.conf import settings

gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

def get_place_id(address):
    pass



# share with ppl
# unique identifier for locations to store in favorites
# maps.html errors
# work