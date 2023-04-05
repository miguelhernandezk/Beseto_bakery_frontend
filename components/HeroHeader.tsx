import { Typography, Box, Stack } from '@mui/material';

function HeroHeader() {
  return (
    <header className="header-bg w-screen -z-20 height-650 overflow-hidden relative flex flex-row items-center justify-center">
      {/* <img
        className="absolute w-screen"
        src={mainHeader.src}
        // src="https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80"
        alt="background"
      /> */}
      <Box className="absolute h-full w-full bg-black/30 z-0" />
      <Stack className="text-white w-160 h-auto z-20 text-center" spacing={8}>
        <Typography
          component="h1"
          className="text-4xl px-5 font-bold w-full sm:text-5xl md:text-8xl"
        >
          Llegó la hora del <span className="text-beseto-bisque">Pastel</span>
        </Typography>
        <Typography
          component="p"
          className="mb-10 w-full sm:text-lg md:text-2xl"
        >
          Aunque no lo creas, no solo es un pastel. Es él pastel. Y sabemos que
          te encantará
        </Typography>
      </Stack>
    </header>
  );
}

export default HeroHeader;
