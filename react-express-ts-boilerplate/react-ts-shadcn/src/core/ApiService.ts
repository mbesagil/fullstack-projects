import axios, { AxiosInstance, AxiosResponse } from "axios";

class ApiService {
  static axiosInstance: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_URL || null}/api`,
    // headers: {
    //   Authorization: `Bearer ${JwtService.getToken()}`,
    //   Accept: 'application/json',
    // },
  });

  /**
   * HTTP isteklerine başlık ekler.
   */
  static setHeader(): void {
    ApiService.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${
      localStorage.getItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY) ||
      null
    }`;
    ApiService.axiosInstance.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * GET HTTP isteği gönderir.
   * @param resource: string
   * @param params: Object
   * @returns {Promise<AxiosResponse>}
   */
  static query<T = any>(
    resource: string,
    params?: Record<string, any>
  ): Promise<AxiosResponse<T>> {
    return ApiService.axiosInstance.get<T>(resource, { params });
  }

  /**
   * GET HTTP isteği gönderir.
   * @param resource: string
   * @returns {Promise<AxiosResponse>}
   */
  static get<T = any>(resource: string): Promise<AxiosResponse<T>> {
    return ApiService.axiosInstance.get<T>(resource);
  }

  /**
   * POST HTTP isteği gönderir.
   * @param resource: string
   * @param params: any
   * @returns {Promise<AxiosResponse>}
   */
  static post<T = any>(
    resource: string,
    params: any
  ): Promise<AxiosResponse<T>> {
    return ApiService.axiosInstance.post<T>(resource, params);
  }

  /**
   * UPDATE (PUT) HTTP isteği gönderir.
   * @param resource: string
   * @param slug: string
   * @param params: any
   * @returns {Promise<AxiosResponse>}
   */
  static update<T = any>(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse<T>> {
    return ApiService.axiosInstance.put<T>(`${resource}/${slug}`, params);
  }

  /**
   * PUT HTTP isteği gönderir.
   * @param resource: string
   * @param params: any
   * @returns {Promise<AxiosResponse>}
   */
  static put<T = any>(
    resource: string,
    params: any
  ): Promise<AxiosResponse<T>> {
    return ApiService.axiosInstance.put<T>(resource, params);
  }

  /**
   * DELETE HTTP isteği gönderir.
   * @param resource: string
   * @returns {Promise<AxiosResponse>}
   */
  static delete<T = any>(resource: string): Promise<AxiosResponse<T>> {
    return ApiService.axiosInstance.delete<T>(resource);
  }
}

export default ApiService;
