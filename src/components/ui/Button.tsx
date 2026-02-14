import type {
   ButtonHTMLAttributes,
   PropsWithChildren,
   ReactElement,
} from "react";
import { cn } from "../../util/cn";
import Spinner from "./Spinner";

type ButtonSize = "sm" | "md" | "lg" | "0";
type ButtonVariant =
   | "primary"
   | "secondary"
   | "danger"
   | "link"
   | "ghost"
   | "success";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   size: ButtonSize;
   variant?: ButtonVariant;
   icon?: ReactElement;
   className?: string;
   startIcon?: ReactElement | null;
   endIcon?: ReactElement | null;
   loading?: boolean;
}

const sizes: Record<ButtonSize, string> = {
   0: "p-0",
   sm: "px-3 py-2 text-xs sm:text-sm",
   md: "px-4 py-2.5 text-sm sm:text-base",
   lg: "px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold",
};

const variants: Record<ButtonVariant, string> = {
   primary: `
   bg-indigo-600 text-white
   hover:bg-indigo-700
   active:bg-indigo-800
   dark:bg-indigo-500 dark:text-white
   dark:hover:bg-indigo-600
   dark:active:bg-indigo-700
   focus-visible:ring-indigo-500
   shadow-sm hover:shadow-md
   `,

   secondary: `
   bg-indigo-50 text-indigo-700 border border-indigo-200
   font-semibold
   hover:bg-indigo-100 hover:border-indigo-300
   active:bg-indigo-200
   dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700/50
   dark:hover:bg-indigo-900/60 dark:hover:border-indigo-600/50
   dark:active:bg-indigo-900/80
   focus-visible:ring-indigo-500
   `,

   success: `
   bg-green-50 text-green-700 border border-green-200
   font-semibold
   hover:bg-green-100 hover:border-green-300
   active:bg-green-200
   dark:bg-green-900/40 dark:text-green-200 dark:border-green-700/50
   dark:hover:bg-green-900/60 dark:hover:border-green-600/50
   dark:active:bg-green-900/80
   focus-visible:ring-green-500
   transition-all duration-200
`,

   ghost: `
   bg-transparent text-gray-700 border border-gray-200
   hover:bg-gray-50 hover:border-gray-300
   active:bg-gray-100
   dark:bg-transparent dark:border-zinc-700
   dark:text-gray-300
   dark:hover:bg-zinc-800 dark:hover:border-zinc-600
   dark:active:bg-zinc-700
   focus-visible:ring-gray-400
   `,

   danger: `
   bg-red-600 text-white border border-red-600
   hover:bg-red-700 hover:border-red-700
   active:bg-red-800
   dark:bg-red-500 dark:border-red-500
   dark:hover:bg-red-600 dark:hover:border-red-600
   dark:active:bg-red-700
   focus-visible:ring-red-500
   shadow-sm hover:shadow-md
  `,

   link: `
   bg-transparent text-indigo-600 underline-offset-4
   hover:underline hover:text-indigo-700
   dark:text-indigo-400
   dark:hover:text-indigo-300
   px-0
   focus-visible:ring-transparent
  `,
};

const baseStyles = `
   inline-flex items-center justify-center gap-2 
   cursor-pointer rounded-lg font-medium 
   transition-all duration-200 
   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
   disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
   relative overflow-hidden
`;

const Button = ({
   size,
   variant = "primary",
   className = "",
   startIcon,
   endIcon,
   children,
   loading = false,
   disabled,
   ...props
}: PropsWithChildren<BtnProps>) => {
   const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "md" : "sm";
   const spinnerVariant =
      variant === "primary" || variant === "danger" ? "white" : "primary";

   return (
      <button
         {...props}
         disabled={disabled || loading}
         className={cn(
            baseStyles,
            sizes[size],
            variants[variant],
            loading && "cursor-wait",
            className,
         )}
      >
         {loading ? (
            <Spinner size={spinnerSize} variant={spinnerVariant} />
         ) : (
            startIcon
         )}
         {children}
         {!loading && endIcon}
      </button>
   );
};

export default Button;
