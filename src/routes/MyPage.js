import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import { getRewards } from "../utils/rewards";
import { getSession } from "../utils/localStorage";

import { HiBell } from "react-icons/hi2";
import { FaGear } from "react-icons/fa6";

import "../css/mypage.css";
import GiftModal from "../components/GiftModal";


const KEY_BASE = "souvenirEventResult";
const keyFor = (uid) => (uid ? `${KEY_BASE}:${uid}` : KEY_BASE);


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
  const [rewards, setRewardsState] = useState({ coupons: 0, gifts: 0 });
  const [eventData, setEventData] = useState(null);
  const [open, setOpen] = useState(false);
  const { isLoggedIn, user, logoutAll } = useAuth();
  const navigate = useNavigate();
  const isAuthed = !!isLoggedIn?.local;
  const loggedIn = !!isLoggedIn?.local;

  //보상
  const s = getSession();
  const uid = s?.username || s?.userid || null;
  const r = getRewards(uid);



  useEffect(() => {
    if (!isAuthed) {
      setRewardsState({ coupons: 0, gifts: 0 }); // ✅ 로그아웃 즉시 0
      setEventData(null);
      return;
    }
    const s = getSession();
    const uid = s?.username || null;
    const r = getRewards(uid);
    setRewardsState({
      points: Number(r.points) || 0,
      coupons: Number(r.coupons) || 0,
      gifts: Number(r.gifts) || 0,
    });
  }, [isAuthed]);


  // 이벤트 결과 로드
  useEffect(() => {
    try {
      const s = getSession();
      const uid = s?.username || s?.userid || null;
      const raw = localStorage.getItem(keyFor(uid));
      setEventData(raw ? JSON.parse(raw) : null);
    } catch {
      setEventData(null);
    }
  }, []);
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") {
        try {
          const s = getSession();
          const uid = s?.username || s?.userid || null;
          const raw = localStorage.getItem(keyFor(uid));
          setEventData(raw ? JSON.parse(raw) : null);
        } catch { setEventData(null); }
        const uid = getSession()?.username || null;
        const r = getRewards(uid);
        setRewardsState({ points: Number(r.points) || 0, coupons: Number(r.coupons) || 0, gifts: Number(r.gifts) || 0 });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);



  // 모달 데이터
  const modalData = useMemo(() => {
    if (!eventData?.won) return null;
    const received = eventData.openedAt || new Date().toISOString();
    const start = fmt(received);
    const end = fmt(addDays(received, 32));
    return {
      heroImage: "/img/gift_poster.jpg",
      giftType: eventData.prizeName === "present_for_you" ? "인테리어포스터" : "선물",
      receivedAtText: start,
      periodText: `${start} ~ ${end}`,
      shipping: "배송중",
    };
  }, [eventData]);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logoutAll?.();
    } finally {
      navigate("/", { replace: true });
    }
  };

  // 🔔 당첨이면 '무한' 흔들기 & 벨 클릭 시 멈춤 + 문구 토글
  const [shake, setShake] = useState(false);       // 벨 흔들림 여부
  const [silenced, setSilenced] = useState(false); // 사용자가 벨 눌러서 멈춤 여부
  const [showNotice, setShowNotice] = useState(false);

  // 라운드(eventData) 바뀌면 초기화
  useEffect(() => {
    setSilenced(false);
    setShowNotice(false);   // ← 문구도 같이 초기화
  }, [eventData]);

  // 당첨이면 자동 무한 흔들기, 무음이면 멈춤
  useEffect(() => {
    if (eventData?.won && !silenced) setShake(true);
    else setShake(false);
  }, [eventData?.won, silenced]);

  // 벨 클릭: 즉시 멈추고 문구 토글
  const onBellClick = () => {
    if (!eventData?.won) return;   // 미당첨이면 무시
    setSilenced(true);             // 자동 흔들림 금지
    setShake(false);               // 즉시 멈춤
    setShowNotice(v => !v);        // 문구 토글
  };



  return (

    <>
      <div id="mypage-wrap">
        <div id="mypage-progress">
          <ul>
            <li className="progress1">
              <div className="circle">
                <p>01</p>
              </div>
              <p className="progress-nav">SIGNUP</p>
            </li>
            <li>
              <p className="ntt">
                <i className="fa-solid fa-angle-right" />
              </p>
            </li>
            <li className="progress2">
              <div className="circle">
                <p>02</p>
              </div>
              <p className="progress-nav">LOGIN</p>
            </li>
            <li>
              <p className="ntt">
                <i className="fa-solid fa-angle-right" />
              </p>
            </li>
            <li className="progress3">
              <div className="circle2">
                <p>03</p>
              </div>
              <p className="progress-nav2">MYPAGE</p>
            </li>
          </ul>
        </div>

        <main className="a_mypage">
          {/* 왼쪽 메뉴 */}
          <div className="a_mymenu">
            <nav className="a_mynav">
              <div className="a_nav-title">나의 쇼핑정보</div>
              <Link to="#none">주문배송조회</Link>
              <Link to="#none">취소/교환/반품 내역</Link>
              <Link to="#none">상품 리뷰</Link>
            </nav>
            <nav className="a_mynav">
              <div className="a_nav-title">나의 계정정보</div>
              <Link to="#none">회원정보수정</Link>
              <Link to="#none">나의 멤버십 혜택</Link>
              <Link to="#none">쿠폰</Link>
              <Link to="#none">적립금</Link>
            </nav>
            <nav className="a_mynav">
              <div className="a_nav-title">고객센터</div>
              <Link to="#none">1:1 문의</Link>
              <Link to="#none">FAQ</Link>
              <Link to="#none">고객의 소리</Link>
            </nav>

            {/* ✅ 로그아웃 버튼 */}
            <nav className="logout">
              <button
                type="button"
                onClick={handleLogout}
                className="a_nav-title"
                style={{
                  border: "1px solid #5e472f",
                  cursor: "pointer",
                  borderRadius: "5px",
                  padding: "2px",
                }}
              >
                <p>로그아웃하기</p>
              </button>
            </nav>
          </div>

          {/* 오른쪽 콘텐츠 */}
          <section className="a_my-content">
            {/* 프로필 */}
            <div className="a_profile">
              <div className="a_profile-img">
                {/* class -> className 수정 */}
                <i className="fa-solid fa-user" aria-hidden="true"></i>
              </div>

              <div className="a_nickname">
                {loggedIn ? (
                  // 로그인 상태: 링크 없이 이름만 표시
                  <span>{user?.name || "회원"}</span>
                ) : (
                  // 미로그인 상태: 로그인 링크 노출
                  <Link to="/login">로그인이 필요합니다</Link>
                )}
              </div>


              <div className="profile-icons">
                <div
                  className={`bell-wrap ${eventData?.won ? 'is-winnable' : 'disabled'}`}
                  onClick={onBellClick}
                  role="button"
                  tabIndex={0}
                  aria-disabled={!eventData?.won}
                  aria-live="polite"
                >
                  {/* 글자도 당첨된 경우에만 표시 */}
                  {eventData?.won && showNotice && (
                    <span className="bell-notice">선물이 도착했습니다!</span>
                  )}
                  <HiBell
                    style={{
                      fontSize: "33px",
                      cursor: eventData?.won ? "pointer" : "default"
                    }}
                    className={shake ? "bell-shake" : ""}
                    title={eventData?.won ? "선물 알림 보기" : "알림 없음"}
                  />
                </div>
                <FaGear style={{ fontSize: "29px" }} />
              </div>


            </div>

            {/* 요약 박스 */}
            <div className="a_myboxs">
              {/* 적립금 */}
              <div className="mybox">
                <div className="mybox-title">
                  <img src="https://00anuyh.github.io/SouvenirImg/coin_icon.svg" alt="coin_icon" />
                  <span>적립금</span>
                </div>
                <div className="mybox-num">{(rewards.points || 0).toLocaleString()} p</div>
              </div>

              {/* 선물함: rewards.gifts 개수로 표시 & 클릭 가능 */}
              <div
                className={`mybox ${rewards.gifts > 0 ? "is-clickable" : "is-disabled"}`}
                role="button"
                tabIndex={0}
                onClick={() => rewards.gifts > 0 && setOpen(true)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && rewards.gifts > 0 && setOpen(true)
                }
                title={rewards.gifts > 0 ? "선물 상세 보기" : "받은 선물이 없습니다"}
              >
                <div className="mybox-title">
                  <img src="https://00anuyh.github.io/SouvenirImg/gift_icon.svg" alt="gift_icon" />
                  <span>선물함</span>
                </div>
                <div className="mybox-num">{rewards.gifts || 0}</div>
              </div>

              {/* 쿠폰 */}
              <div className="mybox">
                <div className="mybox-title">
                  <img src="https://00anuyh.github.io/SouvenirImg/ticket_icon.svg" alt="ticket_icon" />
                  <span>쿠폰</span>
                </div>
                <div className="mybox-num">{rewards.coupons || 0}</div>
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

      {/* <div className="floating-ask"><img src="https://00anuyh.github.io/SouvenirImg/askicon.png" width="60" alt="help" /></div> */}
    </>
  );
};

export default MyPage;
