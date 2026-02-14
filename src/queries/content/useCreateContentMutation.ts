import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

export type CreateContentData = {
   title?: string;
   link?: string;
   tags?: string[];
};

const createContentFn = async (content: CreateContentData) => {
   const response = await api.post(`/content/create`, content);
   return response.data;
};

export const useCreateContentMutation = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createContentFn,
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ["user-contents"] });
         toast.success(data?.message);
      },
      onError: (error: AxiosError<{ message?: string }>) => {
         const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to Create content";

         toast.error(message);
      },
   });
};
