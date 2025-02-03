import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-slate-900 dark:to-slate-800 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:bg-purple-900/50 animate-blob"></div>
          <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:bg-blue-900/50 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-6 leading-tight">
            Connect Through
            <br />
            <span className="text-4xl md:text-5xl">Community Events</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover local gatherings, meet like-minded people, and create
            unforgettable experiences in your neighborhood. What will you
            explore today?
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Browse Events
            </Link>

            {user?.isStaff && window.innerWidth > 640 && (
              <span className="text-gray-500 dark:text-gray-400 mx-2">or</span>
            )}

            {user?.isStaff && (
              <Link
                to="/events/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 hover:border-gray-400 dark:border-slate-600 dark:hover:border-slate-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Event
              </Link>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
                Diverse Activities
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                From tech meetups to art workshops, find what excites you
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">
                Local Connections
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Meet neighbors and build meaningful relationships
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
                Easy Participation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Simple registration and event management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
