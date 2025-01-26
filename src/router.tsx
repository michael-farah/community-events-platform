import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { EventsPage } from "./pages/EventsPage";
import { HomePage } from "./pages/HomePage";
import { EventPage } from "./pages/EventPage";
import { CreateEventPage } from "./pages/CreateEventPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:eventId", element: <EventPage /> },
      { path: "events/create", element: <CreateEventPage /> },
    ],
  },
]);