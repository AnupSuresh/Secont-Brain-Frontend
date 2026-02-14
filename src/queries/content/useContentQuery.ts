import { useQuery } from "@tanstack/react-query";
import api from "../../api/axiosClient";

type Tag = {
   _id: string;
   name: string;
};

export type ContentType = "video" | "tweet" | "link";

export type Content = {
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

const getContent = async (): Promise<Content[]> => {
   const response = await api.get("/content/user");
   return response.data.contents;
};

export const useContentQuery = (enabled:boolean) =>
   useQuery({
      queryKey: ["user-contents"],
      enabled: enabled,
      queryFn: getContent,
   });
