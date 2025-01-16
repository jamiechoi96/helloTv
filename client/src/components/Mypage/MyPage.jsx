import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './MyPage.css';

function MyPage() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const defaultHash = 'a97ed1db84bc3dc8586b46572d253e86d4771b902b5ee38c64150e13968ff3ad';
  const hash = searchParams.get('hash') || defaultHash;

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/watch-history?hash=${hash}`);
        console.log('API 응답:', response);
        const data = await response.json();
        console.log('받은 데이터:', data);
        setWatchHistory(data);
      } catch (error) {
        console.error('시청 기록 가져오기 오류:', error);
        setError('오류가 발생했습니다: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, [hash]);

  if (loading) return <div>데이터를 불러오는 중...</div>;
  if (error) return <div>오류가 발생했습니다: {error}</div>;

  return (
    <div className="mypage">
      <div className="mypage_header">
        <div className="profile_section">
          <div className="profile_icon">
            <span className="profile-placeholder">프로필</span>
          </div>
          <div className="profile_name">
            <span>수정 &gt;</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">시청기록</h2>
        <div className="section_content watch-history">
          {watchHistory && watchHistory.length > 0 ? (
            <div className="watch-history-grid">
              {watchHistory.map((item) => (
                <div key={item.sha2_hash} className="watch-history-item">
                  <div className="poster poster-placeholder">
                    <span className="title-placeholder">{item.latest_episode}</span>
                  </div>
                  <div className="content-info">
                    <h3>{item.latest_episode}</h3>
                    <p className="category">{item.category}</p>
                    <p className="date">{new Date(item.latest_strt_dt).toLocaleDateString()}</p>
                    <p className="duration">{Math.floor(item.total_use_tms / 60)}분</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>시청 기록이 없습니다.</p>
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
