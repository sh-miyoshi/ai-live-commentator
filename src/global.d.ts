export { };

declare global {
  interface Window {
    api: {
      chat: (payload: {
        title: string
        context: string
      }) => Promise<Omit<ChatMessage, "isStreamer">[]>;
    };
  }
}
