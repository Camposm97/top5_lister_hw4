import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, useContext } from 'react';
import AuthContext from '../auth';
import Copyright from './Copyright'
import { GlobalStoreContext } from '../store'

import ErrorDialog from './ErrorDialog'

export default function SignIn() {
  const { auth } = useContext(AuthContext)
  const { store } = useContext(GlobalStoreContext)

  const [errMsg, setErrMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false)

  const handleCloseDialog = () => {
    setShowAlert(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    auth.loginUser({
      email: formData.get('email'),
      password: formData.get('password')
    }, store).then(value => {
      if (value) {
        setErrMsg(value)
        setShowAlert(true)
      }
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <ErrorDialog
        showAlert={showAlert}
        errMsg={errMsg}
        handleCloseDialog={handleCloseDialog}
      />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/register/" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}