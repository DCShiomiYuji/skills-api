// api/userSkillsApi.ts - APIクライアント
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getUserSkills() {
  const response = await fetch(`${API_BASE_URL}/users/skills`);
  
  if (!response.ok) {
    throw new Error('スキル一覧の取得に失敗しました');
  }
  
  return response.json();
}