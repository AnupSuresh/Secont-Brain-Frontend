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

export type SharedBrain = {
   _id: string;
   title: string;
   link: string;
   type: ContentType;
   tags: Tag[];
   userId: string;
   hash: string;
   isActive: boolean;
   expiresAt: Date;
   createdAt: string;
   updatedAt: string;
};

interface BrainApiResponse {
   brain: SharedBrain[];
}

// Query Keys
export const sharedBrainKeys = {
   all: ["brain", "shared"] as const,
   byHash: (hash: Hash) => [...sharedBrainKeys.all, hash] as const,
};

// Fetch Function
export const fetchSharedBrain = async (hash: Hash): Promise<SharedBrain[]> => {
   if (!hash) {
      throw new Error("Hash is required");
   }

   const { data } = await api.get<BrainApiResponse>(
      `/content/brain/shared/${hash}`,
   );

   if (!data?.brain) {
      throw new Error("Invalid response structure");
   }

   return data.brain;
};

// Query Options (exported for reuse)
export const sharedBrainQueryOptions = (hash: Hash) => ({
   queryKey: sharedBrainKeys.byHash(hash),
   queryFn: () => fetchSharedBrain(hash),
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
export const useSharedBrainQuery = (
   hash: Hash,
): UseQueryResult<SharedBrain[], Error> => {
   return useQuery(sharedBrainQueryOptions(hash));
};
