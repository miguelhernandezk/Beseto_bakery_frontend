import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css';
import { AppProps } from 'next/app';

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
