import api from "./index";
// 전공 리스트 가져오기
export const getMajorList = async () => {
  const res = await api.get("/api/major/list");
  // data 배열에서 name과 id를 그대로 반환
  return res.data.data.map((m: { id: string; name: string }) => ({
    id: m.id,
    name: m.name
  }));
};