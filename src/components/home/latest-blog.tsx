import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { RepCounter } from "@/components/ui/rep-counter";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";

const posts = [
  {
    slug: "how-much-protein-do-you-actually-need",
    title: "How Much Protein Do You Actually Need? A Kenyan Lifter's Guide",
    excerpt: "Grams per kg, how to hit your target on ugali-and-beans, and the real cost per 20g of protein across local sources.",
    category: "Nutrition",
    readingMinutes: 8,
    date: "2026-09-01",
  },
  {
    slug: "progressive-overload-the-only-training-principle-that-matters",
    title: "Progressive Overload: The Only Training Principle That Matters",
    excerpt: "The five ways to progress, how to run a linear progression, and when to deload. Everything else is noise.",
    category: "Training",
    readingMinutes: 7,
    date: "2026-08-25",
  },
  {
    slug: "eating-for-fat-loss-without-giving-up-kenyan-food",
    title: "Eating for Fat Loss Without Giving Up Kenyan Food",
    excerpt: "You don't need to quit chapati. You need to understand portions, protein, and planning.",
    category: "Nutrition",
    readingMinutes: 9,
    date: "2026-08-18",
  },
];

export function LatestBlog() {
  return (
    <section className="section-spacing">
      <div className="container-gymist">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <RepCounter index="10" label="BLOG" />
              <h2>Latest from the blog.</h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-iron transition-colors"
            >
              All articles
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded overflow-hidden border border-ink/5 hover:border-ink/10 transition-all hover:-translate-y-1"
              >
                <div className="aspect-[16/9] bg-charcoal relative overflow-hidden">
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/80 bg-ink/50 px-2 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base mb-2 group-hover:text-iron transition-colors font-heading line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-iron text-sm line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-iron/50">
                    <span className="font-mono flex items-center gap-1">
                      <Clock size={12} />
                      {post.readingMinutes} min
                    </span>
                    <span>
                      {new Date(post.date).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
