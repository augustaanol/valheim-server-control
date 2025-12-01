"use client";

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
import { useServerStore } from "@/store/serverStore";

type BadgeColor = "green" | "red" | "yellow" | "gray";

export default function ServerControlCard() {
  const {
    running,
    serverActive,
    isInitialLoading,
    actionLoading,
    playerCount,
    playersList,
    serverName,
    serverSteamID,
    handleAction,
  } = useServerStore();


  // --- logika statusu ---
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
        {/* STATUS SERWERA */}
        <Flex justify="between" align="center" className="mb-2">
          <HoverCard.Root>
            <HoverCard.Trigger>
              <Heading as="h2" style={{ cursor: "default" }}>
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

          {isInitialLoading ? (
            <Badge color="gray">Ładowanie...</Badge>
          ) : (
            <Badge color={statusColor}>{statusLabel}</Badge>
          )}
        </Flex>

        {/* PRZYCISKI START/STOP */}
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

        {/* GRACZE ONLINE */}
        {serverActive && (
          <Flex align="center" gap="2" className="mt-2">
            <Text weight="bold">Gracze online:</Text>
            <Badge color={playerCount && playerCount > 0 ? "green" : "gray"}>
              {playerCount ?? 0}
            </Badge>
          </Flex>
        )}

        {/* LISTA GRACZY */}
        {serverActive && playersList && playersList.length > 0 && (
          <Flex direction="column" gap="2">
            {playersList.map((player) => (
              <Card key={player.steam_id}>
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
                          ? `${player.position[0]} ${player.position[1]} ${player.position[2]}`
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
