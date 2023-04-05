import { Box } from '@mui/material';

import Toolbar from './Toolbar';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const Layout = ({ children }: Props) => {
  return (
    <Box className="w-screen">
      <Box className="relative">
        <Toolbar />
        <Box className="absolute w-full top-0 left-0 -z-10">{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
