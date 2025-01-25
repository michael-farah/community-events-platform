import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "./auth/AuthModal";

export const Navbar = () => {
  const { user, isAuthenticated, signOut, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    console.log("Sign out completed");
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/50 border-b border-gray-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <span className="text-2xl font-semibold text-slate-900 dark:text-white tracking-wide transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200">
                  Community Events
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/events"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-300/30 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors">
                  Events
                </Link>
                {user?.isStaff && (
                  <Link
                    to="/events/create"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-300/30 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors">
                    Create Event
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg
                    className="animate-spin h-5 w-5 text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Welcome, <span className="font-medium">{user.name}</span>
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};