"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Flex,
  Card,
  Heading,
  Badge,
  Button,
  Text,
  HoverCard,
  Grid
} from "@radix-ui/themes";

type BadgeColor = "green" | "red" | "yellow" | "gray";

type PlayersList = {
  name: string;
  hp: [number, number] | null;
  steam_id: string;
  position: [number, number, number] | null;
};

export default function ServerControlCard() {
  const [running, setRunning] = useState(false); // kontener działa
  const [serverActive, setServerActive] = useState(false); // serwer odpowiada
  const [statusLoading, setStatusLoading] = useState(true); // loading statusu
  const [actionLoading, setActionLoading] = useState(false); // loading dla przycisków
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [playersList, setPlayersList] = useState<PlayersList[] | null>(null);
  const [serverName, setServerName] = useState<string | null>(null);
  const [serverSteamID, setServerSteamID] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ---- 1. STATUS KONTENERA I SERWERA ----
  const fetchStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/server_status`);
      const data = await res.json();

      setRunning(data.server_status !== "offline");
      setServerActive(data.server_status === "online");
      setPlayerCount(data.player_count);
      setServerName(data.server_name || null);
      setServerSteamID(data.steam_id || null);

      if (data.players && Array.isArray(data.players)) {
        setPlayersList(data.players);
      } else {
        setPlayersList([]);
      }
    } catch (error) {
      console.error("Błąd pobierania statusu serwera:", error);
      setRunning(false);
      setServerActive(false);
      setPlayerCount(null);
      setPlayersList([]);
    } finally {
      setStatusLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // ---- 2. AKCJE START/STOP ----
  const handleAction = async (action: "start" | "stop") => {
    setActionLoading(true);
    try {
      await fetch(`${BACKEND_URL}/api/container-control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });

      await fetchStatus();

      if (action === "stop") {
        setServerActive(false);
        setPlayerCount(null);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ---- LOGIKA WYŚWIETLANIA STATUSU ----
  let statusLabel = "Offline";
  let statusColor: BadgeColor = "red";

  if (!running) {
    statusLabel = "Offline";
    statusColor = "red";
  } else if (running && !serverActive) {
    statusLabel = "Starting";
    statusColor = "yellow";
  } else {
    statusLabel = "Online";
    statusColor = "green";
  }

  return (
    <Card>
      <Flex direction="column" gap="3" className="p-4">
        {/* --- STATUS SERWERA --- */}
        <Flex justify="between">
          <HoverCard.Root>
            <HoverCard.Trigger>
              <Heading as="h2" mb="2" trim="start">
                Status serwera
              </Heading>
            </HoverCard.Trigger>
            <HoverCard.Content side="top" align="center">
              <Grid columns="2" gap="2" width="auto">
                <Text>Nazwa serwera:</Text>
                <Badge style={{ justifySelf: "end" }}>{serverName}</Badge>

                <Text>Steam ID:</Text>
                <Badge style={{ justifySelf: "end" }}>{serverSteamID}</Badge>
              </Grid>
            </HoverCard.Content>
          </HoverCard.Root>
          <Badge color={statusColor}>{statusLabel}</Badge>
        </Flex>

        {/* --- PRZYCISKI START/STOP --- */}
        <Flex gap="2">
          <Button
            variant="surface"
            color="green"
            disabled={running || actionLoading}
            onClick={() => handleAction("start")}
          >
            Run server
          </Button>
          <Button
            variant="surface"
            color="red"
            disabled={!running || actionLoading}
            onClick={() => handleAction("stop")}
          >
            Stop server
          </Button>
        </Flex>

        {/* --- GRACZE ONLINE --- */}
        {serverActive && (
          <Flex align="center" gap="2" className="mt-2">
            <Text>Gracze online:</Text>
            <Badge color={playerCount && playerCount > 0 ? "green" : "gray"}>
              {playerCount ?? 0}
            </Badge>
          </Flex>
        )}

        {/* --- LISTA GRACZY --- */}
        {serverActive && playersList && playersList.length > 0 && (
          <Flex direction="column" gap="2">
            {playersList.map((player) => (
              <Card key={player.name}>
                <Flex justify="between" align="center">
                  <Flex direction="column" gap="1">
                    <Text weight="bold">{player.name}</Text>
                    <Text size="1">{player.steam_id}</Text>
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Flex gap="3" align="center" justify="between">
                      <Text size="1">HP:</Text>
                      <Badge color="gray" size="1">
                        <Text>
                          {player.hp?.[0] ?? "?"} / {player.hp?.[1] ?? "?"}
                        </Text>
                      </Badge>
                    </Flex>
                    <Flex gap="3" align="center" justify="between">
                      <Text size="1">Position:</Text>
                      <Badge color="gray" size="1">
                        <Text>
                          {player.position?.[0] ?? "?"},{" "}
                          {player.position?.[1] ?? "?"},{" "}
                          {player.position?.[2] ?? "?"}
                        </Text>
                      </Badge>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
