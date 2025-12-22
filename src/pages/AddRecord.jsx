// src/pages/AddRecord.jsx
import { Container, TextField, Button, Typography, Box, Paper, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { getAuthHeaders, isAuthenticated } from '../utils/auth';

export default function AddRecord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0] // 預設今天日期
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category) {
      alert('請填寫金額和分類');
      return;
    }

    if (!isAuthenticated()) {
      alert('請先登入');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/expenses',
        {
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          description: formData.description
        },
        {
          headers: getAuthHeaders()
        }
      );

      if (response.status === 201) {
        alert('新增成功！');
        navigate(-1);
      }
    } catch (error) {
      console.error('新增失敗:', error);
      if (error.response?.status === 401) {
        alert('登入已過期，請重新登入');
        navigate('/login');
      } else {
        alert('新增失敗：' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2} display="flex" alignItems="center">
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          新增紀錄
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="標題"
          placeholder="例如：早餐、計程車費"
          margin="normal"
          variant="outlined"
          value={formData.description}
          onChange={handleChange('description')}
        />

        <TextField
            fullWidth
            label="金額"
            type="number"
            margin="normal"
            placeholder="0"
            value={formData.amount}
            onChange={handleChange('amount')}
            InputProps={{
                startAdornment: <Typography color="text.secondary" sx={{ mr: 1 }}>$</Typography>
            }}
        />

        {/* 未來這裡建議改成 Select (下拉選單) */}
        <TextField
          fullWidth
          label="分類"
          placeholder="食、衣、住、行..."
          margin="normal"
          value={formData.category}
          onChange={handleChange('category')}
        />

        <TextField
          fullWidth
          label="日期"
          type="date"
          margin="normal"
          value={formData.date}
          onChange={handleChange('date')}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate(-1)}
                disabled={loading}
            >
                取消
            </Button>
            <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? '儲存中...' : '儲存'}
            </Button>
        </Box>
      </Paper>
    </Container>
  )
}