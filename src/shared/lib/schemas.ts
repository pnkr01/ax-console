import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid business email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, "Full name is required"),
});

export const workspaceSchema = z.object({
  name: z.string().min(3, "Workspace name is too short"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slugs can only contain lowercase letters, numbers, and hyphens"),
  industry: z.string().min(1, "Please select an industry"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type WorkspaceInput = z.infer<typeof workspaceSchema>;

export const createKeySchema = z.object({
  name: z.string().min(3, "Key name must be at least 3 characters").max(50, "Key name is too long"),
});

export type CreateKeyInput = z.infer<typeof createKeySchema>;