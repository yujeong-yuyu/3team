import "../styles/header.css"
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; //유정추가


import MyPage from "../pages/MyPage"
import Login from "../pages/Login";


const Header = () => {
    /////유정추가
    /////유정추가
    /////유정추가
    const navigate = useNavigate();
    const { isLoggedIn, logoutAll } = useAuth();
    const handleLogout = async () => {
        await logoutAll();
        navigate("/", { replace: true }); // 원하면 /Login 등으로 변경
    };
    const isAuthed = !!isLoggedIn?.local; // 또는 Object.values(isLoggedIn).some(Boolean)
    /////유정추가
    /////유정추가
    /////유정추가
    /////유정추가
    /////유정추가

    return (
        <>
            <div className="warp1">
                <header>
                    <div id="mainheader">
                        <img src="/img/logo.png" alt="logo" id="logo" />
                    </div>
                </header>
                {/* 메뉴  */}
                <nav id="mainnav">

                    <ul id="menu1">
                        <li><a href="#none">LIFESTYLE</a></li>
                        <li><a href="#none">FRAGRANCE</a></li>
                        <li><a href="#none">LIGHTING</a></li>
                        <li><a href="#none">OBJECTS</a></li>
                        <li><a href="#none">COMMUNITY</a></li>
                    </ul>

                    <ul id="menu2">

                        <li>
                            <NavLink to="/Mypage" className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="fa-solid fa-magnifying-glass"></i></NavLink></li>
                        <li>
                            <NavLink to="/Mypage" className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="fa-regular fa-user"></i>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Mypage" className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="fa-regular fa-heart"></i></NavLink>
                        </li>
                        <li>
                            <NavLink to="/Mypage" className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="fa-solid fa-cart-shopping"></i>
                            </NavLink>
                        </li>

                        {/* 
                            유정추가 로그인 
                            유정추가 로그인 
                            유정추가 로그인 
                            유정추가 로그인 
                        */}
                        {isAuthed ? (
                            // 로그인 상태 → 로그아웃 아이콘
                            <li>
                                <button
                                    type="button"
                                    className="login_btn"
                                    onClick={handleLogout}
                                    aria-label="로그아웃"
                                    title="로그아웃"
                                >
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </button>
                            </li>
                        ) : (
                            // 비로그인 상태 → 로그인 아이콘/링크
                            <li>
                                <NavLink to="/Login" className={({ isActive }) => isActive ? "active" : undefined}>
                                    <i class="fa-solid fa-arrow-right-to-bracket"></i>
                                </NavLink>
                            </li>
                        )}

                    </ul>

                </nav>
            </div >
        </>
    )
}

export default Header;