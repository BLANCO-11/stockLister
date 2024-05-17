import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('/api/watchlists/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setWatchlist(response.data);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchlist();
  }, [token]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Watchlist
      </Typography>
      <List>
        {watchlist.map((item: any) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.symbol} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Watchlist;
