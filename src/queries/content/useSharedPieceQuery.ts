// queries/content/useSharedBrainQuery.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import type { AxiosError } from "axios";
import type { ContentType } from "./useContentQuery";

// Types
type Tag = {
   _id: string;
   name: string;
};

export type Hash = string | null | undefined;

export type SharedPiece = {
   _id: string;
   title: string;
   link: string;
   tags: Tag[];
   type: ContentType;
};

interface PieceApiResponse {
   brainPiece: SharedPiece;
   expiresAt: Date;
   message: string;
}

// Query Keys
export const sharedBrainKeys = {
   all: ["brain", "piece", "shared"] as const,
   byHash: (hash: Hash) => [...sharedBrainKeys.all, hash] as const,
};

// Fetch Function
export const fetchSharedPiece = async (
   hash: Hash,
): Promise<PieceApiResponse> => {
   if (!hash) {
      throw new Error("Hash is required");
   }

   const { data } = await api.get<PieceApiResponse>(
      `/content/brain/piece/shared/${hash}`,
   );

   if (!data?.brainPiece) {
      throw new Error("Invalid response structure");
   }

   return data;
};

// Query Options (exported for reuse)
export const sharedPieceQueryOptions = (hash: Hash) => ({
   queryKey: sharedBrainKeys.byHash(hash),
   queryFn: () => fetchSharedPiece(hash),
   enabled: !!hash,
   staleTime: 5 * 60 * 1000, // 5 minutes
   retry: (failureCount: number, error: AxiosError) => {
      const status = error?.response?.status;
      if (status === 404 || status === 401 || status === 403) {
         return false;
      }
      return failureCount < 2;
   },
});

// Hook
export const useSharedPieceQuery = (
   hash: Hash,
): UseQueryResult<PieceApiResponse, Error> => {
   return useQuery(sharedPieceQueryOptions(hash));
};
