// src/utils/localStorage.js

// 모든 유저를 { [username]: user } 형태로 저장
export const USERS_KEY = "souvenir_users_v1";
// 현재 로그인 세션 키
export const SESSION_KEY = "souvenir_session_v1";
// 세션 변경 브로드캐스트 이벤트명
export const SESSION_CHANGED_EVENT = "session:changed";

/* ----------------------------- 유틸 ----------------------------- */
function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}
const hasLS = () => typeof localStorage !== "undefined";

/* -------------------------- Users CRUD -------------------------- */
function getUsersMap() {
  if (!hasLS()) return {};
  return safeParse(localStorage.getItem(USERS_KEY), {}) || {};
}
function setUsersMap(map) {
  if (!hasLS()) return;
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
  map[username] = data; // ⚠️ 데모용: 비번 평문 저장(실서비스 금지)
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

/** 유저 존재 여부 */
export function hasUser(username) {
  const map = getUsersMap();
  return !!map[username];
}

/** 유저 부분 업데이트 */
export function updateUser(username, partial = {}) {
  const map = getUsersMap();
  const cur = map[username] || {};
  map[username] = { ...cur, ...partial };
  setUsersMap(map);
  return map[username];
}

/** 모든 유저 리스트(배열) */
export function listUsers() {
  const map = getUsersMap();
  return Object.keys(map).map((k) => ({ username: k, ...map[k] }));
}

/* --------------------------- Session --------------------------- */
/** 세션 저장: { username, loginAt } */
export function setSession(username) {
  if (!hasLS()) return null;
  const s = { username, loginAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  // 세션 변경 브로드캐스트
  try {
    window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT, { detail: s }));
  } catch {}
  return s;
}

/** 내부: 레거시 세션 마이그레이션 (userid -> username) */
function migrateLegacySession(obj) {
  if (!obj) return null;
  if (obj.username) return obj;
  if (obj.userid) return { ...obj, username: obj.userid };
  return obj;
}

/** 세션 조회(과거 userid 필드 → username으로 정규화) */
export function getSession() {
  if (!hasLS()) return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const parsed = safeParse(raw, null);
  return migrateLegacySession(parsed);
}

/** 현재 로그인한 username만 얻기 */
export function getCurrentUsername() {
  return getSession()?.username ?? null;
}

/** 세션 삭제 */
export function clearSession() {
  if (!hasLS()) return;
  localStorage.removeItem(SESSION_KEY);
  // 세션 변경 브로드캐스트(null)
  try {
    window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT, { detail: null }));
  } catch {}
}

/* --------------------- 세션 구독/해제 헬퍼 --------------------- */
/** 세션 변경 구독: const off = onSessionChange((s)=>{ ... }); off(); */
export function onSessionChange(cb) {
  if (typeof window === "undefined" || typeof cb !== "function") return () => {};
  const handler = (e) => cb(e.detail ?? null);
  window.addEventListener(SESSION_CHANGED_EVENT, handler);
  return () => window.removeEventListener(SESSION_CHANGED_EVENT, handler);
}

/** 명시적 해제(옵션) */
export function offSessionChange(cb) {
  if (typeof window === "undefined" || typeof cb !== "function") return;
  window.removeEventListener(SESSION_CHANGED_EVENT, cb);
}
