export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fetch, { RequestInit } from "node-fetch";
import https from "https";

const PORTAINER_URL = process.env.PORTAINER_URL!;
const PORTAINER_TOKEN = process.env.PORTAINER_TOKEN!;
const CONTAINER_ID = process.env.CONTAINER_ID!;
const endpointId = 3;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

interface FetchWithAgent extends RequestInit {
  agent?: https.Agent;
}

// GET
export async function GET() {
  try {
    const headers = {
      "X-API-Key": PORTAINER_TOKEN,
      "Content-Type": "application/json",
    };

    const res = await fetch(
      `${PORTAINER_URL}/endpoints/${endpointId}/docker/containers/${CONTAINER_ID}/json`,
      { headers, agent: httpsAgent } as FetchWithAgent
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Portainer GET error:", text);
      return NextResponse.json({ error: "Failed to fetch container info" }, { status: res.status });
    }

    // rzutowanie typu
    const data = (await res.json()) as { State: { Running: boolean } };
    return NextResponse.json({ running: data.State.Running });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("GET fetch failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action } = (await req.json()) as { action: "start" | "stop" };

    const headers = {
      "X-API-Key": PORTAINER_TOKEN,
      "Content-Type": "application/json",
    };

    const res = await fetch(
      `${PORTAINER_URL}/endpoints/${endpointId}/docker/containers/${CONTAINER_ID}/${action}`,
      { method: "POST", headers, agent: httpsAgent } as FetchWithAgent
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Portainer POST error:", text);
      return NextResponse.json({ error: "Action failed" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("POST fetch failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
