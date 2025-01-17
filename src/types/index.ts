export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  max_attendees?: number;
  current_attendees?: number;
  image_url?: string;
  category?: string;
}