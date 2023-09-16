import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function TripPage() {
    const { tripId } = useParams();
    const [tripData, setTripData] = useState(null);
    const [destinations, setDestinations] = useState([]);

    const fetchTripData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:3000/api/v1/trips/${tripId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTripData(data);

                // After fetching trip data, fetch the associated destinations
                fetchDestinations();
            } else {
                console.error('Error fetching trip data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching trip data:', error);
        }
    };

    const fetchDestinations = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:3000/api/v1/trips/${tripId}/destinations`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDestinations(data);
            } else {
                console.error('Error fetching destinations:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    useEffect(() => {
        fetchTripData();
    }, [tripId]);

    if (!tripData) {
        return <div>Loading...</div>;
    }

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    return (
        <div>
            <h1>{tripData.name}</h1>
            <p>{tripData.description}</p>
            <p>Start Date: {tripData.startDate}</p>
            <p>End Date: {tripData.endDate}</p>

            <h2>Destinations</h2>
            <ul>
                {destinations.map((destination) => (
                    <li key={destination.id}>
                        {destination.name}, {destination.city}
                    </li>
                ))}
            </ul>

            <LoadScript googleMapsApiKey="INSERTAR API KEY AQUI">  
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={8} 
                    center={{ lat: 0, lng: 0 }} 
                >
                    {destinations.map((destination) => (
                        <Marker
                            key={destination.id}
                            position={{ lat: destination.latitude, lng: destination.longitude }}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

export default TripPage;

