import React, { useEffect, useState } from "react";
import axios from "../../axios";
import "./MyPage.css";

function MyPage() {
  const [user, setUser] = useState(null);
  const [viewingHistory, setViewingHistory] = useState([]);
  const sha2Hash = "your_sha2_hash";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/${sha2Hash}`);
        setUser(response.data);
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    };

    const fetchViewingHistory = async () => {
      try {
        const response = await axios.get(`/api/user/${sha2Hash}/viewing-history`);
        setViewingHistory(response.data);
      } catch (error) {
        console.error("최근 시청 기록을 가져오는 중 오류 발생:", error);
      }
    };

    fetchUser();
    fetchViewingHistory();
  }, [sha2Hash]);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mypage">
      <div className="mypage_header">
        <div className="profile_section">
          <div className="profile_icon">
            <img
              src="/images/LG_logo.png"
              alt="LG Logo"
              className="logo-image"
            />
          </div>
          <div className="profile_name">
            <span>{user.name}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">최근 시청 기록</h2>
        <div className="section_content">
          {viewingHistory.length > 0 ? (
            viewingHistory.map((item, index) => (
              <div key={index}>
                <p>카테고리: {item.category}</p>
                <p>최신 시작 날짜: {item.latest_strt_dt}</p>
                <p>총 사용 시간: {item.total_use_tms} 분</p>
                <p>최신 에피소드: {item.latest_episode}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>최근 시청 기록이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">구매 리스트</h2>
        <div className="section_content">
          새 콘텐츠를 구매하거나 대여할 수 있습니다.
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">찜한 콘텐츠</h2>
        <div className="section_content">
          찜한 콘텐츠가 여기에서 보여집니다.
        </div>
      </div>
    </div>
  );
}

export default MyPage;
