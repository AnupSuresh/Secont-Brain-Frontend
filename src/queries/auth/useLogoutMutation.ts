import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const logoutFn = async () => {
   const response = await api.post("/user/logout");
   return response.data;
};

export const useLogoutMutation = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: logoutFn,
      onSuccess: (data) => {
         queryClient.clear();
         toast.success(data.message);
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
