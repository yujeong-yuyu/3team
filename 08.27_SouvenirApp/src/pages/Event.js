
import { useState } from "react";
import { useNavigate } from "react-router-dom";




import "../styles/Event.css"



const WIN_RATE = 0.5;
const IMG_CLOSED = "/img/a_event_green.png";
const IMG_WIN = "/img/win.png";
const IMG_LOSE = "/img/lose.png";
const LS_KEY = "souvenirEventResult";


const Event = () => {
  const navigate = useNavigate();
  const goMyPage = () => navigate("/mypage");


  // 6개의 편지 상태
  const [cards, setCards] = useState(
    Array.from({ length: 6 }, () => ({ opened: false, isWin: null }))
  );

  const [openedIndex, setOpenedIndex] = useState(null);

  const handleClick = (idx) => {
    // 이미 하나 열렸고, 그게 아닌 다른 카드를 누르면 무시
    if (openedIndex !== null && idx !== openedIndex) return;

    // 이미 연 카드면 무시
    if (cards[idx].opened) return;

    // ✅ 당첨 여부는 여기서 한 번만 계산
    const isWin = Math.random() < WIN_RATE;

    // 상태 갱신
    setCards((prev) => {
      const next = prev.slice();
      next[idx] = { opened: true, isWin };
      return next;
    });

    if (openedIndex === null) setOpenedIndex(idx);

    // ✅ 결과 저장(마이페이지에서 읽음)
    const payload = {
      won: isWin,
      prizeName: isWin ? "present_for_you" : null,
      openedAt: new Date().toISOString(),
      source: "event_letters_v1",
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch { }
  };

  return (
    <>


      <div className="a_event_wrap">
        <div className="a_event_container">
          <div className="a_event_banner">
            <div className="a_event_textbox">
              <p className="a_event_text1">“작은 행운이 담긴 편지를 열어보세요 ”</p>
              <p>당신의 하루에 작은 기쁨을 전합니다.</p>
            </div>
            <img src="/img/a_event_wh_logo.png" alt="wh_logo" className="a_event_wh_logo" />
          </div>
          <div className="a_event_mainbox"
            style={{
              backgroundImage: 'url(/img/a_event_background_1.jpg)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}>
            <div className="a_event_title">
              <p>“present &nbsp;&nbsp; for &nbsp;&nbsp; you”</p>
            </div>
            <div className="letters">
              {cards.map((c, i) => {
                const src = !c.opened ? IMG_CLOSED : c.isWin ? IMG_WIN : IMG_LOSE;
                const cls =
                  "letter" + (c.opened ? " opened" : "") + (c.isWin ? " win" : c.opened ? " lose" : "");

                return (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    className={cls}
                    onClick={() => handleClick(i)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick(i)}
                    title={c.opened && c.isWin ? "클릭하면 마이페이지로 이동" : ""}
                  >
                    <img src={src} alt={!c.opened ? "편지" : c.isWin ? "당첨" : "꽝"} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="a_event_buttons">
            <button className="a_event_button1">다시 쇼핑하러 가기</button>
            <button className="a_event_button2" onClick={goMyPage}>마이페이지 가기</button>
          </div>
        </div>
      </div>


    </>
  )
}

export default Event;