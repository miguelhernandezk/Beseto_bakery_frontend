import axios, { AxiosRequestConfig } from 'axios';
import {
  createProductDto,
  UpdateProductDto,
} from '../interfaces/dtos/Product.dto';
import { Product } from '../interfaces/Product';
import { ServicesResponse } from '../interfaces/Responses';
import { handleApiErrors } from '../utils/handleApiErrors';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllProducts = async (): Promise<ServicesResponse> => {
  try {
    const { data } = await axios.get(`${backendUrl}/products/`);

    // "data Type"
    const products: Product[] = data;
    const response: ServicesResponse<Product[]> = {
      error: false,
      data: products,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};

export const getOneProduct = async (_id: string): Promise<ServicesResponse> => {
  try {
    const { data } = await axios.get(`${backendUrl}/products/${_id}`);

    // "data Type"
    const product: Product = data;
    const response: ServicesResponse<Product> = {
      error: false,
      data: product,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};

export const createProduct = async (
  payload: createProductDto,
  token: string
): Promise<ServicesResponse> => {
  try {
    // // const token = localStorage.getItem('Beseto_token');
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${backendUrl}/products/`,
      payload,
      config
    );

    // "data Type"
    const productInfo: Product = data;
    const response: ServicesResponse<Product> = {
      error: false,
      data: productInfo,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};

export const updateProduct = async (
  _id: string,
  payload: UpdateProductDto,
  token: string
): Promise<ServicesResponse> => {
  try {
    // const token = localStorage.getItem('Beseto_token');
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(
      `${backendUrl}/products/${_id}`,
      payload,
      config
    );

    // "data Type"
    const productInfo: Product = data;
    const response: ServicesResponse<Product> = {
      error: false,
      data: productInfo,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};
