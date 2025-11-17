// src/app/api/active-players/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const host = process.env.VALHEIM_HOST;
  const port = process.env.VALHEIM_STATUS_PORT; // np. 8090

  if (!host || !port) {
    console.error("Missing VALHEIM_HOST or VALHEIM_STATUS_PORT env vars");
    return NextResponse.json({ error: true, online: null });
  }

  const url = `http://${host}:${port}/status.json`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Status server error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      online: data.player_count ?? 0,
      maxPlayers: data.max_players ?? null,
      world: data.world_name ?? null,
      serverName: data.server_name ?? null,
      raw: data // dodatkowo, abyś mógł debugować
    });
  } catch (err) {
    console.error("VALHEIM STATUS API ERROR:", err);
    return NextResponse.json({ error: true, online: null });
  }
}
