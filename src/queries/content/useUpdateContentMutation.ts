import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

export type UpdateContentData = {
   title?: string;
   link?: string;
   tags?: string[];
};

const updateContentFn = async ({
   content,
   contentId,
}: {
   content: UpdateContentData;
   contentId: string;
}) => {
   const response = await api.patch(`/content/update/${contentId}`, content);
   return response.data;
};

export const useUpdateContentMutation = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateContentFn,
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ["user-contents"] });
         toast.success(data?.message);
      },
      onError: (error: AxiosError<{ message?: string }>) => {
         const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete content";

         toast.error(message);
      },
   });
};
