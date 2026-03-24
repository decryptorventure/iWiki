import React from 'react';
import { FileText, Search, Filter, Plus, Target, Coins, Sparkles, ArrowRight } from 'lucide-react';
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

  const navigateToHome = () => {
    dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      {/* Header / Breadcrumbs */}
      <div className="px-8 py-4 border-b border-gray-100 flex items-center text-sm text-gray-500 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <span onClick={navigateToHome} className="hover:text-[#f76226] cursor-pointer transition-colors">Trang chủ</span>
        <span className="mx-2 text-gray-300">/</span>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-[#f76226] cursor-pointer transition-colors'}>
              {crumb}
            </span>
            {index < breadcrumbs.length - 1 && <span className="mx-2 text-gray-300">/</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-12 animate-slide-up">{folderName}</h1>

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-16 animate-slide-up stagger-1">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bài viết</h2>
          <div className="flex items-center gap-3 text-gray-400">
            <button className="hover:text-gray-600 transition-colors hover:bg-gray-100 p-1.5 rounded-lg"><Search size={16} /></button>
            <button className="hover:text-gray-600 transition-colors hover:bg-gray-100 p-1.5 rounded-lg"><Filter size={16} /></button>
            <button onClick={handleWriteArticle} className="hover:text-gray-600 transition-colors hover:bg-gray-100 p-1.5 rounded-lg"><Plus size={16} /></button>
          </div>
        </div>

        {/* Empty State with Bounty */}
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center mt-10 animate-slide-up stagger-2">
          <div className="mb-4 text-gray-300 animate-float">
            <FileText size={48} strokeWidth={1} title="Chưa có bài viết" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có bài viết</h3>
          <p className="text-sm text-gray-500 mb-10">Các bài viết sẽ sớm được cập nhật</p>

          {/* Bounty Card */}
          <div className="w-full relative group mt-4">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#f76226] via-orange-400 to-amber-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white border border-orange-100/50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col sm:flex-row items-center gap-8">

              <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full flex items-center justify-center shrink-0 shadow-inner border border-orange-100/50 group-hover:scale-110 transition-transform duration-300">
                <Target size={36} className="text-[#f76226]" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900">Nhiệm vụ: Người tiên phong</h4>
                  <span className="px-2.5 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-[#f76226] text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                    <Sparkles size={12} />
                    Bounty
                  </span>
                </div>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  Thư mục <span className="font-semibold text-gray-900">"{folderName}"</span> đang trống. Hãy là người đầu tiên đóng góp bài viết chất lượng để nhận phần thưởng đặc biệt từ hệ thống!
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100/50 shadow-sm">
                    <Coins size={18} />
                    +500 iCoin
                  </div>
                  <button onClick={handleWriteArticle} className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#f76226] to-[#FF8A6A] hover:from-[#e55a2b] hover:to-[#f76226] px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#f76226]/20 active:scale-95">
                    Viết bài ngay
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

