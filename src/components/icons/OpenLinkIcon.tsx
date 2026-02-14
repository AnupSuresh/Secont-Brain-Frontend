import type { LogoProps } from "./LogoProps.type";

const OpenLinkIcon = (props: LogoProps) => {
   return (
      <div>
         <svg
            className="w-4 h-4 text-gray-400 shrink-0 mt-0.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
         </svg>
      </div>
   );
};

export default OpenLinkIcon;
