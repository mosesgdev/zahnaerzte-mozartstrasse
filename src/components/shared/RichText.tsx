import Markdown, { defaultUrlTransform, type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";

/** Default safe protocols (http/https/mailto, relative) plus phone links. */
function urlTransform(url: string) {
  return /^tel:[+\d\s()/-]+$/i.test(url) ? url : defaultUrlTransform(url);
}

/**
 * Only numbered lists counting 1, 2, 3 … are lists. Other lines starting with
 * a number and a dot (dates such as "24. Dezember") stay text — otherwise
 * Markdown would renumber "24. / 31. Dezember" to "24. / 25.".
 */
function escapeDateLines(source: string): string {
  let expected = 1;
  return source
    .split("\n")
    .map((line) => {
      const match = /^( {0,3})(\d{1,9})([.)])(\s|$)/.exec(line);
      if (!match) {
        if (line.trim() && !/^\s/.test(line)) expected = 1;
        return line;
      }
      const number = Number(match[2]);
      if (number === 1 || number === expected) {
        expected = number + 1;
        return line;
      }
      return `${match[1]}${match[2]}\\${line.slice(match[1].length + match[2].length)}`;
    })
    .join("\n");
}

/**
 * Renders admin-edited text as Markdown: **fett**, *kursiv*, Listen, Links,
 * Zwischenüberschriften (## / ###). A blank line starts a new paragraph, a
 * single line break stays a line break (remark-breaks). Raw HTML is never
 * rendered (react-markdown default: shown as text) and unsafe link protocols
 * (javascript: etc.) are removed by its default URL transform.
 */
export function RichText({
  text,
  className,
  paragraphClassName,
}: {
  text: string | string[] | undefined;
  className?: string;
  paragraphClassName?: string;
}) {
  const source = escapeDateLines(
    (Array.isArray(text) ? text.join("\n\n") : (text ?? "")).trim(),
  );
  if (!source) return null;

  const components: Components = {
    p: ({ children }) => <p className={paragraphClassName}>{children}</p>,
    ul: ({ children }) => (
      <ul className={cn(paragraphClassName, "list-disc space-y-1 pl-5")}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className={cn(paragraphClassName, "list-decimal space-y-1 pl-5")}>{children}</ol>
    ),
    // Page headings stay with the page; Markdown headings become sub-headings.
    h1: ({ children }) => (
      <h3 className={cn(paragraphClassName, "font-semibold")}>{children}</h3>
    ),
    h2: ({ children }) => (
      <h3 className={cn(paragraphClassName, "font-semibold")}>{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className={cn(paragraphClassName, "font-semibold")}>{children}</h4>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    a: ({ href, children }) => {
      const external = Boolean(href && /^https?:\/\//.test(href));
      return (
        <a
          href={href}
          className="font-medium underline underline-offset-4 hover:opacity-80"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
    img: () => null,
  };

  return (
    <div className={className}>
      <Markdown remarkPlugins={[remarkBreaks]} components={components} urlTransform={urlTransform}>
        {source}
      </Markdown>
    </div>
  );
}
