import axios, { AxiosRequestConfig } from 'axios';
import { LoginPayload } from '../interfaces/dtos/Login';
import { Product } from '../interfaces/Product';
import { ServicesResponse } from '../interfaces/Responses';
import { User, UserSignin } from '../interfaces/User';
import { handleApiErrors } from '../utils/handleApiErrors';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const login = async (
  email: string,
  password: string
): Promise<ServicesResponse> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const userLoginPayload: LoginPayload = {
      email,
      password,
    };
    const { data } = await axios.post(
      `${backendUrl}/auth/login/`,
      userLoginPayload,
      config
    );

    // "data Type"
    const signinUser: UserSignin = data;
    if (data.acces_token) {
      localStorage.setItem('Beseto_token', data.acces_token);
      alert('paso aquí');
      const response: ServicesResponse<User> = {
        error: false,
        data: signinUser.user,
        helperText: null,
      };
      return response;
    } else {
      // Default: Not log in
      const response: ServicesResponse = {
        error: true,
        data: {
          loggedIn: false,
        },
        helperText: 'We could not log you in',
      };
      return response;
    }
  } catch (e) {
    console.log(e);
    return handleApiErrors(e);
  }
};

export const signinStatus = async (): Promise<ServicesResponse> => {
  try {
    const token = localStorage.getItem('Beseto_token');
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${backendUrl}/profile/me/`, config);

    // "data Type"
    const userInfo: User = data;
    const response: ServicesResponse<User> = {
      error: false,
      data: userInfo,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};
