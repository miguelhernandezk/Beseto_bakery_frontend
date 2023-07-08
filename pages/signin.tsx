import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
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
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export default function SignIn() {
  const [loadingState, setLoadingState] = useState<boolean>(false);

  /**
   * Displays an error message if something went wrong
   * @param {JSX.Element} msg - Message to be displayed
   */
  const notifyError = (msg = 'Oops, something went wrong') => toast.error(msg);

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
        signIn('credentials', {
          username: email,
          password: password,
        });
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
        <title>Iniciar sesión</title>
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

export const getServerSideProps: GetServerSideProps<object> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
