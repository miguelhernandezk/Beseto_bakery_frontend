import { AxiosError, AxiosRequestConfig, AxiosResponseHeaders } from 'axios';
import {
  BackendError,
  CustomAxiosErrorData,
  ServicesResponse,
} from '../interfaces/Responses';

/**
 * Builds a custom response for errors while making API calls
 * @param error
 * @returns
 */
export const handleApiErrors = (
  error: AxiosError
): ServicesResponse<CustomAxiosErrorData<BackendError>> => {
  let handledError: ServicesResponse<CustomAxiosErrorData<BackendError>>;
  if (error.response) {
    handledError = {
      error: true,
      helperText:
        'The request was made and the server responded with a status code that falls out of the range of 2xx',
      data: {
        axiosError: true,
        data: error.response.data as BackendError,
        status: error.response.status,
        headers: error.response.headers as AxiosResponseHeaders,
        config: error.config as AxiosRequestConfig<any>,
      },
    };
  } else if (error.request) {
    handledError = {
      error: true,
      helperText: 'The request was made but no response was received',
      data: {
        axiosError: true,
        request: error.request,
        config: error.config as AxiosRequestConfig<any>,
      },
    };
  } else {
    handledError = {
      error: true,
      helperText:
        'Something happened in setting up the request that triggered an Error',
      data: {
        axiosError: true,
        errorMessage: error.message,
        config: error.config as AxiosRequestConfig<any>,
      },
    };
  }
  return handledError;
};

export const getErrorText = (
  error: ServicesResponse<CustomAxiosErrorData<BackendError>>
): string => {
  if (
    error.helperText ===
    'The request was made and the server responded with a status code that falls out of the range of 2xx'
  ) {
    if (error.data.data !== undefined && error.data.data.detail !== undefined) {
      return error.data.data.detail;
    } else
      return 'ERROR - Please contact and admin and provide the following error code: EC001';
  } else if (
    error.helperText === 'The request was made but no response was received'
  ) {
    return 'It seems the server is unreachable. Please contact an admin.';
  } else if (
    error.helperText ===
    'Something happened in setting up the request that triggered an Error'
  ) {
    return 'The request was not configured correctly. Try again, if problem persist,  please contact an admin';
  } else return 'There was an unknown error';
};

export const getStatusCode = (
  error: ServicesResponse<CustomAxiosErrorData<BackendError>>
): number => {
  if (
    error.helperText ===
    'The request was made and the server responded with a status code that falls out of the range of 2xx'
  ) {
    if (
      error.data.data !== undefined &&
      error.data.data.error_code !== undefined
    ) {
      return error.data.data.error_code;
    } else {
      return -1;
    }
  } else if (
    error.helperText === 'The request was made but no response was received'
  ) {
    return 0;
  } else return -1;
};
