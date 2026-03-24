import { Article } from '../store/useAppStore';
import { can } from './permissions';
import { User } from '../store/useAppStore';

export interface RagCitation {
  articleId: string;
  title: string;
  snippet: string;
  score: number;
}

export interface RagAnswer {
  answer: string;
  citations: RagCitation[];
}

const SYNONYM_MAP: Record<string, string[]> = {
  onboarding: ['nhan su moi', 'onboard', 'onboarding', 'new hire'],
  quytrinh: ['quy trinh', 'sop', 'process', 'playbook'],
  nghiphep: ['nghi phep', 'pto', 'leave'],
  baocao: ['bao cao', 'report', 'weekly'],
  product: ['prd', 'product', 'okrs'],
  kythuat: ['tech', 'engineering', 'frontend', 'backend', 'devops'],
};

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandQueryTokens(query: string): string[] {
  const normalized = normalize(query);
  const tokens = new Set(normalized.split(' ').filter(Boolean));
  Object.entries(SYNONYM_MAP).forEach(([key, variants]) => {
    if (variants.some((variant) => normalized.includes(variant))) {
      tokens.add(key);
      variants.forEach((variant) => tokens.add(variant));
    }
  });
  return Array.from(tokens);
}

export function retrieveScopedArticles(user: User, articles: Article[], query: string): RagCitation[] {
  const q = normalize(query);
  const queryTokens = expandQueryTokens(query);
  const now = Date.now();

  return articles
    .filter(a => a.status === 'published' && can(user, 'article.read', a))
    .map(article => {
      const normalizedTitle = normalize(article.title);
      const normalizedTags = article.tags.map((tag) => normalize(tag));
      const normalizedContent = normalize(article.content);
      const haystack = `${normalizedTitle} ${normalizedContent} ${normalizedTags.join(' ')}`;
      const tokenHits = queryTokens.filter((token) => haystack.includes(token)).length;
      const titleHit = normalizedTitle.includes(q) || queryTokens.some((token) => normalizedTitle.includes(token));
      const tagHit = normalizedTags.some((tag) => queryTokens.some((token) => tag.includes(token)));
      const contentHit = queryTokens.some((token) => normalizedContent.includes(token));
      const recencyDays = (now - new Date(article.updatedAt).getTime()) / (24 * 60 * 60 * 1000);
      const recencyScore = recencyDays < 30 ? 10 : recencyDays < 120 ? 6 : 2;
      const popularityScore = Math.min(10, Math.round((article.views + article.likes * 3) / 500));

      const score = (titleHit ? 52 : 0)
        + (tagHit ? 24 : 0)
        + (contentHit ? 12 : 0)
        + Math.min(12, tokenHits * 3)
        + recencyScore
        + popularityScore;
      return {
        articleId: article.id,
        title: article.title,
        snippet: (article.excerpt || article.content).slice(0, 160),
        score: Math.min(99, score),
      };
    })
    .filter(c => c.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function generateRagAnswer(user: User, articles: Article[], query: string): RagAnswer {
  const citations = retrieveScopedArticles(user, articles, query);
  if (citations.length === 0) {
    return {
      answer: `Không tìm thấy tri thức phù hợp với "${query}" trong phạm vi quyền truy cập hiện tại.`,
      citations: [],
    };
  }

  const top = citations[0];
  const confidence = top.score >= 80 ? 'rất cao' : top.score >= 60 ? 'cao' : 'trung bình';
  return {
    answer: `Dựa trên semantic matching của iWiki, kết quả phù hợp nhất cho "${query}" là "${top.title}" (độ tin cậy ${confidence}). Tôi đã xếp hạng các nguồn liên quan và đính kèm citation để bạn kiểm chứng ngay.`,
    citations,
  };
}
