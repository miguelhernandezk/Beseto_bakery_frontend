import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Stack,
  List,
  Tabs,
  Tab,
  Container,
  IconButton,
  Box,
  ListItem,
  ListItemButton,
  Drawer,
  ListItemText,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { signIn, signOut, useSession } from 'next-auth/react';

import logo from '../public/assets/imgs/common/xs/logo_xs.png';
// import { signOut } from '../services/auth';

function LoginLogout() {
  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    return (
      <Button
        variant="contained"
        className="bg-beseto-bisque"
        onClick={() => signOut()}
      >
        Cerrar sesión
      </Button>
    );
  }
  return (
    <Button
      variant="contained"
      className="bg-beseto-bisque"
      onClick={() => signIn()}
    >
      Iniciar sesión
    </Button>
  );
}

function Toolbar() {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const navigationLinks: string[] = [
    // 'inicio',
    // 'nosotros',
    // 'productos',
    // 'tienda',
    // 'carrito',
  ];
  const [value, setValue] = useState(0);

  const handleChange = (event: unknown, newValue: unknown) => {
    setValue(newValue as number);
  };

  const toggleDrawer = () => {
    setOpenMenu(!openMenu);
  };

  const list = (anchor: unknown) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
      // className="bg-beseto-dark-gray"
    >
      <List>
        {navigationLinks.map((link) => (
          <ListItem key={link} disablePadding>
            <ListItemButton>
              <Link key={link} href={link === 'inicio' ? '/' : `/${link}`}>
                <ListItemText
                  primary={link}
                  className="capitalize font-bold text-white"
                />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ background: 'black' }}>
      <Container>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          className="justify-center lg:justify-between items-center p-4 z-100 w-full flex-col lg:flex-row"
        >
          <Link href="/">
            <img
              className="hover:cursor-pointer"
              src={logo.src}
              alt="logo de beseto"
            />
          </Link>
          <IconButton
            aria-label="Mostrar Menú"
            className="block lg:hidden"
            onClick={toggleDrawer}
          >
            <MenuIcon className="text-white text-3xl" />
            <Drawer
              anchor="right"
              open={openMenu}
              onClose={toggleDrawer}
              PaperProps={{ className: 'bg-beseto-dark-gray' }}
            >
              {list('right')}
            </Drawer>
          </IconButton>
          <List className="hidden lg:block z-100">
            <Tabs
              value={value}
              onChange={handleChange}
              orientation="horizontal"
              TabIndicatorProps={{ style: { background: '#F6D9B6' } }}
            >
              {navigationLinks.map((link) => (
                <Link key={link} href={link === 'inicio' ? '/' : `/${link}`}>
                  <Tab label={link} className="text-white" />
                </Link>
              ))}
            </Tabs>
          </List>
          <LoginLogout />
        </Stack>
      </Container>
    </Box>
  );
}

export default Toolbar;
