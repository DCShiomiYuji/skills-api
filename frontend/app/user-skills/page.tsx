'use client';

import { useState, useEffect } from 'react';
import { getUserSkills } from '@/app/api/userSkillsApi';
import { UserSkill } from '@/app/types/userSkills';

export default function UserSkillsPage() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getUserSkills();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザースキル一覧</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <p>読み込み中...</p>
      ) : skills.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">ユーザーID</th>
              <th className="border px-4 py-2">スキルID</th>
              <th className="border px-4 py-2">レベル</th>
              <th className="border px-4 py-2">経験年数</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(skill => (
              <tr key={skill.id}>
                <td className="border px-4 py-2">{skill.id}</td>
                <td className="border px-4 py-2">{skill.user_id}</td>
                <td className="border px-4 py-2">{skill.skill_id}</td>
                <td className="border px-4 py-2">{skill.level}</td>
                <td className="border px-4 py-2">{skill.experience}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}