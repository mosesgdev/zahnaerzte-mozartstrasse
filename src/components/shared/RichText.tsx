import { Fragment } from "react";
import { splitParagraphs } from "@/lib/text";

/**
 * Renders admin-edited plain text: blank lines become separate <p>, single
 * line breaks become <br>. Content is rendered as React text (escaped), so
 * HTML in the input is shown literally and never executed.
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
  const paragraphs = (Array.isArray(text) ? text : [text ?? ""]).flatMap(
    splitParagraphs,
  );
  if (paragraphs.length === 0) return null;

  return (
    <div className={className}>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={paragraphClassName}>
          {paragraph.split("\n").map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
