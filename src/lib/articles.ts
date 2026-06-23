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
  /** Page pilier SEO (dossier de fond, tête de silo). */
  pillar?: boolean;
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
  pillar: boolean;
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
    pillar: Boolean(fm.pillar),
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
    pillar: Boolean(a.frontmatter.pillar),
    tags: a.frontmatter.tags ?? [],
  };
}

export function getAllArticleSummaries(): ArticleSummary[] {
  return getAllArticles().map(toSummary);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

/**
 * Articles d'une catégorie. Les pages piliers sont exclues par défaut
 * (elles sont mises en avant séparément), mais conservées dans le sitemap
 * et la recherche via getAllArticles().
 */
export function getArticlesByCategory(
  category: CategorySlug,
  { includePillars = false } = {},
): ArticleSummary[] {
  return getAllArticleSummaries().filter(
    (a) => a.category === category && (includePillars || !a.pillar),
  );
}

export function getLatestArticles(limit = 6): ArticleSummary[] {
  return getAllArticleSummaries()
    .filter((a) => !a.pillar)
    .slice(0, limit);
}

export function getFeaturedArticles(limit = 3): ArticleSummary[] {
  const featured = getAllArticleSummaries().filter(
    (a) => a.featured && !a.pillar,
  );
  const list =
    featured.length > 0
      ? featured
      : getAllArticleSummaries().filter((a) => !a.pillar);
  return list.slice(0, limit);
}

/** Toutes les pages piliers (dossiers de fond), les plus récentes d'abord. */
export function getPillars(limit?: number): ArticleSummary[] {
  const pillars = getAllArticleSummaries().filter((a) => a.pillar);
  return typeof limit === "number" ? pillars.slice(0, limit) : pillars;
}

/** Le pilier d'une catégorie (le plus récent s'il y en a plusieurs). */
export function getPillarForCategory(
  category: CategorySlug,
): ArticleSummary | undefined {
  return getAllArticleSummaries().find((a) => a.pillar && a.category === category);
}

/** Résout une liste de slugs en résumés d'articles (ordre préservé). */
export function getSummariesBySlugs(slugs: string[]): ArticleSummary[] {
  const all = getAllArticleSummaries();
  return slugs
    .map((slug) => all.find((a) => a.slug === slug))
    .filter((a): a is ArticleSummary => Boolean(a));
}

/**
 * Articles liés : on privilégie d'abord les articles du même silo,
 * puis la même catégorie, puis les plus récents — afin de renforcer
 * la cohérence thématique et la circulation du maillage interne.
 */
export function getRelatedArticles(
  article: Article,
  limit = 3,
  preferredSlugs: string[] = [],
): ArticleSummary[] {
  const all = getAllArticleSummaries().filter(
    (a) => a.slug !== article.slug && !a.pillar,
  );
  const ordered: ArticleSummary[] = [];
  const pushUnique = (items: ArticleSummary[]) => {
    for (const it of items) {
      if (!ordered.some((o) => o.slug === it.slug)) ordered.push(it);
    }
  };
  pushUnique(all.filter((a) => preferredSlugs.includes(a.slug)));
  pushUnique(all.filter((a) => a.category === article.frontmatter.category));
  pushUnique(all);
  return ordered.slice(0, limit);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}
