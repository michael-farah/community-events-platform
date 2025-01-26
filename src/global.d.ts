declare namespace google.accounts.oauth2 {
  interface TokenClient {
    callback: (resp: any) => void;
    requestAccessToken: (params: { prompt: string }) => void;
  }
  function initTokenClient(config: {
    client_id: string;
    scope: string;
    callback?: (resp: any) => void;
  }): TokenClient;
  function revoke(token: string): void;
}