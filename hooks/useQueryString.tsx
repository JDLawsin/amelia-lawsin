import { createQueryString } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type QueryParams = Record<string, string | undefined>;
type UpdateQueryStringFn = (params: QueryParams, deleteKeys?: string[]) => void;

const useUpdateQueryString = (): UpdateQueryStringFn => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFn = useCallback(
    (params: QueryParams, deleteKeys: string[] = []) => {
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

      router.push(`${pathname}?${updatedQueryString}`);
    },
    [searchParams],
  );

  return updateFn;
};

export default useUpdateQueryString;
