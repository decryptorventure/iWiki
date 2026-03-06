import React from 'react';
import { FileText, Plus, Target, Coins, ArrowRight, ChevronRight, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EmptyFolderBountyProps {
  folderId: string;
  folderName: string;
  breadcrumbs: string[];
}

export default function EmptyFolderBounty({ folderId, folderName, breadcrumbs }: EmptyFolderBountyProps) {
  const { dispatch } = useApp();

  const handleWriteArticle = () => {
    dispatch({ type: 'OPEN_EDITOR', article: { folderId } });
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      {/* Breadcrumbs */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'dashboard' })} className="hover:text-orange-500 transition-colors flex items-center gap-1.5">
          <Home size={14} />
          <span>Trang chủ</span>
        </button>
        <ChevronRight size={12} className="text-gray-300" />
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-orange-500 transition-colors'}>
              {crumb}
            </span>
            {index < breadcrumbs.length - 1 && <ChevronRight size={12} className="text-gray-300 mx-0.5" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{folderName}</h1>

        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-12">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bài viết</h2>
          <button onClick={handleWriteArticle} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400">
            <Plus size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <FileText size={40} className="text-gray-200 mb-4" />
          <h3 className="text-base font-bold text-gray-900 mb-1">Chưa có bài viết</h3>
          <p className="text-sm text-gray-400 mb-10">Thư mục này hiện tại đang trống.</p>

          <div className="w-full max-w-lg bg-white border border-orange-100 rounded-lg p-6 shadow-sm flex items-start gap-6">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
              <Target size={24} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-bold text-gray-900">Thử thách: Người tiên phong 🚀</h4>
              </div>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Thư mục <span className="font-semibold">"{folderName}"</span> đang cần những bài viết đầu tiên. Hãy đóng góp ngay để nhận phần thưởng iCoin.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-orange-600 font-bold text-sm bg-orange-50 px-3 py-1.5 rounded">
                  <Coins size={16} />
                  +500 iCoin
                </div>
                <button onClick={handleWriteArticle} className="flex items-center gap-2 text-sm font-bold text-white bg-gray-900 hover:bg-orange-600 px-5 py-2 rounded transition-colors">
                  Viết bài ngay
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
