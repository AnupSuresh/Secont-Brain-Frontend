import { Link, useParams } from "react-router-dom";
import { useModalActions, useTheme } from "../store/AppStore";
import DeleteIcon from "./icons/DeleteIcon";
import DocumetIcon from "./icons/DocumetIcon";
import ShareIcon from "./icons/ShareIcon";
import TweetIcon from "./icons/TweetIcon";
import VideoIcon from "./icons/VideoIcon";
import { type Content } from "../queries/content/useContentQuery";
import EditIcon from "./icons/EditIcon";
import { useDeleteContentMutation } from "../queries/content/useDeleteContentMutation";
import type { Hash } from "../queries/content/useSharedBrainQuery";
import ToggleSwitch from "./ui/ToggleSwitch";
import { useBrainPieceShareStatusQuery } from "../queries/content/useBrainPieceShareStatusQuery";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import TickIcon from "./icons/TickIcon";
import { cn } from "../util/cn";
import { useSharedPieceQuery } from "../queries/content/useSharedPieceQuery";
import Spinner from "./ui/Spinner";
import OpenLinkIcon from "./icons/OpenLinkIcon";

declare global {
   interface Window {
      twttr?: {
         widgets: {
            createTweet: (
               tweetId: string,
               container: HTMLElement,
               options?: any,
            ) => Promise<HTMLElement | null>;
         };
      };
   }
}

interface CardProps {
   content?: Content;
   brainHash?: Hash;
   layout?: "tile" | "page";
}

const extractYouTubeId = (url: string): string | null => {
   const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
   ];
   for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
   }
   return null;
};

const extractTweetId = (url: string): string | null => {
   const patterns = [
      /twitter\.com\/\w+\/status\/(\d+)/,
      /x\.com\/\w+\/status\/(\d+)/,
   ];
   for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
   }
   return null;
};

