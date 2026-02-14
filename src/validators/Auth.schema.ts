import { z } from "zod";

export const SignupSchema = z.object({
   name: z.string().min(2, { message: "Name must be at least 2 characters" }),

   email: z.email({ message: "Please enter a valid email address" }),

   password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
});

export const LoginSchema = z.object({
   email: z.email({ message: "Please enter a valid email address" }),

   password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
});

export type SignupFormData = z.infer<typeof SignupSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type AuthMode = "signup" | "login";
