import { FormEvent, useEffect, useState } from 'react';
import { SignInResponse, signIn } from 'next-auth/react';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useRouter } from 'next/router';

export default function SignIn() {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

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
      if (email && password) {
        signIn('credentials', {
          username: email,
          password: password,
          redirect: false,
        }).then((response: SignInResponse) => {
          if (response.error) {
            setErrorMessage(
              response.error === 'CredentialsSignin'
                ? 'Datos de usuario incorrectos'
                : response.error
            );
          } else {
            response.url ? router.push(response.url) : router.push('/');
          }
        });

        setLoadingState(false);
      }
    } else {
      setErrorMessage('Verifica la información ingresada');
      setLoadingState(false);
    }
  };
  useEffect(() => {
    if (router.isReady && router.query.error) {
      router.query.error && router.query.error === 'CredentialsSignin'
        ? setErrorMessage('Datos de inicio de sesión incorrectos  ')
        : setErrorMessage(
            'Tuvimos problemas para iniciar tu sesión. Por favor contacta a soporte.'
          );
    }
  }, [router.isReady]);

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
          <Box className={`flex flex-col items-center max-w-lg w-full`}>
            <Avatar className="">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar sesión
            </Typography>
            <Box className="w-full" component="form" onSubmit={handleSubmit}>
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
              {errorMessage && (
                <Box className="inline-error-message">
                  <Typography>{errorMessage}</Typography>
                </Box>
              )}
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
