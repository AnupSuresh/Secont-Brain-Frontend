import { useMutation } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const enableSharingFn = async (contentId: string) => {
   const res = await api.post(`/content/brain/piece/share/${contentId}`);
   return res.data;
};

export const useEnableSharePieceMutation = (contentId: string) =>
   useMutation({
      mutationFn: () => enableSharingFn(contentId),
      onSuccess: (data) => {
         toast.success(data.message);
      },
      onError: (error: AxiosError<{ message?: string }>) => {
         const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to Create content";

         toast.error(message);
      },
   });
