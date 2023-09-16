//AIzaSyDRZ7yD6VG7yFqk9XvLGEZfrTmQ6TWr_R0
import React, { useState, useCallback } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

function NewDestinationPage() {
    const [formData, setFormData] = useState({
        country: '',
        city: '',
        name: '',
        latitude: null,
        longitude: null,
    });

    const [selectedLocation, setSelectedLocation] = useState(null);

    const [searchValue, setSearchValue] = useState('');

    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

    const googleMapsApiKey = 'AIzaSyDRZ7yD6VG7yFqk9XvLGEZfrTmQ6TWr_R0';

    const mapOptions = {
        center: mapCenter,
        zoom: 10,
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey,
    });

    const handleMapClick = useCallback((e) => {
        setSelectedLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        });
        setFormData({
            ...formData,
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng(),
        });
        setMapCenter({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        });
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newDestination = {
            country: formData.country,
            city: formData.city,
            latitude: formData.latitude,
            longitude: formData.longitude,
            name: formData.name,
        };

        try {
            const response = await fetch("/api/v1/destinations", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify(newDestination),
            });

            if (response.ok) {
                console.log('Destination created successfully');
                setFormData({
                    country: '',
                    city: '',
                    latitude: null,
                    longitude: null,
                    name: '',
                });
            } else {
                console.error('Error creating destination');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSelect = async (address) => {
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setSelectedLocation({ lat, lng });
            setFormData({
                ...formData,
                latitude: lat,
                longitude: lng,
            });
            setMapCenter({ lat, lng });
        } catch (error) {
            console.error('Error selecting location:', error);
        }
    };

    const handleSearch = () => {
        handleSelect(searchValue);
    };

    const handleGetCurrentLocation = () => {
        // Get the user's current location using the browser's geolocation API
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setSelectedLocation({ lat: latitude, lng: longitude });
                setFormData({
                    ...formData,
                    latitude: latitude,
                    longitude: longitude,
                });
                setMapCenter({ lat: latitude, lng: longitude });
            }, (error) => {
                console.error('Error getting current location:', error);
            });
        } else {
            console.error('Geolocation is not supported by your browser.');
        }
    };

    const {
        ready,
        setValue,
        suggestions: { data, status },
    } = usePlacesAutocomplete({
        requestOptions: {
            types: ["(cities)"],
        },
    });

    return (
        <div>
            <h1>Create a New Destination</h1>
            <form onSubmit={handleSubmit}>
                <Box>
                    <TextField
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </Box>
                <Box>
                    <TextField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </Box>
                <Box>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </Box>

                <Box mt={2}>
                    <TextField
                        label="Search for Location"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        fullWidth
                    />
                    {status === "OK" && (
                        <ul>
                            {data.map((suggestion, index) => {
                                const {
                                    description,
                                } = suggestion;
                                return (
                                    <li
                                        key={index}
                                        onClick={() => handleSelect(description)}
                                    >
                                        {description}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </Box>

                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGetCurrentLocation}
                    >
                        Use Current Location
                    </Button>
                </Box>

                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={{ height: '400px', width: '100%' }}
                        center={mapOptions.center}
                        zoom={mapOptions.zoom}
                        onClick={handleMapClick}
                    >
                        {selectedLocation && (
                            <Marker position={selectedLocation} />
                        )}
                    </GoogleMap>
                )}

                <Box mt={2}>
                    <Button variant="contained" color="primary" type="submit">
                        Create Destination
                    </Button>
                </Box>
            </form>
        </div>
    );
}

export default NewDestinationPage;
