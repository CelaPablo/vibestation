export {};

declare global {
  interface Window {
    electron: {
      generateText: (model: string, prompt: string) => Promise<string>;
    };
  }
}