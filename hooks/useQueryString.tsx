import { createQueryString } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type QueryParams = Record<string, string | undefined>;

type UpdateOptions = {
  // When true, use router.replace instead of router.push to avoid spamming
  // browser history. Defaults to false (push) to preserve existing behavior.
  replace?: boolean;
};

type UpdateQueryStringFn = (
  params: QueryParams,
  deleteKeys?: string[],
  options?: UpdateOptions,
) => void;

const useUpdateQueryString = (): UpdateQueryStringFn => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFn = useCallback(
    (params: QueryParams, deleteKeys: string[] = [], options?: UpdateOptions) => {
      const currentParams: QueryParams = {};
      for (const [key, value] of searchParams.entries()) {
        currentParams[key] = value;
      }

      const merged = { ...currentParams, ...params };

      deleteKeys.forEach((key) => {
        delete merged[key];
      });

      const updatedParams = Object.fromEntries(
        Object.entries(merged).filter(
          ([, value]) => value !== "" && value !== undefined,
        ),
      );

      const updatedQueryString = createQueryString(updatedParams);
      const url = `${pathname}?${updatedQueryString}`;

      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [searchParams, pathname, router],
  );

  return updateFn;
};

export default useUpdateQueryString;
