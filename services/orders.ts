import axios, { AxiosRequestConfig } from 'axios';
import { ServicesResponse } from '../interfaces/Responses';
import { handleApiErrors } from '../utils/handleApiErrors';
import { CreateOrderDto, Order } from '../interfaces/Order';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createOrder = async (
  token: string,
  payload: CreateOrderDto
): Promise<ServicesResponse> => {
  try {
    // // const token = localStorage.getItem('Beseto_token');
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(`${backendUrl}/orders/`, payload, config);

    // "data Type"
    const createdOrder: Order = data;
    const response: ServicesResponse<Order> = {
      error: false,
      data: createdOrder,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};

export const getOrders = async (token: string): Promise<ServicesResponse> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${backendUrl}/orders/`, config);

    // "data Type"
    const listOfOrders: Order = data;
    const response: ServicesResponse<Order> = {
      error: false,
      data: listOfOrders,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};
