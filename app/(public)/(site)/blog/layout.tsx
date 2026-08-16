import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": [
        {
          url: "/feed.xml",
          title: "Amelia Lawsin Real Estate Blog",
        },
      ],
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
