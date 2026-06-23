import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import { type CategorySlug, isCategorySlug } from "./categories";
import { getAuthor, type Author } from "./authors";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface ArticleFrontmatter {
  title: string;
  description: string;
  category: CategorySlug;
  author: string;
  date: string;
  updated?: string;
  cover: string;
  coverAlt: string;
  excerpt: string;
  /** Surcharge facultative de l'image Open Graph (sinon : cover). */
  ogImage?: string;
  tags?: string[];
  featured?: boolean;
  faq?: FaqItem[];
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  /** Contenu MDX brut (sans frontmatter). */
  content: string;
  author: Author;
  readingMinutes: number;
  toc: TocItem[];
  /** Image Open Graph résolue (ogImage ?? cover). */
  ogImage: string;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: CategorySlug;
  date: string;
  updated?: string;
  cover: string;
  coverAlt: string;
  authorName: string;
  authorKey: string;
  readingMinutes: number;
  featured: boolean;
  tags: string[];
}

/** Extrait les titres H2/H3 du MDX pour construire la table des matières. */
function buildToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  const lines = content.split("\n");
  let inFence = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (/^(```|~~~)/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    // Nettoie le markdown inline éventuel (gras, liens) du titre.
    const title = match[2]
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();
    const id = slugger.slug(title);
    toc.push({ id, title, level });
  }
  return toc;
}

function coerceFrontmatter(data: Record<string, unknown>): ArticleFrontmatter {
  const fm = data as Partial<ArticleFrontmatter> & Record<string, unknown>;
  return {
    title: String(fm.title ?? "Sans titre"),
    description: String(fm.description ?? ""),
    category: (isCategorySlug(String(fm.category)) ? fm.category : "maison") as CategorySlug,
    author: String(fm.author ?? ""),
    date: normalizeDate(fm.date),
    updated: fm.updated ? normalizeDate(fm.updated) : undefined,
    cover: String(fm.cover ?? ""),
    coverAlt: String(fm.coverAlt ?? fm.title ?? ""),
    excerpt: String(fm.excerpt ?? fm.description ?? ""),
    ogImage: fm.ogImage ? String(fm.ogImage) : undefined,
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    featured: Boolean(fm.featured),
    faq: Array.isArray(fm.faq)
      ? (fm.faq as FaqItem[]).map((f) => ({
          question: String(f.question),
          answer: String(f.answer),
        }))
      : [],
  };
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").slice(0, 10);
}

let _cache: Article[] | null = null;

/** Lit et parse tous les articles MDX du dossier content/articles. */
export function getAllArticles(): Article[] {
  if (_cache) return _cache;

  if (!fs.existsSync(ARTICLES_DIR)) {
    _cache = [];
    return _cache;
  }

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const articles: Article[] = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { content, data } = matter(raw);
    const frontmatter = coerceFrontmatter(data);
    const stats = readingTime(content);

    return {
      slug,
      frontmatter,
      content,
      author: getAuthor(frontmatter.author),
      readingMinutes: Math.max(1, Math.round(stats.minutes)),
      toc: buildToc(content),
      ogImage: frontmatter.ogImage ?? frontmatter.cover,
    };
  });

  // Tri du plus récent au plus ancien.
  articles.sort((a, b) =>
    a.frontmatter.date < b.frontmatter.date ? 1 : -1,
  );

  _cache = articles;
  return articles;
}

function toSummary(a: Article): ArticleSummary {
  return {
    slug: a.slug,
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    excerpt: a.frontmatter.excerpt,
    category: a.frontmatter.category,
    date: a.frontmatter.date,
    updated: a.frontmatter.updated,
    cover: a.frontmatter.cover,
    coverAlt: a.frontmatter.coverAlt,
    authorName: a.author.name,
    authorKey: a.author.key,
    readingMinutes: a.readingMinutes,
    featured: Boolean(a.frontmatter.featured),
    tags: a.frontmatter.tags ?? [],
  };
}

export function getAllArticleSummaries(): ArticleSummary[] {
  return getAllArticles().map(toSummary);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: CategorySlug): ArticleSummary[] {
  return getAllArticleSummaries().filter((a) => a.category === category);
}

export function getLatestArticles(limit = 6): ArticleSummary[] {
  return getAllArticleSummaries().slice(0, limit);
}

export function getFeaturedArticles(limit = 3): ArticleSummary[] {
  const featured = getAllArticleSummaries().filter((a) => a.featured);
  const list = featured.length > 0 ? featured : getAllArticleSummaries();
  return list.slice(0, limit);
}

/**
 * Articles liés : même catégorie en priorité, complétés par les plus récents.
 */
export function getRelatedArticles(article: Article, limit = 3): ArticleSummary[] {
  const all = getAllArticleSummaries().filter((a) => a.slug !== article.slug);
  const sameCategory = all.filter(
    (a) => a.category === article.frontmatter.category,
  );
  const others = all.filter((a) => a.category !== article.frontmatter.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}
