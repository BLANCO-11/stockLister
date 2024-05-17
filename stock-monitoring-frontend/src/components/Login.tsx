import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import axios from 'axios';
import Cookies from 'js-cookie';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/auth/login/', { email, password });
      Cookies.set('token', response.data.token); // Set token with 1-day expiry
      navigate('/dashboard'); // Redirect to /dashboard
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  const handleSignup = () =>{
    navigate('/signup');
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Container>
        <Button
          className="mx-8"        
          variant="contained"
          color="primary"
          type="submit"
        >
          Login
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSignup}>
          Signup
        </Button>

        </Container>
      </form>
    </Container>
  );
};

export default Login;
