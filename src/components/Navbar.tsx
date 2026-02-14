import { Link, useLocation } from "react-router-dom";
import ToggleDark from "./ui/ToggleDark";
import { useMeQuery } from "../queries/auth/useMeQuery";
import { useLogoutMutation } from "../queries/auth/useLogoutMutation";
import { useState } from "react";

interface NavbarProps {
   onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
   const location = useLocation();
   const logoutMutation = useLogoutMutation();
   const { data: queryUser, isError, isLoading } = useMeQuery(true);

   const handleLogout = async () => {
      await logoutMutation.mutateAsync();
      setIsUserMenuOpen(false);
   };

   const isActive = (path: string) => location.pathname === path;

   const navLinks: { path: string; label: string }[] = [];

   return (
      <nav className="relative flex justify-between items-center py-3 px-4 sm:py-4 sm:px-6 md:px-10 w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
         {/* Left: Hamburger (mobile) + Logo */}
         <div className="flex items-center gap-2 sm:gap-8">
            {/* Hamburger button — only on mobile */}
            <button
               type="button"
               onClick={onMenuClick}
               className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
               aria-label="Open sidebar"
            >
               <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M4 6h16M4 12h16M4 18h16"
                  />
               </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-white font-bold text-base sm:text-xl">
                     B
                  </span>
               </div>
               <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent hidden sm:block">
                  Brain
               </span>
            </Link>

            {/* Desktop Nav Links */}
            {navLinks.length > 0 && (
               <div className="hidden md:flex items-center gap-1">
                  {navLinks.map((link) => (
                     <Link
                        key={link.path}
                        to={link.path}
                        className={`
                           px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                           ${
                              isActive(link.path)
                                 ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                                 : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                           }
                        `}
                     >
                        {link.label}
                     </Link>
                  ))}
               </div>
            )}
         </div>

         {/* Right Section */}
         <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle — hidden on mobile (shown inside dropdown instead) */}
            <div className="hidden sm:block">
               <ToggleDark />
            </div>

            {/* User Section */}
            {isLoading ? (
               <div className="flex items-center gap-2 px-2 py-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="w-20 h-4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse hidden md:block" />
               </div>
            ) : isError || !queryUser ? (
               <Link
                  to="/auth"
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
               >
                  Login
               </Link>
            ) : (
               <div className="relative">
                  <button
                     type="button"
                     onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                     className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                     aria-expanded={isUserMenuOpen}
                     aria-haspopup="true"
                  >
                     {/* Avatar */}
                     <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shrink-0">
                        {queryUser.name?.charAt(0).toUpperCase() || "U"}
                     </div>

                     {/* User Info — desktop only */}
                     <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                           {queryUser.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                           {queryUser.email}
                        </p>
                     </div>

                     {/* Dropdown Arrow */}
                     <svg
                        className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 hidden sm:block ${isUserMenuOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M19 9l-7 7-7-7"
                        />
                     </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                     <>
                        {/* Backdrop */}
                        <div
                           className="fixed inset-0 z-10"
                           onClick={() => setIsUserMenuOpen(false)}
                        />

                        {/* Menu — anchored right, won't overflow on small screens */}
                        <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden z-20">
                           {/* User Info in Dropdown */}
                           <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                 {queryUser.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                 {queryUser.email}
                              </p>
                           </div>

                           {/* Menu Items */}
                           <div className="py-2">
                              <Link
                                 to="/profile"
                                 className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                 onClick={() => setIsUserMenuOpen(false)}
                              >
                                 <svg
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                 </svg>
                                 Profile
                              </Link>

                              <Link
                                 to="/settings"
                                 className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                 onClick={() => setIsUserMenuOpen(false)}
                              >
                                 <svg
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                 </svg>
                                 Settings
                              </Link>

                              {/* Theme toggle — only inside dropdown on mobile */}
                              <div className="sm:hidden">
                                 <div className="h-px bg-gray-200 dark:bg-zinc-800 my-2" />
                                 <div className="px-4 py-2.5 flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                       Theme
                                    </span>
                                    <ToggleDark />
                                 </div>
                              </div>

                              <div className="h-px bg-gray-200 dark:bg-zinc-800 my-2" />

                              <button
                                 type="button"
                                 onClick={handleLogout}
                                 className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                 <svg
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                 </svg>
                                 Logout
                              </button>
                           </div>
                        </div>
                     </>
                  )}
               </div>
            )}
         </div>
      </nav>
   );
};

export default Navbar;
