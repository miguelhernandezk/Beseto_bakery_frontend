import axios from 'axios';
import { ServicesResponse } from '../interfaces/Responses';
import { handleApiErrors } from '../utils/handleApiErrors';

export const revalidatePage = async (
  path: string
): Promise<ServicesResponse> => {
  try {
    const { data } = await axios.get(path);

    const message: string = data;
    const response: ServicesResponse<string> = {
      error: false,
      data: message,
      helperText: null,
    };
    return response;
  } catch (e) {
    return handleApiErrors(e);
  }
};
