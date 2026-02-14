import { useQueryClient } from "@tanstack/react-query";
import { useBrainShareStatusQuery } from "../queries/content/useBrainShareStatusQuery";
import { useBrainPieceShareStatusQuery } from "../queries/content/useBrainPieceShareStatusQuery";
import { useEnableShareBrainMutation } from "../queries/content/useEnableShareBrainMutation";
import { useEnableSharePieceMutation } from "../queries/content/useEnableSharePieceMutation";
import { useDisableShareBrainMutation } from "../queries/content/useDisableShareBraintMutation";
import { useDisableSharePiecetMutation } from "../queries/content/useDisableSharePieceMutation";
import type { Content } from "../queries/content/useContentQuery";

export const useShareToggle = (type: "brain" | "piece", contentId?: string) => {
   const queryClient = useQueryClient();

   const statusQuery =
      type === "brain"
         ? useBrainShareStatusQuery()
         : useBrainPieceShareStatusQuery(contentId!);

   const enableMutation =
      type === "brain"
         ? useEnableShareBrainMutation()
         : useEnableSharePieceMutation(contentId!);

   const disableMutation =
      type === "brain"
         ? useDisableShareBrainMutation()
         : useDisableSharePiecetMutation(contentId!);

   const queryKey =
      type === "brain"
         ? (["brain", "status"] as const)
         : (["brain", "piece", "status", contentId!] as const);

   const isMutating = enableMutation.isPending || disableMutation.isPending;
   const isSharing = statusQuery.data?.isSharing ?? false;

   const handleToggle = async () => {
      if (!statusQuery.data || isMutating) return;

      const newSharingState = !isSharing;
      const previousPieceStatus = statusQuery.data;
      const previousBrainContents = queryClient.getQueryData(["user-contents"]);

      queryClient.setQueryData(queryKey, {
         ...statusQuery.data,
         isSharing: !isSharing,
      });

      if (type === "piece" && contentId) {
         queryClient.setQueryData<Content[]>(["user-contents"], (oldData) => {
            if (!oldData || !Array.isArray(oldData)) return oldData;

            return oldData.map((content) =>
               content._id === contentId
                  ? { ...content, isActive: newSharingState }
                  : content,
            );
         });
      }

      try {
         if (isSharing) {
            await disableMutation.mutateAsync();
         } else {
            await enableMutation.mutateAsync();
         }
      } catch (err) {
         queryClient.setQueryData(queryKey, previousPieceStatus);

         if (type === "piece" && contentId) {
            queryClient.setQueryData(["user-contents"], previousBrainContents);
         }
      } finally {
         queryClient.invalidateQueries({ queryKey });
      }
   };

   return { isSharing, isMutating, handleToggle };
};
