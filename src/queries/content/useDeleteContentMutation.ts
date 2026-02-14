import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

type DeleteContentResponse = {
   message: string;
};

const deleteContentFn = async (
   contentId: string,
): Promise<DeleteContentResponse> => {
   const res = await api.delete(`/content/delete/${contentId}`);
   return res.data;
};

export const useDeleteContentMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteContentFn,

      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["user-contents"],
         });

         toast.success("Content deleted");
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
