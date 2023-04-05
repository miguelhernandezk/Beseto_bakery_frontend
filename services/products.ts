import axios, { AxiosRequestConfig } from 'axios';
import { ProductDto } from '../interfaces/dtos/Product.dto';
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

export const createProduct = async (
  payload: ProductDto
): Promise<ServicesResponse> => {
  try {
    const token = localStorage.getItem('Beseto_token');
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
    const userInfo: Product = data;
    const response: ServicesResponse<Product> = {
      error: false,
      data: userInfo,
      helperText: null,
    };
    return response;
  } catch (e) {
    console.log(e);
    return handleApiErrors(e);
  }
};
