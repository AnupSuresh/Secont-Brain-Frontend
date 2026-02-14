import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useTheme, useThemeActions } from "./store/AppStore";
import { ToastContainer } from "react-toastify";

function App() {
   const { initTheme } = useThemeActions();
   const theme = useTheme();

   useEffect(() => {
      initTheme();
   }, [initTheme]);

   return (
      <>
         <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme={theme}
         />
         <AppRoutes />
      </>
   );
}

export default App;
