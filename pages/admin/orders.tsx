import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useContext, useEffect, useState } from 'react';

import Head from 'next/head';
import Footer from '../../components/Footer';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import Toolbar from '../../components/Toolbar';
import { Role } from '../../interfaces/Enums';
import { getOrders } from '../../services/orders';
import { Order } from '../../interfaces/Order';
import AppContext from '../../context/AppContext';
import { differenceInDays, format } from 'date-fns';

export enum UiStates {
  LOADING_DATA = 0,
  DATA_LOADED = 1,
}

export default function AdminSite() {
  const { notifyError } = useContext(AppContext);
  const { data: session, status } = useSession();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [localUiState, setLocalUiState] = useState<UiStates>(
    UiStates.LOADING_DATA
  );

  const onSetOrders = async () => {
    if (session && status === 'authenticated') {
      const ordersResponse = await getOrders(session.access_token);
      if (ordersResponse.error) {
        notifyError('No pudimos las ordenes');
      } else {
        const orders: Order[] = ordersResponse.data;
        setAllOrders(orders);
        setFilteredOrders(orders);
      }
      setLocalUiState(UiStates.DATA_LOADED);
    } else {
      notifyError('Cierra sesión y vuelve a iniciarla.');
    }
  };

  const filterByUpcomingOrders = () => {
    const newFilteredOrders = allOrders.filter(
      (order) =>
        differenceInDays(new Date(order.deliveryDate), new Date()) >= 0 &&
        differenceInDays(new Date(order.deliveryDate), new Date()) < 8
    );
    setFilteredOrders(newFilteredOrders);
  };

  useEffect(() => {
    onSetOrders();
  }, []);
  if (status === 'loading') return null;
  if (status === 'unauthenticated' || !session)
    return <Typography>No has iniciado sesión</Typography>;

  return (
    <Box className="h-screen">
      <Toolbar />
      <Head>
        <title>Órdenes - Beseto</title>
      </Head>
      <Box className="flex flex-col h-full">
        <Container className="w-full flex flex-col items-center justify-center text-center grow">
          {localUiState === UiStates.LOADING_DATA && (
            <>
              <CircularProgress />
              <Typography variant="h3">Cargando</Typography>
            </>
          )}
          {localUiState === UiStates.DATA_LOADED && allOrders.length > 0 && (
            <>
              <Stack direction="row" className="mt-8" spacing={3}>
                <Button
                  variant="contained"
                  className="bg-beseto-dark-gray text-white  flex flex-col justify-center items-center"
                  onClick={filterByUpcomingOrders}
                >
                  Mostrar solo pedidos para los siguientes 7 días
                </Button>
                <Button
                  variant="contained"
                  className="bg-beseto-dark-gray text-white  flex flex-col justify-center items-center"
                  onClick={() => setFilteredOrders(allOrders)}
                >
                  Mostrar todos los pedidos
                </Button>
              </Stack>
              <Stack spacing={2} className="mt-12 mb-12 w-full">
                {filteredOrders.map((order) => (
                  <Card key={order._id}>
                    <CardHeader
                      className="bg-beseto-dark-gray text-white"
                      color="white"
                      title={`Orden #${order._id}`}
                    />
                    <CardContent className="flex flex-col items-start">
                      <Typography variant="h6" className="font-bold">
                        Fecha y hora de entrega:{' '}
                        <Typography component="span">
                          {format(
                            new Date(order.deliveryDate),
                            'dd-MM-yyyy kk:mm'
                          )}
                        </Typography>
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        Dirección de entrega:{' '}
                        <Typography component="span">
                          {order.address}
                        </Typography>
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        Cliente:{' '}
                        <Typography component="span">{`${order.finalCustomer.name} ${order.finalCustomer.lastName}`}</Typography>
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        Estatus:{' '}
                        <Typography component="span">{order.status}</Typography>
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        Indicaciones especiales:{' '}
                        <Typography component="span">
                          {order.customerInstructions}
                        </Typography>
                      </Typography>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead className="bg-beseto-bisque">
                            <TableRow>
                              <TableCell align="left">Nombre</TableCell>
                              <TableCell align="left">Precio</TableCell>
                              <TableCell align="left">Cantidad</TableCell>
                              <TableCell align="left">Subtotal</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.cart.map((cartItem) => (
                              <TableRow
                                key={cartItem.product._id}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="left">
                                  {cartItem.product.name}
                                </TableCell>
                                <TableCell align="left">
                                  {new Intl.NumberFormat('es-MX', {
                                    style: 'currency',
                                    currency: 'MXN',
                                  }).format(cartItem.currentPrice)}
                                </TableCell>
                                <TableCell align="left">
                                  {cartItem.amount}
                                </TableCell>
                                <TableCell align="left">
                                  {new Intl.NumberFormat('es-MX', {
                                    style: 'currency',
                                    currency: 'MXN',
                                  }).format(
                                    cartItem.amount * cartItem.currentPrice
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Typography
                        variant="h5"
                        className="font-bold mt-3"
                        alignSelf="flex-end"
                      >
                        Total{' '}
                        <Typography component="span" variant="h5">
                          {new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                          }).format(order.total)}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="h5"
                        className="font-bold mt-3"
                        alignSelf="flex-end"
                      >
                        Cliente aún debe:{' '}
                        <Typography component="span" variant="h5">
                          {new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                          }).format(0)}
                        </Typography>
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </>
          )}
          {localUiState === UiStates.DATA_LOADED && allOrders.length <= 0 && (
            <Typography variant="h2">No hay pedidos para mostrar</Typography>
          )}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps<object> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session && session.user.role === Role.CUSTOMER) {
    return {
      notFound: true,
    };
  }
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
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
