import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-gray-200 dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center text-gray-800 dark:text-gray-100">
          <Link
            to="/"
            className="font-bold text-xl hover:text-gray-600 dark:hover:text-gray-300"
          >
            Community Events
          </Link>
          <div className="flex gap-4">
            <Link
              to="/events"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              Events
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};