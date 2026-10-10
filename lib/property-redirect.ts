import { FormState } from "@/actions/property.action";

export const getPropertyRedirectPath = (state: FormState) => {
  if (!state?.success || !state.slug) return null;
  return state.isPublished
    ? `/properties/${state.slug}`
    : `/admin/properties/${state.slug}/update`;
};
