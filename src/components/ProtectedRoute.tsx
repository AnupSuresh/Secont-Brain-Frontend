import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useMeQuery } from "../queries/auth/useMeQuery";
import Spinner from "./ui/Spinner";

type ProtectedRouteProps = {
   children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
   const { data: user, isLoading, isError } = useMeQuery(true);
   const location = useLocation();

   if (isLoading) {
      return (
         <div className="w-full flex items-center justify-center min-h-dvh bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
            <div className="text-center flex justify-center items-center gap-3">
               <Spinner />
               <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                  Verifying authentication...
               </p>
            </div>
         </div>
      );
   }

   if (user && !isError) {
      return <>{children}</>;
   }

   return <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;
