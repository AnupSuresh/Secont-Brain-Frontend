import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";

export type loginData = {
   name: string;
   email: string;
   password: string;
};

const signupFn = async (data: loginData) => {
   const response = await api.post("/user/signup", data);
   return response.data.message;
};

export const useSignupnMutation = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: signupFn,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["user"] });
      },
   });
};
