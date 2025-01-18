import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Welcome to Community Events</h1>
      <p className="text-lg dark:text-gray-200 mb-8">
        Discover and join exciting events in your community. Connect with others
        and make memories together.
      </p>
      <Link
        to="/events"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Browse Events
      </Link>
    </div>
  );
};