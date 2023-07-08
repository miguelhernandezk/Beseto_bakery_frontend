import {
  Container,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';
import HeroHeader from '../components/HeroHeader';
import Layout from '../components/Layout';
import AppContext from '../context/AppContext';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { CartItem, CartItemDto } from '../interfaces/User';
import { updateCart } from '../services/users';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { Role } from '../interfaces/Enums';

function Carrito() {
  const { cart, setCart, notifyError, notifySuccess } = useContext(AppContext);
  const { data: session, status } = useSession();
  const [amounts, setAmounts] = useState<(number | string)[]>([]);
  const [tempAmount, setTempAmount] = useState<number>();
  const [uiState, setUiState] = useState<'loading' | 'info loaded'>();

  const handleChangeAmount = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    indexOfElement: number
  ) => {
    setTempAmount(cart[indexOfElement].amount);
    const newAmounts = [...amounts];
    newAmounts[indexOfElement] = event.target.value;
    setAmounts(newAmounts);
  };

  const handleLeftAmountField = async (indexOfElement: number) => {
    const newAmountsNumber: number[] = [];
    const newAmounts: (string | number)[] = [];
    amounts.forEach((amount) => {
      newAmountsNumber.push(Number(amount));
      newAmounts.push(amount);
    });
    if (
      newAmountsNumber[indexOfElement] &&
      newAmountsNumber[indexOfElement] > 0
    ) {
      const newCart: CartItem[] = [];
      cart.forEach((item, index) =>
        newCart.push({
          product: item.product,
          amount: newAmountsNumber[index],
        })
      );
      if (session && status === 'authenticated') {
        const payload: CartItemDto[] = [];
        newCart.map((item) =>
          payload.push({ product: item.product._id, amount: item.amount })
        );
        const updatedCartResponse = await updateCart(
          session?.access_token,
          payload
        );
        if (updatedCartResponse.error) {
          notifyError('No pudimos actualizar tu carrito');
        } else {
          notifySuccess('Carrito actualizado');
          setCart(newCart);
        }
      }
    } else {
      if (tempAmount && amounts[indexOfElement] === '') {
        notifyError(
          'No puedes dejar este campo en blanco. Regresando al valor anterior'
        );
        newAmounts[indexOfElement] = tempAmount;
        setAmounts(newAmounts);
      }
      if (
        tempAmount &&
        (amounts[indexOfElement] === 0 ||
          amounts[indexOfElement] === '0' ||
          Number(amounts[indexOfElement]) < 0)
      ) {
        notifyError('Valor no válido');
        newAmounts[indexOfElement] = tempAmount;
        setAmounts(newAmounts);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const newCart: CartItem[] = cart.filter(
      (cartItem) => cartItem.product._id !== productId
    );
    const newCartDto: CartItemDto[] = newCart.map((fullCartItem) => ({
      product: fullCartItem.product._id,
      amount: fullCartItem.amount,
    }));
    if (session && status === 'authenticated') {
      const updatedCartResponse = await updateCart(
        session?.access_token,
        newCartDto
      );
      if (updatedCartResponse.error)
        notifyError('No pudimos actualizar tu carrito');
      else {
        notifySuccess('Objeto eliminado correctamente');
        setCart(newCart);
      }
    }
  };

  useEffect(() => {
    setAmounts(cart.map((cartItem) => cartItem.amount));
    if (cart !== undefined) {
      setUiState('info loaded');
    }
  }, [cart]);

  return (
    <>
      <Layout>
        <HeroHeader />
        <Container className="pt-16">
          {cart.length > 0 && uiState === 'info loaded' && (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead className="bg-beseto-bisque">
                    <TableRow>
                      <TableCell />
                      <TableCell />
                      <TableCell align="left">Producto</TableCell>
                      <TableCell align="left">Precio</TableCell>
                      <TableCell align="left">Cantidad</TableCell>
                      <TableCell align="left">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((cartItem, index) => (
                      <TableRow
                        key={cartItem.product.name}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <IconButton
                            onClick={() =>
                              handleDeleteProduct(cartItem.product._id)
                            }
                          >
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="right">
                          <img
                            src={cartItem.product.picture[0]}
                            className="w-8"
                            alt={cartItem.product.name}
                          />
                        </TableCell>
                        <TableCell align="left">
                          {cartItem.product.name}
                        </TableCell>
                        <TableCell align="left">
                          {new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                          }).format(cartItem.product.price)}
                        </TableCell>
                        <TableCell align="left">
                          <TextField
                            type="number"
                            value={amounts[index]}
                            onChange={(event) =>
                              handleChangeAmount(event, index)
                            }
                            onBlur={() => handleLeftAmountField(index)}
                          />
                        </TableCell>
                        <TableCell align="left">
                          {new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                          }).format(cartItem.amount * cartItem.product.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack alignItems="flex-end">
                <Typography variant="h5" className="mt-10">
                  Total:{' '}
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(
                    cart.reduce(
                      (accumulator, currentItem) =>
                        accumulator +
                        currentItem.amount * currentItem.product.price,
                      0
                    )
                  )}
                </Typography>
                <Box>
                  <Link href="/checkout">
                    <Button
                      variant="contained"
                      className="bg-beseto-dark-gray text-white grow mt-10 flex flex-col justify-center items-center"
                    >
                      Realizar pedido
                    </Button>
                  </Link>
                </Box>
              </Stack>
            </>
          )}
          {cart.length <= 0 && uiState === 'info loaded' && (
            <Typography variant="h3">Tu carrito está vacío</Typography>
          )}
          {uiState === 'loading' && (
            <>
              <CircularProgress />
              <Typography variant="h3">Cargando</Typography>
            </>
          )}
        </Container>
        <Box className="mt-8">
          <Footer />
        </Box>
      </Layout>
    </>
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

export default Carrito;
