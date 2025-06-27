import { useState, useEffect } from "react";

export function SSEClient() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/sse");

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log("SSE connection opened");
    };

    eventSource.addEventListener("update", (e) => {
      setMessages((prev) => [...prev, e.data]);
    });

    eventSource.onerror = () => {
      setIsConnected(false);
      console.log("SSE connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  const handleReset = () => {
    setMessages([]);
  };

  return (
    <div>
      <h2>Server-Sent Events</h2>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <button onClick={handleReset}>Reset</button>
      <div>
        {messages.map((message, index) => (
          <span key={index}>{message}</span>
        ))}
      </div>
    </div>
  );
}
