"use client";

import { Loader2, Search } from "lucide-react";
import clsx from "clsx";
import { useCallback, useId, type KeyboardEvent } from "react";
import useDebouncedQueryParam from "@/hooks/useDebouncedQueryParam";
import { Input } from "@/components/ui/shadcn/input";

type Props = {
  initialQuery?: string;
};

const BlogSearchBar = ({ initialQuery }: Props) => {
  const inputId = useId();

  const { value, setValue, isPending, clear, hasValue } =
    useDebouncedQueryParam("q", { initialValue: initialQuery });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape" && hasValue) {
        event.preventDefault();
        clear();
      }
    },
    [clear, hasValue],
  );

  return (
    <form
      role="search"
      className="w-full max-w-xl"
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor={inputId} className="sr-only">
        Search blog articles
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash"
          aria-hidden="true"
        />

        <Input
          id={inputId}
          name="q"
          type="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search articles by topic or keyword…"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-busy={isPending}
          className={clsx(
            "search-input-native-clear h-11 touch-manipulation bg-white pl-9 text-sm text-ink",
            "border-wire placeholder:text-ash/60",
            "focus-visible:border-wire focus-visible:ring-bg-ink/30",
            "rounded-xl",
            isPending && !hasValue && "pr-9",
          )}
        />

        {isPending && !hasValue && (
          <Loader2
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ash motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {isPending ? "Searching…" : ""}
      </p>
    </form>
  );
};

export default BlogSearchBar;
