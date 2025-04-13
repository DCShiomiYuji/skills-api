const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

// MySQL 接続設定
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3307,
  database: 'skills_management'
};

// データベース接続プールの作成
const pool = mysql.createPool(dbConfig);

// サーバー起動時に接続確認
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL データベースに正常に接続しました');
    connection.release();
  } catch (err) {
    console.error('MySQL 接続エラー:', err);
  }
}

// ここに API のルートを追加します

// 一覧取得 - GET /users/skills
app.get('/users/skills', async (req, res) => {
    const exp = req.query.exp;
    let query = 'SELECT * FROM UserSkills';
    let params = [];

    try {
      // expクエリパラメータが指定されている場合、フィルタリングする
      if (exp !== undefined) {
        const expValue = parseInt(exp);
        
        // 数値に変換できない場合はエラー
        if (isNaN(expValue)) {
          return res.status(400).json({ error: '経験年数 exp は数値で指定してください' });
        }
        
        // 指定された経験年数以上のスキルをフィルタリング
        query = 'SELECT * FROM UserSkills WHERE experience >= ?';
        params = [expValue];
      }

      // クエリパラメータがない場合は全件返す
      const [skills] = await pool.query(query, params);
      res.status(200).json(skills);

   } catch (error) {
      console.error('予期せぬエラー:', error);
      return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
   }
});

// 1件取得 - GET /skills/:id
app.get('/skills/:id', (req, res) => {
    const skill = skills.find(s => s.id === req.params.id);

    // ここにエラーを追加
    if (!skill) {
        return res.status(404).json({ error: 'スキルが見つかりません' });
    }
    
    res.status(200).json(skill);
});

app.listen(3000, async() => {
    console.log('Server is running on port 3000');
    // データベース接続確認
    await testConnection();
});
