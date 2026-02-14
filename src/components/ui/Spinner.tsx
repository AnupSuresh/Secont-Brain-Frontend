import { cn } from "../../util/cn";

type SpinnerSize = "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "primary" | "secondary" | "white";

interface SpinnerProps {
   size?: SpinnerSize;
   variant?: SpinnerVariant;
   className?: string;
   fullScreen?: boolean;
}

const sizes: Record<SpinnerSize, string> = {
   sm: "w-4 h-4 border-2",
   md: "w-6 h-6 border-2",
   lg: "w-8 h-8 border-4",
   xl: "w-12 h-12 border-4",
};

const variants: Record<SpinnerVariant, string> = {
   primary:
      "border-gray-300 border-t-indigo-600 dark:border-zinc-700 dark:border-t-indigo-400",
   secondary:
      "border-indigo-200 border-t-indigo-600 dark:border-indigo-800 dark:border-t-indigo-400",
   white: "border-white/30 border-t-white",
};

const Spinner = ({
   size = "md",
   variant = "primary",
   className = "",
   fullScreen = false,
}: SpinnerProps) => {
   const spinner = (
      <div
         className={cn(
            "rounded-full animate-spin",
            sizes[size],
            variants[variant],
            className,
         )}
         role="status"
         aria-label="Loading"
      />
   );

   if (fullScreen) {
      return (
         <div className="flex items-center justify-center h-screen">
            {spinner}
         </div>
      );
   }

   return spinner;
};

export default Spinner;
