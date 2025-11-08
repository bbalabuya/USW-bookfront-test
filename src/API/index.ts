import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

// 🔑 메모리에 저장할 accessToken
let accessToken: string | null = null;

// getter
export const getAccessToken = () => accessToken;

// setter
export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem("accessToken", token);
  console.log("✅ [setAccessToken] 토큰 저장 완료 (Local & Memory)"); // 로그 명확화
};

// 🚀 앱 시작 시 localStorage에서 불러오기
const initialToken = localStorage.getItem("accessToken");
if (initialToken) {
  accessToken = initialToken;
  console.log("🚀 초기 accessToken 불러오기 성공");
}

// 🌐 Axios 인스턴스 생성 (쿠키 포함)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ 항상 쿠키 전송
});

// ✅ 퍼블릭 화면/엔드포인트 목록
const PUBLIC_SCREENS = ["/", "/join", "/email-verify"];
const PUBLIC_APIS = [
  "/api/mail/send-verification",
  "/api/mail/verify",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/reissue",
];

// 📡 요청 인터셉터
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || "";

    // ✅ PUBLIC_APIS 중 하나로 시작하면 토큰 미첨부
    const isPublic = PUBLIC_APIS.some((p) => url.startsWith(p));

    if (isPublic) {
      console.log(`⏩ [요청 인터셉터] 퍼블릭 API 요청 (${url}) → 토큰 미첨부`);
      return config;
    }

    // ✅ 그 외 API → Authorization 헤더 추가
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log(`🔑 [요청 인터셉터] 토큰 첨부 완료 (${url})`);
    } else {
      console.warn(`⚠️ [요청 인터셉터] 토큰 없음 → 로그인 필요 (${url})`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ [요청 인터셉터] 에러 발생:", error.message);
    return Promise.reject(error);
  }
);


// 📡 응답 인터셉터
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
    const isPublicApi = PUBLIC_APIS.some((p) => url === p);

    // 퍼블릭 API/화면에서 발생한 401 → 무시
    if (status === 401 && isPublicApi) {
      console.warn("⚠️ [401] 퍼블릭 API에서 인증 오류 (무시)");
      return Promise.reject(error);
    }

    // 🔄 401 → 토큰 재발급 시도
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔄 [401] 토큰 재발급 요청 중...");

      try {
        const res = await axios.post(
          `${API_URL}/api/auth/reissue`,
          {},
          { withCredentials: true }
        );

        console.log("✅ [401] 토큰 재발급 성공");

        const newTokenHeader =
          res.headers["authorization"] || res.headers["Authorization"];

        if (newTokenHeader) {
          const tokenValue = newTokenHeader.replace("Bearer ", "");
          setAccessToken(tokenValue);
          console.log("🎉 [401] 새 accessToken 저장 완료");

          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${tokenValue}`;
          }

          return api(originalRequest);
        } else {
          console.error("❌ [401] 토큰 재발급 실패: Authorization 헤더 없음");
        }
      } catch (e) {
        console.error("💥 [401] 토큰 재발급 요청 실패:", e);
        if (!isPublicScreen) {
          console.warn("🚨 로그인 만료 → 로그인 화면으로 이동");
          window.location.href = "/login";
        }
      }
    }

    // 재발급 실패 시
    if (status === 401) {
      console.error("❌ [401] 인증 실패 → 요청 중단:", url);
    }

    return Promise.reject(error);
  }
);

export default api;
