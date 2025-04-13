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
    const {exp, level, userId} = req.query;
    let query = 'SELECT * FROM UserSkills';
    let params = [];
    let conditions = []; // 検索条件を追加

    try {
      // exp のフィルタリング
      if (exp !== undefined) {
        const expValue = parseInt(exp);
        
        // 数値に変換できない場合はエラー
        if (isNaN(expValue)) {
          return res.status(400).json({ error: '経験年数 exp は数値で指定してください' });
        }
        
        // 指定された経験年数以上のスキルをフィルタリング
        conditions.push('experience >= ?');
        params.push(expValue);
      }

      // level のフィルタリング
      if (level !== undefined) {
        const levelValue = parseInt(level);
        
        // 数値に変換できない場合はエラー
        if (isNaN(levelValue)) {
          return res.status(400).json({ error: 'レベル level は数値で指定してください' });
        }
        
        // 指定されたレベル以上のスキルをフィルタリング
        conditions.push('level >= ?');
        params.push(levelValue);
      }

      // userId のフィルタリング
      if (userId !== undefined) {
        // 指定されたユーザーIDのスキルをフィルタリング
        conditions.push('user_id = ?');
        params.push(userId);
      }

      // WEHERE 句の結合
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      // クエリパラメータがない場合は全件返す
      const [skills] = await pool.query(query, params);
      return res.status(200).json(skills);

   } catch (error) {
      console.error('予期せぬエラー:', error);
      return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
   }
});



// 1件取得 - GET /skills/:id
app.get('/users/skills/:id', async(req, res) => {
    try {
        const [rows] = await pool.query(
          'SELECT * FROM UserSkills WHERE id = ?', 
          [req.params.id]
        );

        const userSkill = rows[0]; // 取得したスキル情報

        if (!userSkill) {
            return res.status(404).json({ error: 'スキルが見つかりません' });
        }

        return res.status(200).json(userSkill);
    } catch (error) {
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
});

app.listen(3000, async() => {
    console.log('Server is running on port 3000');
    // データベース接続確認
    await testConnection();
});
