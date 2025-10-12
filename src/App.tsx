import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./header";
import Home from "./Home";
import Login from "./pages/login & join/login";
import Join from "./pages/login & join/join";
import Single from "./pages/singlePage/single";
import Like from "./pages/mypage/like";
import Bought from "./pages/mypage/bought";
import Selling_book from "./pages/mypage/selling_book";
import My_info from "./pages/mypage/my_info";
import Change_pw from "./pages/mypage/change_pw";
import Upload from "./pages/upload/upload";
import EditMyInfo from "./pages/mypage/editMyInfo";
import Chatlist from "./pages/chat/chatlist";
import Chat from "./pages/chat/chat";
import Find_password from "./pages/login & join/find_password";
import Withdrawal from "./pages/mypage/withdrawal";
import "./App.css";

// 🔹 실제 콘텐츠를 렌더링하는 내부 컴포넌트
function AppContent() {
  const location = useLocation();

  // 특정 경로에서는 Header 숨김
  const hideHeaderPaths = ["/login", "/join", "/find_password"];
  const shouldHideHeader = hideHeaderPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="app-container">
      {/* ✅ 헤더 (조건부 렌더링) */}
      {!shouldHideHeader && <Header />}

      {/* ✅ 메인 콘텐츠 영역 */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/single/:postId" element={<Single />} />
          <Route path="/mypage/like" element={<Like />} />
          <Route path="/mypage/bought" element={<Bought />} />
          <Route path="/mypage/selling_book" element={<Selling_book />} />
          <Route path="/mypage/my_info" element={<My_info />} />
          <Route path="/mypage/change_pw" element={<Change_pw />} />
          <Route path="/mypage/edit_my_info" element={<EditMyInfo />} />
          <Route path="/mypage/withdrawal" element={<Withdrawal />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/chatlist" element={<Chatlist />} />
          <Route path="/chat/:roomId" element={<Chat />} />
          <Route path="/find_password" element={<Find_password />} />
        </Routes>
      </main>
    </div>
  );
}

// 🔹 BrowserRouter로 감싸는 루트 App
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
