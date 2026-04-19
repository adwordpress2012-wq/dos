import { Link, useParams } from "wouter";
import { AppLayout } from "@/components/layout/MarketingLayout";
import { getBlogPost, BlogSection } from "@/data/blogPosts";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";

const CALENDLY = "https://calendly.com/adwordpress2012/directive-os-agency-onboarding";

const CATEGORY_COLORS: Record<string, string> = {
  "Lead Generation": "#00d1b2",
  "Cost & ROI": "#C9A84C",
  "Technology": "#a78bfa",
  "Buyer Experience": "#3b82f6",
};

function renderMd(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-foreground font-semibold">{part}</strong> : <span key={i}>{part}</span>
  );
}

function Section({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "h2":
      return <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{section.content}</h2>;
    case "h3":
      return <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{section.content}</h3>;
    case "p":
      return <p className="text-muted-foreground leading-relaxed mb-5 text-[15px]">{renderMd(section.content ?? "")}</p>;
    case "ul":
      return (
        <ul className="mb-6 space-y-2.5">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-muted-foreground leading-relaxed">
              <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "#00d1b2" }} />
              {renderMd(item)}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div className="my-8 rounded-xl border p-5 text-sm leading-relaxed"
          style={{ borderColor: "rgba(0,209,178,0.3)", background: "rgba(0,209,178,0.06)", color: "#00d1b2" }}>
          <strong className="block mb-1 text-foreground font-semibold">Directive OS</strong>
          {section.content}
        </div>
      );
    case "cta":
      return (
        <div className="my-8 rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground mb-4 text-sm">{section.content}</p>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg transition-all hover:opacity-90 text-sm"
            style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a" }}
          >
            Book Free Strategy Call <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const post = getBlogPost(params.slug);

  if (!post) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <Link href="/blog" className="text-primary hover:underline">← Back to blog</Link>
        </div>
      </AppLayout>
    );
  }

  const catColor = CATEGORY_COLORS[post.category] ?? "#00d1b2";

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Blog
        </Link>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ color: catColor, background: catColor + "15" }}>
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />{post.readTime}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />{post.publishedDate}
            </span>
          </div>

          <div className="flex items-start gap-5 mb-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: catColor + "15", border: `1px solid ${catColor}30` }}>
              {post.heroEmoji}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{post.title}</h1>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed border-l-2 pl-4 italic" style={{ borderColor: catColor }}>
            {post.excerpt}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Body */}
        <article>
          {post.body.map((section, i) => (
            <Section key={i} section={section} />
          ))}
        </article>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.2)" }}>
            <p className="text-xs font-semibold tracking-wider mb-3" style={{ color: "#00d1b2" }}>DIRECTIVE OS</p>
            <h3 className="text-2xl font-bold text-foreground mb-3">Ready to stop missing leads?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Book a free 15-minute strategy call. We'll show you exactly how AI reception works for your agency and what your ROI looks like.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg transition-all hover:opacity-90 text-sm"
                style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a" }}
              >
                Book Free Strategy Call <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← More articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
