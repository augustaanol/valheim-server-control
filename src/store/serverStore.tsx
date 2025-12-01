"use client";

import { create } from "zustand";

export type PlayersList = {
  name: string;
  hp: [number, number] | null;
  steam_id: string;
  position: [number, number, number] | null;
};

type ServerStore = {
  running: boolean;
  serverActive: boolean;
  isInitialLoading: boolean;
  actionLoading: boolean;
  playerCount: number | null;
  playersList: PlayersList[];
  serverName: string | null;
  serverSteamID: string | null;

  fetchStatus: (skipLoading?: boolean) => Promise<void>;
  handleAction: (action: "start" | "stop") => Promise<void>;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3000"; // <- upewnij się, że działa w przeglądarce

export const useServerStore = create<ServerStore>((set, get) => ({
  running: false,
  serverActive: false,
  isInitialLoading: true,
  actionLoading: false,
  playerCount: null,
  playersList: [],
  serverName: null,
  serverSteamID: null,

  fetchStatus: async (skipLoading = false) => {
    if (!skipLoading) set({ isInitialLoading: true });

    try {
      const res = await fetch(`${BACKEND_URL}/api/server-status`);
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      set({
        running: data.server_status !== "offline",
        serverActive: data.server_status === "online",
        playerCount: data.player_count ?? null,
        serverName: data.server_name ?? null,
        serverSteamID: data.steam_id ?? null,
        playersList: Array.isArray(data.players) ? data.players : [],
      });
    } catch (error) {
      console.warn("Server offline lub błąd fetch:", error);
      // ustaw status offline, ale nie resetuj wszystkiego drastycznie
      set({
        running: false,
        serverActive: false,
        playerCount: null,
        playersList: [],
      });
    } finally {
      set({ isInitialLoading: false });
    }
  },

  handleAction: async (action: "start" | "stop") => {
    set({ actionLoading: true });
    try {
      await fetch(`${BACKEND_URL}/api/container-control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      // natychmiastowe odświeżenie stanu po akcji
      await get().fetchStatus(true);

      if (action === "stop") {
        set({
          serverActive: false,
          playerCount: null,
          playersList: [],
        });
      }
    } catch (err) {
      console.error("Błąd wysyłania akcji:", err);
    } finally {
      set({ actionLoading: false });
    }
  },
}));
