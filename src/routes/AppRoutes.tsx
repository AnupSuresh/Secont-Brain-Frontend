import { Route, Routes, Navigate } from "react-router-dom";
import Auth from "../pages/Auth";
import MainLayout from "../layouts/MainLayout";
import type { ReactElement } from "react";
import Brain from "../pages/Brain";
import ProtectedRoute from "../components/ProtectedRoute";
import Card from "../components/Card";

interface RouteType {
   path: string;
   element: ReactElement;
   protected: boolean;
   title?: string;
}

const routesConfig: RouteType[] = [
   {
      path: "/auth",
      element: <Auth />,
      protected: false,
      title: "Authentication",
   },
   {
      path: "/brain/:hash",
      element: <Brain />,
      protected: false,
      title: "Shared Brain",
   },
   {
      path: "/brain/piece/:pieceHash",
      element: <Card layout="page" />,
      protected: false,
      title: "Shared Piece",
   },
   {
      path: "/brain",
      element: <Brain />,
      protected: true,
      title: "Brain",
   },
];

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/" element={<MainLayout />}>
            {/* Home Route */}
            <Route
               index
               element={
                  <ProtectedRoute>
                     <Brain />
                  </ProtectedRoute>
               }
            />

            {/* Dynamic Routes */}
            {routesConfig.map(({ path, element, protected: isProtected }) => (
               <Route
                  key={path}
                  path={path}
                  element={
                     isProtected ? (
                        <ProtectedRoute>{element}</ProtectedRoute>
                     ) : (
                        element
                     )
                  }
               />
            ))}

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
         </Route>
      </Routes>
   );
};

export default AppRoutes;
