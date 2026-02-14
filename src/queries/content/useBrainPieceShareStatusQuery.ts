import { useQuery } from "@tanstack/react-query";
import api from "../../api/axiosClient";

type BrainShareInfo = {
   isSharing: boolean;
   hash: string | null;
   expiresAt: string | null;
};

const getBrainPieceShareInfo = async (
   contentId: string,
): Promise<BrainShareInfo | undefined> => {
   const { data } = await api.get(
      `/content/brain/piece/share/status/${contentId}`,
   );

   if (typeof data?.isSharing !== "boolean") {
      throw new Error("Invalid brain piece share response");
   }

   return data;
};

export const useBrainPieceShareStatusQuery = (contentId: string) =>
   useQuery({
      queryKey: ["brain", "piece", "status", contentId],
      queryFn: () => getBrainPieceShareInfo(contentId),
      staleTime: 5 * 60 * 1000,
      enabled: !!contentId,
   });
