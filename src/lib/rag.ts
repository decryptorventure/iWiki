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

export function retrieveScopedArticles(user: User, articles: Article[], query: string): RagCitation[] {
  const q = query.toLowerCase().trim();
  return articles
    .filter(a => a.status === 'published' && can(user, 'article.read', a))
    .map(article => {
      const haystack = `${article.title} ${article.content} ${article.tags.join(' ')}`.toLowerCase();
      const score = (article.title.toLowerCase().includes(q) ? 60 : 0)
        + (article.tags.some(t => t.toLowerCase().includes(q)) ? 25 : 0)
        + (haystack.includes(q) ? 15 : 0);
      return {
        articleId: article.id,
        title: article.title,
        snippet: (article.excerpt || article.content).slice(0, 160),
        score,
      };
    })
    .filter(c => c.score > 0)
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
  return {
    answer: `Dựa trên dữ liệu iWiki, thông tin phù hợp nhất cho "${query}" nằm trong "${top.title}". Tôi đã đính kèm nguồn để bạn kiểm chứng và mở tài liệu gốc.`,
    citations,
  };
}
