"use server";

import { LoginSchema } from "../_schema/login.schema";

export const login = async (_: any, formData: FormData) => {
  const entries = Object.fromEntries(formData.entries());

  const result = LoginSchema.safeParse(entries);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
};
