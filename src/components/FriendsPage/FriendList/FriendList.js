import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';


function FriendList({ userId }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
  
    fetch(`http://localhost:3000/api/v1/users/${userId}/friends`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } 
        return response.json();
      })
      .then(data => {
        console.log('Friends Data:', data);
        if (Array.isArray(data)) {
          setFriends(data);
        }
      })
      .catch(error => {
        console.error('Error fetching friends:', error.message);
      });
  }, [userId]);
  
  return (
    <div>
      <h2>Your Friends:</h2>
      {Array.isArray(friends) ? (
        <List>
          {friends.map(friend => (
            <ListItem key={friend.id}>
              <ListItemText
                primary={friend.name}
                secondary={
                <Typography variant="h4">
                  -{friend.first_name} {friend.last_name},<br></br> email: {friend.email}
                </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <p>No friends to display.</p>
      )}
    </div>
  );
}

export default FriendList;
