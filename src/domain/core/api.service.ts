import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class ApiService {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
    console.log(
      "Initializing ApiService with RPC_URL",
      import.meta.env.VITE_JARJAR_RPC_URL,
    );
    this.instance.defaults.baseURL = import.meta.env.VITE_JARJAR_RPC_URL;
    this.instance.defaults.timeout = 1500;
  }

  get<T = unknown, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.get(url, config);
  }

  post<T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.post(url, data, config);
  }

  put<T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.put(url, data, config);
  }

  patch<T = unknown, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.patch(url, data, config);
  }

  delete<T = unknown, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.delete(url, config);
  }
}
