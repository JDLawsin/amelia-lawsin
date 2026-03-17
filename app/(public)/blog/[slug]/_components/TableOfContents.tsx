"use client";

// app/(public)/blog/[slug]/_components/TableOfContents.tsx

import { useState, useEffect } from "react";
import clsx from "clsx";
import { slugifyHeading } from "./BlogContent";

type TipTapNode = {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
};

type Heading = {
  level: number;
  text: string;
  id: string;
};

type TableOfContentsProps = {
  content: unknown;
};

const getNodeText = (node: TipTapNode): string => {
  if (node.text) return node.text;
  return node.content?.map(getNodeText).join("") ?? "";
};

const extractHeadings = (content: unknown): Heading[] => {
  const doc = content as { type: string; content?: TipTapNode[] };
  if (!doc?.content) return [];

  return doc.content
    .filter((node) => node.type === "heading")
    .map((node) => {
      const text = getNodeText(node);
      return {
        level: node.attrs?.level ?? 2,
        text,
        id: slugifyHeading(text),
      };
    });
};

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-10% 0% -80% 0%",
        threshold: 0,
      },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!headings.length) return null;

  return (
    <div className="bg-cloud rounded-xl p-4">
      <p className="text-xs font-medium text-ink mb-3">Table of contents</p>
      <nav className="flex flex-col">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={clsx(
              "text-left py-2 transition-colors",
              "flex items-center gap-2 text-xs",
              heading.level === 3 && "pl-3",
              heading.level >= 4 && "pl-5",
              activeId === heading.id
                ? "text-ink font-medium"
                : "text-ash hover:text-ink",
            )}
          >
            <span
              className={clsx(
                "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors",
                activeId === heading.id ? "bg-ink" : "bg-wire",
              )}
            />
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
