const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 데이터베이스 설정
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'lg_hellovisionvod',
};

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('데이터베이스 연결 성공');
    await connection.end();
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error.message);
    return false;
  }
}

// 서버 시작
async function startServer() {
  // 데이터베이스 연결 테스트
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('데이터베이스 연결 실패. MySQL이 실행 중인지 확인해주세요.');
    console.log('서버를 다시 시작하려면 코드를 수정하거나 rs를 입력하세요.');
    return;
  }

  // API 라우트
  app.get('/api/watch-history', async (req, res) => {
    let connection;
    try {
      const { hash } = req.query;  
      if (!hash) {
        return res.status(400).json({ 오류: '사용자 ID가 필요합니다' });
      }
      
      console.log('요청된 hash:', hash);
      
      connection = await mysql.createConnection(dbConfig);
      console.log('데이터베이스 연결됨');

      const [rows] = await connection.execute(`
        WITH RankedContent AS (
          SELECT 
            sha2_hash,
            SUBSTRING_INDEX(category, '/', -1) AS category,
            MAX(strt_dt) AS latest_strt_dt,
            SUM(use_tms) AS total_use_tms,
            SUBSTRING_INDEX(MAX(CONCAT(strt_dt, '_', asset_nm)), '_', -1) AS latest_episode
          FROM 
            202310_vod
          WHERE 
            sha2_hash = ?
          GROUP BY 
            sha2_hash, SUBSTRING_INDEX(category, '/', -1)
        )
        SELECT 
          sha2_hash,
          category,
          latest_strt_dt,
          total_use_tms,
          latest_episode
        FROM 
          RankedContent
        ORDER BY 
          latest_strt_dt DESC
        LIMIT 5;
      `, [id]);

      console.log('쿼리 결과:', rows);
      res.json(rows);
    } catch (error) {
      console.error('데이터베이스 오류 상세:', {
        코드: error.code,
        에러번호: error.errno,
        SQL메시지: error.sqlMessage,
        SQL상태: error.sqlState,
        SQL: error.sql
      });
      res.status(500).json({ 
        오류: '데이터베이스 쿼리 오류',
        상세: error.message
      });
    } finally {
      if (connection) {
        try {
          await connection.end();
          console.log('데이터베이스 연결 종료');
        } catch (err) {
          console.error('연결 종료 중 오류 발생:', err);
        }
      }
    }
  });

  app.get('/api/test', (req, res) => {
    res.json({ message: '백엔드 서버가 실행 중입니다!' });
  });

  // 리액트 라우팅 처리, 모든 요청을 리액트 앱으로 리다이렉트
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });

  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다`);
    console.log(`서버 주소: http://localhost:${PORT}`);
  });
}

// 서버 시작
startServer();