import axios, { AxiosRequestConfig } from 'axios';
import { ServicesResponse } from '../interfaces/Responses';
import { CreateUserDto } from '../interfaces/dtos/User.dto';
import { User } from '../interfaces/User';
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
