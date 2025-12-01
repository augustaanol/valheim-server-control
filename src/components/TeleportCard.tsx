"use client";

import { Card, Flex, Heading, Button, Select, TextField, Text } from "@radix-ui/themes";
import { useState } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useServerStore } from "@/store/serverStore";

export default function TeleportCard() {
    const { serverActive, playersList } = useServerStore();

    const [playerToTeleport, setPlayerToTeleport] = useState<string | null>(null);
    const [teleportTarget, setTeleportTarget] = useState<string | null>(null);
    const [customCoordinates, setCustomCoordinates] = useState<string>("");

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3000";

    const sendTeleport = async () => {
        if (!playerToTeleport) return alert("Wybierz gracza do teleportowania");

        let payload = "";

        if (teleportTarget === "coordinates") {
            if (!customCoordinates.trim()) {
                return alert("Podaj koordynaty (x y z)");
            }
            payload = `<${playerToTeleport} ${customCoordinates}>`;
        } else {
            if (!teleportTarget?.trim()) {
                return alert("Wybierz cel teleportu");
            }
            payload = `<${playerToTeleport} ${teleportTarget}>`;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/api/teleport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ command: payload }),
            });

            if (!res.ok) {
                console.error(await res.text());
                alert("Teleport nieudany");
                return;
            }

            alert("Teleport wykonany!");
        } catch (error) {
            console.error(error);
            alert("Błąd połączenia z backendem");
        }
    };

    return (
        <Card className="w-full">
            <Flex direction="column" gap="2" className="p-4 w-full">
                <Heading as="h2" mb="2" trim="start">
                    Teleport
                </Heading>

                {serverActive && (
                    <Flex
                        direction={{ initial: "column", md: "row" }}
                        justify={"between"}
                        flexGrow={"1"}
                        align={{ initial: "end", md: "center" }}
                        gap={"2"}
                    >
                        <Flex gap={"2"} align="center">
                            {/* Player select */}
                            <Select.Root onValueChange={setPlayerToTeleport}>
                                <Select.Trigger placeholder="player" />
                                <Select.Content>
                                    {playersList.map((player) => (
                                        <Select.Item key={player.steam_id} value={player.steam_id}>
                                            {player.name}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>

                            <ArrowRightIcon className="w-5 h-5" />

                            {/* Teleport target */}
                            <Select.Root onValueChange={setTeleportTarget}>
                                <Select.Trigger placeholder="target" />
                                <Select.Content>
                                    {playersList.map((player) => (
                                        <Select.Item
                                            key={player.steam_id}
                                            value={player.position ? player.position.join(" ") : ""}
                                        >
                                            {player.name}
                                        </Select.Item>
                                    ))}
                                    <Select.Item value="coordinates">Koordynaty</Select.Item>
                                </Select.Content>
                            </Select.Root>

                            {/* Custom coordinates */}
                            {teleportTarget === "coordinates" && (
                                <TextField.Root
                                    size="2"
                                    placeholder="x y z"
                                    value={customCoordinates}
                                    onChange={(e) => setCustomCoordinates(e.target.value)}
                                />
                            )}
                        </Flex>

                        {/* BUTTON */}
                        <Button
                            variant="surface"
                            color="green"
                            onClick={sendTeleport}
                            disabled={
                                !playerToTeleport ||
                                !teleportTarget ||
                                (teleportTarget === "coordinates" && !customCoordinates.trim())
                            }
                        >
                            Teleportuj!
                        </Button>
                    </Flex>
                )}

                {!serverActive && (
                    <Text size="2" color="gray">
                        Serwer offline
                    </Text>
                )}
            </Flex>
        </Card>
    );
}
