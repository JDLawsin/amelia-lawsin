import { z } from "zod";

export const InquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .max(50, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  propertyType: z
    .string()
    .max(50)
    .optional()
    .or(z.literal("")),
  propertyTitle: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  propertySlug: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  propertyPrice: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
  propertyLocation: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  propertyStatus: z
    .string()
    .max(50)
    .optional()
    .or(z.literal("")),
  source: z.enum(["Contact page", "Property listing"]),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  honeypot: z.string().optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof InquirySchema>;
