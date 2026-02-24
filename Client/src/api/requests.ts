import axios, { AxiosError, AxiosResponse } from "axios";
import { IProducts } from "../model/IProducts";
import { ICart } from "../model/ICart";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = "http://localhost:5094/api/";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelErrors: string[] = [];
          for (const key in data.errors) {
            modelErrors.push(data.errors[key]);
          }
          throw modelErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 404:
        router.navigate("/not-found", { state: { error: data } });
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        toast.error("Something went wrong");
        break;
    }
    return Promise.reject(error.response);
  },
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) =>
    axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Catalog = {
  list: () => requests.get<IProducts[]>("products"),
  details: (id: number) => requests.get<IProducts>(`products/${id}`),
};

const Errors = {
  get400Error: () => requests.get("error/bad-request"),
  get401Error: () => requests.get("error/unauthorized"),
  get404Error: () => requests.get("error/not-found"),
  get500Error: () => requests.get("error/server-error"),
  getValidationError: () => requests.get("error/validation-error"),
};

const Cart = {
  get: () => requests.get<ICart>("cart"),
  addItem: (productId: number, quantity: number) =>
    requests.post<ICart>(`cart/${productId}?quantity=${quantity}`, {}),
  deleteItem: (productId: number, quantity: number) =>
    requests.delete(`cart/${productId}?quantity=${quantity}`),
};

const agent = {
  Catalog,
  Errors,
  Cart,
};

export default agent;
