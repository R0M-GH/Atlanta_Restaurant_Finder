let map;
let currentResults = [];
let currentQuery = '';
let markers = [];
let currentDistanceFilter = 'All';
let currentRatingFilter = 'All';

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 33.753746, lng: -84.386330 },
        zoom: 12,
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

    if (currentQuery === '') return;

    if (results.length > 0) {
        resultsContainer.style.display = 'block';

        results.forEach(place => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-title">${place.name}</div>
                <div class="card-info star-rating">${'★'.repeat(Math.round(place.rating || 0))}${'☆'.repeat(5 - Math.round(place.rating || 0))} (${place.rating || 'N/A'}/5)</div>
                <div class="card-info"><i class="fas fa-map-marker-alt"></i> ${place.vicinity || 'N/A'}</div>
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
                    <div class="details-info"><i class="fas fa-clock"></i> ${details.opening_hours.weekday_text[new Date().getDay() + 6 % 7]}</div>
                    <div class="details-info star-rating"><i class="fas fa-star"></i> ${'★'.repeat(Math.round(details.rating || 0))}${'☆'.repeat(5 - Math.round(details.rating || 0))} (${details.rating || 'N/A'}/5)</div>
                    <div class="details-info"><i class="fas fa-utensils"></i> Cuisine: ${details.types.find(type => type.includes("_restaurant")) ? details.types.find(type => type.includes("_restaurant")).replace("_restaurant", "").replace("_", " ") : "Restaurant"}</div>
                </div>
                <div class="details-image-carousel">${imageSlides}</div>
                <div class="expand" id="reviews-toggle" onclick="toggleReviews()">Show Reviews</div>
                <div class="reviews" style="display: none; max-height: 200px; overflow-y: auto;"></div>
            `;

            if (details.photos) {
                setTimeout(() => {
                    $('.details-image-carousel').slick({
                        dots: true,
                        arrows: false,
                        infinite: true,
                        speed: 600,
                        fade: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 2000,
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
    if (reviewContainer.style.display === 'none') {
        reviewContainer.style.display = 'block';
        document.getElementById("reviews-toggle").innerText = "Hide Reviews";
    } else {
        reviewContainer.style.display = 'none';
        document.getElementById("reviews-toggle").innerText = "Show Reviews";
    }
}

function goBack() {
    const detailsContainer = document.getElementById("details");
    detailsContainer.style.display = 'remove';
    displayResults(currentResults);

    initMap();
    performSearch(currentQuery);
}

function performSearch(query, dist = 'All', rating = 'All') {
    if (!query) {
        displayResults([]);
        return;
    }

    clearMarkers();
    currentQuery = query;

    let radius;
    switch (dist) {
        case '1 mi': radius = 1609.34; break;
        case '2 mi': radius = 3218.69; break;
        case '3 mi': radius = 4828.03; break;
        case '4 mi': radius = 6437.38; break;
        case '5 mi': radius = 8046.72; break;
        default: radius = 9000;
    }

    if (query === '!!favorites!!') {
        return;
    } else {
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: {lat: 33.7490, lng: -84.3880},
            radius: radius,
            keyword: query,
            type: 'restaurant',
        }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                currentResults = results;
            } else {
                displayResults([]);
                alert('No places found. Please try another search term.');
            }
        });
    }

    if (currentRatingFilter !== 'All') {
        const ratingValue = parseInt(currentRatingFilter.split(' ')[0], 10);
        currentResults = currentResults.filter(place => {
            return place.rating && place.rating >= ratingValue;
        });
    }

    displayResults(currentResults);
}

function changeDistanceFilter() {
    const distanceOptions = ['All', '1 mi', '2 mi', '3 mi', '4 mi', '5 mi'];
    const currentIndex = distanceOptions.indexOf(currentDistanceFilter);
    const nextIndex = (currentIndex + 1) % distanceOptions.length;
    currentDistanceFilter = distanceOptions[nextIndex];

    const distanceButton = document.getElementById("distance-filter");
    distanceButton.innerText = `Distance: ${currentDistanceFilter}`;
    if (currentDistanceFilter !== 'All') {
        distanceButton.classList.add('filter-active');
    } else {
        distanceButton.classList.remove('filter-active');
    }

    performSearch(currentQuery, currentDistanceFilter);
}

function changeRatingFilter() {
    const ratingOptions = ['All', '1*', '2*', '3*', '4*', '5*'];
    const currentIndex = ratingOptions.indexOf(currentRatingFilter);
    const nextIndex = (currentIndex + 1) % ratingOptions.length;
    currentRatingFilter = ratingOptions[nextIndex];

    const ratingButton = document.getElementById("rating-filter");
    ratingButton.innerText = `Rating: ${currentRatingFilter}`;
    if (currentRatingFilter !== 'All') {
        ratingButton.classList.add('filter-active');
    } else {
        ratingButton.classList.remove('filter-active');
    }

    performSearch(currentQuery, undefined, currentRatingFilter);
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
