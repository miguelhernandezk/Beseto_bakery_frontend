import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SessionProvider as AuthProvider } from 'next-auth/react';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css';
import { AppProps } from 'next/app';
import AppContext from '../context/AppContext';
import useSharedState from '../hooks/useSharedState';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F6D9B6',
    },
    secondary: {
      main: '#733315',
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
  components: {
    MuiTextField: { defaultProps: { color: 'secondary' } },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider session={pageProps.session}>
      <AppContext.Provider value={useSharedState()}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
              />
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </StyledEngineProvider>
        </LocalizationProvider>
      </AppContext.Provider>
    </AuthProvider>
  );
}

export default MyApp;
