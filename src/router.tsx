import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { EventsPage } from "./pages/EventsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "events",
        element: <EventsPage />,
      },
    ],
  },
]);