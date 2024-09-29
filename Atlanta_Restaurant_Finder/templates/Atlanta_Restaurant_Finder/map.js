let map;
let currentResults = [];
let currentQuery = '';
let markers = [];
let currentDistanceFilter = 'All';
let currentRatingFilter = 'All';

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 33.753746, lng: -84.386330 },
        zoom: 13,
        mapTypeId: 'roadmap',
        disableDefaultUI: true
    });
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
    });

    marker.addListener('click', function () {
        showDetails(place);
    });

    markers.push(marker);
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function displayResults(results) {
    initMap();
    const resultsContainer = document.getElementById("results");
    const detailsContainer = document.getElementById("details");

    resultsContainer.innerHTML = '';
    detailsContainer.style.display = 'none';

    clearMarkers();

    if (results.length > 0) {
        resultsContainer.style.display = 'block';

        results.forEach(place => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-title">${place.name}</div>
                <div class="card-info star-rating">
                    ${'★'.repeat(Math.round(place.rating || 0))}${'☆'.repeat(5 - Math.round(place.rating || 0))} (${place.rating || 'N/A'}/5)
                </div>
                <div class="card-info">
                    <i class="fas fa-map-marker-alt"></i> ${place.vicinity || 'N/A'}
                </div>
            `;
            card.onclick = () => showDetails(place);
            resultsContainer.appendChild(card);

            createMarker(place);
        });
    } else {
        resultsContainer.innerHTML = '<p>No restaurants found. Try a different search term.</p>';
        resultsContainer.style.display = 'block';
    }
}

function showDetails(place) {
    const detailsContainer = document.getElementById("details");
    const resultsContainer = document.getElementById("results");

    resultsContainer.style.display = 'none';
    detailsContainer.style.display = 'block';

    const service = new google.maps.places.PlacesService(map);
    service.getDetails({ placeId: place.place_id }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

            const imageSlides = details.photos ?
                details.photos.map(photo => `<div><img class="details-image" src="${photo.getUrl({ maxWidth: 400 })}"  alt="images"/></div>`).join('') : '';

            detailsContainer.innerHTML = `
                <div class="details-header">
                    <div class="back-button" onclick="goBack()">
                        <i class="fa-solid fa-rotate-left"></i>
                        Back to Results
                    </div>
                    <div class="details-title">${details.name}</div>
                    <div class="details-info"><i class="fas fa-map-marker-alt"></i> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.vicinity)}" target="_blank">${details.vicinity || 'N/A'}</a></div>
                    <div class="details-info"><i class="fas fa-phone-alt"></i> ${details.formatted_phone_number || 'N/A'}</div>
                    <div class="details-info"><i class="fas fa-globe"></i> <a href="${details.website}" target="_blank">${details.website ? 'Website' : 'N/A'}</a></div>
                    <div class="details-info star-rating"><i class="fas fa-star"></i> ${'★'.repeat(Math.round(details.rating || 0))}${'☆'.repeat(5 - Math.round(details.rating || 0))} (${details.rating || 'N/A'}/5)</div>
                    <div class="details-info"><i class="fas fa-utensils"></i> Cuisine: ${details.types.find(type => type.includes("_restaurant")) ? details.types.find(type => type.includes("_restaurant")).replace("_restaurant", "").replace("_", " ") : "Restaurant"}</div>
                </div>
                <div class="details-image-carousel">${imageSlides}</div>
                <div class="expand" onclick="toggleReviews()">Show Reviews</div>
                <div class="reviews" style="display: none; max-height: 200px; overflow-y: auto;"></div>
            `;

            if (details.photos) {
                setTimeout(() => {
                    $('.details-image-carousel').slick({
                        dots: false,
                        infinite: true,
                        speed: 600,
                        fade: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        nextArrow: '<button type="button" class="slick-next slick-arrow-custom"><i class="fas fa-chevron-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev slick-arrow-custom"><i class="fas fa-chevron-left"></i></button>',
                    });
                }, 100);
            }

            map.setMapTypeId('hybrid');
            const targetLocation = details.geometry.location;
            map.panTo(targetLocation);

            let currentZoom = map.getZoom();
            const targetZoom = 19.5;
            const zoomStep = 0.5;

            const zoomInInterval = setInterval(() => {
                if (currentZoom < targetZoom) {
                    currentZoom += zoomStep;
                    map.setZoom(currentZoom);
                } else {
                    clearInterval(zoomInInterval);
                }
            }, 100);

            if (details.reviews && details.reviews.length) {
                document.querySelector('.reviews').innerHTML = details.reviews.map(review => `
                    <div class="review-card">
                        <div class="review-rating">${'★'.repeat(Math.round(review.rating || 0))}${'☆'.repeat(5 - Math.round(review.rating || 0))}</div>
                        <div class="review-date">${new Date(review.time * 1000).toLocaleDateString()}</div>
                        <div class="review-text">${review.text}</div>
                    </div>
                `).join('');
            }
        } else {
            alert('Details not available for this place.');
        }
    });
}

function toggleReviews() {
    const reviewContainer = document.querySelector('.reviews');
    reviewContainer.style.display = reviewContainer.style.display === 'none' ? 'block' : 'none';
}

function goBack() {
    const detailsContainer = document.getElementById("details");
    detailsContainer.style.display = 'remove';
    displayResults(currentResults);

    initMap();
    performSearch(currentQuery);
}

function performSearch(query) {
    if (!query) {
        initMap();
        displayResults([]);
        return;
    }

    clearMarkers();

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: { lat: 33.7490, lng: -84.3880 },
        radius: 7000,
        keyword: query,
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            currentResults = results;
            applyFilters();
        } else {
            displayResults([]);
            alert('No places found. Please try another search term.');
        }
    });
}

function changeDistanceFilter() {
    const distanceOptions = ['All', '1 km', '2 km', '5 km'];
    const currentIndex = distanceOptions.indexOf(currentDistanceFilter);
    const nextIndex = (currentIndex + 1) % distanceOptions.length;
    currentDistanceFilter = distanceOptions[nextIndex];

    document.getElementById("distance-filter").innerText = `Distance: ${currentDistanceFilter}`;
    applyFilters();
}

function changeRatingFilter() {
    const ratingOptions = ['All', '1*', '2*', '3*', '4*', '5*'];
    const currentIndex = ratingOptions.indexOf(currentRatingFilter);
    const nextIndex = (currentIndex + 1) % ratingOptions.length;
    currentRatingFilter = ratingOptions[nextIndex];

    document.getElementById("rating-filter").innerText = `Rating: ${currentRatingFilter}`;
    applyFilters();
}

function applyFilters() {
    let filteredResults = currentResults;

    if (currentDistanceFilter !== 'All') {
        let radius;
        if (currentDistanceFilter === '1 km') {
            radius = 1000;
        } else if (currentDistanceFilter === '2 km') {
            radius = 2000;
        } else if (currentDistanceFilter === '5 km') {
            radius = 5000;
        }

        filteredResults = filteredResults.filter(place => {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(33.753746, -84.386330),
                place.geometry.location
            );
            return distance <= radius;
        });
    }

    if (currentRatingFilter !== 'All') {
        const ratingValue = parseInt(currentRatingFilter.split(' ')[1].charAt(0), 10);
        filteredResults = filteredResults.filter(place => {
            return place.rating && place.rating >= ratingValue;
        });
    }

    displayResults(filteredResults);
}

document.getElementById("search-button").onclick = () => {
    currentQuery = document.getElementById("search-input").value;
    performSearch(currentQuery);
};

document.getElementById("search-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        currentQuery = document.getElementById("search-input").value;
        performSearch(currentQuery);
    }
});

window.onload = initMap;
