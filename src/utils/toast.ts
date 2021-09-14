import { AxiosError } from "axios";

export const toastSNSAxiosError = (error: AxiosError) => {
  console.log(error);
};
