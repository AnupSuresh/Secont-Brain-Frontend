import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

const MainLayout = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);

   return (
      <div className="w-full h-dvh flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
         {/* Navbar */}
         <div className="shrink-0 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-50">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
         </div>

         <div className="flex-1 flex overflow-hidden bg-linear-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
            {/* Mobile overlay */}
            {sidebarOpen && (
               <div
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
               />
            )}

            {/* Sidebar */}
            <aside
               className={`
            fixed lg:static inset-y-0 left-0 z-50
            shrink-0 border-r border-gray-200 dark:border-zinc-800
            bg-white dark:bg-zinc-900 shadow-sm
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
            >
               <SideBar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
               <main className="flex-1 overflow-y-auto overflow-x-hidden">
                  <div className="min-h-full flex">
                     <Outlet />
                  </div>
               </main>
            </div>
         </div>
      </div>
   );
};

export default MainLayout;
