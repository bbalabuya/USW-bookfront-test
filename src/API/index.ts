// src/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

// 메모리에 저장할 accessToken
let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // refreshToken을 자동으로 포함시킴
});

// 요청 인터셉터: accessToken 붙여서 보내기
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    if(config.url?.includes('/login') || config.url?.includes('/join')) {
      return config; // 로그인, 회원가입 요청에는 토큰 추가 없이 그냥 전송
    }

    // 로그인,회원가입이 아니면 토큰 추가
    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    //오류 응답을 받은 config의 정보를 다시 originalRequest에 저장

    // accessToken 만료 → refreshToken으로 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${API_URL}/api/auth/reissue`, {}, { 
          withCredentials: true 
        });

        // 새 accessToken 저장
        const newToken = res.headers["authorization"];
        if (newToken) {
          setAccessToken(newToken.replace("Bearer ", ""));
        }

        // 실패했던 요청 다시 보내기
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (err) {
        // refreshToken도 만료라면 로그인 페이지로 강제 이동
        alert("로그인이 필요합니다");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
