import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { eventsApi } from "../utils/api/events";
import { useAuth } from "../context/AuthContext";
import { format, parseISO, isPast } from "date-fns";

export const EventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, isAuthenticated, showAuthModal } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      setIsLoading(true);
      try {
        const eventData = await eventsApi.getEvent(eventId);
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setIsLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  const handleRegistration = async () => {
    if (!isAuthenticated || !user) {
      sessionStorage.setItem("redirectEventId", eventId!);
      showAuthModal();
      return;
    }
    try {
      await eventsApi.registerForEvent(eventId!, user.id);
      const updatedEvent = await eventsApi.getEvent(eventId!);
      setEvent(updatedEvent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const handleUnregistration = async () => {
    if (!isAuthenticated || !user || !eventId) return;
    try {
      await eventsApi.unregisterFromEvent(eventId, user.id);
      const updatedEvent = await eventsApi.getEvent(eventId);
      setEvent(updatedEvent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unregistration failed");
    }
  };

  if (!eventId) {
    return (
      <div className="text-center py-12 text-red-500">Event not found</div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-full" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <div className="text-red-600 dark:text-red-400 font-medium mb-2">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isRegistered = event.registrations?.some(
    (reg: any) => reg.user_id === user?.id
  );
  const isEventFull =
    event.max_attendees && event.current_attendees >= event.max_attendees;
  const isEventPast = isPast(parseISO(event.date));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {event.title}
        </h1>
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <div className="text-gray-600 dark:text-gray-300 space-y-4 mb-6">
          <p>{event.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {format(parseISO(event.date), "MMM d, yyyy")} at {event.time}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location}</span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>
              {event.current_attendees} / {event.max_attendees || "∞"} attendees
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Hosted by {event.organizer?.name || "Unknown"}</span>
          </div>
        </div>

        {!isEventPast && (
          <div className="mt-8">
            {isRegistered ? (
              <button
                onClick={handleUnregistration}
                className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
                Unregister from Event
              </button>
            ) : (
              <button
                onClick={handleRegistration}
                disabled={isEventFull || !isAuthenticated}
                className={`w-full py-3 px-6 ${
                  isEventFull || !isAuthenticated
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold rounded-lg transition-colors`}>
                {isEventFull
                  ? "Event Full"
                  : !isAuthenticated
                  ? "Sign In to Register"
                  : "Register Now"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};