import type { LogoProps } from "./LogoProps.type";

const TitleIcon = (props: LogoProps) => {
   return (
      <div>
         <svg
            className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
         </svg>
      </div>
   );
};

export default TitleIcon;
