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
  console.log("📦 [setAccessToken] 저장된 토큰:", token);
};

// 🚀 앱 시작 시 localStorage에서 불러오기
const initialToken = localStorage.getItem("accessToken");
if (initialToken) {
  accessToken = initialToken;
  console.log("🚀 초기 accessToken 불러옴:", initialToken);
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
    console.log("➡️ [요청 인터셉터] 요청 URL:", url);

    // 퍼블릭 API는 토큰 미부착
    if (PUBLIC_APIS.some((p) => url === p)) {
      console.log("⏩ [퍼블릭 API] 토큰 추가 안 함:", url);
      return config;
    }

    // 그 외 API → Authorization 헤더 추가
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("🔑 [요청 인터셉터] Authorization 헤더 추가:", token);
    } else {
      console.warn("⚠️ [요청 인터셉터] accessToken 없음, 헤더 추가 실패");
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ [요청 인터셉터] 에러:", error);
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
      console.warn("⚠️ [401] 퍼블릭 API → 리다이렉트하지 않음");
      return Promise.reject(error);
    }

    // 🔄 401 → 토큰 재발급 시도 (한 번만)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.group("🔄 [401 처리 로직 시작]");
      console.log("📌 originalRequest URL:", originalRequest.url);
      console.log("📌 현재 accessToken:", getAccessToken());
      console.log("➡️ [재발급 요청 전] refreshToken 기반 요청 시도");

      try {
        // 🔑 RefreshToken은 서버 쿠키에 저장 → withCredentials 필요
        const res = await axios.post(
          `${API_URL}/api/auth/reissue`,
          {},
          { withCredentials: true }
        );

        console.log("✅ [reissue 응답 수신]", res);

        // 서버가 내려준 새 accessToken 추출
        const newTokenHeader =
          res.headers["authorization"] || res.headers["Authorization"];

        if (newTokenHeader) {
          const tokenValue = newTokenHeader.replace("Bearer ", "");
          setAccessToken(tokenValue);
          console.log("🎉 [토큰 재발급 성공] 새로운 accessToken:", tokenValue);

          // 실패했던 원래 요청에 새 토큰 추가 후 재시도
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${tokenValue}`;
            console.log("🔁 [재시도 요청] Authorization 헤더 교체 완료");
          }

          console.groupEnd();
          return api(originalRequest);
        } else {
          console.error("❌ [토큰 재발급 실패] Authorization 헤더 없음");
        }
      } catch (e) {
        console.error("💥 [토큰 재발급 실패] refreshToken 요청 에러:", e);
        if (!isPublicScreen) {
          console.warn("🚨 [리다이렉트] 로그인 화면으로 이동");
          window.location.href = "/login";
        }
      }

      console.groupEnd();
    }

    // 401인데 재발급 실패 → 명확히 로그 출력
    if (status === 401) {
      console.error(
        "❌ [401 처리 실패] accessToken 재발급 불가, 요청 실패:",
        url
      );
    }

    return Promise.reject(error);
  }
);

export default api;
