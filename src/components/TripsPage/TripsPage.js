import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import TripCard from "./TripCard/TripCard";
import './TripsPage.css';
import { Fab, Paper, Stack, styled } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from "@mui/material/CircularProgress";
import { generatePath, useNavigate } from "react-router-dom";
import { useScrollDirection } from 'react-use-scroll-direction';

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    maxWidth: '50%', // Set the maximum width for each trip card
    flexBasis: '50%', // Set the flex basis to 50% for each trip card
}));

let email = "luanne@stark.com";

const GET_DATA = gql`
query {
  user(email: "${email}") {
    firstName
    email
    trips {
      id
      name
      description
      startDate
      endDate
    }
  }
}
`;

function TripsPage(props) {
    const { loading, error, data } = useQuery(GET_DATA);
    const [extended, setExtended] = useState(true);
    const [newtrip, setNewTrip] = useState(true);
    const [selectedTripId, setSelectedTripId] = useState(null);

    const { isScrollingUp, isScrollingDown } = useScrollDirection();

    let ext = extended ? "extended" : "circular";
    let nt = newtrip ? 'New Trip' : "";

    const navigate = useNavigate();

    const handleTripCardClick = (tripId) => {
        setSelectedTripId(tripId);
        // Navigate to the individual trip page here
        navigate(`/trip/${tripId}`); 
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isScrollingUp) {
                setExtended(true);
                setNewTrip(true);
            }
            if (isScrollingDown) {
                setExtended(false);
                setNewTrip(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrollingUp, isScrollingDown]);

    if (loading) return <CircularProgress />;
    if (error) return <h1>Error: {error.message}</h1>;

    return (
        <>
            <div className={"GroupStack"}>
                <Fab color="primary" aria-label="add" className={"NewTripFab"} id={"NewTrip"} variant={ext}>
                    <AddIcon /> <div id={"NewTripText"} >{nt}</div>
                </Fab>

                <Stack
                    direction="row" // Display trips in a row
                    justifyContent="center" // Center the trips horizontally
                    alignItems="flex-start" // Align the trips to the top
                    spacing={2}
                    overflow={"scroll"}
                    sx={{ mx: 2, mt: '90px' }}
                >
                    <React.Fragment>
                        {data?.user?.trips?.map((trip) => (
                            <Item key={trip.id} trip={trip} onClick={() => handleTripCardClick(trip.id)}>
                                <TripCard trip={trip} />
                            </Item>
                        ))}
                    </React.Fragment>
                </Stack>
            </div>
        </>
    );
}

export default TripsPage;
