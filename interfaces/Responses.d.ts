import { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';

type HandledApiError =
  | 'The request was made and the server responded with a status code that falls out of the range of 2xx'
  | 'The request was made but no response was received'
  | 'Something happened in setting up the request that triggered an Error';

type CustomErrors = 'We could not log you in';

export interface ServicesResponse<T = any> {
  error: boolean;
  data: T;
  helperText: HandledApiError | CustomErrors | null;
}

export interface BackendError {
  detail: string;
  error: boolean;
  error_code: number;
}

export interface CustomAxiosErrorData<T = boolean> {
  axiosError: boolean;
  config: AxiosRequestConfig<any>;
  data?: T;
  status?: number;
  headers?: AxiosResponseHeaders;
  request?: any;
  errorMessage?: string;
}

export interface VerificationRta {
  alreadyVerified: boolean;
  verified: true;
}
