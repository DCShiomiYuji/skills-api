const express = require("express");
const app = express();
const { testConnection } = require("./src/config/db");
const userSkills = require("./src/users-skills/index");

// リクエストBodyを取得するために必要
app.use(express.json());

// ユーザースキル関連のルートをマウント
app.use("/users/skills", userSkills);
// スキル関連のルートをマウント
// app.use("/skills", skills);

app.listen(3000, async () => {
  console.log("Server is running on port 3000");
  // データベース接続確認
  await testConnection();
});
