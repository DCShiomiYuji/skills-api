const mysql = require("mysql2/promise");

// MySQL 接続設定
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  port: 3307,
  database: "skills_management",
};

// データベース接続プールの作成
const pool = mysql.createPool(dbConfig);

// データベース接続テスト関数
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL データベースに正常に接続しました");
    connection.release();
  } catch (err) {
    console.error("MySQL 接続エラー:", err);
  }
}

module.exports = {
  pool,
  testConnection,
};
