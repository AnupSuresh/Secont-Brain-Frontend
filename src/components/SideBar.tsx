import Button from "./ui/Button";
import HamburgerIcon from "./icons/HamburgerIcon";
import { useSidebarActions, useSidebarState } from "../store/AppStore";
import VideoIcon from "./icons/VideoIcon";
import DocumetIcon from "./icons/DocumetIcon";
import TweetIcon from "./icons/TweetIcon";
import type { ReactElement } from "react";
import { useContentQuery } from "../queries/content/useContentQuery";
import AllIcon from "./icons/AllIcon";
import { useSharedBrainQuery } from "../queries/content/useSharedBrainQuery";
import { useParams } from "react-router";
import { cn } from "../util/cn";

interface SideBarProps {
   onClose?: () => void;
}

const SideBar = ({ onClose }: SideBarProps) => {
   const { hash } = useParams();
   const { isOpen, activeItem } = useSidebarState();
   const { toggleSidebar, setActiveItem } = useSidebarActions();
   const { data: brainContents } = useContentQuery(true);
   const { data: sharedBrainContents } = useSharedBrainQuery(hash);

   const contents = brainContents ?? sharedBrainContents;
   const allCount = contents?.length ?? 0;
   const videoCount = contents?.filter((i) => i.type === "video").length ?? 0;
   const tweetCount = contents?.filter((i) => i.type === "tweet").length ?? 0;
   const otherCount = contents?.filter((i) => i.type === "link").length ?? 0;

   const menuItems: {
      id: "all" | "video" | "tweet" | "link";
      label: string;
      icon: ReactElement;
      count: number;
   }[] = [
      { id: "all", label: "All", icon: <AllIcon />, count: allCount },
      { id: "video", label: "Videos", icon: <VideoIcon />, count: videoCount },
      { id: "tweet", label: "Tweets", icon: <TweetIcon />, count: tweetCount },
      {
         id: "link",
         label: "Other Links",
         icon: <DocumetIcon />,
         count: otherCount,
      },
   ];

   const handleItemClick = (id: "all" | "video" | "tweet" | "link") => {
      setActiveItem(id);
      onClose?.();
   };

   return (
      <aside
         className={cn(
            "flex flex-col gap-3 p-3 h-full bg-white dark:bg-zinc-900 transition-all duration-300 ease-in-out overflow-hidden",
            // Mobile: always w-64 inside the drawer
            "w-64",
            // Desktop: explicitly w-64 or w-20 — full strings so Tailwind includes both
            isOpen ? "lg:w-64" : "lg:w-20",
         )}
      >
         {/* Header */}
         <div
            className={cn(
               "flex items-center mb-2",
               isOpen ? "justify-between" : "justify-between lg:justify-center",
            )}
         >
            <h2
               className={cn(
                  "text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide",
                  !isOpen && "lg:hidden",
               )}
            >
               Menu
            </h2>

            <div className="flex items-center gap-2">
               {/* Close button — mobile drawer only */}
               <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close sidebar"
               >
                  <svg
                     className="w-4 h-4"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               </button>

               {/* Collapse toggle — desktop only */}
               <Button
                  size="sm"
                  variant="secondary"
                  className="hidden lg:flex p-2.5 hover:scale-105 transition-transform"
                  onClick={toggleSidebar}
               >
                  <HamburgerIcon
                     className={cn(
                        "size-5 transition-transform duration-300",
                        isOpen && "rotate-180",
                     )}
                  />
               </Button>
            </div>
         </div>

         {/* Divider */}
         <div className="h-px bg-linear-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent" />

         {/* Nav */}
         <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700">
            <ul className="space-y-2">
               {menuItems.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                     <li key={item.id}>
                        <button
                           type="button"
                           onClick={() => handleItemClick(item.id)}
                           className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                              "transition-all duration-200 active:scale-95 group relative",
                              !isOpen && "lg:justify-center",
                              isActive
                                 ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                                 : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300",
                           )}
                        >
                           <div
                              className={cn(
                                 "shrink-0 w-5 h-5 transition-colors",
                                 isActive
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
                              )}
                           >
                              {item.icon}
                           </div>

                           <span
                              className={cn(
                                 "flex-1 text-left text-sm font-medium transition-colors",
                                 !isOpen && "lg:hidden",
                              )}
                           >
                              {item.label}
                           </span>

                           <span
                              className={cn(
                                 "shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full",
                                 !isOpen && "lg:hidden",
                                 isActive
                                    ? "bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
                                    : "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300",
                              )}
                           >
                              {item.count}
                           </span>

                           {/* Tooltip — desktop collapsed only */}
                           {!isOpen && (
                              <div className="hidden lg:group-hover:block absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-zinc-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
                                 {item.label}
                                 <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-zinc-700 rotate-45" />
                              </div>
                           )}
                        </button>
                     </li>
                  );
               })}
            </ul>
         </nav>
         {/* Storage section removed */}
      </aside>
   );
};

export default SideBar;
