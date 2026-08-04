import { Button } from "@/components/ui/shadcn/button";
import Link from "next/link";

const BlogNotFound = () => (
  <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
    <div className="w-16 h-16 bg-cloud border border-wire rounded-full flex items-center justify-center mb-5">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#86868b"
        strokeWidth="1.5"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    </div>
    <h1 className="text-xl font-serif font-medium text-ink mb-2">
      Article not found
    </h1>
    <p className="text-sm text-ash max-w-xs mb-6">
      This article may have been removed or the link may be incorrect.
    </p>
    <div className="flex gap-3">
      <Button
        asChild
        className="bg-ink text-white hover:bg-ink/90 rounded-full"
      >
        <Link href="/blog">Browse all articles</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="border-wire text-ink hover:bg-cloud rounded-full"
      >
        <Link href="/properties">View properties</Link>
      </Button>
    </div>
  </main>
);

export default BlogNotFound;
