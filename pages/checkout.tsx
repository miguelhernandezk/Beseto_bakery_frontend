import {
  Button,
  Container,
  Box,
  TextField,
  Stack,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Head from 'next/head';
import Footer from '../components/Footer';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import Toolbar from '../components/Toolbar';
import { Role } from '../interfaces/Enums';
import Link from 'next/link';
import { DateTimePicker } from '@mui/x-date-pickers';
import { CartItemInOrderDto, CreateOrderDto } from '../interfaces/Order';
import AppContext from '../context/AppContext';
import { createOrder } from '../services/orders';
import { updateCart } from '../services/users';

export enum UiStates {
  ENTER_DATA = 0,
  CREATED = 1,
  NO_ITEMS = 3,
}

export default function AdminSite() {
  const { data: session, status } = useSession();
  const { cart, setCart, notifyError, notifySuccess } = useContext(AppContext);
  const [orderDto, setOrderDto] = useState<CreateOrderDto>();
  const [uiState, setUiState] = useState<UiStates>(UiStates.ENTER_DATA);
  const [productsInCheckout, setProductsInCheckout] = useState<
    CartItemInOrderDto[]
  >([]);
  const [newDeliveryDate, setNewDeliveryDate] = useState<Date | null>();
  const [alertMessageDate, setAlertMessageDate] = useState<string>();
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [clientBalance, setClientBalance] = useState<number>(0);
  const [receivedMoney, setReceivedMoney] = useState<number>(0);
  const [receivedMoneyField, setReceivedMoneyField] = useState<string>();
  const [totalMoneyOrder, setTotalMoneyOrder] = useState<number>(0);

  const handleChangeDate = (newValue: Date | null) => {
    if (newValue) {
      setNewDeliveryDate(newValue);
      setAlertMessageDate(undefined);
    } else {
      setNewDeliveryDate(null);
      setAlertMessageDate('Por favor ingresa tu fecha de nacimiento');
    }
  };

  const handleChangeReceivedMoney = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setReceivedMoneyField(event.target.value);
    setReceivedMoney(Number(event.target.value));
    setClientBalance(Number(event.target.value) - totalMoneyOrder);
  };

  const runValidations = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const streetName = data.get('street')?.toString().trim();
    const streetNumber = data.get('street-number')?.toString().trim();
    const colonia = data.get('colonia')?.toString().trim();
    const zipCode = data.get('zip-code')?.toString().trim();
    if (!newDeliveryDate || alertMessageDate) {
      notifyError('Verifica la fecha y hora ingresada');
      return false;
    }
    if (streetName && streetNumber && colonia && zipCode) {
      if (isNaN(Number(streetNumber))) {
        notifyError('Verifica que el número de tu dirección');
        return false;
      }
      if (isNaN(Number(zipCode))) {
        notifyError('Verifica tu código postal');
        return false;
      }
      if (orderDto) return true;
      return false;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingState(true);
    if (runValidations(event) && session && orderDto) {
      const data = new FormData(event.currentTarget);
      const streetName = data.get('street')?.toString().trim();
      const streetNumber = data.get('street-number')?.toString().trim();
      const colonia = data.get('colonia')?.toString().trim();
      const zipCode = data.get('zip-code')?.toString().trim();
      setClientBalance(receivedMoney - totalMoneyOrder);

      const customerInstructions = data
        .get('additional-info')
        ?.toString()
        .trim();
      const newOrderDto: CreateOrderDto = {
        ...orderDto,
        address: [
          streetName,
          'No.',
          streetNumber,
          colonia,
          'C.P.',
          zipCode,
        ].join(' '),
        cart: [...productsInCheckout],
        total: totalMoneyOrder,
        totalWithDiscount: totalMoneyOrder,
        customerInstructions: customerInstructions ? customerInstructions : '',
        deliveryDate: newDeliveryDate ? newDeliveryDate : new Date(),
        credit: clientBalance >= 0 ? 0 : clientBalance * -1,
      };
      setOrderDto(newOrderDto);
      const createdOrderResponse = await createOrder(
        session?.access_token,
        newOrderDto
      );
      if (createdOrderResponse.error) {
        notifyError('Tuvimos problemas al crear tu orden');
      } else {
        notifySuccess('Orden creada');
        setUiState(UiStates.CREATED);
        setCart([]);
      }
      await updateCart(session.access_token, []);
    }
    setLoadingState(false);
  };

  useEffect(() => {
    if (session && status === 'authenticated') {
      setOrderDto({
        createdBy: session.user._id,
        createdOn: new Date(),
        finalCustomer: session.user._id,
        immediateSale: true,
        cart: [],
        address: '',
        status: 'abierto',
        paymentMethod: 'cash',
        total: 0,
        totalWithDiscount: 0,
        deliveryDate: new Date(),
        customerInstructions: '',
        credit: 0,
      } as CreateOrderDto);
    }
  }, [session, status]);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      if (uiState !== UiStates.CREATED) setUiState(UiStates.NO_ITEMS);
    }
    const products: CartItemInOrderDto[] = cart.map((itemInCart) => ({
      product: itemInCart.product._id,
      amount: itemInCart.amount,
      currentPrice: itemInCart.product.price,
    }));
    if (products) {
      setProductsInCheckout(products);
      const newTotalMoneyOrder = products.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.amount * currentValue.currentPrice,
        0
      );
      setTotalMoneyOrder(newTotalMoneyOrder);
      setClientBalance(receivedMoney - totalMoneyOrder);
    }
  }, [cart]);

  return (
    <Box className="h-screen">
      <Toolbar />
      <Head>
        <title>Checkout - Beseto</title>
      </Head>
      <Box className="flex flex-col h-full">
        <Container className="w-full flex flex-col items-center justify-center text-center grow">
          {uiState === UiStates.ENTER_DATA && (
            <>
              <Typography variant="h3" alignSelf="flex-start">
                Checkout
              </Typography>
              <Box component="form" onSubmit={handleSubmit} className="w-full">
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TextField
                      className="grow"
                      type="text"
                      helperText="Dirección donde se entregará el pastel"
                      required
                      id="street"
                      label="Calle"
                      name="street"
                      autoComplete="street"
                      autoFocus
                      disabled={loadingState}
                    />
                    <TextField
                      type="text"
                      helperText="Número exterior"
                      required
                      id="street-number"
                      label="No."
                      name="street-number"
                      autoComplete="street-number"
                      autoFocus
                      disabled={loadingState}
                    />
                  </Stack>
                  <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TextField
                      className="grow"
                      type="text"
                      helperText="Colonia"
                      required
                      id="colonia"
                      label="Colonia"
                      name="colonia"
                      autoComplete="colonia"
                      autoFocus
                      disabled={loadingState}
                    />
                    <TextField
                      type="text"
                      helperText="Código Postal"
                      required
                      id="zip-code"
                      label="Código Postal"
                      name="zip-code"
                      autoComplete="zip-code"
                      autoFocus
                      disabled={loadingState}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <FormControl>
                      <FormLabel
                        required
                        id="radio-button-group-payment-method"
                        color="secondary"
                      >
                        Forma de pago
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="radio-button-group-payment-method-label"
                        defaultValue="cash"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="cash"
                          control={<Radio />}
                          label="Efectivo"
                        />
                        <FormControlLabel
                          value="credit/debit card"
                          control={<Radio />}
                          label="Tarjeta de crédito/débito"
                          disabled
                        />
                        <FormControlLabel
                          value="paypal"
                          control={<Radio />}
                          label="Paypal"
                          disabled
                        />
                        <FormControlLabel
                          value="other"
                          control={<Radio />}
                          label="Otro"
                          disabled
                        />
                      </RadioGroup>
                    </FormControl>
                    <Box>
                      <DateTimePicker
                        label="Fecha y hora de entrega"
                        disablePast
                        format="dd-MM-yyyy HH:mm"
                        value={newDeliveryDate}
                        onError={(error) => {
                          error
                            ? notifyError(
                                'Revisa el valor ingresado en la fecha y hora de entrega'
                              )
                            : null;
                          setAlertMessageDate('Verifica la fecha de entrega');
                        }}
                        onChange={handleChangeDate}
                      />
                      {alertMessageDate && (
                        <Typography sx={{ color: 'red' }}>
                          {alertMessageDate}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                  <TextField
                    type="text"
                    helperText="Número interior de la vivienda, número de teléfono adicional, persona que recibe, referencias, etc"
                    multiline
                    maxRows={4}
                    id="additional-info"
                    label="Instrucciones adicionales"
                    name="additional-info"
                    autoFocus
                    disabled={loadingState}
                  />
                  <TextField
                    type="number"
                    value={receivedMoneyField}
                    helperText="Dinero recibido (antes de dar cambio)"
                    id="received-money"
                    label="Dinero recibido del cliente (antes de dar cambio)"
                    name="received-money"
                    autoFocus
                    onChange={handleChangeReceivedMoney}
                    disabled={loadingState}
                  />
                  {clientBalance === 0 && (
                    <Typography variant="h6">
                      El cliente ha pagado el total de la cuenta
                    </Typography>
                  )}
                  {clientBalance > 0 && (
                    <Typography variant="h6" sx={{ color: 'green' }}>
                      No olvides dar cambio al cliente:{' '}
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }).format(clientBalance)}
                    </Typography>
                  )}
                  {clientBalance < 0 && (
                    <Typography variant="h6" sx={{ color: 'red' }}>
                      Recuerda al cliente que queda pendiente por pagar:{' '}
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }).format(clientBalance * -1)}
                    </Typography>
                  )}
                  <Typography sx={{ color: 'red' }}>
                    Somos una sucursal localizada en la ciudad de Puebla. Las
                    entregas se hacen dentro de la zona metropolitana y sus
                    alrededores
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Link href="/carrito">
                      <Button
                        variant="contained"
                        disabled={loadingState}
                        className="bg-beseto-dark-gray text-white grow mt-10 flex flex-col justify-center items-center"
                      >
                        Regresar al carrito
                      </Button>
                    </Link>
                  </Box>
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loadingState}
                      className="bg-beseto-dark-gray text-white grow mt-10 flex flex-col justify-center items-center"
                    >
                      Pagar y confirmar pedido
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </>
          )}
          {uiState === UiStates.CREATED && (
            <Stack className={`flex flex-col items-center`} spacing={3}>
              <Typography>Orden realizada con éxito</Typography>
              <CheckCircleIcon sx={{ color: 'green' }} />
              <Button variant="contained" className="bg-beseto-bisque">
                <Link href="/">Ir a inicio</Link>
              </Button>
            </Stack>
          )}

          {uiState === UiStates.NO_ITEMS && (
            <Typography variant="h3">
              No puedes crear pedidos si no tienes items en tu carrito
            </Typography>
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
