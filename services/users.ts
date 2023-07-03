import axios, { AxiosRequestConfig } from 'axios';
import { ServicesResponse } from '../interfaces/Responses';
import { CreateUserDto } from '../interfaces/dtos/User.dto';
import { CartItem, User, CartItemDto } from '../interfaces/User';
import { handleApiErrors } from '../utils/handleApiErrors';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createUser = async (
  payload: CreateUserDto
): Promise<ServicesResponse> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(`${backendUrl}/users/`, payload, config);

    // "data Type"
    const createdUser: User = data;
    const response: ServicesResponse<User> = {
      error: false,
      data: createdUser,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};

export const updateCart = async (
  token: string,
  payload: CartItemDto[]
): Promise<ServicesResponse> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${backendUrl}/profile/update-cart`,
      { cart: payload },
      config
    );

    // "data Type"
    const updatedCart: CartItem[] = data;
    const response: ServicesResponse<CartItem[]> = {
      error: false,
      data: updatedCart,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};

export const getUserCart = async (token: string): Promise<ServicesResponse> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${backendUrl}/profile/cart`, config);

    // "data Type"
    const updatedCart: CartItem[] = data;
    const response: ServicesResponse<CartItem[]> = {
      error: false,
      data: updatedCart,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};
