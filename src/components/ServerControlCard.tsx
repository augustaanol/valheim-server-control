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
  const [running, setRunning] = useState(false);
  const [serverActive, setServerActive] = useState(false);
  // Zmiana: isInitialLoading służy tylko do pierwszego renderu, żeby nie migać co 2s
  const [isInitialLoading, setIsInitialLoading] = useState(true); 
  const [actionLoading, setActionLoading] = useState(false);
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [playersList, setPlayersList] = useState<PlayersList[] | null>(null);
  const [serverName, setServerName] = useState<string | null>(null);
  const [serverSteamID, setServerSteamID] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"; // Fallback

  // ---- 1. STATUS KONTENERA I SERWERA ----
  const fetchStatus = useCallback(async (skipLoadingState = false) => {
    // Nie ustawiamy loading na true przy cyklicznym odświeżaniu
    if (!skipLoadingState) setIsInitialLoading(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/server_status`);
      if (!res.ok) throw new Error("Network response was not ok");
      
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
      // W razie błędu zakładamy, że offline, ale nie resetujemy wszystkiego drastycznie
      // chyba że serwer faktycznie nie odpowiada.
      setRunning(false); 
      setServerActive(false);
      setPlayerCount(null);
      setPlayersList([]);
    } finally {
      setIsInitialLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    // Pierwsze pobranie z loadingiem
    fetchStatus();

    // Kolejne pobrania bez flagi loading (skipLoadingState=true)
    const interval = setInterval(() => {
      fetchStatus(true);
    }, 2000);

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

      // Natychmiastowe odświeżenie po akcji
      await fetchStatus(true); 

      if (action === "stop") {
        setServerActive(false);
        setPlayerCount(null);
        setPlayersList([]);
      }
    } catch (err) {
      console.error("Błąd wysyłania komendy:", err);
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
  
  // Pomocnicza funkcja do formatowania pozycji
  const fmtPos = (val: number) => val.toFixed(0);

  return (
    <Card>
      <Flex direction="column" gap="3" className="p-4">
        {/* --- STATUS SERWERA --- */}
        <Flex justify="between" align="center">
          <HoverCard.Root>
            <HoverCard.Trigger>
              <Heading as="h2" mb="2" trim="start" style={{ cursor: "default" }}>
                Status serwera
              </Heading>
            </HoverCard.Trigger>
            <HoverCard.Content side="top" align="center">
              <Grid columns="2" gap="2" width="auto">
                <Text size="2" color="gray">Nazwa serwera:</Text>
                <Badge style={{ justifySelf: "end" }}>{serverName || "-"}</Badge>

                <Text size="2" color="gray">Steam ID:</Text>
                <Badge style={{ justifySelf: "end" }}>{serverSteamID || "-"}</Badge>
              </Grid>
            </HoverCard.Content>
          </HoverCard.Root>
          
          {/* Opcjonalnie: Pokaż spinner jeśli to pierwsze ładowanie */}
          {isInitialLoading ? (
             <Badge color="gray">Ładowanie...</Badge>
          ) : (
             <Badge color={statusColor}>{statusLabel}</Badge>
          )}
        </Flex>

        {/* --- PRZYCISKI START/STOP --- */}
        <Flex gap="2">
          <Button
            variant="surface"
            color="green"
            // Blokujemy start też gdy serwer już wstaje (yellow status)
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
            <Text weight="bold">Gracze online:</Text>
            <Badge color={playerCount && playerCount > 0 ? "green" : "gray"}>
              {playerCount ?? 0}
            </Badge>
          </Flex>
        )}

        {/* --- LISTA GRACZY --- */}
        {serverActive && playersList && playersList.length > 0 && (
          <Flex direction="column" gap="2">
            {playersList.map((player) => (
              // POPRAWKA: Użycie steam_id jako klucza
              <Card key={player.steam_id || player.name}>
                <Flex justify="between" align="center">
                  <Flex direction="column" gap="1">
                    <Text weight="bold">{player.name}</Text>
                    <Text size="1" color="gray">{player.steam_id}</Text>
                  </Flex>

                  <Flex direction="column" gap="1" align="end">
                    <Flex gap="2" align="center">
                      <Text size="1" color="gray">HP:</Text>
                      <Badge color="gray" size="1">
                          {player.hp ? `${player.hp[0]} / ${player.hp[1]}` : "?"}
                      </Badge>
                    </Flex>
                    <Flex gap="2" align="center">
                      <Text size="1" color="gray">Pos:</Text>
                      <Badge color="gray" size="1">
                          {player.position 
                            ? `${fmtPos(player.position[0])}, ${fmtPos(player.position[1])}, ${fmtPos(player.position[2])}` 
                            : "?"}
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