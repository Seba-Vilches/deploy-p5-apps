import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


function TripPage() {
    const { tripId } = useParams(); 
    const [tripData, setTripData] = useState(null); 

    const fetchTripData = async () => {
        try {

            const response = await fetch(`/api/trips/${tripId}`); 
            const data = await response.json();
            setTripData(data);
        } catch (error) {
            console.error('Error fetching trip data:', error);
        }
    };

    useEffect(() => {
        fetchTripData();
    }, [tripId]);

    if (!tripData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{tripData.name}</h1>
            <p>{tripData.description}</p>
            <p>Start Date: {tripData.startDate}</p>
            <p>End Date: {tripData.endDate}</p>
            {}
        </div>
    );
}

export default TripPage;
