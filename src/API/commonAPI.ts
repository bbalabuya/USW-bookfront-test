import React from "react";
import api from "./index";

export const likeRequest = async (postId) => {
  try {
    const res = await api.post(`/api/posts/${postId}/like`);
    console.log("✅ 좋아요 저장하기 성공");
    return res.data;
  } catch (err) {
    console.error("❌ 좋아요 저장 실패:", err);
    throw err;
  }
};

export const unlikeRequest = async (postId) => {
  try {
    const res = await api.delete(`/api/posts/${postId}/like`);
    console.log("✅ 좋아요 취소 요청 성공");
    return res.data;
  } catch (err) {
    console.error("❌ 좋아요 취소 요청 실패:", err);
    throw err;
  }
};
