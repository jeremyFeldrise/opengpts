import { MarkedOptions, marked } from "marked";
import DOMPurify from "dompurify";
import { cn } from "../utils/cn";

const OPTIONS: MarkedOptions = {
  gfm: true,
  breaks: true,
};

export function StringViewer(props: {
  value: string;
  className?: string;
  markdown?: boolean;
}) {
  return props.markdown ? (
    <div
      className={cn("text-base font-light", props.className)}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(props.value, OPTIONS)).trim(),
      }}
    />
  ) : (
    <div className={cn("text-base font-light", props.className)}>
      {props.value}
    </div>
  );
}
