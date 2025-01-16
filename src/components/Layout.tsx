import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main
        className="container mx-auto px-4 py-8 flex-grow"
        aria-label="Main content">
        <Outlet />
      </main>
      <footer className="w-full bg-white dark:bg-gray-800 border-t">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Community Events Platform
        </div>
      </footer>
    </div>
  );
};