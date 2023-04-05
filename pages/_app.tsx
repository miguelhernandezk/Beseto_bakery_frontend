import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider as AuthProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F6D9B6',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 780,
      lg: 1024,
      xl: 1200,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Layout> */}
        <Component {...pageProps} />
        {/* </Layout> */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
