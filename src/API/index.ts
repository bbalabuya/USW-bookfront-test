import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

// 메모리에 저장할 accessToken
let accessToken: string | null = null;

// getter
export const getAccessToken = () => accessToken;

// setter
export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem("accessToken", token);
  console.log("📦 setAccessToken 호출됨, 저장된 토큰:", token);
};

// 앱 시작 시 localStorage에서 불러오기
const initialToken = localStorage.getItem("accessToken");
if (initialToken) {
  accessToken = initialToken;
  console.log("🚀 초기 accessToken 불러옴:", initialToken);
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ 퍼블릭 화면/엔드포인트 목록
const PUBLIC_SCREENS = ["/", "/join", "/email-verify"];
const PUBLIC_APIS = [
  "/api/mail/",
  "/api/auth/login",
  "/api/auth/reissue",
  "/api/auth/signup",
];

// 요청 인터셉터
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || "";
    console.log("➡️ [요청 인터셉터] 요청 URL:", url);

    // 로그인/회원가입 등 퍼블릭 API는 토큰 미부착
    if (PUBLIC_APIS.some((p) => url.includes(p))) {
      console.log("⏩ 퍼블릭 API 요청 → 토큰 추가 안 함");
      return config;
    }

    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("🔑 [요청 인터셉터] Authorization 헤더 추가:", token);
    } else {
      console.log("⚠️ [요청 인터셉터] accessToken 없음, 헤더 추가 실패");
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ [요청 인터셉터] 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ [응답 성공]", response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const url = originalRequest.url || "";
    const here = window.location.pathname;

    const isPublicScreen = PUBLIC_SCREENS.some((p) => here.startsWith(p));
    const isPublicApi = PUBLIC_APIS.some((p) => url.includes(p));

    // 퍼블릭 화면/API에서 401 발생해도 로그인 리다이렉트 안 함
    if (status === 401 && (isPublicScreen || isPublicApi)) {
      console.warn("⚠️ 퍼블릭 화면/퍼블릭 API 401 → 리다이렉트하지 않음");
      return Promise.reject(error);
    }

    // 401 → 토큰 재발급 시도 (한 번만)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${API_URL}/api/auth/reissue`,
          {},
          { withCredentials: true }
        );
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
      } catch (e) {
        if (!isPublicScreen) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
