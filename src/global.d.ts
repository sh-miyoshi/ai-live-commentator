export {};

declare global {
  interface Window {
    llm: {
      chat: (payload: {
        model: string;
        messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
      }) => Promise<{ full: string }>;

      onChunk: (cb: (data: { chunk: string; full: string }) => void) => () => void;
      onDone: (cb: (data: { full: string }) => void) => () => void;
    };
  }
}
