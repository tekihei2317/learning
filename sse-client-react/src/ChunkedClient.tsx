import { useState } from "react";

export function ChunkedClient() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStart = async () => {
    setText("");
    setIsStreaming(true);

    try {
      const response = await fetch("http://localhost:3000/stream-text");

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        setText((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    setText("");
  };

  return (
    <div>
      <h2>Chunked Streaming</h2>
      <button onClick={handleStart} disabled={isStreaming}>
        {isStreaming ? "Streaming..." : "Start Stream"}
      </button>
      <button onClick={handleReset}>Reset</button>
      <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
    </div>
  );
}
