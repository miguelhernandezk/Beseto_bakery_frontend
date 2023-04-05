import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Container } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login, signinStatus } from '../services/auth';

export default function SignIn() {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<boolean>(false);

  /**
   *  Displays a success message if everything went right after logged in
   */
  const notifySuccess = (msg = 'Tarea realizada exitosamente') =>
    toast.success(msg);

  /**
   * Displays an error message if something went wrong
   * @param {JSX.Element} msg - Message to be displayed
   */
  const notifyError = (msg = 'Oops, something went wrong') =>
    toast.error(
      msg !== null && msg !== undefined ? (
        msg
      ) : (
        <div>
          There was an error logging in.
          <br />
          Please try again later.
        </div>
      )
    );

  /**
   *  If already logged, redirects to previous page
   */
  const handleSignInStatus = async (route?: string) => {
    const validSignInResponse = await signinStatus();
    if (validSignInResponse.error) {
      notifyError('No pudimos iniciar tu sesión');
    } else {
      notifySuccess('Ya habías iniciado sesión');
      router.push(route !== undefined ? route : '/');
    }
  };

  useEffect(() => {
    if (typeof router.query.next === 'string') {
      handleSignInStatus(router.query.next);
    } else handleSignInStatus();
  }, [router]);

  /**
   *  Gets data from form and connects with API in order to log in
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingState(true);
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    if (
      email !== null &&
      password !== null &&
      typeof email === 'string' &&
      typeof password === 'string'
    ) {
      if (email) {
        const loginStatusResponse = await login(email, password);
        if (loginStatusResponse.error) {
          notifyError();
        } else {
          notifySuccess();
          router.replace(`${router.query.next ?? '/'}`);
        }
        setLoadingState(false);
      } else {
        notifyError('The email you provided is not valid');
        setLoadingState(false);
      }
    } else {
      notifyError(
        'You did not provide credentials or the credentials provided are not in valid format'
      );
      setLoadingState(false);
    }
  };

  return (
    <>
      <Head>
        <title>Inicir sesión</title>
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />

      <>
        <Container className="w-full flex flex-col items-center justify-center text-center home">
          <Box className={`flex flex-col items-center`}>
            <Avatar className="">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar sesión
            </Typography>
            <Box className="" component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                disabled={loadingState}
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
                disabled={loadingState}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loadingState}
              >
                Entrar
              </Button>
              <Grid className="" container>
                <Grid item xs>
                  <Link href="/forgot-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </>
    </>
  );
}
