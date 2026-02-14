import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
   LoginSchema,
   SignupSchema,
   type AuthMode,
   type LoginFormData,
   type SignupFormData,
} from "../validators/Auth.schema";
import Button from "./ui/Button";
import { useLoginMutation } from "../queries/auth/useLoginMutation";
import { useSignupnMutation } from "../queries/auth/useSignupMutation";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FieldErrors } from "./ui/FieldErrors";

type LocationState = {
   from?: {
      pathname: string;
   };
};

const AuthForm = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const from: string =
      (location.state as LocationState)?.from?.pathname || "/";
   const loginMutation = useLoginMutation();
   const signupMutaion = useSignupnMutation();
   const [mode, setMode] = useState<AuthMode>("login");
   const {
      register,
      handleSubmit,
      setError,
      getFieldState,
      formState,
      setFocus,
   } = useForm<SignupFormData | LoginFormData>({
      resolver: zodResolver(mode === "signup" ? SignupSchema : LoginSchema),
      mode: "onBlur",
      reValidateMode: "onBlur",
      shouldUnregister: true,
   });

   useEffect(() => {
      setFocus(mode === "login" ? "email" : "name");
   }, [mode, setFocus]);

   const onSubmit = async (authData: SignupFormData | LoginFormData) => {
      try {
         if (mode === "signup") {
            await signupMutaion.mutateAsync(authData as SignupFormData);
            toast("Registered Successfully!");
            setTimeout(() => {
               setMode("login");
            }, 200);
         } else {
            await loginMutation.mutateAsync(authData as LoginFormData);
            toast("Login Successfull!");
            navigate(from, { replace: true });
         }
      } catch (error: any) {
         const data = error?.response?.data;

         if (!data) {
            setError("root", {
               type: "server",
               message: "Something went wrong. Please try again.",
            });
            return;
         }

         if (data.fieldErrors) {
            Object.entries(data.fieldErrors).forEach(
               ([field, messages]: any) => {
                  setError(field, {
                     type: "server",
                     message: Array.isArray(messages)
                        ? messages[0]
                        : String(messages),
                  });
               },
            );
            return;
         }

         setError("root", {
            type: "server",
            message: data.message ?? "Request failed. Please try again.",
         });
      }
   };

   const switchMode = (newMode: AuthMode) => {
      setMode(newMode);
   };

   const inputClass =
      "w-full bg-indigo-100 dark:bg-slate-900 dark:text-indigo-300 text-indigo-800 py-3 px-4 rounded shadow-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";

   return (
      /* Full-page centering wrapper */
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-zinc-950 px-4 py-10">
         {/* Card */}
         <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 text-center">
               <h1 className="text-3xl font-bold dark:text-indigo-100 text-indigo-500">
                  {mode === "signup" ? "REGISTER" : "LOGIN"}
               </h1>
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {mode === "signup"
                     ? "Create your Brain account"
                     : "Welcome back! Sign in to continue"}
               </p>
            </div>

            {/* Form */}
            <form
               onSubmit={handleSubmit(onSubmit)}
               noValidate
               className="px-6 sm:px-8 pb-8 pt-2 flex flex-col gap-4"
            >
               {/* Root error */}
               {formState.errors.root?.message && (
                  <p className="text-sm text-red-400 text-center bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
                     {formState.errors.root.message}
                  </p>
               )}

               {/* Name field — signup only */}
               {mode === "signup" && (
                  <div className="flex flex-col">
                     <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                     >
                        Name
                     </label>
                     <input
                        className={inputClass}
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="Your name"
                     />
                     <FieldErrors
                        formState={formState}
                        getFieldState={getFieldState}
                        name="name"
                     />
                  </div>
               )}

               {/* Email field */}
               <div className="flex flex-col">
                  <label
                     htmlFor="email"
                     className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                     Email
                  </label>
                  <input
                     className={inputClass}
                     type="email"
                     id="email"
                     placeholder="you@example.com"
                     {...register("email")}
                  />
                  <FieldErrors
                     formState={formState}
                     getFieldState={getFieldState}
                     name="email"
                  />
               </div>

               {/* Password field */}
               <div className="flex flex-col">
                  <label
                     htmlFor="password"
                     className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                     Password
                  </label>
                  <input
                     className={inputClass}
                     type="password"
                     id="password"
                     placeholder="••••••••"
                     {...register("password")}
                  />
                  <FieldErrors
                     formState={formState}
                     getFieldState={getFieldState}
                     name="password"
                  />
               </div>

               {/* Mode switch */}
               <div className="flex justify-center items-center gap-1 text-sm">
                  {mode === "login" ? (
                     <>
                        <span className="text-gray-600 dark:text-gray-400">
                           Don't have an account?
                        </span>
                        <Button
                           type="button"
                           variant="link"
                           size="0"
                           onClick={() => switchMode("signup")}
                        >
                           Register Now
                        </Button>
                     </>
                  ) : (
                     <>
                        <span className="text-gray-600 dark:text-gray-400">
                           Already have an account?
                        </span>
                        <Button
                           type="button"
                           variant="link"
                           size="0"
                           onClick={() => switchMode("login")}
                        >
                           Login
                        </Button>
                     </>
                  )}
               </div>

               {/* Submit */}
               <Button
                  size="lg"
                  variant="primary"
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="w-full mt-2"
               >
                  {formState.isSubmitting
                     ? "Please wait..."
                     : mode === "signup"
                       ? "Create Account"
                       : "Sign In"}
               </Button>
            </form>
         </div>
      </div>
   );
};

export default AuthForm;
