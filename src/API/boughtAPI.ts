import api from "../API/index";

export const getBoughtBooks = async () => {
    try{
        const response = await api.get("/api/me/posts/buy");
        console.log("구매한 책 목록 불러오기 성공");
        return response.data.data;
    }catch(err){
        console.error("구매한 책 목록 불러오기 실패", err);
    };
};