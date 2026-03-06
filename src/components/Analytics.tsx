import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Eye, Flame, Award, Calendar, Filter, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Analytics() {
    const { state } = useApp();
    const { articles, folders } = state;

    const [timeRange, setTimeRange] = useState('7d');

    const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0);
    const totalComments = articles.reduce((sum, a) => sum + a.comments.length, 0);
    const avgViews = articles.length ? Math.round(totalViews / articles.length) : 0;

    const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
    const topContributors = [
        { name: 'Nguyễn Thị Nguyệt', role: 'CHRO', articles: 12, views: 5400, avatar: 'https://picsum.photos/seed/nguyet/100/100' },
        { name: 'Phạm Thùy Mai', role: 'Admin', articles: 8, views: 3200, avatar: 'https://picsum.photos/seed/mai/100/100' },
        { name: 'Trần Hoàng Huy', role: 'Solution BE', articles: 6, views: 2400, avatar: 'https://picsum.photos/seed/huy/100/100' },
        { name: 'Lê Văn C', role: 'Frontend Lead', articles: 5, views: 1800, avatar: 'https://picsum.photos/seed/person1/100/100' },
    ];

    const categories = folders.map(f => ({
        name: f.name,
        count: articles.filter(a => a.folderId === f.id || (f.children && f.children.some(c => c.id === a.folderId))).length
    })).sort((a, b) => b.count - a.count);

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Thống kê iWiki 📊</h1>
                    <p className="text-sm text-gray-500">Báo cáo sức khoẻ và mức độ tương tác của tri thức nội bộ.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md">
                        <Calendar size={14} className="text-gray-400" />
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="text-xs font-semibold text-gray-700 bg-transparent outline-none cursor-pointer"
                        >
                            <option value="today">Hôm nay</option>
                            <option value="7d">7 ngày qua</option>
                            <option value="30d">30 ngày qua</option>
                            <option value="1y">1 năm qua</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Tổng lượt xem', value: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-500' },
                    { label: 'Bài viết mới', value: articles.length, icon: FileText, color: 'text-orange-500' },
                    { label: 'Tương tác', value: (totalLikes + totalComments).toLocaleString(), icon: TrendingUp, color: 'text-green-500' },
                    { label: 'Xem trung bình', value: avgViews, icon: Activity, color: 'text-purple-500' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white border border-gray-100 p-5 rounded-lg">
                        <div className="flex items-center gap-2.5 mb-3">
                            <stat.icon size={16} className={stat.color} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Activity Map Simulation */}
                <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-900 mb-8">Tăng trưởng độc giả</h3>
                    <div className="h-48 flex items-end justify-between gap-1">
                        {[40, 60, 45, 80, 70, 90, 85, 95, 75, 60, 85, 90].map((v, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-orange-100/50 rounded-t group-hover:bg-orange-400 transition-colors" style={{ height: `${v}%` }} />
                                <span className="text-[9px] text-gray-400 font-medium">T{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribution */}
                <div className="bg-white border border-gray-100 p-6 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-900 mb-6">Mật độ nội dung</h3>
                    <div className="space-y-4">
                        {categories.slice(0, 5).map(cat => (
                            <div key={cat.name}>
                                <div className="flex items-center justify-between text-[11px] mb-1.5">
                                    <span className="font-semibold text-gray-600">{cat.name}</span>
                                    <span className="text-gray-400">{cat.count}</span>
                                </div>
                                <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500"
                                        style={{ width: `${(cat.count / articles.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hot Articles */}
                <div className="bg-white border border-gray-100 p-6 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">🔥 Bài viết nổi bật</h3>
                    <div className="space-y-3">
                        {topArticles.map((a, i) => (
                            <div key={a.id} className="flex items-center gap-4 group p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                                <span className="text-xs font-bold text-gray-300 w-4">0{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">{a.title}</h4>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{a.views} lượt xem · {a.author.name}</p>
                                </div>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Top Content</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Users */}
                <div className="bg-white border border-gray-100 p-6 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">⭐ Người chia sẻ xuất sắc</h3>
                    <div className="space-y-3">
                        {topContributors.map((u, i) => (
                            <div key={u.name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                                <img src={u.avatar} className="w-8 h-8 rounded-full" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-gray-800">{u.name}</h4>
                                    <p className="text-[10px] text-gray-400">{u.role}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-900">{u.articles} bài</p>
                                    <p className="text-[10px] text-gray-400">{u.views.toLocaleString()} lượt xem</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
