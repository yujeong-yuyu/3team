// src/RoutesArea.jsx
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login";
import MyPage from "./pages/MyPage";
// 필요한 페이지들을 위에 추가로 import 하세요.
// 예: import Home from "./pages/Home";

export default function RoutesArea() {
    return (
        <Routes>
            {/* 실제 보유한 페이지/경로에 맞게 수정 */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Mypage" element={<MyPage />} />
        </Routes>
    );
}
