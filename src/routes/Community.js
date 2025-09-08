import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IoHeartOutline,
  IoPricetagOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import "../css/Community.css";
import postsData from "../data/CommunityData.json"; // 기존 데이터

function ComCard({ post }) {
  const navigate = useNavigate();
  const CommunityDetailNavigate = () => {
    navigate(`/Community3/${post.id}`);
  };

  // 항상 JSON에서 가져온 userImg 또는 기본 이미지
  const userImg =
    post.userImg || "https://00anuyh.github.io/SouvenirImg/user.png";

  // 메인 이미지
  let mainImg = "/img/default-image.png";
  if (post.image) {
    mainImg = post.image; // 기존 글
  } else if (post.photos && post.photos.length > 0) {
    // 새 글
    const firstPhoto = post.photos[0];
    mainImg =
      typeof firstPhoto === "string"
        ? firstPhoto
        : URL.createObjectURL(firstPhoto);
  }

  return (
    <div className="comBox">
      <div className="comImg" onClick={CommunityDetailNavigate}>
        <img src={mainImg} alt="커뮤이미지" />
      </div>
      <div className="comInpo">
        <div className="comUser">
          <img src={userImg} alt="커뮤회원" width="60px" />
          <p>{post.author || post.user}</p>
        </div>
        <div className="comText" onClick={CommunityDetailNavigate}>
          {post.content || post.text}
        </div>
        <div className="like-tag-mes">
          <div role="button" tabIndex={0}>
            <IoHeartOutline className="ltm-icon" aria-hidden="true" />
            <span className="ltm-num">20</span>
          </div>
          <div role="button" tabIndex={0}>
            <IoPricetagOutline className="ltm-icon" aria-hidden="true" />
            <span className="ltm-num">20</span>
          </div>
          <div role="button" tabIndex={0}>
            <IoChatbubbleEllipsesOutline
              className="ltm-icon"
              aria-hidden="true"
            />
            <span className="ltm-num">20</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const navigate = useNavigate();

  const writeNavigate = () => navigate("/Community2");

  // 로컬에 저장된 글 불러오기
  const savedPosts = JSON.parse(localStorage.getItem("communityPosts")) || [];
  const allPosts = [...savedPosts, ...postsData]; // 새 글 맨 위

  return (
    <div className="warp1">
      <div className="toptitle">
        <div className="titleleft" />
        <h2>Community</h2>
        <div className="titleright" />
      </div>

      <div className="comTap">
        <button type="button" className="combtn">
          내 글 찾기
        </button>
        <button type="button" className="combtn">
          나의 활동
        </button>
        <button type="button" className="combtn" onClick={writeNavigate}>
          작성하기
        </button>
      </div>

      <div className="comList">
        {allPosts.map((post, idx) => (
          <React.Fragment key={post.id || idx}>
            <ComCard post={post} />
            {idx !== allPosts.length - 1 && <div className="comLine" />}
          </React.Fragment>
        ))}
        <div className="comPageNum">페이지 수</div>
      </div>
    </div>
  );
}
