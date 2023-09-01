import React from "react";
import './BottomBar.css';
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useNavigate } from "react-router-dom";

function BottomBar(props) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const navigate = useNavigate();

    // Assuming you have a variable isAuthenticated that indicates whether the user is authenticated
    const isAuthenticated = localStorage.getItem("authToken"); // Replace with your authentication logic

    return (
        <BottomNavigation sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0 }} value={value} onChange={handleChange}>
            {/* Conditional rendering of the "Login" button */}
            {isAuthenticated ? null : (
                <BottomNavigationAction
                    label="Login"
                    value="login"
                    onClick={() => navigate('/login')}
                    icon={<AccessibilityNewIcon />}
                />
            )}
            {!isAuthenticated ? null : (
                <BottomNavigationAction
                    label="Logout"
                    value="logout"
                    onClick={() => {
                        // Clear the authentication token from local storage
                        localStorage.removeItem("authToken");
                        console.log(localStorage.getItem("authToken"))
                        
                        // Navigate to the login page
                        navigate('/login');
                    }}
                    icon={<AccessibilityNewIcon />}
                />
            )}
            {!isAuthenticated ? null : (
            <BottomNavigationAction
                label="Home"
                value="home"
                onClick={() => navigate('/')}
                icon={<HomeIcon />}
            />
            )}
            {!isAuthenticated ? null : (
            <BottomNavigationAction
                label="Trips"
                value="trips"
                onClick={() => navigate('/trips')}
                icon={<ConnectingAirportsIcon />}
            />
            )}
            {!isAuthenticated ? null : (
            <BottomNavigationAction
                label="Map"
                value="map"
                onClick={() => navigate('/map')}
                icon={<LocationOnIcon />}
            />
            )}
            {!isAuthenticated ? null : (
            <BottomNavigationAction
                label="Search"
                value="search"
                onClick={() => navigate('/search')}
                icon={<TravelExploreIcon />}
            />
            )}
            {!isAuthenticated ? null : (
            <BottomNavigationAction
                label="Friends"
                value="friends"
                onClick={() => navigate('/friends')}
                icon={<GroupsIcon />}
            />
            )}
        </BottomNavigation>
    );
}

export default BottomBar;
