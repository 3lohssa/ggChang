import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Collapse,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

export default function NavigationBar({ isLoggedIn = false, onLogout = () => {} }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openFriendRequests, setOpenFriendRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);

  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get('https://your-api-endpoint/friend-requests', {
        headers: getAuthHeaders()
      });
      setFriendRequests(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`https://your-api-endpoint/friend-requests/${requestId}/accept`, {}, {
        headers: getAuthHeaders()
      });
      fetchFriendRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`https://your-api-endpoint/friend-requests/${requestId}/reject`, {}, {
        headers: getAuthHeaders()
      });
      fetchFriendRequests();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchFriendRequests();
    }
  }, [isLoggedIn]);

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white' }}>
      <Toolbar>
        <IconButton
          onClick={() => setOpenMenu(true)}
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer open={openMenu} onClose={() => setOpenMenu(false)}>
          <List sx={{ width: 250 }}>
            <ListItemButton onClick={() => { navigate("/dashboard"); setOpenMenu(false); }}>
              <ListItemText primary="我的帳本" />
            </ListItemButton>

            <ListItemButton onClick={() => { navigate("/friends"); setOpenMenu(false); }}>
              <ListItemText primary="朋友" />
            </ListItemButton>

            <ListItemButton onClick={() => { navigate("/add-friend"); setOpenMenu(false); }}>
              <ListItemText primary="新增好友" />
            </ListItemButton>

            <ListItemButton onClick={() => setOpenFriendRequests(!openFriendRequests)}>
              <ListItemText primary="交友邀請" />
              {openFriendRequests ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openFriendRequests} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {friendRequests.map((req) => (
                  <ListItemButton key={req.id} sx={{ pl: 4 }}>
                    <ListItemText primary={req.fromUserName} />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAccept(req.id)}
                    >
                      接受
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleReject(req.id)}
                    >
                      拒絕
                    </Button>
                  </ListItemButton>
                ))}
                {friendRequests.length === 0 && (
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="沒有新的邀請" />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </List>
        </Drawer>

        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, color: '#271010ff' }}
        >
          記記好帳
        </Typography>

        {!isLoggedIn ? (
          <IconButton color="inherit" onClick={() => navigate('/login')}>
            <LoginIcon />
          </IconButton>
        ) : (
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
