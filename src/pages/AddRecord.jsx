import { Container, TextField, Button, Typography, Box } from '@mui/material'

export default function AddRecord() {
  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Add Record
        </Typography>

        <TextField fullWidth label="Title" margin="normal" />
        <TextField fullWidth label="Amount" type="number" margin="normal" />
        <TextField fullWidth label="Category" margin="normal" />

        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          Save
        </Button>
      </Box>
    </Container>
  )
}
