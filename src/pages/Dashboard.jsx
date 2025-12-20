import { Container, Card, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Current Balance</Typography>
          <Typography variant="h3" color="primary">
            $12,500
          </Typography>
        </Card>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => navigate('/add-record')}
        >
          Add Record
        </Button>
      </Box>
    </Container>
  )
}
