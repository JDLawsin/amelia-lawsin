"use server";

import { LoginSchema } from "../_schema/login.schema";

export const login = async (formData: FormData) => {
  const entries = Object.fromEntries(formData.entries());

  const result = LoginSchema.safeParse(entries);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
};
