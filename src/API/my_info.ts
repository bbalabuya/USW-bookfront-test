import api from "../API/index";

export const getMyInfo = async () => {
  try {
    const response = await api.get("/api/user/infomation", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    console.log("유저 정보 불러오기 성공");
    return response.data.data;
  } catch (err) {
    console.error("유저 정보 불러오기 실패", err);
  }
};