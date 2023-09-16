import React, { Component } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Box, Container, CssBaseline, Paper, Stack, styled, Button } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
}));

function MapPage(props) {
    const navigate = useNavigate();
    return (
        <Box mt={10}>
            {/* Your existing content */}
            <Button  variant="contained" color="primary" onClick={() => navigate('/new-destination')}>
                Create New Destination
            </Button>
            
        </Box>
    );
}
export default MapPage;
