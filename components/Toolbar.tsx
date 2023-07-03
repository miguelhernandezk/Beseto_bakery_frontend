import { useContext, useEffect, useState } from 'react';
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
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { signIn, signOut, useSession } from 'next-auth/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import logo from '../public/assets/imgs/common/xs/logo_xs.png';
import { Role } from '../interfaces/Enums';
import AppContext from '../context/AppContext';
import { getUserCart } from '../services/users';
import { useRouter } from 'next/router';
// import { signOut } from '../services/auth';

function LoginLogout() {
  const { status, data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (status === 'loading') {
    return null;
  } else if (status === 'authenticated') {
    return (
      <Stack direction="row" spacing={1} className="items-center h-full">
        <Button
          variant="contained"
          className="bg-beseto-bisque"
          onClick={() => signOut()}
        >
          Cerrar sesión
        </Button>
        {session.user.role !== Role.CUSTOMER && (
          <>
            <IconButton onClick={handleClickButton}>
              <KeyboardArrowDownIcon sx={{ color: 'white' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link href="/admin">Panel de administración</Link>
              </MenuItem>
            </Menu>
          </>
        )}
      </Stack>
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
  const { status, data: session } = useSession();
  const { cart, setCart } = useContext(AppContext);

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

  const onClickCart = () => {
    router.push('/carrito');
  };

  const onSetCart = async () => {
    if (session && status === 'authenticated') {
      const cartResponse = await getUserCart(session.access_token);
      if (cartResponse.error) {
        cart;
      } else {
        setCart(cartResponse.data);
      }
    }
  };
  useEffect(() => {
    onSetCart();
  }, [session, status]);

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
          <Stack direction="row">
            <LoginLogout />
            {session && status === 'authenticated' && (
              <IconButton
                aria-label="cart"
                sx={{ color: 'white' }}
                onClick={onClickCart}
              >
                <Badge
                  badgeContent={cart.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.amount,
                    0
                  )}
                  color="primary"
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Toolbar;
