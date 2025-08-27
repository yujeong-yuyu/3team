// src/utils/localStorage.js
const USERS_KEY = "souvenir_users_v1";     // 모든 유저를 여기에 { [username]: user } 형태로 저장
const SESSION_KEY = "souvenir_session_v1"; // 현재 로그인 세션

function getUsersMap() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); }
  catch { return {}; }
}
function setUsersMap(map) {
  localStorage.setItem(USERS_KEY, JSON.stringify(map));
}

/** username으로 유저 한 명 가져오기 */
export function getFromLocalStorage(username) {
  if (!username) return null;
  const map = getUsersMap();
  return map[username] || null;
}

/** username으로 유저 저장(생성/업데이트) */
export function saveToLocalStorage(username, data) {
  const map = getUsersMap();
  map[username] = data; // ⚠️ 데모용: 비밀번호 평문 저장(실서비스 금지)
  setUsersMap(map);
}

/** 유저 삭제(옵션) */
export function removeFromLocalStorage(username) {
  const map = getUsersMap();
  if (map[username]) {
    delete map[username];
    setUsersMap(map);
  }
}

/** 세션 저장/조회/삭제 */
export function setSession(username) {
  const s = { username, loginAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  return s;
}
export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
