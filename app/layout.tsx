import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import 'styles/main.css';

export const metadata: Metadata = {
  title: '高中物理名师备课站',
  description: '专注物理教学资源分享',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN">
      {/* 去掉了 bg-black，改为 bg-white */}
      <body className="bg-white text-gray-900">
        {/* 这里删掉了原本的 <Navbar /> 和 <Footer />，因为你的 page.tsx 里已经写好了 */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
