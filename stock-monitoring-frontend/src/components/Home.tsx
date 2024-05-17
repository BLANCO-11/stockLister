import React, {useEffect} from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Home: React.FC = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const token = Cookies.get('token');

    if (!token) {
      navigate('/login'); // Redirect to login if no token or token is expired
    }
    
  });
  
  return (
    <Container maxWidth="sm">
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to the APP
      </Typography>
      <Button component={Link} to="/dashboard" variant="contained" color="primary" fullWidth>
        Go to Dashboard
      </Button>
      {/* <Button component={Link} to="/signup" variant="outlined" color="primary" fullWidth>
        Signup
      </Button> */}
    </Container>
  );
};

export default Home;
