export { };

declare global {
  interface Window {
    api: {
      chat: (payload: {
        title: string
      }) => Promise<ChatMessage[]>;
    };
  }
}
