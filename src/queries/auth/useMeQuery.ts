import { useQuery } from "@tanstack/react-query";
import api from "../../api/axiosClient";

type User = {
   name: string;
   email: string;
};

const getUser = async (): Promise<User> => {
   console.trace("🚨 /me request fired");
   const response = await api.get("/user/me");
   return response.data.user;
};

export const useMeQuery = (enabled:boolean) => {
   return useQuery({
      queryKey: ["user"],
      queryFn: getUser,
      enabled: enabled,
      retry: false,
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000, 
      refetchOnWindowFocus: false, 
      refetchOnMount: false, 
   });
};
