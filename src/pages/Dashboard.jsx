// src/pages/Dashboard.jsx
import { Container, Card, Typography, Button, Box, Grid, IconButton, AppBar, Toolbar } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios'
import { exchangeCodeForTokens, isAuthenticated, logout as authLogout, getAuthHeaders } from '../utils/auth'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [records, setRecords] = useState([]) // 儲存支出紀錄
  const [totalAmount, setTotalAmount] = useState(0) // 儲存總金額

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/expenses',
        {
          headers: getAuthHeaders()
        }
      );
      setRecords(response.data.items || []);

      const sum = (response.data.items || []).reduce((acc, curr) => acc + Number(curr.amount), 0);
      setTotalAmount(sum);
    } catch (error) {
      console.error("抓取失敗:", error);
      if (error.response?.status === 401) {
        authLogout();
        setIsLoggedIn(false);
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    // 處理 Cognito 回調
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (code) {
        try {
          await exchangeCodeForTokens(code);
          setIsLoggedIn(true);
          // 清除 URL 中的 code 參數
          window.history.replaceState({}, document.title, '/');
        } catch (error) {
          console.error('登入失敗:', error);
          navigate('/login');
        }
      }
    };

    handleCallback();
    setIsLoggedIn(isAuthenticated());
  }, [location, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    authLogout();
    setIsLoggedIn(false);
    navigate('/login');
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 簡單的頂部導覽列 */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            ExpenseTracker
          </Typography>
          {!isLoggedIn ? (
            <IconButton color="inherit" onClick={() => navigate('/login')}>
              <LoginIcon />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        
        {/* 餘額卡片：使用漸層背景 */}
        <Card 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // 紫色漸層
            color: 'white' 
          }}
        >
          <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>目前餘額</Typography>
          <Typography variant="h2" component="div" fontWeight="bold">
            ${totalAmount}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            + $2,300 本月收入
          </Typography>
        </Card>

        {/* 操作區 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
           <Typography variant="h6" fontWeight="bold">近期紀錄</Typography>
           <Button variant="text" size="small">查看全部</Button>
        </Box>

        {/* 這裡可以放紀錄列表，目前先留空或放個佔位符 */}
        {records.map((item, index) => (
  <Card key={index} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography fontWeight="500">{item.description}</Typography>
      <Typography variant="caption" color="text.secondary">{item.date}</Typography>
    </Box>
    <Typography color="error" fontWeight="bold">-${item.amount}</Typography>
  </Card>
))}

        {/* 懸浮按鈕 (FAB) 風格的 Add 按鈕，或是寬版按鈕 */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ 
            mt: 2, 
            py: 1.5, 
            borderRadius: 50, // 膠囊狀按鈕
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' 
          }}
          onClick={() => navigate('/add-record')}
        >
          新增一筆紀錄
        </Button>
      </Container>
    </Box>
  )
}
