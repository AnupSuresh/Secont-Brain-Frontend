import { z } from "zod";

export const ContentSchema = z.object({
   title: z.string().min(1, "Title cannot be empty").optional(),

   link: z.url("Must be a valid URL").optional(),

   tags: z
      .array(
         z.object({
            name: z.string().min(1, "Tag cannot be empty"),
         }),
      )
      .optional()
      .refine(
         (tags) => {
            if (!tags) return true;

            const normalized = tags.map((t) => t.name.trim().toLowerCase());

            return new Set(normalized).size === normalized.length;
         },
         {
            message: "Duplicate tags are not allowed",
         },
      ),

   newTag: z.string().optional(), // UI-only
   isActive: z.boolean().optional(),
});
