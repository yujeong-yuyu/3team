// src/pages/MyPage.js
import { useEffect, useMemo, useState } from "react";
import GiftModal from "../components/GiftModal";
import { useAuth } from "../context/AuthContext";



import "../styles/mypage.css";

const LS_KEY = "souvenirEventResult";

const fmt = (d) => {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const MyPage = () => {
  const [eventData, setEventData] = useState(null);
  const [open, setOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  // 로컬스토리지에서 이벤트 결과 읽기
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      setEventData(raw ? JSON.parse(raw) : null);
    } catch {
      setEventData(null);
    }
  }, []);

  // 모달 표시용 데이터
  const modalData = useMemo(() => {
    if (!eventData?.won) return null;
    const received = eventData.openedAt || new Date().toISOString();
    const start = fmt(received);
    const end = fmt(addDays(received, 32));
    return {
      heroImage: "/img/gift_poster.jpg", // 없으면 /img/win.png로 대체 가능
      giftType: eventData.prizeName === "present_for_you" ? "인테리어포스터" : "선물",
      receivedAtText: start,
      periodText: `${start} ~ ${end}`,
      shipping: "배송중",
    };
  }, [eventData]);

  const giftCount = eventData?.won ? 1 : 0;
  const couponCount = eventData?.won ? 1 : 0;



  return (
    <>

      <div id="mypage-wrap">

        <div id="mypage-progress">
          <ul>
            <li className="progress1">
              <div className="circle"><p>01</p></div>
              <p className="progress-nav">SIGNUP</p>
            </li>
            <li><p className="ntt"><i className="fa-solid fa-angle-right" /></p></li>
            <li className="progress2">
              <div className="circle"><p>02</p></div>
              <p className="progress-nav">LOGIN</p>
            </li>
            <li><p className="ntt"><i className="fa-solid fa-angle-right" /></p></li>
            <li className="progress3">
              <div className="circle2"><p>03</p></div>
              <p className="progress-nav2">MYPAGE</p>
            </li>
          </ul>
        </div>

        <main className="a_mypage">
          {/* 왼쪽 메뉴 */}
          <div className="a_mymenu">
            <nav className="a_mynav">
              <a href="#none" className="a_nav-title">나의 쇼핑정보</a>
              <a href="#none">주문배송조회</a>
              <a href="#none">취소/교환/반품 내역</a>
              <a href="#none">상품 리뷰</a>
            </nav>
            <nav className="a_mynav">
              <a href="#none" className="a_nav-title">나의 계정정보</a>
              <a href="#none">회원정보수정</a>
              <a href="#none">나의 멤버십 혜택</a>
              <a href="#none">쿠폰</a>
              <a href="#none">적립금</a>
            </nav>
            <nav className="a_mynav">
              <a href="#none" className="a_nav-title">고객센터</a>
              <a href="#none">1:1 문의</a>
              <a href="#none">FAQ</a>
              <a href="#none">고객의 소리</a>
            </nav>
          </div>

          {/* 오른쪽 콘텐츠 */}
          <section className="a_my-content">
            {/* 프로필 */}
            <div className="a_profile">
              <div className="a_profile-img">
                <i class="fa-solid fa-user"></i>
              </div>

              <div className="a_nickname"> {isLoggedIn?.local ? (user?.name || "회원") : "로그인이 필요합니다"} </div>
              <div className="profile-icons">
                <i className="fa-solid fa-bell"></i>
                <i className="fa-solid fa-gear"></i>
              </div>
            </div>

            {/* 요약 박스 */}
            <div className="a_myboxs">
              <div className="mybox">
                <div className="mybox-title">
                  <img src="/img/coin_icon.svg" alt="" />
                  <span>적립금</span>
                </div>
                <div className="mybox-num">1000p</div>
              </div>

              {/* 선물함 (당첨 시 클릭 가능 → 모달 오픈) */}
              <div
                className={`mybox ${giftCount ? "is-clickable" : "is-disabled"}`}
                role="button"
                tabIndex={0}
                onClick={() => giftCount && setOpen(true)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && giftCount && setOpen(true)}
                title={giftCount ? "선물 상세 보기" : "받은 선물이 없습니다"}
              >
                <div className="mybox-title">
                  <img src="/img/gift_icon.svg" alt="" />
                  <span>선물함</span>
                </div>
                <div className="mybox-num">{giftCount}</div>
              </div>

              <div className="mybox">
                <div className="mybox-title">
                  <img src="/img/ticket_icon.svg" alt="" />
                  <span>쿠폰</span>
                </div>
                <div className="mybox-num">{couponCount}</div>
              </div>
            </div>

            {/* 최근주문 */}
            <div className="a_orders">
              <p className="a_order-title">최근주문</p>
              <div className="a_order-con">
                <div className="a_order-sub-title">
                  <div>주문일</div>
                  <div>주문내역</div>
                  <div>결제금액</div>
                  <div>배송상태</div>
                </div>

                <div className="a_order-box">
                  <div className="a_date">2025.08.18</div>
                  <div className="a_item">
                    <div className="item-img"></div>
                    <div className="i-title">감성 우아 목각 말 촛농 유약 우드 오브제</div>
                  </div>
                  <div className="a_price">95,000원</div>
                  <div className="a_state">배송완료</div>
                </div>

                <div className="a_order-box">
                  <div className="a_date">2025.08.18</div>
                  <div className="a_item">
                    <div className="item-img"></div>
                    <div className="i-title">감성 우아 목각 말 촛농 유약 우드 오브제</div>
                  </div>
                  <div className="a_price">95,000원</div>
                  <div className="a_state">배송완료</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* 모달 */}
        <GiftModal open={open} onClose={() => setOpen(false)} data={modalData || {}} />
      </div>

      <div className="floating-ask"><img src="/img/ask.png" width="150" alt="help" /></div>
    </>
  );
};

export default MyPage;
