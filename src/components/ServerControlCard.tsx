"use client";

import { useState, useEffect, useCallback } from "react";
import { Flex, Card, Heading, Badge, Button, Text } from "@radix-ui/themes";

// Definiujemy typ dla kolorów Radix UI
type BadgeColor = "green" | "red" | "yellow" | "gray";

export default function ServerControlCard() {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [serverActive, setServerActive] = useState<boolean>(false);

  // ---- 1. STATUS KONTENERA (DOCKER) ----
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/container-status");
      const data = await res.json();
      setRunning(data.running);
      // Jeśli kontener nie działa, resetujemy też stan aktywności serwera gry
      if (!data.running) {
        setServerActive(false);
        setPlayerCount(null);
      }
    } catch (error) {
      console.error("Błąd statusu kontenera", error);
      setRunning(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAction = async (action: "start" | "stop") => {
    setLoading(true);
    try {
      await fetch("/api/container-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await fetchStatus();
      if (action === "stop") {
        setServerActive(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // ---- 2. STATUS GRACZY I GRY ----
  const loadPlayers = useCallback(async () => {
    if (!running) return; // Nie pytamy o graczy, jeśli kontener leży

    try {
      const res = await fetch("/api/active-players");
      const data = await res.json();

      setServerActive(data.server_active);

      if (data.server_active) {
        setPlayerCount(data.online);
      } else {
        setPlayerCount(null);
      }
    } catch {
      setServerActive(false);
      setPlayerCount(null);
    }
  }, [running]);

  useEffect(() => {
    loadPlayers();
    const interval = setInterval(loadPlayers, 5000);
    return () => clearInterval(interval);
  }, [loadPlayers]);

  // ---- LOGIKA WYŚWIETLANIA GŁÓWNEGO STATUSU ----
  
  let statusLabel = "Offline";
  let statusColor: BadgeColor = "red";

  if (!running) {
    // 1. Kontener nie działa
    statusLabel = "Offline";
    statusColor = "red";
  } else if (running && !serverActive) {
    // 2. Kontener działa, ale gra się ładuje (API nie odpowiada)
    statusLabel = "Starting";
    statusColor = "yellow";
  } else {
    // 3. Kontener działa i gra odpowiada
    statusLabel = "Online";
    statusColor = "green";
  }

  return (
    <Card>
      <Flex direction="column" gap="4" className="p-2">
        
        {/* --- GŁÓWNY STATUS SERWERA --- */}
        <Flex justify="between">
          <Heading as="h2" mb="2" trim="start">Status serwera</Heading>
          {/* Tutaj wyświetlamy: Offline (red) / Starting (yellow) / Online (green) */}
          <Badge color={statusColor}>
            {statusLabel}
          </Badge>
        </Flex>

        <Flex gap="2">
          <Button
            variant="surface"
            color="green"
            disabled={running || loading}
            onClick={() => handleAction("start")}
          >
            Run server
          </Button>

          <Button
            variant="surface"
            color="red"
            disabled={!running || loading}
            onClick={() => handleAction("stop")}
          >
            Stop server
          </Button>
        </Flex>

        {/* --- AKTYWNI GRACZE --- */}
        {/* Wyświetlamy tylko gdy serwer jest w pełni aktywny (serverActive = true) */}
        {serverActive && (
          <Flex align="center" gap="2">
            <Text>Gracze online:</Text>
            <Badge color={playerCount && playerCount > 0 ? "green" : "gray"}>
              {playerCount !== null ? playerCount : "0"}
            </Badge>
          </Flex>
        )}

      </Flex>
    </Card>
  );
}