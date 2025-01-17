import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types";
import { eventsApi } from "../utils/api/events";

export const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventsApi.getEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = async (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Community Events</h1>

      {isLoading && (
        <div className="text-center py-8">
          <p>Loading events...</p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="text-center py-8">
          <p>No events found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleEventClick(event.id)}>
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {event.description}
            </p>
            <div className="space-y-2 text-sm">
              <p>
                📅 {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
              <p>📍 {event.location}</p>
              <p>
                👥 {event.current_attendees}/{event.max_attendees || "∞"}{" "}
                attending
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};