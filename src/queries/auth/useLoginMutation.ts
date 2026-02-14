import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";

export type loginData = {
   email: string;
   password: string;
};

const loginFn = async (data: loginData) => {
   const response = await api.post("/user/login", data);
   return response.data.message;
};

export const useLoginMutation = () => {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: loginFn,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["user"] });
      },
   });
};
