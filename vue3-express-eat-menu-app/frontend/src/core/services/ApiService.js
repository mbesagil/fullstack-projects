import axios from "axios"; // Axios'i içe aktarın
import JwtService from "./JwtService";

class ApiService {
  static axiosInstance = axios.create({
    // baseURL: `${process.env.API_URL}`,
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
      // Authorization: `Bearer ${JwtService.getToken()}`,
      // Accept: "application/json",
    },
  });

  /**
   * HTTP isteklerine başlık ekler.
   */
  static setHeader() {
    // console.log("set header calisti");

    ApiService.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;

    ApiService.axiosInstance.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * GET HTTP isteği gönderir.
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns {Promise<AxiosResponse>}
   */
  static query(resource, params) {
    return ApiService.axiosInstance.get(resource, { params });
  }

  /**
   * GET HTTP isteği gönderir.
   * @param resource: string
   * @returns {Promise<AxiosResponse>}
   */
  static get(resource) {
    return ApiService.axiosInstance.get(resource);
  }

  /**
   * POST HTTP isteği gönderir.
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns {Promise<AxiosResponse>}
   */
  static post(resource, params) {
    return ApiService.axiosInstance.post(resource, params);
  }

  /**
   * UPDATE (PUT) HTTP isteği gönderir.
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns {Promise<AxiosResponse>}
   */
  static update(resource, slug, params) {
    return ApiService.axiosInstance.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  static put(resource, params) {
    return ApiService.axiosInstance.put(resource, params);
  }

  /**
   * DELETE HTTP isteği gönderir.
   * @param resource: string
   * @returns {Promise<AxiosResponse>}
   */
  static delete(resource) {
    return ApiService.axiosInstance.delete(resource);
  }
}

export default ApiService;
