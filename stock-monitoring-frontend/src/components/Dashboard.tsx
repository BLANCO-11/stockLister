import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, CircularProgress, List, ListItem, ListItemText, Button, Typography, Paper, Card, CardContent } from '@mui/material';
import { Search as SearchIcon} from '@mui/icons-material';

import axios from 'axios';
import Cookies from 'js-cookie';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
}

interface StockList {
  id: number;
  user: number;
  stock: {
    id: number;
    symbol: string;
    data: any; // Assuming data is an array of any type
    last_updated: string;
  };
  created_at: string;
}


const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<StockList[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const fetchWatchlist = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:8000/api/watchlists/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      console.log(response.data);
      setWatchlist(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  useEffect(() => {

    if (!token) {
      navigate('/login'); // Redirect to login if no token or token is expired
    }
  
    fetchWatchlist();

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
      const response = await axios.get(`http://localhost:8000/api/get-stocks-list/?search=${term}`);
      const data = response.data;
  
      const stocksArray = Object.keys(data).map((key) => ({
        symbol: data[key as keyof typeof data][0],
        name: key,
        exchange: data[key as keyof typeof data][1]
      }));
  
      const filteredStocks = stocksArray.filter((stock) =>
        stock.name.toLowerCase().includes(term.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(term.toLowerCase())
      );
  
      const sortedStocks = filteredStocks.sort((a, b) => {
        const distanceA = Math.abs(a.name.toLowerCase().indexOf(term.toLowerCase()));
        const distanceB = Math.abs(b.name.toLowerCase().indexOf(term.toLowerCase()));
        return distanceA - distanceB;
      });
  
      setSearchResults(sortedStocks);
      setSearching(false);
    } catch (error) {
      console.error('Error fetching stocks:', error);
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

  const addToWatchlist = async (stock: Stock) => {
  
    // Retrieve the token from local storage or cookies
    const token = Cookies.get('token');
    console.log(stock);
    try {
      const response = await axios.post('http://localhost:8000/api/watchlists/', {
        stock: {
          data :{
            name: stock.name            
          },
          symbol: stock.symbol,
          exhange: stock.exchange
        },
      }, {
        headers: {
          'Authorization': `Token ${token}`, // Include the Django token here
        }
      });

      
      const newStock: StockList = {
            id: response.data.id, // Use the ID returned from the server
            user: response.data.user, // Use the user ID returned from the server
            stock: {
                id: response.data.stock.id, // Use the stock ID returned from the server
                symbol: stock.symbol,
                data: response.data.stock.data, // Assuming data is an array of any type
                last_updated: response.data.stock.last_updated // Use the last_updated value returned from the server
            },
            created_at: response.data.created_at // Use the created_at value returned from the server
        };

        // Update the watchlist state
        // setWatchlist([...watchlist, newStock]);
        fetchWatchlist()
      // console.log('Stock added to watchlist:', response.data);

    } catch (error) {
      console.error('Error adding stock to watchlist:', error);      
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login'); // Redirect to login page
  };

  const handleRemoveFromWatchlist = (symbol: string) => {

    axios.post(
      'http://localhost:8000/api/watchlist/delete/',
      { "stock_symbol": symbol },
      {
          headers: {
              'Authorization': `Token ${token}`
          }
      }
    ).then(response => {            
            // console.log(response.data);
            setWatchlist(watchlist.filter(stocklist => stocklist.stock.symbol !== symbol));
        })
        .catch(error => {
            // Handle error response if needed
            console.error('Error removing item from watchlist:', error);
        });    
  };

  return (
    <div className="px-5 py-5" style={{ position: 'relative', height: '100px' }}>
      <Typography variant="h2">Stock Dashboard</Typography>
      <Button style={{ position: 'absolute', top: 20, right: 20 }} variant="contained" color="secondary" onClick={handleLogout}>
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
          <Typography className="bg-blue-600" variant="h3">Search Results</Typography>
          <List>
            {searchResults.slice(0, 15).map((stock) => (
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
          {watchlist.map((watchlistItem) => (
            <Card
              className="hover:bg-purple-100 mb-10 w-1/3"
              key={watchlistItem.stock.symbol}
              style={{
                flexGrow: 0,
              }}
            >
              <CardContent style={{ position: 'relative' }}>
                <Typography className='' variant="h5">{watchlistItem.stock.data.name} <Typography variant="body2"> {watchlistItem.stock.data.time_zone}</Typography> </Typography>
                <Typography variant="body1">Symbol: {watchlistItem.stock.symbol}</Typography>
                <Typography variant="body1">Price: { watchlistItem.stock.data.latest_open}</Typography>
                <Typography variant="body1">Volume: { watchlistItem.stock.data.latest_volume}</Typography>
                <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <IconButton
                    onClick={() => handleRemoveFromWatchlist(watchlistItem.stock.symbol)}
                    size="small"                    
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardContent>

              
            </Card>
          ))}
        </Paper>
      )}
    </div>
  );
};

export default Dashboard;
