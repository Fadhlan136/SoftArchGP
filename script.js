let map;
let infoWindow;
let service;
let currentLocation;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 15
    });

    infoWindow = new google.maps.InfoWindow({ map: map });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(currentLocation);
            infoWindow.setContent('Location found.');
            map.setCenter(currentLocation);
            performSearch(currentLocation, 'gym');
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    const input = document.getElementById('location');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    autocomplete.setTypes(['geocode']);

    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }

        currentLocation = place.geometry.location;
        performSearch(currentLocation, 'gym');
    });

    const buttons = document.querySelectorAll('.search-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedType = button.getAttribute('data-placeType');
            performSearch(currentLocation, selectedType);
        });
    });

    document.getElementById('current-location-btn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(currentLocation);
                performSearch(currentLocation, 'gym');
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function performSearch(location, type) {
    const placesContainer = document.getElementById('places');
    placesContainer.innerHTML = '<p>Loading...</p>'; // Loading spinner or message

    const request = {
        location: location,
        radius: '5000',
        type: [type],
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    const placesContainer = document.getElementById('places');
    placesContainer.innerHTML = '';

    if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (results.length === 0) {
            placesContainer.innerHTML = '<p>No places found.</p>';
        } else {
            for (let i = 0; i < Math.min(results.length, 5); i++) {
                createMarker(results[i]);
                getPlaceDetails(results[i].place_id);
            }
        }
    } else {
        placesContainer.innerHTML = '<p>No places found.</p>';
    }
}

function createMarker(place) {
    const placeLoc = place.geometry.location;
    const marker = new google.maps.Marker({
        map: map,
        position: placeLoc,
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
    });
}

function getPlaceDetails(placeId) {
    service.getDetails({ placeId: placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayPlace(place);
        } else {
            console.error('Place details request failed due to ' + status);
        }
    });
}

function displayPlace(place) {
    const placesContainer = document.getElementById('places');
    const placeElement = document.createElement('div');
    placeElement.className = 'place';

    const placeImage = place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 150, maxHeight: 150 }) : 'https://via.placeholder.com/150';
    const placeName = place.name;
    const placeAddress = place.formatted_address;
    const placeDescription = place.reviews && place.reviews.length > 0 ? place.reviews[0].text : 'No description available';

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.formatted_address)}`;

    placeElement.innerHTML = `
        <img src="${placeImage}" alt="${placeName}">
        <div class="place-info">
            <h3>${placeName}</h3>
            <p>${placeAddress}</p>
            <p>${placeDescription}</p>
            <a href="${directionsUrl}" target="_blank" class="green-btn">Get Directions</a>
        </div>
    `;

    placesContainer.appendChild(placeElement);
}

google.maps.event.addDomListener(window, 'load', initMap);
