import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

// 메모리에 저장할 accessToken
let accessToken: string | null = null;

// getter 함수 (동기 시점 문제 방지용)
export const getAccessToken = () => accessToken;

// setter 함수
export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem("accessToken", token); // 새로고침 대비
};

// 앱 시작 시 localStorage에서 불러오기
const initialToken = localStorage.getItem("accessToken");
if (initialToken) {
  accessToken = initialToken;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // refreshToken 자동 포함
});

// 요청 인터셉터: accessToken 붙여서 보내기
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 로그인/회원가입 요청은 토큰 불필요
    if (config.url?.includes("/login") || config.url?.includes("/join")) {
      return config;
    }

    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터: accessToken 만료 → refreshToken으로 재발급
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 발생 시 토큰 재발급
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${API_URL}/api/auth/reissue`,
          {},
          { withCredentials: true }
        );
        console.log("✅ 토큰 재발급 성공:", res.data);

        // Authorization 헤더에서 토큰 꺼내기 (대소문자 안전 처리)
        console.log("다시 연결 시도");
        const newTokenHeader =
          res.headers["authorization"] || res.headers["Authorization"];
        if (newTokenHeader) {
          const tokenValue = newTokenHeader.replace("Bearer ", "");
          setAccessToken(tokenValue);

          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${tokenValue}`;
          }
        }

        return api(originalRequest);
      } catch (err) {
        console.error("토큰 재발급 실패:", err);
        window.location.href = "/login"; // 강제 로그아웃
      }
    }

    return Promise.reject(error);
  }
);

export default api;
