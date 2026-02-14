import type { FormState } from "react-hook-form";

export const FieldErrors = ({
   name,
   formState,
   getFieldState,
}: {
   name: string;
   formState: FormState<any>;
   getFieldState: any;
}) => {
   const { isTouched } = getFieldState(name, formState);
   const err = formState.errors[name];
   const message = typeof err?.message === "string" ? err?.message : undefined;
   const isServerError = err?.type === "server";

   const shouldShow = message && (isServerError || isTouched);

   if (!shouldShow) {
      return <div className="h-0" />;
   }

   return (
      <div className="mt-1.5 animate-in slide-in-from-top-1 duration-200">
         <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 dark:bg-red-900/20 dark:border-red-800/50">
            <svg
               className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0"
               fill="currentColor"
               viewBox="0 0 20 20"
            >
               <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
               />
            </svg>
            <p className="text-xs font-medium text-red-700 dark:text-red-300 leading-relaxed">
               {message}
            </p>
         </div>
      </div>
   );
};
