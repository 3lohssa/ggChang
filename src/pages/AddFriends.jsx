import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders, isAuthenticated, logout as authLogout } from '../utils/auth';
import NavigationBar from '../components/NavigationBar';

const API_BASE = 'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod';

export default function AddFriend() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({
    message: '',
    type: 'success',
    open: false,
  });

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    authLogout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleAddFriend = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus({
        message: '請輸入好友的電子郵件',
        type: 'error',
        open: true,
      });
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/friends/request`,
        { email: trimmedEmail },
        { headers: { 'Content-Type': 'application/json', ...getAuthHeaders() } }
      );

      setStatus({
        message: '好友邀請已送出！',
        type: 'success',
        open: true,
      });
      setEmail('');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        '送出好友邀請失敗，請稍後再試';
      setStatus({ message, type: 'error', open: true });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB' }}>
      <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          新增好友
        </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="朋友的電子郵件"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddFriend}>
          送出
        </Button>
      </Box>

      <Snackbar
        open={status.open}
        autoHideDuration={3000}
        onClose={() => setStatus((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={status.type} sx={{ width: '100%' }}>
          {status.message}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  );
}
