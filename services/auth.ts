import axios, { AxiosRequestConfig } from 'axios';
import { LoginPayload } from '../interfaces/dtos/Login';
import { ServicesResponse, VerificationRta } from '../interfaces/Responses';
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
    if (data.access_token) {
      const response: ServicesResponse<UserSignin> = {
        error: false,
        data: signinUser,
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
    return handleApiErrors(e);
  }
};

export const signinStatus = async (
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

// Sends a code to backend to verify
export const verify = async (code: string): Promise<ServicesResponse> => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/auth/verify-email/${code}`
    );

    // "data Type"
    const verifiedInfo: VerificationRta = data;
    const response: ServicesResponse<VerificationRta> = {
      error: false,
      data: verifiedInfo,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};
