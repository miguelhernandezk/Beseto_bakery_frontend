import { useState } from 'react';
import { CartItem, CartItemDto } from '../interfaces/User';
import { toast } from 'react-toastify';
import { updateCart } from '../services/users';

const useSharedState = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const notifyError = (msg: string) => toast.error(msg);
  const notifySuccess = (msg: string) => toast.success(msg);

  const addToCart = async (token: string, productId: string, amount = 1) => {
    const newCartDto: CartItemDto[] = cart.map((item) => ({
      product: item.product._id,
      amount: item.amount,
    }));

    const indexOfItemToBeAdded = newCartDto?.findIndex(
      (cartItem) => cartItem.product === productId
    );
    if (indexOfItemToBeAdded >= 0) {
      newCartDto[indexOfItemToBeAdded].amount += amount;
    } else {
      newCartDto.push({ product: productId, amount });
    }
    const updatedCartResponse = await updateCart(token, newCartDto);
    if (updatedCartResponse.error) {
      notifyError('No pudimos actualizar tu carrito');
    } else {
      setCart(updatedCartResponse.data);
      notifySuccess('Agregado correctamente');
    }
  };

  const removeFromCart = async (
    token: string,
    productId: string,
    amount = 1
  ) => {
    const newCartDto: CartItemDto[] = cart.map((item) => ({
      product: item.product._id,
      amount: item.amount,
    }));

    const indexOfItemToBeRemoved = newCartDto?.findIndex(
      (product) => product.product === productId
    );
    if (indexOfItemToBeRemoved >= 0) {
      newCartDto[indexOfItemToBeRemoved].amount -= amount;
    } else {
      newCartDto.push({ product: productId, amount });
    }
    const newUpdatedCart =
      newCartDto[indexOfItemToBeRemoved].amount > 0
        ? [...newCartDto]
        : newCartDto.filter((item) => item.amount !== 0);
    const updatedCartResponse = await updateCart(token, newUpdatedCart);
    if (updatedCartResponse.error) {
      notifyError('No pudimos actualizar tu carrito');
    } else {
      setCart(updatedCartResponse.data);
      notifySuccess('Eliminado correctamente correctamente');
    }
  };
  return {
    cart,
    setCart,
    notifyError,
    notifySuccess,
    addToCart,
    removeFromCart,
  };
};

export default useSharedState;
