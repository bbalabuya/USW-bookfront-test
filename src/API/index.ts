import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

// 메모리에 저장할 accessToken
let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // refreshToken 자동 포함
});

// 요청 인터셉터: accessToken 붙여서 보내기
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url?.includes("/login") || config.url?.includes("/join")) {
      return config; // 로그인/회원가입은 토큰 없이
    }

    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터: accessToken 만료 시 refreshToken으로 재발급
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 새 accessToken 발급
        const res = await axios.post(
          `${API_URL}/api/auth/reissue`,
          {},
          {
            withCredentials: true,
          }
        );

        const newToken = res.headers["authorization"];
        if (newToken) {
          const tokenValue = newToken.replace("Bearer ", "");
          setAccessToken(tokenValue); // 전역 변수 업데이트
          localStorage.setItem("accessToken", tokenValue); // 선택: localStorage에도 저장
        }

        // 실패했던 요청 다시 보내기
        if (originalRequest.headers && accessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (err) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
