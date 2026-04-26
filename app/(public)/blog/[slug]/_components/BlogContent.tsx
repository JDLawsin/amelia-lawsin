import Link from "next/link";
import clsx from "clsx";

type TipTapMark = {
  type: "bold" | "italic" | "underline" | "link" | "code";
  attrs?: { href?: string; target?: string };
};

type TipTapNodeAttrs = {
  level?: number;
  src?: string;
  alt?: string;
  title?: string;
  [key: string]: unknown;
};

type TipTapNode = {
  type: string;
  attrs?: TipTapNodeAttrs;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
};

type TipTapDoc = {
  type: "doc";
  content: TipTapNode[];
};

export const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const getNodeText = (node: TipTapNode): string => {
  if (node.text) return node.text;
  return node.content?.map(getNodeText).join("") ?? "";
};

const InlineText = ({ node }: { node: TipTapNode }) => {
  if (!node.text) return null;

  let content: React.ReactNode = node.text;

  node.marks?.forEach((mark) => {
    switch (mark.type) {
      case "bold":
        content = <strong className="font-semibold text-ink">{content}</strong>;
        break;
      case "italic":
        content = <em className="italic">{content}</em>;
        break;
      case "underline":
        content = <u className="underline">{content}</u>;
        break;
      case "code":
        content = (
          <code className="bg-cloud border border-wire px-1.5 py-0.5 rounded text-xs font-mono text-ink">
            {content}
          </code>
        );
        break;
      case "link":
        content = (
          <Link
            href={mark.attrs?.href ?? "#"}
            target={mark.attrs?.target ?? "_self"}
            className="text-ink underline underline-offset-2 hover:text-ash transition-colors"
          >
            {content}
          </Link>
        );
        break;
    }
  });

  return <>{content}</>;
};

const RenderNode = ({ node }: { node: TipTapNode }) => {
  switch (node.type) {
    case "heading": {
      const level = node.attrs?.level ?? 2;
      const text = getNodeText(node);
      const id = slugifyHeading(text);
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
      const styles: Record<number, string> = {
        1: "text-2xl font-serif font-medium text-ink mt-8 mb-4 leading-snug",
        2: "text-xl font-serif font-medium text-ink mt-8 mb-3 leading-snug",
        3: "text-base font-medium text-ink mt-6 mb-2",
        4: "text-sm font-medium text-ink mt-4 mb-2",
      };
      return (
        <Tag id={id} className={styles[level] ?? styles[2]}>
          {node.content?.map((child, i) => (
            <InlineText key={i} node={child} />
          ))}
        </Tag>
      );
    }

    case "paragraph":
      return (
        <p className="text-sm text-[#3d3d3f] leading-[1.85] mb-4">
          {node.content?.map((child, i) => (
            <InlineText key={i} node={child} />
          ))}
        </p>
      );

    case "bulletList":
      return (
        <ul className="list-disc list-outside pl-5 mb-4 space-y-2">
          {node.content?.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </ul>
      );

    case "orderedList":
      return (
        <ol className="list-decimal list-outside pl-5 mb-4 space-y-2">
          {node.content?.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </ol>
      );

    case "listItem":
      return (
        <li className="text-sm text-[#3d3d3f] leading-[1.85] pl-1">
          {node.content?.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </li>
      );

    case "blockquote":
      return (
        <blockquote className="border-l-[3px] border-ink bg-cloud rounded-r-xl px-5 py-4 my-5">
          {node.content?.map((child, i) => (
            <p key={i} className="text-sm text-ink italic leading-relaxed m-0">
              {child.content?.map((c, j) => (
                <InlineText key={j} node={c} />
              ))}
            </p>
          ))}
        </blockquote>
      );

    case "horizontalRule":
      return <hr className="border-wire my-8" />;

    case "hardBreak":
      return <br />;

    case "codeBlock":
      return (
        <pre className="bg-cloud border border-wire rounded-xl p-4 overflow-x-auto mb-4">
          <code className="text-xs font-mono text-ink leading-relaxed">
            {node.content?.map((child, i) => (
              <InlineText key={i} node={child} />
            ))}
          </code>
        </pre>
      );

    case "image":
      return node.attrs?.src ? (
        <figure className="my-6">
          <img
            src={node.attrs.src}
            alt={node.attrs.alt ?? ""}
            className="w-full rounded-xl border border-wire"
          />
          {node.attrs.title && (
            <figcaption className="text-xs text-fog text-center mt-2">
              {node.attrs.title}
            </figcaption>
          )}
        </figure>
      ) : null;

    default:
      return null;
  }
};

type BlogContentProps = {
  content: unknown;
};

const BlogContent = ({ content }: BlogContentProps) => {
  const doc = content as TipTapDoc;

  if (!doc?.content?.length) {
    return <p className="text-sm text-fog italic">No content available.</p>;
  }

  return (
    <article className="prose-custom">
      {doc.content.map((node, i) => (
        <RenderNode key={i} node={node} />
      ))}
    </article>
  );
};

export default BlogContent;
