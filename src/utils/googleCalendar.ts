const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient: google.accounts.oauth2.TokenClient;

export function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
}

export function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
  });
}

export function handleAuthClick(
  onAuthSuccess: () => void,
  onAuthFailure: (error: any) => void
) {
  tokenClient.callback = async (resp: any) => {
    if (resp.error !== undefined) {
      onAuthFailure(resp.error);
      return;
    }
    onAuthSuccess();
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

export function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken(null);
  }
}

export async function addEventToCalendar(eventDetails: {
  title: string;
  location: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
}) {
  const event = {
    summary: eventDetails.title,
    location: eventDetails.location,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startDateTime,
      timeZone: "UTC",
    },
    end: {
      dateTime: eventDetails.endDateTime,
      timeZone: "UTC",
    },
  };

  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    console.log("Event created: ", response);
    return response;
  } catch (err) {
    console.error("Error creating event: ", err);
    throw err;
  }
}

(window as any).gapiLoaded = gapiLoaded;
(window as any).gisLoaded = gisLoaded;