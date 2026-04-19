import { Link } from "wouter";
import { AppLayout } from "@/components/layout/MarketingLayout";
import { BLOG_POSTS } from "@/data/blogPosts";
import { ArrowRight, Clock, Calendar } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "Lead Generation": "#00d1b2",
  "Cost & ROI": "#C9A84C",
  "Technology": "#a78bfa",
  "Buyer Experience": "#3b82f6",
};

export default function BlogPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
            style={{ color: "#00d1b2", borderColor: "rgba(0,209,178,0.3)", background: "rgba(0,209,178,0.08)" }}>
            INSIGHTS & STRATEGY
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Real Estate AI Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical insights for Australian real estate agencies on AI, lead generation, and staying ahead of the competition.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${BLOG_POSTS[0].slug}`}>
          <div className="group mb-8 rounded-2xl border border-border bg-card p-8 cursor-pointer hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.2)" }}>
                {BLOG_POSTS[0].heroEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: CATEGORY_COLORS[BLOG_POSTS[0].category] ?? "#00d1b2", background: (CATEGORY_COLORS[BLOG_POSTS[0].category] ?? "#00d1b2") + "15" }}>
                    {BLOG_POSTS[0].category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />{BLOG_POSTS[0].readTime}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{BLOG_POSTS[0].publishedDate}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{BLOG_POSTS[0].excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#00d1b2" }}>
                  Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Rest of posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(1).map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <div className="group h-full rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/40 transition-all duration-200 hover:shadow-md hover:shadow-primary/5 flex flex-col">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: (CATEGORY_COLORS[post.category] ?? "#00d1b2") + "15", border: `1px solid ${(CATEGORY_COLORS[post.category] ?? "#00d1b2")}30` }}>
                  {post.heroEmoji}
                </div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: CATEGORY_COLORS[post.category] ?? "#00d1b2", background: (CATEGORY_COLORS[post.category] ?? "#00d1b2") + "15" }}>
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h3 className="font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug flex-1">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold mt-auto" style={{ color: "#00d1b2" }}>
                  Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO blurb */}
        <div className="mt-16 p-6 rounded-xl border border-border bg-card text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Directive OS is an AI receptionist platform for Australian real estate agencies. We help agencies answer every call, capture every lead, and sync automatically with VaultRE — 24 hours a day.{" "}
            <Link href="/book" className="font-semibold hover:underline" style={{ color: "#00d1b2" }}>
              Book a free strategy call
            </Link>
            {" "}to see how it works for your agency.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
