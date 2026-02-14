import { useQuery } from "@tanstack/react-query";
import api from "../../api/axiosClient";

type BrainShareInfo = {
   isSharing: boolean;
   hash: string | null;
   viewCount: number;
   expiresAt: string | null;
   createdAt: string;
};

const getBrainShareInfo = async (): Promise<BrainShareInfo> => {
   const { data } = await api.get("/content/brain/share/status");

   if (typeof data?.isSharing !== "boolean") {
      throw new Error("Invalid brain share response");
   }

   return data;
};

export const useBrainShareStatusQuery = () =>
   useQuery({
      queryKey: ["brain", "status"],
      queryFn: getBrainShareInfo,
      staleTime: 5 * 60 * 1000,
   });
