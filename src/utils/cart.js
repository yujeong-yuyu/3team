// src/utils/cart.js
const STORAGE_KEY = "cart_v1";
export const CART_UPDATED_EVENT = "cart:updated";

// "₩123,456" 같은 문자열 → 숫자
export function parsePriceKRW(v) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const n = String(v).replace(/[^\d.-]/g, "");
  return Number(n || 0);
}

export function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  // 다른 탭/컴포넌트와 동기화
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: { cart } }));
}

/** 외부에서 전체 교체 저장이 필요할 때 사용 */
export function setCart(next) {
  const safe = Array.isArray(next) ? next : [];
  saveCart(safe);
  return safe;
}

/** 키 생성 규칙: id/slug/sku/name + optionId + thumb
 *  → 이미지가 다르면 다른 라인으로 (합쳐지지 않음)
 */
function mergeKey(item) {
  const base = item.id || item.slug || item.sku || item.name || "";
  const opt  = item.optionId ?? "base";
  // thumb가 절대/상대경로 여부에 상관없이 문자열 그대로 비교
  const pic  = item.thumb || item.image || "";
  return `${base}::${opt}::${pic}`;
}

// 장바구니 담기(동일 키면 수량 증가, 아니면 새 라인)
export function addToCart(item, qty = 1) {
  const cart = getCart();

  const key = mergeKey(item);
  const idx = cart.findIndex((x) => x.key === key);

  if (idx >= 0) {
    cart[idx].qty += Math.max(1, qty | 0);
  } else {
    cart.push({
      key,
      id: item.id ?? null,
      slug: item.slug ?? null,
      name: item.name ?? "",
      price: Number(item.price ?? 0), // 단가(옵션 포함)
      basePrice: Number(item.basePrice ?? item.price ?? 0),
      optionId: item.optionId ?? null,
      optionLabel: item.optionLabel ?? null,
      delivery: Number(item.delivery ?? 0),
      thumb: item.thumb ?? item.image ?? null,
      qty: Math.max(1, qty | 0),
      addedAt: Date.now(),
    });
  }

  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

// 특정 key의 수량 설정
export function setQty(key, qty) {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.key === key);
  if (idx >= 0) {
    cart[idx].qty = Math.max(1, qty | 0);
    saveCart(cart);
  }
  return cart;
}

// 특정 key 삭제
export function removeByKey(key) {
  const cart = getCart().filter((x) => x.key !== key);
  saveCart(cart);
  return cart;
}

// 총 수량
export function cartCount() {
  return getCart().reduce((s, x) => s + (x.qty || 0), 0);
}
