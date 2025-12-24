import { PropsWithChildren } from 'react';
import 'styles/main.css';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN">
      <body className="bg-white">
        {/* 直接显示内容，不加任何判断 */}
        {children}
      </body>
    </html>
  );
}
