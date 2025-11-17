export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fetch, { RequestInit } from "node-fetch";
import https from "https";

// 🔑 Ustaw w .env.local
const PORTAINER_URL = process.env.PORTAINER_URL!;
const PORTAINER_TOKEN = process.env.PORTAINER_TOKEN!;
const CONTAINER_NAME = process.env.CONTAINER_NAME!;
// ID endpointa z URL Portainera (np. #!/3/...)
const ENDPOINT_ID = 3; 

// Konfiguracja agenta HTTPS (wymagana dla self-signed certyfikatów)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Typ danych, który musi być rzutowany, aby użyć 'agent' w fetchu z node-fetch
interface FetchWithAgent extends RequestInit {
  agent?: https.Agent;
}

// Typ danych zwracanych przez Portainer
interface ContainerInfo {
  State: { Running: boolean };
  [key: string]: unknown;
}

// Nagłówki z kluczem API
const getHeaders = () => ({
  "X-API-Key": PORTAINER_TOKEN, // Używamy X-API-Key dla kluczy Portainera
  "Content-Type": "application/json",
});

/**
 * Zwraca ogólną odpowiedź błędu z poprawnym nagłówkiem Content-Type.
 * Zapobiega to błędom parsowania HTML/JSON na frontendzie.
 */
const handleErrorResponse = (message: string, status: number) => {
    console.error("API Error:", message);
    return NextResponse.json({ error: message }, { status });
};

// --- GET - STATUS KONTEJNERA (Endpoint: /api) ---
export async function GET(req: NextRequest) {
  // Jeśli żądanie ma parametr 'logs=true', przekierowujemy do logiki logów
  if (req.nextUrl.searchParams.get("logs") === "true") {
    return GET_LOGS();
  }
  
  try {
    const res = await fetch(
      `${PORTAINER_URL}/endpoints/${ENDPOINT_ID}/docker/containers/${CONTAINER_NAME}/json`,
      { 
        headers: getHeaders(), 
        agent: httpsAgent,
        // Zapobiega cache'owaniu odpowiedzi statusu przez Next.js
        cache: 'no-store' 
      } as FetchWithAgent
    );

    if (!res.ok) {
      const text = await res.text();
      return handleErrorResponse(`Portainer GET error: ${text}`, res.status);
    }

    const data = (await res.json()) as ContainerInfo;
    return NextResponse.json({ running: data.State.Running });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return handleErrorResponse(`GET fetch failed: ${message}`, 500);
  }
}

// --- LOGIKA POBIERANIA LOGÓW (Wewnętrzna funkcja, Endpoint: /api?logs=true) ---
async function GET_LOGS() {
  try {
    const logUrl = new URL(`${PORTAINER_URL}/endpoints/${ENDPOINT_ID}/docker/containers/${CONTAINER_NAME}/logs`);
    logUrl.searchParams.append("stdout", "true");
    logUrl.searchParams.append("stderr", "true");
    logUrl.searchParams.append("timestamps", "true");
    logUrl.searchParams.append("tail", "100");
    logUrl.searchParams.append("strip_ansi", "true");
    logUrl.searchParams.append("follow", "false"); // <--- bardzo ważne

    const res = await fetch(
      logUrl.toString(),
      {
        headers: {
            "X-API-Key": process.env.PORTAINER_TOKEN!,
            "Content-Type": "application/json",
        },
        agent: httpsAgent,
        cache: "no-store",
      } as FetchWithAgent
    );

    if (!res.ok) {
      const text = await res.text();
      return handleErrorResponse(`Portainer Logs GET error: ${text}`, res.status);
    }

    const logs = await res.text();
    return NextResponse.json({ logs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return handleErrorResponse(`GET logs fetch failed: ${message}`, 500);
  }
}


// --- POST - START / STOP KONTEJNERA (Endpoint: /api) ---
export async function POST(req: NextRequest) {
  try {
    const { action } = (await req.json()) as { action: "start" | "stop" };
    if (action !== "start" && action !== "stop") {
      return handleErrorResponse("Invalid action", 400);
    }

    const res = await fetch(
      `${PORTAINER_URL}/endpoints/${ENDPOINT_ID}/docker/containers/${CONTAINER_NAME}/${action}`,
      { method: "POST", headers: getHeaders(), agent: httpsAgent } as FetchWithAgent
    );

    if (!res.ok) {
      const text = await res.text();
      return handleErrorResponse(`Portainer POST error: ${text}`, res.status);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return handleErrorResponse(`POST fetch failed: ${message}`, 500);
  }
}