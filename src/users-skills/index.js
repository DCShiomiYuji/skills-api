const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// ここに API のルートを追加します

// 一覧取得 - GET /users/skills
router.get("/", async (req, res) => {
  const { exp, level, userId } = req.query;
  let query = "SELECT * FROM UserSkills";
  let params = [];
  let conditions = []; // 検索条件を追加

  try {
    // exp のフィルタリング
    if (exp !== undefined) {
      const expValue = parseInt(exp);

      // 数値に変換できない場合はエラー
      if (isNaN(expValue)) {
        return res
          .status(400)
          .json({ error: "経験年数 exp は数値で指定してください" });
      }

      // 指定された経験年数以上のスキルをフィルタリング
      conditions.push("experience >= ?");
      params.push(expValue);
    }

    // level のフィルタリング
    if (level !== undefined) {
      const levelValue = parseInt(level);

      // 数値に変換できない場合はエラー
      if (isNaN(levelValue)) {
        return res
          .status(400)
          .json({ error: "レベル level は数値で指定してください" });
      }

      // 指定されたレベル以上のスキルをフィルタリング
      conditions.push("level >= ?");
      params.push(levelValue);
    }

    // userId のフィルタリング
    if (userId !== undefined) {
      // 指定されたユーザーIDのスキルをフィルタリング
      conditions.push("user_id = ?");
      params.push(userId);
    }

    // WEHERE 句の結合
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // クエリパラメータがない場合は全件返す
    const [skills] = await pool.query(query, params);
    return res.status(200).json(skills);
  } catch (error) {
    console.error("予期せぬエラー:", error);
    return res.status(500).json({
      error:
        "予期せぬエラーが発生しました。システム管理者に問い合わせてください。",
    });
  }
});

// 1件取得 - GET /skills/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM UserSkills WHERE id = ?", [
      req.params.id,
    ]);

    const userSkill = rows[0]; // 取得したスキル情報

    if (!userSkill) {
      return res.status(404).json({ error: "ユーザースキルが見つかりません" });
    }

    return res.status(200).json(userSkill);
  } catch (error) {
    console.error("予期せぬエラー:", error);
    return res.status(500).json({
      error:
        "予期せぬエラーが発生しました。システム管理者に問い合わせてください。",
    });
  }
});

// 新規作成 - POST /users/skills
router.post("/", async (req, res) => {
  try {
    const { userId, skillId, level, experience } = req.body;

    // バリデーション
    if (
      !userId ||
      skillId === undefined ||
      level === undefined ||
      experience === undefined
    ) {
      return res
        .status(400)
        .json({ error: "userId, skillId, level, experience は必須です" });
    }

    await pool.query(
      "INSERT INTO UserSkills (user_id, skill_id, level, experience) VALUES (?, ?, ?, ?)",
      [userId, skillId, level, experience],
    );

    res.status(201).json({
      userId,
      skillId,
      level,
      experience,
    });
  } catch (error) {
    console.error("予期せぬエラー:", error);
    return res.status(500).json({
      error:
        "予期せぬエラーが発生しました。システム管理者に問い合わせてください。",
    });
  }
});

// 更新 - PUT /users/skills/:id
router.put("/:id", async (req, res) => {
  try {
    const { level, experience } = req.body;
    const id = req.params.id;

    // バリデーション
    if (level === undefined || experience === undefined) {
      return res.status(400).json({ error: "level, experience は必須です" });
    }

    const [result] = await pool.query(
      "UPDATE UserSkills SET level = ?, experience = ? WHERE id = ?",
      [level, experience, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ユーザースキルが見つかりません" });
    }

    res.status(200).json({
      id,
      level,
      experience,
    });
  } catch (err) {
    console.error("エラー:", err);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

// 削除 - DELETE /users/skills/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM UserSkills WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ユーザースキルが見つかりません" });
    }

    res.status(204).end();
  } catch (error) {
    console.error("予期せぬエラー:", error);
    return res.status(500).json({
      error:
        "予期せぬエラーが発生しました。システム管理者に問い合わせてください。",
    });
  }
});

module.exports = router;
