'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// 初始化 Supabase 客户端
// Vercel 会自动读取环境变量，不需要手动填 Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Index() {
  const [files, setFiles] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsReady(true);
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      // 注意：这里用的是你创建的小写 flie
      const { data, error } = await supabase.storage.from('flie').list();
      if (!error) setFiles(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const uploadFile = async (event: any) => {
    if (!event.target.files || event.target.files.length === 0) return;
    try {
      setUploading(true);
      const file = event.target.files[0];
      const { error } = await supabase.storage.from('flie').upload(`${Date.now()}-${file.name}`, file);
      if (error) throw error;
      alert('上传成功！');
      fetchFiles();
    } catch (err: any) {
      alert('上传失败：' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isReady) return <div className="p-10 text-center">正在加载物理备课站...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <nav className="w-full bg-blue-600 p-5 text-white shadow-lg text-center font-bold text-2xl">
        ⚛️ 物理名师备课站
      </nav>

      <main className="w-full max-w-4xl p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-10 border">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">电磁振荡资源库</h1>
          <p className="text-center text-gray-500 mb-8">专注物理教学数字化 · 资源共享平台</p>
          
          <div className="flex justify-between items-center mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="text-sm text-blue-800 font-medium">
                当前库内资源：<span className="text-lg font-bold">{files.length}</span> 个
             </div>
             <label className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 shadow-md font-bold transition">
               {uploading ? '正在保存...' : '+ 上传新资源'}
               <input type="file" className="hidden" onChange={uploadFile} disabled={uploading} />
             </label>
          </div>

          <div className="border rounded-xl overflow-hidden shadow-sm">
             <div className="bg-gray-100 p-4 font-bold border-b flex justify-between text-gray-700">
                <span>资源名称</span>
                <span>操作</span>
             </div>
             <div className="divide-y">
               {files.length > 0 ? (
                 files.map(f => (
                   <div key={f.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                      <span className="text-gray-700 font-medium truncate max-w-[200px] md:max-w-md">{f.name}</span>
                      <a 
                        href={`${supabaseUrl}/storage/v1/object/public/flie/${f.name}`}
                        target="_blank"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        下载
                      </a>
                   </div>
                 ))
               ) : (
                 <div className="p-20 text-center text-gray-400">
                    <div className="text-5xl mb-4">📂</div>
                    <p>目前库内尚无文件，请点击上方按钮开始分享</p>
                 </div>
               )}
             </div>
          </div>
        </div>
        <p className="mt-10 text-center text-gray-400 text-xs">智理名师 · 2025 物理备课数字化方案</p>
      </main>
    </div>
  );
}
