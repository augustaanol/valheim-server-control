"use client";

import { useState, useEffect } from "react";
import { Flex, Card, Heading, Badge, Button, Text } from "@radix-ui/themes";

export default function ServerControlCard() {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---- STATUS KONTENERA ----
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/container-status");
      const data = await res.json();
      setRunning(data.running);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "start" | "stop") => {
    setLoading(true);
    try {
      await fetch("/api/container-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---- LICZBA AKTYWNYCH GRACZY ----
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch("/api/active-players");
        const data = await res.json();

        if (data.error) {
          setPlayerCount(null);
        } else {
          setPlayerCount(data.online); // backend zwraca { online: X }
        }
      } catch {
        setPlayerCount(null);
      }
    }

    loadPlayers();
    const interval = setInterval(loadPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <Flex direction="column" gap="4" className="p-2">
        
        {/* --- STATUS SERWERA --- */}
        <Flex justify="between">
          <Heading as="h2" mb="2" trim="start">Status</Heading>
          <Badge color={running ? "green" : "red"}>
            {running ? "Online" : "Offline"}
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
        <Flex align="center" gap="2">
          <Text>Gracze online:</Text>
          <Badge
            color={
              playerCount === null
                ? "gray"
                : playerCount > 0
                ? "green"
                : "gray"
            }
          >
            {playerCount === null ? "?" : playerCount}
          </Badge>
        </Flex>

      </Flex>
    </Card>
  );
}
