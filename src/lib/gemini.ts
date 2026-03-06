import { GoogleGenerativeAI } from "@google/generative-ai";
import { Article } from "../store/useAppStore";

// Get API Key from environment (defined in vite.config.ts)
const API_KEY = (window as any).process?.env?.GEMINI_API_KEY || "";

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Simplified RAG: Search for relevant articles based on keywords and similarity
 */
export function retrieveContext(query: string, articles: Article[]): Article[] {
    const q = query.toLowerCase();
    const searchTerms = q.split(/\s+/).filter(t => t.length > 2);

    return articles
        .map(article => {
            let score = 0;
            const title = article.title.toLowerCase();
            const content = article.content.toLowerCase();
            const tags = article.tags.map(t => t.toLowerCase());

            // Title match is weighted heavily
            if (title.includes(q)) score += 10;

            // Keyword matches
            searchTerms.forEach(term => {
                if (title.includes(term)) score += 5;
                if (content.includes(term)) score += 1;
                if (tags.some(t => t.includes(term))) score += 3;
            });

            return { article, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5) // Top 5 relevant articles
        .map(item => item.article);
}

/**
 * Generate AI response using Gemini with provided context
 */
export async function generateRAGResponse(
    query: string,
    context: Article[],
    onStream?: (text: string) => void
) {
    if (!genAI) {
        throw new Error("Gemini API Key is not configured. Please add GEMINI_API_KEY to your .env file.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const contextText = context.length > 0
        ? context.map((a, i) => `[Source ${i + 1}]: TITLE: ${a.title}\nCONTENT: ${a.content}`).join("\n\n")
        : "No relevant articles found in the internal knowledge base.";

    const prompt = `
You are iWiki AI, an intelligent assistant for iKame company. 
Your task is to answer user questions based ONLY on the provided internal context.
If the context doesn't contain the answer, say you don't know and suggest who to contact if possible.

INTERNAL CONTEXT:
${contextText}

USER QUESTION: ${query}

INSTRUCTIONS:
- Use a helpful, professional tone.
- Format your response using Markdown (bold, lists, headers).
- IMPORTANT: Cite your sources using numbers like [1], [2] at the end of sentences where appropriate.
- Keep the response concise but informative.
- Answer in the same language as the user question (default to Vietnamese if unsure).
`;

    try {
        const result = await model.generateContentStream(prompt);
        let fullText = "";

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            if (onStream) onStream(fullText);
        }

        return fullText;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
