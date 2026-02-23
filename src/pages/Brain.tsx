import Card from "../components/Card";
import AddIcon from "../components/icons/AddIcon";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EditContentModal from "../components/EditContentModal";
import { useContentQuery } from "../queries/content/useContentQuery";
import {
   useModalActions,
   useModalState,
   useSidebarState,
} from "../store/AppStore";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useBrainShareStatusQuery } from "../queries/content/useBrainShareStatusQuery";
import { useNavigate, useParams } from "react-router-dom";
import { useSharedBrainQuery } from "../queries/content/useSharedBrainQuery";
import { AnimatedCopyIcon } from "../components/ui/AnimatedCopyIcon";
import { useMeQuery } from "../queries/auth/useMeQuery";
import { useQueryClient } from "@tanstack/react-query";

const Brain = () => {
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const { activeItem } = useSidebarState();
   const { hash } = useParams();
   const { data: user } = useMeQuery(hash ? false : true);

   const enabled = hash ? false : user ? true : false;
   const { data: brain } = useSharedBrainQuery(hash);

   const [copied, setCopied] = useState(false);
   const { modalType } = useModalState();
   const { setModalType } = useModalActions();
   const { data: contents, isLoading, isError } = useContentQuery(enabled);
   const { data: status, isLoading: statusIsLoading } =
      useBrainShareStatusQuery();

   const handleCreate = () => setModalType("create");

   const handleShare = async () => {
      if (!status?.hash) return;
      try {
         const link = `${window.location.origin}/brain/${status.hash}`;
         await navigator.clipboard.writeText(link);
         setCopied(true);
         toast.success("Link copied!");
         setTimeout(() => setCopied(false), 1800);
      } catch (err) {
         console.error(err);
         toast.error("Failed to copy link");
      }
   };

   const displayContents = hash ? brain : contents;
   const totalItems = displayContents?.length || 0;

   const filteredContents =
      displayContents?.filter((content) => {
         if (activeItem === "video") return content.type === "video";
         if (activeItem === "tweet") return content.type === "tweet";
         if (activeItem === "link")
            return content.type === "link" || !content.type;
         return true;
      }) || [];

   useEffect(() => {
      const handleLogout = () => {
         queryClient.clear();
         navigate("/auth");
      };
      if (!hash) {
         window.addEventListener("auth:logout", handleLogout);
         return () => window.removeEventListener("auth:logout", handleLogout);
      }
      return;
   }, [navigate, queryClient]);

   return (
      <div className="flex flex-col flex-1 relative overflow-y-auto bg-gray-50 dark:bg-zinc-950">
         {/* Header */}
         <div className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full px-4 sm:px-6 py-4 sm:py-6">
               {/* Title & Stats */}
               <div className="space-y-0.5 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate">
                     {hash ? "Shared Brain" : "All Notes"}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                           <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                           Loading...
                        </span>
                     ) : (
                        <>
                           {filteredContents.length}{" "}
                           {filteredContents.length === 1 ? "item" : "items"}
                           {activeItem !== "link" &&
                              activeItem !== "video" &&
                              activeItem !== "tweet" &&
                              ` of ${totalItems}`}
                           {hash && " • View only"}
                        </>
                     )}
                  </p>
               </div>

               {/* Actions */}
               {!hash && (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                     {/* Share Toggle */}
                     <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                           Share
                        </span>
                        <ToggleSwitch type="brain" size="sm" variant="info" />
                     </div>

                     {/* Share Brain Button */}
                     <Button
                        size="lg"
                        variant={copied ? "success" : "secondary"}
                        startIcon={<AnimatedCopyIcon copied={copied} />}
                        onClick={handleShare}
                        loading={statusIsLoading}
                        disabled={statusIsLoading || !status?.isSharing}
                        className="flex-1 sm:flex-none"
                     >
                        {copied ? "Copied!" : "Share Brain"}
                     </Button>

                     {/* Add Content */}
                     <Button
                        size="lg"
                        variant="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        className="flex-1 sm:flex-none shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20"
                     >
                        Add Content
                     </Button>
                  </div>
               )}
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 px-3 sm:px-6 py-4 sm:py-6 bg-linear-to-br from-white via-slate-50 to-gray-100 dark:from-zinc-950 dark:via-zinc-800 dark:to-zinc-950">
            {/* Loading */}
            {isLoading ? (
               <div className="flex items-center justify-center min-h-96">
                  <div className="text-center flex justify-center items-center gap-3">
                     <Spinner />
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        Loading your content...
                     </p>
                  </div>
               </div>
            ) : /* Error */
            isError && !hash ? (
               <div className="flex items-center justify-center min-h-96">
                  <div className="text-center space-y-3 max-w-md px-4">
                     <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <svg
                           className="w-8 h-8 text-red-600 dark:text-red-400"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                           />
                        </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Something went wrong
                     </h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        We couldn't load your content. Please try again.
                     </p>
                     <Button
                        size="md"
                        variant="secondary"
                        onClick={() => window.location.reload()}
                        className="mt-4"
                     >
                        Refresh Page
                     </Button>
                  </div>
               </div>
            ) : /* Cards */
            filteredContents.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredContents.map((content) => (
                     <Card
                        key={content._id}
                        content={content}
                        brainHash={hash}
                        layout="tile"
                     />
                  ))}
               </div>
            ) : (
               /* Empty */
               <div className="flex items-center justify-center min-h-96">
                  <div className="text-center space-y-4 max-w-md px-4">
                     <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg
                           className="w-10 h-10 text-gray-400 dark:text-gray-600"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                           />
                        </svg>
                     </div>
                     <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                           {hash
                              ? "No content shared yet"
                              : `No ${activeItem} yet`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                           {hash
                              ? "This brain doesn't have any content to display."
                              : `Get started by adding your first ${activeItem === "video" ? "video" : activeItem === "tweet" ? "tweet" : "note"}.`}
                        </p>
                        {!hash && (
                           <Button
                              size="md"
                              variant="primary"
                              startIcon={<AddIcon />}
                              onClick={handleCreate}
                           >
                              Create First Note
                           </Button>
                        )}
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Modal */}
         {modalType && <EditContentModal />}
      </div>
   );
};

export default Brain;