const Card = ({ content, brainHash, layout }: CardProps) => {
   const theme = useTheme();
   const { pieceHash } = useParams();
   const resolvedHash = brainHash ?? pieceHash;
   const { data: sharedPieceData, isLoading } = useSharedPieceQuery(pieceHash);
   const brainPiece = sharedPieceData?.brainPiece;

   const [copied, setCopied] = useState(false);
   const [twitterReady, setTwitterReady] = useState(false);
   const { setModalData, setModalType } = useModalActions();
   const deleteMutation = useDeleteContentMutation();
   const { data: pieceData } = useBrainPieceShareStatusQuery(
      content?._id || "",
   );

   const displayData = brainPiece || content;
   const isSharedView = !!resolvedHash;
   const tweetContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (window.twttr?.widgets) {
         setTwitterReady(true);
         return;
      }
      if (
         document.querySelector(
            'script[src="https://platform.twitter.com/widgets.js"]',
         )
      ) {
         const checkInterval = setInterval(() => {
            if (window.twttr?.widgets) {
               setTwitterReady(true);
               clearInterval(checkInterval);
            }
         }, 100);
         return () => clearInterval(checkInterval);
      }
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
      script.onload = () => {
         const checkInterval = setInterval(() => {
            if (window.twttr?.widgets) {
               setTwitterReady(true);
               clearInterval(checkInterval);
            }
         }, 100);
      };
   }, []);

   useEffect(() => {
      if (
         displayData?.type === "tweet" &&
         twitterReady &&
         tweetContainerRef.current
      ) {
         const container = tweetContainerRef.current;
         const tweetId = extractTweetId(displayData.link);
         if (tweetId && window.twttr?.widgets) {
            container.innerHTML = "";
            window.twttr.widgets
               .createTweet(tweetId, container, {
                  theme,
                  conversation: "none",
                  cards: "visible",
               })
               .catch((error) => {
                  console.error("Error loading tweet:", error);
                  container.innerHTML =
                     '<p class="text-red-500 text-sm">Failed to load tweet</p>';
               });
         }
      }
   }, [displayData?.type, displayData?.link, twitterReady, theme]);

   if (isLoading) return <Spinner />;

   // Shared piece with sharing disabled — show locked state
   if (pieceHash && !isLoading && !displayData) {
      return (
         <div
            className={cn(
               "rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800",
               "flex flex-col items-center justify-center gap-3 p-10 text-center",
               layout === "page"
                  ? "w-full min-h-64"
                  : "w-full sm:w-auto min-h-48",
            )}
         >
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
               <svg
                  className="w-6 h-6 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
               </svg>
            </div>
            <div>
               <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Content unavailable
               </p>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Sharing has been disabled for this item
               </p>
            </div>
         </div>
      );
   }

   const handleEdit = () => {
      if (!content) return;
      setModalData(content);
      setModalType("update");
   };

   const handleDelete = async () => {
      if (!content?._id) return;
      await deleteMutation.mutateAsync(content._id);
   };

   const handleShare = async () => {
      if (!pieceData?.hash) return;
      try {
         const link = `${window.location.origin}/brain/piece/${pieceData.hash}`;
         await navigator.clipboard.writeText(link);
         setCopied(true);
         toast.success("Link copied!");
         setTimeout(() => setCopied(false), 1800);
      } catch (err) {
         console.error(err);
         toast.error("Failed to copy link");
      }
   };

   const formatDate = (iso: string) =>
      new Date(iso).toLocaleDateString("en-IN", {
         day: "2-digit",
         month: "short",
         year: "numeric",
      });

   const getCardIcon = () => {
      const iconWrapperClasses = {
         video: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
         link: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
         tweet: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
      };
      const type = (displayData?.type ||
         "link") as keyof typeof iconWrapperClasses;
      const Icon =
         type === "video"
            ? VideoIcon
            : type === "tweet"
              ? TweetIcon
              : DocumetIcon;
      return (
         <div
            className={cn(
               "w-10 h-10 p-2 rounded-lg flex justify-center items-center shrink-0",
               iconWrapperClasses[type],
            )}
         >
            <Icon />
         </div>
      );
   };

   const renderContent = () => {
      if (!displayData) return null;

      if (displayData.type === "video") {
         const videoId = extractYouTubeId(displayData.link);
         if (videoId) {
            return (
               <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                     width="100%"
                     height="100%"
                     src={`https://www.youtube.com/embed/${videoId}`}
                     title={displayData.title}
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                     allowFullScreen
                     className="w-full h-full"
                  />
               </div>
            );
         }
      }

      if (displayData.type === "tweet") {
         return (
            <div
               ref={tweetContainerRef}
               className="rounded-xl overflow-hidden min-h-50 flex items-center justify-center"
            >
               {!twitterReady && (
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                     Loading tweet...
                  </div>
               )}
            </div>
         );
      }

      return (
         <Link
            to={displayData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group/link"
         >
            <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-800/50 p-4 transition-all hover:shadow-md border border-gray-200 dark:border-zinc-700">
               <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors">
                        {displayData.title}
                     </p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {displayData.link}
                     </p>
                  </div>
                  <OpenLinkIcon />
               </div>
            </div>
         </Link>
      );
   };

   return (
      <div
         className={cn(
            "group relative overflow-hidden rounded-2xl bg-white text-black transition-all duration-300",
            "border border-gray-200 hover:border-gray-300 hover:shadow-xl",
            "dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:hover:border-zinc-700",
            layout === "page"
               ? "w-full"
               : "w-full sm:w-auto sm:min-w-80 lg:min-w-96",
            "hover:-translate-y-1",
         )}
      >
         {/* Header */}
         <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 space-y-3">
            {/* Row 1: Actions */}
            {!isSharedView && content && (
               <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                  <ToggleSwitch
                     type="piece"
                     contentId={content._id}
                     size="sm"
                     variant="success"
                  />
                  <div className="flex items-center gap-1">
                     <button
                        type="button"
                        onClick={handleEdit}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 active:bg-gray-200 dark:active:bg-zinc-700 transition-colors"
                        aria-label="Edit"
                     >
                        <EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                     </button>
                     <button
                        type="button"
                        onClick={handleDelete}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 transition-colors group/delete"
                        aria-label="Delete"
                     >
                        <DeleteIcon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/delete:text-red-600 dark:group-hover/delete:text-red-400" />
                     </button>
                     <button
                        type="button"
                        onClick={content.isActive ? handleShare : undefined}
                        disabled={!content.isActive}
                        className={cn(
                           "relative p-2 rounded-lg transition-colors",
                           content.isActive
                              ? "hover:bg-gray-100 dark:hover:bg-zinc-800 active:bg-gray-200 dark:active:bg-zinc-700"
                              : "opacity-40 cursor-not-allowed",
                        )}
                        aria-label="Share"
                     >
                        <TickIcon
                           className={cn(
                              "absolute inset-0 m-auto w-4 h-4 transition-all duration-200 text-green-600 dark:text-green-400",
                              copied
                                 ? "opacity-100 scale-100"
                                 : "opacity-0 scale-75",
                           )}
                        />
                        <ShareIcon
                           className={cn(
                              "w-4 h-4 text-gray-600 dark:text-gray-400 transition-all duration-200",
                              copied
                                 ? "opacity-0 scale-75"
                                 : "opacity-100 scale-100",
                           )}
                        />
                     </button>
                  </div>
               </div>
            )}

            {/* Row 2: Icon + Title + Date */}
            <div className="flex items-start gap-3 min-w-0 pt-3">
               {getCardIcon()}
               <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base sm:text-lg leading-tight text-gray-900 dark:text-white wrap-break-word line-clamp-2">
                     {displayData?.title}
                  </h4>
                  {!isSharedView && content?.createdAt && (
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(content.createdAt)}
                     </p>
                  )}
               </div>
            </div>
         </div>

         {/* Content */}
         {displayData && (
            <div className="p-4 sm:p-5 space-y-4">
               {renderContent()}
               {displayData.tags && displayData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                     {displayData.tags.map((tag) => (
                        <span
                           key={tag.name}
                           className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                        >
                           <span className="text-indigo-400 dark:text-indigo-500">
                              #
                           </span>
                           {tag.name}
                        </span>
                     ))}
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default Card;
