let map;
const markers = [];
let currentResults = [];
let currentQuery = '';

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 33.753746, lng: -84.386330 },
        zoom: 13,
        mapTypeId: 'roadmap',
        disableDefaultUI: true
    });
}

function displayResults(results) {
    initMap();
    const resultsContainer = document.getElementById("results");
    const detailsContainer = document.getElementById("details");

    resultsContainer.innerHTML = '';
    detailsContainer.style.display = 'none';

    if (results.length > 0) {
        resultsContainer.style.display = 'block';
        currentResults = results;

        results.forEach(place => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-title">${place.name}</div>
                <div class="card-info star-rating">
                    ${'★'.repeat(Math.round(place.rating || 0))}${'☆'.repeat(5 - Math.round(place.rating || 0))} (${place.rating || 'N/A'})
                </div>
                <div class="card-info">
                    <i class="fas fa-map-marker-alt"></i> ${place.vicinity || 'N/A'}
                </div>
            `;
            card.onclick = () => showDetails(place);
            resultsContainer.appendChild(card);

            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
            });
            markers.push(marker);
            marker.onclick = () => showDetails(place);
        });
    } else {
        resultsContainer.innerHTML = '<p>No restaurants found. Try a different search term.</p>';
        resultsContainer.style.display = 'block';
    }
}

function showDetails(place) {
    const detailsContainer = document.getElementById("details");
    const resultsContainer = document.getElementById("results");

    resultsContainer.style.display = 'none'; // Hide results when showing details
    detailsContainer.style.display = 'block'; // Show details

    // Use Google Places Service to get full details of the selected place
    const service = new google.maps.places.PlacesService(map);
    service.getDetails({ placeId: place.place_id }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

            // Generate image carousel slides (if photos are available)
            const imageSlides = details.photos ?
                details.photos.map(photo => `<div><img class="details-image" src="${photo.getUrl({ maxWidth: 400 })}" /></div>`).join('') : '';

            // Populate details section with available data
            detailsContainer.innerHTML = `
                <div class="details-header">
                    <div class="back-button" onclick="goBack()">
                        <i class="fa-solid fa-rotate-left"></i>
                        Back to Results
                    </div>
                    <div class="details-title">${details.name}</div>
                    <div class="details-info"><i class="fas fa-map-marker-alt"></i> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.vicinity)}" target="_blank">${details.vicinity || 'N/A'}</a></div>
                    <div class="details-info"><i class="fas fa-phone-alt"></i> ${details.formatted_phone_number || 'N/A'}</div>
                    <div class="details-info"><i class="fas fa-globe"></i> <a href="${details.website}" target="_blank">${'Website' || 'N/A'}</a></div>
                    <div class="details-info star-rating"><i class="fas fa-star"></i> ${'★'.repeat(Math.round(details.rating || 0))}${'☆'.repeat(5 - Math.round(details.rating || 0))} (${details.rating || 'N/A'})</div>
                </div>
                <div class="details-image-carousel">${imageSlides}</div>
                <div class="expand" onclick="toggleReviews()">Show Reviews</div>
                <div class="reviews" style="display: none; max-height: 200px; overflow-y: auto;"></div>
            `;

            // Initialize the carousel only if there are images
            if (details.photos) {
                setTimeout(() => {
                    $('.details-image-carousel').slick({
                        dots: false,
                        infinite: true,
                        speed: 600,
                        fade: true,  // Smooth fade transition between images
                        positionAlign: "center",
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        nextArrow: '<button type="button" class="slick-next slick-arrow-custom"><i class="fas fa-chevron-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev slick-arrow-custom"><i class="fas fa-chevron-left"></i></button>',
                    });
                }, 100); // Delay to ensure the DOM is fully updated
            }

            // Set map center and zoom
            map.setCenter(details.geometry.location);
            map.setZoom(19.5);
            map.setMapTypeId('hybrid'); // Hybrid view (satellite with roads)

            // Display reviews if available
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
    detailsContainer.style.display = 'none';
    displayResults(currentResults);

    initMap();
    performSearch(currentQuery);
}

function performSearch(query) {
    if (!query) {
        initMap();
        displayResults();
        return;
    }

    markers.forEach(marker => marker.setMap(null));
    markers.length = 0;

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: { lat: 33.7490, lng: -84.3880 },
        radius: 7000, // 7 km radius
        keyword: query,
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayResults(results);
        } else {
            displayResults([]);
            alert('No places found. Please try another search term.');
        }
    });
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

document.addEventListener('click', function(event) {
    const detailsContainer = document.getElementById("details");
    const searchContainer = document.getElementById("search-container");

    if (!detailsContainer.contains(event.target) && !searchContainer.contains(event.target)) {
        detailsContainer.style.display = 'none';
    }
});

document.getElementById("search-input").addEventListener("input", function(event) {
    if (event.target.value.trim() === '') {
        document.getElementById("results").style.display = 'none';
    }
});

window.onload = initMap;
