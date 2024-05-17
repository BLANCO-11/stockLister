import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, CircularProgress, List, ListItem, ListItemText, Button, Typography, Paper, Card, CardContent } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
}

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      navigate('/login'); // Redirect to login if no token or token is expired
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);
  

  const searchStocks = async (term: string) => {
    try {
      setSearching(true);
      const response = await axios.get('http://localhost:8000/api/get-stocks-list/');
      const data = response.data;

      const stocksArray = Object.keys(data).map((key) => ({
        symbol: key,
        name: data[key as keyof typeof data][0],
        exchange: data[key as keyof typeof data][1]
      }));
      const filteredStocks = stocksArray.filter((stock) =>
        stock.name.toLowerCase().includes(term.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredStocks);
      setSearching(false);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setSearching(false);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const [debouncedSearchStocks] = useState(() => debounce(searchStocks, 500));
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearchStocks(value);
  };

  const addToWatchlist = (stock: Stock) => {
    setWatchlist([...watchlist, stock]);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="px-5 py-5">
      <Typography variant="h2">Stock Dashboard</Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
      <TextField
        className="w-2/5"
        type="text"
        autoComplete="off"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for a stock..."
        InputProps={{
          startAdornment: <SearchIcon />,
          endAdornment: searching && <CircularProgress color="inherit" size={20} />,
        }}
      />

      {searchResults.length > 0 && (
        <Paper ref={searchRef} className="w-2/3" elevation={3} style={{ maxHeight: '250px', overflowY: 'auto', margin: '10px 0' }}>
          <Typography variant="h3">Search Results</Typography>
          <List>
            {searchResults.slice(0, 5).map((stock) => (
              <ListItem className="hover:bg-purple-100" key={stock.symbol}>
                <ListItemText primary={`${stock.name} (${stock.symbol})`} />
                <Button variant="outlined" onClick={() => addToWatchlist(stock)}>Add to Watchlist</Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {watchlist.length > 0 && (
        <Paper elevation={3} style={{ margin: '10px 0', padding: '10px' }}>
          <Typography variant="h4">Watchlist</Typography>
          {watchlist.map((stock) => (
            <Card
              className="hover:bg-blue-100 mb-10 w-1/3"
              key={stock.symbol}
              style={{
                flexGrow: 0,
              }}
            >
              <CardContent>
                <Typography variant="h5">{stock.name}</Typography>
                <Typography variant="body1">Symbol: {stock.symbol}</Typography>
                <Typography variant="body1">Price: { /* Add price value here */ }</Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </div>
  );
};

export default Dashboard;
