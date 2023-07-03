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
} from '@mui/material';
import { useSession } from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';
import HeroHeader from '../components/HeroHeader';
import Layout from '../components/Layout';
import AppContext from '../context/AppContext';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import { CartItem, CartItemDto } from '../interfaces/User';
import { updateCart } from '../services/users';
import { ToastContainer } from 'react-toastify';

function Carrito() {
  const { cart, setCart, notifyError, notifySuccess } = useContext(AppContext);
  const { data: session, status } = useSession();
  const [amounts, setAmounts] = useState<(number | string)[]>([]);
  const [tempAmount, setTempAmount] = useState<number>();

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
  }, [cart]);

  return (
    <>
      <Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
        />
        <HeroHeader />
        <Container className="pt-16">
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
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                    <TableCell align="left">{cartItem.product.name}</TableCell>
                    <TableCell align="left">{cartItem.product.price}</TableCell>
                    <TableCell align="left">
                      <TextField
                        type="number"
                        value={amounts[index]}
                        onChange={(event) => handleChangeAmount(event, index)}
                        onBlur={() => handleLeftAmountField(index)}
                      />
                    </TableCell>
                    <TableCell align="left">
                      {cartItem.amount * cartItem.product.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Box className="mt-8">
          <Footer />
        </Box>
      </Layout>
    </>
  );
}

export default Carrito;
