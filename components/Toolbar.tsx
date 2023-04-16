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

import logo from '../public/assets/imgs/common/xs/logo_xs.png';
import { signOut } from '../services/auth';

interface LoginLogoutProps {
  session: boolean;
}

function LoginLogout({ session }: LoginLogoutProps) {
  const goToSignInPage = () => {
    window.location.replace('/signin');
  };
  if (session) {
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
      onClick={() => goToSignInPage()}
    >
      Iniciar sesión
    </Button>
  );
}

function Toolbar() {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const [session, setSession] = useState<boolean>();
  const navigationLinks = [
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

  const handleGetSession = () => {
    const besetoToken = localStorage.getItem('Beseto_token');
    if (
      besetoToken !== null &&
      besetoToken !== undefined &&
      besetoToken !== 'undefined'
    )
      setSession(true);
    else setSession(false);
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

  useEffect(() => {
    if (!router.isReady) return;
    setValue(
      router.asPath.substring(1) === ''
        ? 0
        : navigationLinks.indexOf(router.asPath.substring(1))
    );
    handleGetSession();
  }, [router.isReady, router.asPath]);

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
          {session !== undefined ? <LoginLogout session={session} /> : null}
        </Stack>
      </Container>
    </Box>
  );
}

export default Toolbar;
