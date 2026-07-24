import axios from 'axios';

interface DataResponse {
  data: any;
  status: number;
}

interface DataRequest {
  [key: string]: any;
}

export interface RequestParams {
  [key: string]: string | number;
}

interface RequestHeaders {
  [key: string]: string;
}

export async function makeRequest(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: DataRequest,
  params?: RequestParams,
  headers?: RequestHeaders,
): Promise<DataResponse> {
  try {
    return await axios.request({
      method,
      url,
      data,
      params,
      headers,
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sendMultipleRequests(requests: any[]) {
  const promises = requests.map((request) => {
    const { method, url, data, params, headers } = request;
    return makeRequest(method, url, data, params, headers);
  });

  try {
    return await axios.all(promises);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
