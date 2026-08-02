"use client";

import { useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Badge } from "@/components/ui/shadcn/badge";
import { BlogTagInput } from "../_schema/blog.schema";
import { slugifyTagName } from "@/lib/slugify";
import { normalizeForMatching } from "@/lib/normalization";

type AvailableTag = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  availableTags: AvailableTag[];
  value: BlogTagInput[];
  onChange: (tags: BlogTagInput[]) => void;
  error?: string;
};

const TagCombobox = ({ availableTags, value, onChange, error }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = normalizeForMatching(query);

  const selectedSlugs = useMemo(
    () => new Set(value.map((t) => t.slug)),
    [value],
  );

  const filteredTags = useMemo(() => {
    if (!normalizedQuery) return availableTags.filter((t) => !selectedSlugs.has(t.slug));
    return availableTags.filter(
      (t) =>
        !selectedSlugs.has(t.slug) &&
        (normalizeForMatching(t.name).includes(normalizedQuery) ||
          t.slug.includes(normalizedQuery)),
    );
  }, [availableTags, normalizedQuery, selectedSlugs]);

  const canCreate =
    query.trim() &&
    !value.some(
      (t) =>
        normalizeForMatching(t.name) === normalizedQuery ||
        t.slug === slugifyTagName(query),
    ) &&
    !availableTags.some(
      (t) =>
        normalizeForMatching(t.name) === normalizedQuery ||
        t.slug === slugifyTagName(query),
    );

  const addTag = (tag: BlogTagInput) => {
    if (!tag.name.trim()) return;

    const newValue = [
      ...value,
      { name: tag.name.trim(), slug: tag.slug || slugifyTagName(tag.name) },
    ];
    onChange(newValue);
    setQuery("");
    setOpen(false);
  };

  const removeTag = (slug: string) => {
    onChange(value.filter((t) => t.slug !== slug));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left text-sm h-11 rounded-xl border-wire bg-white hover:bg-cloud"
          >
            <Plus className="w-4 h-4 mr-2 text-fog" />
            {value.length > 0 ? `${value.length} tag(s) selected` : "Add tags..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="start">
          <Input
            placeholder="Search or create a tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 rounded-xl mb-2"
          />

          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {filteredTags.length === 0 && !canCreate && (
              <p className="text-xs text-ash px-2 py-2">No tags found.</p>
            )}

            {filteredTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() =>
                  addTag({ name: tag.name, slug: tag.slug })
                }
                className="w-full text-left px-2 py-1.5 text-sm text-ink rounded-lg hover:bg-cloud transition-colors"
              >
                {tag.name}
              </button>
            ))}

            {canCreate && (
              <button
                type="button"
                onClick={() =>
                  addTag({
                    name: query.trim(),
                    slug: slugifyTagName(query.trim()),
                  })
                }
                className="w-full text-left px-2 py-1.5 text-sm text-ink rounded-lg hover:bg-cloud transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Create &quot;{query.trim()}&quot;
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge
              key={tag.slug}
              variant="secondary"
              className="gap-1 pr-1.5 bg-cloud text-ink border border-wire"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.slug)}
                className="hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-destructive">{error}</p>
      )}
    </div>
  );
};

export default TagCombobox;
