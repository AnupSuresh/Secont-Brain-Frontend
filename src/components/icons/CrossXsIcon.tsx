import type { LogoProps } from "./LogoProps.type";

const CrossXsIcon = (props:LogoProps) => {
   return (
      <div>
         <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M6 18L18 6M6 6l12 12"
            />
         </svg>
      </div>
   );
};

export default CrossXsIcon;
