import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types";
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { format, parseISO, isPast, differenceInDays } from "date-fns";

export const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoading: authLoading, showAuthModal } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      loadEvents();
    }
  }, [authLoading]);

  const loadEvents = async () => {
    console.log("Starting to load events...");
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          id,
          title,
          description,
          date,
          time,
          location,
          max_attendees,
          current_attendees,
          image_url,
          organizer:profiles(name)
        `
        )
        .order("date", { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedEvents = data.map((event:any) => ({
          ...event,
          organizer:
            (event.organizer as { name: string })?.name ||
            "Unknown Organizer",
          date: new Date(event.date).toISOString(),
          current_attendees: event.current_attendees || 0,
          max_attendees: event.max_attendees || undefined,
        }));

        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Detailed error in loadEvents:", err);
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = async (eventId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      sessionStorage.setItem("redirectEventId", eventId);
      showAuthModal();
    } else {
      navigate(`/events/${eventId}`);
    }
  };

  const getEventStatus = (date: string) => {
    const eventDate = parseISO(date);
    if (isPast(eventDate)) return "past";
    const daysUntil = differenceInDays(eventDate, new Date());
    if (daysUntil <= 7) return "soon";
    return "upcoming";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Community Events
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join exciting gatherings and connect with your community
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl mb-4" />
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded mb-3 w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-full" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <div className="text-red-600 dark:text-red-400 font-medium mb-2">
            Failed to load events
          </div>
          <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
          <button
            onClick={loadEvents}
            className="mt-4 px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg transition-colors">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-48 w-48 text-gray-300 dark:text-slate-600 mb-4">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            No upcoming events found
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Check back later or create your own event to get started!
          </p>
        </div>
      )}

      {!isLoading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const status = getEventStatus(event.date);
            const eventDate = parseISO(event.date);

            return (
              <div
                key={event.id}
                className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer relative overflow-hidden"
                onClick={() => handleEventClick(event.id)}>
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-56 object-cover rounded-t-xl transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-56 bg-gray-100 dark:bg-slate-700 flex items-center justify-center rounded-t-xl">
                    <svg
                      className="w-16 h-16 text-gray-300 dark:text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize"
                      style={{
                        backgroundColor:
                          status === "past"
                            ? "rgba(239, 68, 68, 0.1)"
                            : status === "soon"
                            ? "rgba(234, 179, 8, 0.1)"
                            : "rgba(59, 130, 246, 0.1)",
                        color:
                          status === "past"
                            ? "#dc2626"
                            : status === "soon"
                            ? "#ca8a04"
                            : "#2563eb",
                      }}>
                      {status === "past"
                        ? "Past Event"
                        : status === "soon"
                        ? "Soon"
                        : "Upcoming"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      {format(eventDate, "MMM d, yyyy")}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 dark:text-slate-300 line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">{event.location}</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>
                        {event.current_attendees} / {event.max_attendees || "∞"}{" "}
                        attendees
                      </span>
                    </div>

                    {event.organizer && (
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="truncate">
                          Hosted by {event.organizer}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm">
                        {Math.round(
                          ((event.current_attendees || 0) /
                            (event.max_attendees || 1)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            ((event.current_attendees || 0) /
                              (event.max_attendees || 1)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
