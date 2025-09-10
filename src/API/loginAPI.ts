// authApi.ts
import api, { setAccessToken } from "./index";

export const login = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });

  const token = res.headers["authorization"];
  if (token) {
    setAccessToken(token.replace("Bearer ", ""));
  }

  return res.data;
};
