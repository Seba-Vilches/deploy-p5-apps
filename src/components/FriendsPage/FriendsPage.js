import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import QRCode from 'qrcode.react';
import SpinnerOfDoom from '../HomePage/SpinnerOfDoom';
import jsQR from 'jsqr';
import FriendList from './FriendList/FriendList'

function chunkString(str, chunkSize) {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
}

function FriendsPage(props) {
  const [user, setUser] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [friendId, setFriendId] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const user = { email };
    const authToken = localStorage.getItem('authToken');
    setUser(user);

    // Fetch user_id from the backend
    fetch(`http://localhost:3000/api/v1/users/${email}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.id) {
          setUserId(data.id);
        } else {
          console.error('User ID not found in the response');
        }
      })
      .catch(error => {
        console.error('Error fetching user ID:', error);
      });
  }, []);


  useEffect(() => {
    // Log the friendId when it changes
    console.log("Friend ID: ", friendId);
  }, [friendId]); // Listen for changes in friendId

  const userChunks = chunkString(JSON.stringify(user), 200);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setQrImage(imageDataUrl);
        processQrCode(imageDataUrl);
      };

      reader.readAsDataURL(file);
    }
  };

  const processQrCode = (imageDataUrl) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, img.width, img.height);

      const imageData = context.getImageData(0, 0, img.width, img.height);

      const code = jsQR(imageData.data, img.width, img.height);

      if (code) {
        console.log('QR Code Data:', code.data);

        var emailFromQR = code.data.split(':')[1].trim();
        emailFromQR = emailFromQR.slice(1);
        emailFromQR = emailFromQR.slice(0, -2);

        // Log the email in the desired format
        console.log('QR Code Email:', emailFromQR);
  
        // Access the user_id here
        console.log('User ID:', userId);
      } else {
        console.log('No QR Code found');
      }

      const authToken = localStorage.getItem('authToken');
  
      // Fetch user_id from the backend
      fetch(`http://localhost:3000/api/v1/users/${emailFromQR}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            setFriendId(data.id);
          } else {
            console.error('User ID not found in the response');
          }
        })
        .catch(error => {
          console.error('Error fetching user ID:', error);
        });
    };

    img.src = imageDataUrl;
  };

  const handleAddFriend = () => {
    // Check if both userId and friendId are available
    if (userId && friendId) {
      const authToken = localStorage.getItem('authToken');

      // Send a POST request to create a friendship
      fetch('http://localhost:3000/api/v1/friendships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user_id: userId,
          friend_id: friendId,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Friendship created:', data);
          // You may want to update the UI or perform additional actions
        })
        .catch(error => {
          console.error('Error creating friendship:', error);
        });
    } else {
      console.error('Both userId and friendId are required to create a friendship');
    }
  };

  return (
    <Box style={{ marginTop: '100px', textAlign: 'center', justifyContent: 'center' }}>
      {user ? (
        <>
          <Typography variant="h4">Share this QR code to connect with your friends!</Typography>
          {userChunks.map((chunk, index) => (
            <QRCode key={index} value={chunk} size={256} />
          ))}<br></br>
          <input type="file" accept="image/*" onChange={handleImageUpload} /><br></br><br></br>
          <Button variant="contained" onClick={handleAddFriend}>
            Add Friend
          </Button>

          <FriendList userId={userId} />
        </>
      ) : (
        <SpinnerOfDoom />
      )}
    </Box>
  );
}

export default FriendsPage;
