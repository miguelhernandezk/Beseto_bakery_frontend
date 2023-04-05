import axios from 'axios';
import { ServicesResponse } from '../interfaces/Responses';
import { handleApiErrors } from '../utils/handleApiErrors';
import { Category } from '../interfaces/Category';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllCategories = async (): Promise<ServicesResponse> => {
  try {
    const { data } = await axios.get(`${backendUrl}/categories/`);

    // "data Type"
    const categories: Category[] = data;
    const response: ServicesResponse<Category[]> = {
      error: false,
      data: categories,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};
