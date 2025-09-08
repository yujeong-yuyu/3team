// src/components/WeatherCard.jsx
import { useEffect, useState } from "react";

export default function WeatherCard({
    lat = 37.5665,  // 서울 기본값
    lon = 126.9780,
}) {
    const [temp, setTemp] = useState(null);
    const [/* icon */, setIcon] = useState("");
    const [/* desc */, setDesc] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");


    // 🔑 .env에 REACT_APP_ 으로 키 저장 권장
    const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

    useEffect(() => {
        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

        (async () => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                setTemp(Number(data.main.temp).toFixed(1));
                const iconCode = data.weather?.[0]?.icon || "01d";
                setIcon(`https://openweathermap.org/img/wn/${iconCode}.png`);
                setDesc(data.weather?.[0]?.description ?? "");
            } catch (e) {
                setErr("날씨 불러오기 실패");
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [lat, lon, API_KEY]);

    const skyCode = "4"; // API에서 받은 하늘상태 코드

    return (
        <div className="weather-card">
            <div className="weather-header">Today's weather</div>
            {loading ? (
                <div className="weather-body">불러오는 중…</div>
            ) : err ? (
                <div className="weather-body">정보 없음</div>
            ) : (
                <div className="weather-body">
                    {/* <img src={icon} alt="weather icon" /> */}
                    <span className="weather icon">
                        {skyCode === "1"
                            ? <i class="fa-regular fa-sun"></i>
                            : skyCode === "3"
                                ? <i class="fa-regular fa-cloud"></i>
                                : skyCode === "4"
                                    ? <i class="fa-solid fa-cloud-showers-heavy"></i>
                                    : "알 수 없음"}
                    </span>
                    <span className="weather-desc">
                        {skyCode === "1"
                            ? "맑음"
                            : skyCode === "3"
                                ? "구름 많음"
                                : skyCode === "4"
                                    ? "흐림"
                                    : "알 수 없음"}</span>
                    {/*  {temp !== null && <span className="weather-temp">{temp}℃</span>} */}
                </div>
            )}
        </div>
    );
}