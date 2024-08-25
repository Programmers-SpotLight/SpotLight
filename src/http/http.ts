import axios, { AxiosRequestConfig } from "axios";
const DEFAULT_TIMEOUT = 30000;

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "content-type": "application/json"
    },
    withCredentials: true,
    ...config
  });
  return axiosInstance;
};
export const httpClient = createClient();

type TRequestMethod = "get" | "post" | "put" | "delete";
export const requestHandler = async <T>(
  method: TRequestMethod,
  url: string,
  payload?: T,
  options?: AxiosRequestConfig
) => {
  let response;

  switch (method) {
    case "post":
      response = await httpClient.post(url, payload, options);
      break;
    case "get":
      response = await httpClient.get(url, options);
      break;
    case "put":
      response = await httpClient.put(url, payload, options);
      break;
    case "delete":
      response = await httpClient.delete(url, options);
      break;
  }
  return response.data;
};

export const fetchHandler = async (endpoint: string, refetch : number | false) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/`+endpoint, {next: {revalidate: refetch}});

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Fetch error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.json();
};