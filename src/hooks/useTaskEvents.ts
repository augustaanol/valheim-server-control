import { useEffect } from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function useTaskEvents(onUpdate: () => void) {
  useEffect(() => {
    const es = new EventSource(`${BACKEND_URL}/api/events/tasks`);

    es.onmessage = () => {
      onUpdate(); // 🔥 fetchTasks()
    };

    es.onerror = (err) => {
      console.error("SSE error", err);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [onUpdate]);
}
