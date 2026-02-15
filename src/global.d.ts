export { };

declare global {
  interface Window {
    api: {
      chat: () => Promise<ChatMessage[]>;
    };
  }
}
