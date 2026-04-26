import { useEffect } from "react";
import type {
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type SlugifyOptions = {
  transform?: (value: string) => string;
  shouldValidate?: boolean;
  onlyIfEmpty?: boolean;
};

export const defaultSlugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
};

export const useAutoSlug = <TFormData extends Record<string, unknown>>(
  watch: UseFormWatch<TFormData>,
  setValue: UseFormSetValue<TFormData>,
  sourceField: Path<TFormData>,
  targetField: Path<TFormData>,
  options: SlugifyOptions = {},
) => {
  const {
    transform = defaultSlugify,
    shouldValidate = false,
    onlyIfEmpty = false,
  } = options;

  const sourceValue = watch(sourceField);
  const targetValue = watch(targetField);

  useEffect(() => {
    if (!sourceValue) return;

    // Skip if we should only update empty fields and target is not empty
    if (onlyIfEmpty && targetValue) return;

    const slug = transform(String(sourceValue));

    setValue(targetField, slug as PathValue<TFormData, Path<TFormData>>, {
      shouldValidate,
    });
  }, [
    sourceValue,
    targetValue,
    sourceField,
    targetField,
    setValue,
    transform,
    shouldValidate,
    onlyIfEmpty,
  ]);
};
