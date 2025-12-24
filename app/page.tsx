'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function Index() {
  const supabase = createClientComponentClient();
  const [files, setFiles] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 强制让页面显示
    setIsReady(true);
    
    // 异步获取文件，不影响页面显示
    const fetchFiles = async () => {
      const { data } = await supabase.storage.from('flie').list();
      if (data) setFiles(data);
    };
    fetchFiles();
  }, []);

  // 如果还没准备好，显示一个简单的加载文字，而不是空白
  if (!isReady) return <div className="p-10">正在加载物理备课站...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <nav className="w-full bg-blue-600 p-4 text-white shadow-lg text-center font-bold text-xl">
        ⚛️ 物理名师备课站
      </nav>

      <main className="w-full max-w-4xl p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-10 border">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">电磁振荡资源库</h1>
          
          <div className="flex justify-between items-center mb-8">
             <p className="text-gray-600">欢迎老师！点击右侧按钮分享资料。</p>
             <label className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
               + 上传资源
               <input type="file" className="hidden" onChange={() => alert('检测到上传动作，配置成功后即可存入数据库！')} />
             </label>
          </div>

          <div className="border rounded-lg overflow-hidden">
             <div className="bg-gray-100 p-4 font-bold border-b flex justify-between">
                <span>文件列表</span>
                <span>状态</span>
             </div>
             {files.length > 0 ? (
               files.map(f => (
                 <div key={f.id} className="p-4 border-b flex justify-between hover:bg-gray-50">
                    <span className="text-gray-700">{f.name}</span>
                    <span className="text-blue-600 cursor-pointer">下载</span>
                 </div>
               ))
             ) : (
               <div className="p-10 text-center text-gray-400">目前库内尚无文件，请上传首个资源</div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
