import React, { ComponentType, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, AlertTriangle, FolderOpen, Eye, Users, ShieldCheck, Download, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can, getScopeLevel } from '../lib/permissions';
import { AccessLevel } from '../store/useAppStore';
import { useToast } from '../App';
import { Button, Input, Select } from '@frontend-team/ui-kit';

type ContributorStat = { name: string; score: number; published: number; inReview: number };
type ReportPeriod = 'week' | 'month';

export default function ManagerDashboard() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();

  const [spaceFilter, setSpaceFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('week');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [lineComment, setLineComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const scopedArticles = useMemo(
    () => state.articles.filter((a) => can(state.currentUser, 'article.read', a)),
    [state.articles, state.currentUser]
  );
  const allFolders = useMemo(() => state.folders.flatMap((f) => [f, ...(f.children || [])]), [state.folders]);
  const teamOptions = useMemo(
    () => ['all', ...Array.from(new Set(scopedArticles.map((a) => getTeamFromRole(a.author.role))))],
    [scopedArticles]
  );

  const filteredArticles = useMemo(() => {
    return scopedArticles.filter((article) => {
      const bySpace = spaceFilter === 'all' || article.folderId === spaceFilter;
      const byTeam = teamFilter === 'all' || getTeamFromRole(article.author.role) === teamFilter;
      return bySpace && byTeam;
    });
  }, [scopedArticles, spaceFilter, teamFilter]);

  const reviewQueue = filteredArticles.filter((a) => a.status === 'in_review');
  const published = filteredArticles.filter((a) => a.status === 'published');
  const draft = filteredArticles.filter((a) => a.status === 'draft');
  const needUpdate = filteredArticles.filter((a) => a.status === 'rejected' || isOldArticle(a.updatedAt));
  const outdatedArticles = filteredArticles.filter((a) => isOldArticle(a.updatedAt)).slice(0, 6);
  const topViewed = [...published].sort((a, b) => b.views - a.views).slice(0, 5);

  const topContributors = useMemo(() => {
    const map = filteredArticles.reduce<Record<string, ContributorStat>>((acc, article) => {
      const key = article.author.id;
      if (!acc[key]) acc[key] = { name: article.author.name, score: 0, published: 0, inReview: 0 };
      if (article.status === 'published') {
        acc[key].published += 1;
        acc[key].score += article.views + article.likes * 2;
      }
      if (article.status === 'in_review') {
        acc[key].inReview += 1;
        acc[key].score += 20;
      }
      return acc;
    }, {});
    return (Object.values(map) as ContributorStat[]).sort((a, b) => b.score - a.score).slice(0, 5);
  }, [filteredArticles]);

  useEffect(() => {
    if (reviewQueue.length === 0) {
      setSelectedReviewId(null);
      return;
    }
    if (!selectedReviewId || !reviewQueue.some((a) => a.id === selectedReviewId)) {
      setSelectedReviewId(reviewQueue[0].id);
      setSelectedLine(null);
    }
  }, [reviewQueue, selectedReviewId]);

  const selectedReview = reviewQueue.find((a) => a.id === selectedReviewId) || null;
  const reviewLines = useMemo(() => selectedReview?.content.split('\n') || [], [selectedReview]);
  const reviewComments = selectedReview?.approval?.comments || [];

  const reportFromDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - (reportPeriod === 'week' ? 7 : 30));
    d.setHours(0, 0, 0, 0);
    return d;
  }, [reportPeriod]);
  const reportScopeArticles = filteredArticles.filter((a) => new Date(a.updatedAt) >= reportFromDate);
  const reportPublished = reportScopeArticles.filter((a) => a.status === 'published').length;
  const reportInReview = reportScopeArticles.filter((a) => a.status === 'in_review').length;
  const reportNeedUpdate = reportScopeArticles.filter((a) => a.status === 'rejected' || isOldArticle(a.updatedAt)).length;
  const reportAvgViews = reportPublished
    ? Math.round(reportScopeArticles.filter((a) => a.status === 'published').reduce((sum, a) => sum + a.views, 0) / reportPublished)
    : 0;

  const handleExportReport = () => {
    const lines = [
      ['iWiki Manager Report'],
      [`Period,${reportPeriod === 'week' ? '7 ngày' : '30 ngày'}`],
      [`Space,${spaceFilter}`],
      [`Team,${teamFilter}`],
      [`Generated At,${new Date().toISOString()}`],
      [''],
      ['Metric,Value'],
      [`Draft,${draft.length}`],
      [`In Review,${reviewQueue.length}`],
      [`Published,${published.length}`],
      [`Need Update,${needUpdate.length}`],
      [`Published in period,${reportPublished}`],
      [`In Review in period,${reportInReview}`],
      [`Need Update in period,${reportNeedUpdate}`],
      [`Average views in period,${reportAvgViews}`],
      [''],
      ['Top Viewed,Views'],
      ...topViewed.map((a) => [toCsv(a.title), `${a.views}`]),
      [''],
      ['Top Contributor,Score,Published,In Review'],
      ...topContributors.map((u) => [toCsv(u.name), `${u.score}`, `${u.published}`, `${u.inReview}`]),
    ].map((row) => row.join(','));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `iwiki-manager-report-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Đã xuất báo cáo CSV', 'success');
  };

  const createLifecycleBounty = (articleId: string, title: string) => {
    dispatch({
      type: 'CREATE_BOUNTY',
      bounty: {
        id: `b-lifecycle-${Date.now()}-${articleId}`,
        title: `[Lifecycle] Cập nhật bài: ${title}`,
        description: 'Bài viết đã quá hạn cập nhật. Cần rà soát quy trình và bổ sung thông tin mới.',
        requester: state.currentUser.name,
        requesterId: state.currentUser.id,
        reward: 250,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['Lifecycle', 'Audit'],
        hot: true,
        acceptedBy: [],
        status: 'open',
        createdAt: new Date().toISOString().split('T')[0],
      },
    });
    addToast('Đã tạo bounty cập nhật nội dung', 'success');
  };

  if (!can(state.currentUser, 'manager.access') && state.currentUser.role !== 'admin') {
    return <div className="h-full flex items-center justify-center text-gray-500">Bạn không có quyền truy cập Manager View.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Knowledge Manager Control Center</h1>
      <p className="text-gray-500 mb-8">Duyệt bài theo dòng, lọc theo team/space và theo dõi hiệu quả tri thức tập trung.</p>

      <section className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <SelectControl
            label="Lọc theo Space"
            value={spaceFilter}
            onChange={setSpaceFilter}
            options={[{ value: 'all', label: 'Tất cả Space' }, ...allFolders.map((f) => ({ value: f.id, label: f.name }))]}
          />
          <SelectControl
            label="Lọc theo Team"
            value={teamFilter}
            onChange={setTeamFilter}
            options={teamOptions.map((team) => ({ value: team, label: team === 'all' ? 'Tất cả Team' : team }))}
          />
          <SelectControl
            label="Chu kỳ báo cáo"
            value={reportPeriod}
            onChange={(v) => setReportPeriod(v as ReportPeriod)}
            options={[
              { value: 'week', label: '7 ngày' },
              { value: 'month', label: '30 ngày' },
            ]}
          />
          <div className="flex items-end">
            <Button variant="primary" size="s" onClick={handleExportReport} className="w-full justify-center">
              <Download size={16} /> Xuất báo cáo CSV
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card icon={Clock3} label="Chờ duyệt" value={reviewQueue.length} />
        <Card icon={FolderOpen} label="Nháp" value={draft.length} />
        <Card icon={CheckCircle2} label="Đã đăng" value={published.length} />
        <Card icon={AlertTriangle} label="Cần cập nhật" value={needUpdate.length} />
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Optimized Approval Workflow</h2>
        {reviewQueue.length === 0 || !selectedReview ? (
          <p className="text-sm text-gray-500">Không có bài nào chờ duyệt trong bộ lọc hiện tại.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-4 space-y-2">
              {reviewQueue.map((article) => (
                <button
                  key={article.id}
                  onClick={() => {
                    setSelectedReviewId(article.id);
                    setSelectedLine(null);
                  }}
                  className={`w-full text-left p-3 border rounded-xl transition ${selectedReviewId === article.id ? 'border-orange-300 bg-orange-50/40' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="font-semibold text-gray-900 line-clamp-2">{article.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{article.author.name} • {article.folderName || article.folderId}</div>
                </button>
              ))}
            </div>
            <div className="xl:col-span-8 border border-gray-100 rounded-xl">
              <div className="max-h-72 overflow-y-auto p-3 space-y-1 bg-gray-50/40">
                {reviewLines.map((line, idx) => (
                  <button
                    key={`${selectedReview.id}-${idx}`}
                    onClick={() => setSelectedLine(idx + 1)}
                    className={`w-full text-left flex gap-3 px-3 py-2 rounded-lg transition ${selectedLine === idx + 1 ? 'bg-orange-100/70 border border-orange-200' : 'hover:bg-white border border-transparent'}`}
                  >
                    <span className="text-xs text-gray-400 w-8 shrink-0">{idx + 1}</span>
                    <span className="text-sm text-gray-700 whitespace-pre-wrap">{line || ' '}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <Input
                    value={lineComment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLineComment(e.target.value)}
                    placeholder={selectedLine ? `Feedback dòng ${selectedLine}` : 'Chọn dòng cần feedback'}
                    className="flex-1"
                  />
                  <Button size="s" variant="primary" onClick={() => {
                      if (!selectedLine || !lineComment.trim()) return;
                      dispatch({
                        type: 'ADD_APPROVAL_COMMENT',
                        articleId: selectedReview.id,
                        comment: {
                          id: `ac-${Date.now()}`,
                          lineNumber: selectedLine,
                          quote: reviewLines[selectedLine - 1] || '',
                          content: lineComment.trim(),
                          authorId: state.currentUser.id,
                          authorName: state.currentUser.name,
                          createdAt: new Date().toISOString(),
                        },
                      });
                      setLineComment('');
                      addToast('Đã lưu feedback theo dòng', 'success');
                    }}>
                    Lưu feedback
                  </Button>
                </div>
                {reviewComments.length > 0 && (
                  <div className="mt-3 max-h-36 overflow-y-auto space-y-2">
                    {reviewComments.map((item) => (
                      <div key={item.id} className="p-2 rounded-lg border border-gray-100 bg-white text-sm text-gray-700">
                        Dòng {item.lineNumber}: {item.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-2">
                <Input
                  value={rejectReason}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRejectReason(e.target.value)}
                  placeholder="Lý do từ chối (nếu có)"
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Button size="s" className="bg-green-500 hover:bg-green-600 text-white border-0"
                    onClick={() => {
                      dispatch({ type: 'APPROVE_ARTICLE', articleId: selectedReview.id, approverId: state.currentUser.id });
                      dispatch({ type: 'TRACK_EVENT', event: { type: 'approve', userId: state.currentUser.id, articleId: selectedReview.id } });
                      addToast('Đã duyệt bài viết', 'success');
                    }}>
                    Duyệt bài
                  </Button>
                  <Button variant="border" size="s"
                    onClick={() => {
                      const reason = rejectReason.trim() || 'Cần cập nhật theo feedback chi tiết.';
                      dispatch({ type: 'REJECT_ARTICLE', articleId: selectedReview.id, approverId: state.currentUser.id, reason });
                      dispatch({ type: 'TRACK_EVENT', event: { type: 'reject', userId: state.currentUser.id, articleId: selectedReview.id } });
                      setRejectReason('');
                      addToast('Đã từ chối và gửi lại cho tác giả', 'warning');
                    }}>
                    Từ chối
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <InfoList title="Top bài viết được đọc nhiều" icon={Eye} items={topViewed.map((a) => `${a.title}||${a.views.toLocaleString()} lượt`)} />
        <InfoList title="Thành viên đóng góp tích cực" icon={Users} items={topContributors.map((u) => `${u.name}||${u.published} đã đăng • ${u.inReview} chờ duyệt`)} />
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-5 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Báo cáo hiệu quả tri thức ({reportPeriod === 'week' ? '7 ngày' : '30 ngày'})</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Kpi label="Bài đã đăng trong kỳ" value={reportPublished} />
          <Kpi label="Bài vào hàng chờ duyệt" value={reportInReview} />
          <Kpi label="Bài cần cập nhật" value={reportNeedUpdate} />
          <Kpi label="Lượt xem TB/bài đã đăng" value={reportAvgViews} />
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-5 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          Simplified Permission (Role-based cho Space & Bài viết)
        </h2>
        <p className="text-sm text-gray-500 mb-4">Thiết lập trực quan theo vai trò: phân quyền theo không gian lưu trữ và quyền xem theo từng bài viết.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Role guide nhanh</h3>
            <div className="space-y-2 mb-4">
              {ROLE_GUIDE.map((role) => (
                <div key={role.role} className="p-3 rounded-xl border border-gray-100 bg-gray-50/40">
                  <div className="font-semibold text-sm text-gray-900">{role.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{role.capability}</div>
                </div>
              ))}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phân quyền Space (theo scope manager)</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {allFolders.map((folder) => (
                <div key={folder.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg p-2">
                  <div className="text-sm text-gray-700">{folder.name}</div>
                  <Select
                    options={LEVEL_OPTIONS}
                    value={getScopeLevel(state.currentUser, folder.id)}
                    onValueChange={(v) => {
                      dispatch({ type: 'SET_SCOPE_ACCESS', folderId: folder.id, level: v as AccessLevel });
                      addToast(`Đã cập nhật quyền cho ${folder.name}`, 'info');
                    }}
                    size="xs"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Phân quyền theo từng bài viết</h3>
            <div className="space-y-2 max-h-[430px] overflow-y-auto pr-1">
              {filteredArticles.slice(0, 20).map((article) => (
                <div key={article.id} className="border border-gray-100 rounded-lg p-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-gray-800 truncate">{article.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{article.folderName || article.folderId}</div>
                  </div>
                  <Select
                    options={[{ value: 'public', label: 'Công khai' }, { value: 'restricted', label: 'Hạn chế' }]}
                    value={article.viewPermission}
                    onValueChange={(v) => {
                      dispatch({ type: 'SET_ARTICLE_VIEW_PERMISSION', articleId: article.id, viewPermission: v as 'public' | 'restricted' });
                      addToast(`Đã cập nhật quyền xem bài: ${article.title}`, 'info');
                    }}
                    size="xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-5 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Content lifecycle (bài quá hạn cập nhật)</h2>
        {outdatedArticles.length === 0 ? (
          <p className="text-sm text-gray-500">Không có bài nào quá 180 ngày trong bộ lọc hiện tại.</p>
        ) : (
          <div className="space-y-2">
            {outdatedArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{article.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Cập nhật lần cuối: {article.updatedAt}</p>
                </div>
                <Button size="s" variant="primary" onClick={() => createLifecycleBounty(article.id, article.title)}>
                  <Target size={14} /> Tạo bounty
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const LEVEL_OPTIONS: { value: AccessLevel; label: string }[] = [
  { value: 'none', label: 'Không quyền' },
  { value: 'read', label: 'Chỉ xem' },
  { value: 'write', label: 'Chỉnh sửa' },
  { value: 'approve', label: 'Duyệt bài' },
  { value: 'admin', label: 'Toàn quyền' },
];

const ROLE_GUIDE = [
  { role: 'viewer', label: 'Viewer', capability: 'Chỉ đọc nội dung được cấp quyền.' },
  { role: 'editor', label: 'Editor', capability: 'Viết/chỉnh sửa và gửi bài chờ duyệt.' },
  { role: 'manager', label: 'Manager', capability: 'Duyệt bài, phản hồi chi tiết và quản trị quality của team.' },
  { role: 'admin', label: 'Admin', capability: 'Toàn quyền hệ thống và cấu hình phân quyền.' },
];

function Card({ icon: Icon, label, value }: { icon: ComponentType<{ size?: number; className?: string }>; label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <Icon size={16} className="text-gray-400" />
      </div>
      <div className="text-2xl font-extrabold text-gray-900 mt-2">{value}</div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/40">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-extrabold text-gray-900 mt-1">{value.toLocaleString()}</div>
    </div>
  );
}

function SelectControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
      <Select options={options} value={value} onValueChange={onChange} size="s" className="w-full" />
    </div>
  );
}

function InfoList({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  items: string[];
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon size={18} className="text-indigo-500" />
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Chưa có dữ liệu.</p>
      ) : (
        <div className="space-y-2">
          {items.map((line, idx) => {
            const [left, right] = line.split('||');
            return (
              <div key={`${left}-${idx}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="text-sm text-gray-700">
                  <span className="text-gray-400 mr-2">#{idx + 1}</span>
                  {left}
                </div>
                <div className="text-xs text-gray-500">{right}</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function getTeamFromRole(role: string): string {
  const normalized = role.toLowerCase();
  if (normalized.includes('product')) return 'Product';
  if (normalized.includes('hr') || normalized.includes('chro')) return 'HR';
  if (normalized.includes('frontend') || normalized.includes('fe')) return 'Frontend';
  if (normalized.includes('backend') || normalized.includes('be')) return 'Backend';
  if (normalized.includes('devops')) return 'DevOps';
  if (normalized.includes('qa')) return 'QA';
  return 'General';
}

function isOldArticle(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() > 180 * 24 * 60 * 60 * 1000;
}

function toCsv(text: string): string {
  return `"${text.replace(/"/g, '""')}"`;
}
