import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoHeartOutline,
  IoPricetagOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import "../css/Community.css";
// import postsData from "../data/CommunityData.json"; // 기본 비우려면 사용 X

/* ----- 저장소 유틸 ----- */
const STORAGE_KEY = "communityPosts";
const loadPosts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const savePosts = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  // 다른 탭/페이지(Community2 등)에 변경 알림
  window.dispatchEvent(new CustomEvent("communityPosts:updated", { detail: { posts: list } }));
};

function ComCard({ post, onLike }) {
  const navigate = useNavigate();
  const goDetail = () => {
    // id가 없으면 상세 없다고 가정
    if (post.id != null) navigate(`/Community3/${post.id}`);
  };

  const userImg = post.userImg || "https://00anuyh.github.io/SouvenirImg/user.png";

  let mainImg = "/img/default-image.png";
  if (post.image) {
    mainImg = post.image;
  } else if (post.photos && post.photos.length > 0) {
    const firstPhoto = post.photos[0];
    mainImg = typeof firstPhoto === "string" ? firstPhoto : URL.createObjectURL(firstPhoto);
  }

  return (
    <div className="comBox">
      <div className="comImg" onClick={goDetail}>
        <img src={mainImg} alt="커뮤이미지" />
      </div>
      <div className="comInpo">
        <div className="comUser">
          <img src={userImg} alt="커뮤회원" width="60" height="60" />
          <p>{post.author || post.user || "익명"}</p>
        </div>

        <div className="comText" onClick={goDetail}>
          {post.content || post.text || ""}
        </div>

        <div className="like-tag-mes">
          {/* ❤️ 좋아요: 클릭 시 증가 */}
          <div role="button" tabIndex={0} onClick={() => onLike(post)}>
            <IoHeartOutline className="ltm-icon" aria-hidden="true" />
            <span className="ltm-num">{Number(post.likes || 0)}</span>
          </div>

          {/* 태그/댓글은 고정 or 별도 로직 추가 가능 */}
          <div role="button" tabIndex={0}>
            <IoPricetagOutline className="ltm-icon" aria-hidden="true" />
            <span className="ltm-num">{Number(post.tagsCount || 0)}</span>
          </div>
          <div role="button" tabIndex={0}>
            <IoChatbubbleEllipsesOutline className="ltm-icon" aria-hidden="true" />
            <span className="ltm-num">{Number(post.commentsCount || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const navigate = useNavigate();
  const writeNavigate = () => navigate("/Community2");

  // ✅ 로컬 저장 글을 state로 관리 (렌더마다 재계산 X)
  const [posts, setPosts] = useState(() => loadPosts());

  // 다른 탭/페이지(Community2 포함)에서 저장소가 바뀌면 동기화
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setPosts(loadPosts());
    };
    const onCustom = () => setPosts(loadPosts());
    window.addEventListener("storage", onStorage);
    window.addEventListener("communityPosts:updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("communityPosts:updated", onCustom);
    };
  }, []);

  // ✅ 좋아요 증가 핸들러 (저장소 + state 동시 업데이트)
  const handleLike = useCallback((target) => {
    setPosts((prev) => {
      // id 기준 업데이트 (id 없으면 같은 객체 참조로 비교)
      const next = prev.map((p) => {
        const isTarget = (target.id != null && p.id === target.id) || p === target;
        return isTarget ? { ...p, likes: Number(p.likes || 0) + 1 } : p;
      });
      savePosts(next);
      return next;
    });
  }, []);

  // ✅ 페이지네이션
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);

  const pagePosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return posts.slice(start, start + PAGE_SIZE);
  }, [posts, currentPage]);

  const goPage = (p) => {
    if (p < 1 || p > Math.max(1, totalPages)) return;
    setCurrentPage(p);
  };

  return (
    <div className="comwarp1">
      <div className="toptitle">
        <div className="titleleft" />
        <h2>Community</h2>
        <div className="titleright" />
      </div>

      <div className="comTap">
        <button type="button" className="combtn">내 글 찾기</button>
        <button type="button" className="combtn">나의 활동</button>
        <button type="button" className="combtn" onClick={writeNavigate}>
          작성하기
        </button>
      </div>

      <div className="comList">
        {totalPosts === 0 ? (
          <div className="comEmpty">
            <p>아직 올라온 글이 없어요.</p>
            <button type="button" className="combtn" onClick={writeNavigate}>
              첫 글 작성하기
            </button>
          </div>
        ) : (
          <>
            {pagePosts.map((post, idx) => (
              <React.Fragment key={post.id ?? `p-${(currentPage - 1) * PAGE_SIZE + idx}`}>
                <ComCard post={post} onLike={handleLike} />
                {idx !== pagePosts.length - 1 && <div className="comLine" />}
              </React.Fragment>
            ))}
          </>
        )}

        {/* ✅ 페이지네이션 (항상 노출, 1페이지만 있어도 보여짐) */}
        <div className="comPageNum" role="navigation" aria-label="페이지네이션">
          <button
            type="button"
            onClick={() => goPage(currentPage - 1)}
            disabled={Math.max(1, totalPages) <= 1 || currentPage === 1}
          >
            이전
          </button>

          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((n) => {
            const active = n === Math.min(currentPage, Math.max(1, totalPages));
            return (
              <button
                type="button"
                key={n}
                className={active ? "active" : ""}
                onClick={() => goPage(n)}
                disabled={totalPages <= 1}
                aria-current={active ? "page" : undefined}
              >
                {n}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => goPage(currentPage + 1)}
            disabled={Math.max(1, totalPages) <= 1 || currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
