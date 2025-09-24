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
  withCredentials: true, // refreshToken 자동 포함
});

// 요청 인터셉터
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("➡️ [요청 인터셉터] 요청 URL:", config.url);
    console.log("➡️ [요청 인터셉터] 요청 메서드:", config.method);

    if (config.url?.includes("/login") || config.url?.includes("/join")) {
      console.log("⏩ 로그인/회원가입 요청 → 토큰 추가 안 함");
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
    console.error("❌ [응답 에러] 발생 URL:", error.config?.url);
    console.error("❌ [응답 에러] 상태 코드:", error.response?.status);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 로그인/회원가입 요청은 401이 발생해도 토큰 재발급, 리다이렉트 하지 않음
    if (
      originalRequest.url?.includes("/login") ||
      originalRequest.url?.includes("/join")
    ) {
      console.warn(
        "⚠️ [응답 인터셉터] login/join 요청에서 401 발생 → 재발급/리다이렉트 안 함"
      );
      return Promise.reject(error);
    }

    // 401 에러 → 토큰 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("⚠️ [응답 인터셉터] 401 Unauthorized → 토큰 재발급 시도");
      originalRequest._retry = true;

      try {
        console.log("🔄 [토큰 재발급] /api/auth/reissue 요청 시작");
        const res = await axios.post(
          `${API_URL}/api/auth/reissue`,
          {},
          { withCredentials: true }
        );

        console.log("✅ [토큰 재발급] 성공:", res.data);
        console.log("✅ [토큰 재발급] 응답 헤더:", res.headers);

        const newTokenHeader =
          res.headers["authorization"] || res.headers["Authorization"];
        console.log("📥 [토큰 재발급] 새 Authorization 헤더:", newTokenHeader);

        if (newTokenHeader) {
          const tokenValue = newTokenHeader.replace("Bearer ", "");
          setAccessToken(tokenValue);

          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${tokenValue}`;
            console.log("🔑 [토큰 재발급] 원래 요청에 새 토큰 반영");
          }
        } else {
          console.error("⚠️ [토큰 재발급] 응답에 Authorization 헤더 없음");
        }

        console.log("📡 [재시도] 원래 요청 다시 보냄:", originalRequest.url);
        return api(originalRequest);
      } catch (err) {
        console.error("❌ [토큰 재발급] 실패:", err);
        // 로그인/회원가입 요청이 아닐 때만 강제 로그아웃
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
