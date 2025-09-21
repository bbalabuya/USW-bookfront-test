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

// 요청 인터셉터: accessToken 붙여서 보내기
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("➡️ 요청 보냄:", config.url);

    // 로그인/회원가입 요청은 토큰 불필요
    if (config.url?.includes("/login") || config.url?.includes("/join")) {
      console.log("⏩ 토큰 없이 진행 (로그인/회원가입 요청)");
      return config;
    }

    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("🔑 요청 헤더에 accessToken 추가됨:", token);
    } else {
      console.log("⚠️ accessToken 없음, 헤더에 추가되지 않음");
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ 요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: accessToken 만료 → refreshToken으로 재발급
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ 응답 성공:", response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    console.error("❌ 응답 에러 발생:", error);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 발생 시 토큰 재발급
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("⚠️ 401 Unauthorized 발생, 토큰 재발급 시도");
      originalRequest._retry = true;

      try {
        console.log("🔄 accessToken 만료, 재발급 요청 시작");
        const res = await axios.post(
          `${API_URL}/api/auth/reissue`,
          {},
          { withCredentials: true }
        );
        console.log("✅ 토큰 재발급 성공, 응답 데이터:", res.data);
        console.log("✅ 토큰 재발급 응답 헤더:", res.headers);

        // Authorization 헤더에서 토큰 꺼내기
        const newTokenHeader =
          res.headers["authorization"] || res.headers["Authorization"];
        console.log("📥 새 Authorization 헤더 값:", newTokenHeader);

        if (newTokenHeader) {
          const tokenValue = newTokenHeader.replace("Bearer ", "");
          setAccessToken(tokenValue);

          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${tokenValue}`;
            console.log("🔑 원래 요청 헤더에 새 토큰 반영 완료");
          }
        } else {
          console.error("⚠️ 새 토큰 헤더가 응답에 없음");
        }

        console.log("📡 원래 요청 다시 시도:", originalRequest.url);
        return api(originalRequest);
      } catch (err) {
        console.error("❌ 토큰 재발급 실패:", err);
        window.location.href = "/login"; // 강제 로그아웃
      }
    }

    return Promise.reject(error);
  }
);

export default api;
