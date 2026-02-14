import { useMutation } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const enableSharingFn = async () => {
   const res = await api.delete("/content/brain/share");
   return res.data;
};

export const useDisableShareBrainMutation = () =>
   useMutation({
      mutationFn: enableSharingFn,
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
