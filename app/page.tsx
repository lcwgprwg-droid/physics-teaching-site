'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState, useMemo } from 'react';

export default function Index() {
  const [files, setFiles] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 使用 useMemo 延迟初始化，防止在构建阶段因为缺少 URL 而崩溃
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.warn("未检测到 Supabase 环境变量");
      return null;
    }
    return createClient(url, key);
  }, []);

  useEffect(() => {
    setIsReady(true);
    if (supabase) {
      fetchFiles();
    }
  }, [supabase]);

  const fetchFiles = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.storage.from('flie').list();
      if (!error) setFiles(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const uploadFile = async (event: any) => {
    if (!supabase || !event.target.files || event.target.files.length === 0) return;
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

  if (!isReady) return <div className="p-10 text-center text-gray-400">正在启动物理实验室...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <nav className="w-full bg-blue-600 p-5 text-white shadow-lg text-center font-bold text-2xl">
        ⚛️ 物理名师备课站
      </nav>

      <main className="w-full max-w-4xl p-6">
        {/* 如果没配置好环境变量，给老师一个友好的提醒 */}
        {!supabase && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            ⚠️ 数据库未连接，请在 Vercel 环境变量中配置密钥。
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mt-10 border">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">电磁振荡资源库</h1>
          <p className="text-center text-gray-500 mb-8">专注物理教学数字化 · 资源共享平台</p>
          
          <div className="flex justify-between items-center mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="text-sm text-blue-800 font-medium">
                资源总数：<span className="text-lg font-bold">{files.length}</span>
             </div>
             <label className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 shadow-md font-bold transition">
               {uploading ? '正在同步...' : '+ 上传新资源'}
               <input type="file" className="hidden" onChange={uploadFile} disabled={uploading || !supabase} />
             </label>
          </div>

          <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
             <div className="bg-gray-50 p-4 font-bold border-b flex justify-between text-gray-700 text-sm">
                <span>资源名称</span>
                <span>操作</span>
             </div>
             <div className="divide-y">
               {files.length > 0 ? (
                 files.map(f => (
                   <div key={f.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                      <span className="text-gray-700 font-medium truncate max-w-[200px] md:max-w-md">{f.name}</span>
                      <a 
                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/flie/${f.name}`}
                        target="_blank"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        预览下载
                      </a>
                   </div>
                 ))
               ) : (
                 <div className="p-16 text-center text-gray-300 italic">
                    <p>目前库内尚无文件</p>
                 </div>
               )}
             </div>
          </div>
        </div>
        <p className="mt-10 text-center text-gray-400 text-xs">智理名师 · 2025 物理备课站</p>
      </main>
    </div>
  );
}
