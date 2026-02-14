import ShareIcon from "../icons/ShareIcon";
import TickIcon from "../icons/TickIcon";

export const AnimatedCopyIcon = ({ copied }: { copied: boolean }) => (
   <div className="relative size-5 shrink-0">
      <div
         className={`absolute inset-0 transition-all duration-200 flex items-center justify-center
         ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
         <TickIcon className="size-4 text-green-700 dark:text-green-400" />
      </div>
      <div
         className={`absolute inset-0 transition-all duration-200 flex items-center justify-center
         ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
      >
         <ShareIcon className="size-4" />
      </div>
   </div>
);
