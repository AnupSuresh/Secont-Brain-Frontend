import type { LogoProps } from "./LogoProps.type";

const AllIcon = (props: LogoProps) => {
   return (
      <div>
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            {...props}
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
         </svg>
      </div>
   );
};

export default AllIcon;
