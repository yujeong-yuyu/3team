
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; //유정추가
import RoutesArea from "./RoutesArea"; // 유정추가 라우팅 모듈 (예시)



import MyPage from './pages/MyPage';
import Event from './pages/Event';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';



function App() {
  return (
    <AuthProvider>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Navigate to="/Event" replace />} />
        <Route path="/Event" element={<Event />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="*" element={<Navigate to="/Event" replace />} />
      </Routes>
      <Footer></Footer>
    </AuthProvider>
  );
}

export default App;
