// app/page.tsx - アプリケーションのルートページ（ナビゲーション付き）
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">スキル管理アプリケーション</h1>
      
      <nav className="mb-8">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/user-skills" 
              className="text-blue-500 hover:underline"
            >
              ユーザースキル一覧を表示
            </Link>
          </li>
          {/* 他の機能へのリンク */}
        </ul>
      </nav>
      
      <div className="bg-gray-50 p-6 rounded">
        <h2 className="text-xl font-semibold mb-3">アプリケーションについて</h2>
        <p>このアプリケーションはユーザーのスキルを管理するためのツールです。</p>
      </div>
    </div>
  );
}