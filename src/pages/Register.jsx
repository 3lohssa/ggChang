import { Container, TextField, Button, Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Typography variant="h4" align="center">
          Create Account
        </Typography>

        <TextField fullWidth label="Email" margin="normal" />
        <TextField fullWidth label="Password" type="password" margin="normal" />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Register
        </Button>
      </Box>
    </Container>
  )
}
