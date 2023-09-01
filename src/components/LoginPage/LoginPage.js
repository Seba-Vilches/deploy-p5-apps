
import theme from "../../theme";
import {AUTH_TOKEN} from "../../constants";
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const credentials = `${email}:${password}`;
      const base64Credentials = btoa(credentials);
      const response = await fetch("http://localhost:3000/api/v1/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json","Accept": "application/json",
          Authorization: `Basic ${base64Credentials}`, 
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        localStorage.setItem("authToken", authToken);
        navigate('/trips')
        // Store the token in localStorage or global state (based on your state management choice).
        console.log(authToken)
        // Redirect the user to the home page or another protected page.
        // You can use React Router for this.
      } else {
        console.log("hola")
        // Handle authentication errors, e.g., display an error message to the user.
      }
    } catch (error) {
      // Handle network errors or other exceptions.
    }
  };

  return (
    <Box marginTop="100px">
      <TextField
        label="Correo Electrónico"
        variant="outlined"
        fullWidth
        value={email}
        onChange={handleEmailChange}
      />
      <TextField
        label="Contraseña"
        variant="outlined"
        type="password"
        fullWidth
        value={password}
        onChange={handlePasswordChange}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Iniciar Sesión
      </Button>
    </Box>
  );
}

export default LoginPage;
