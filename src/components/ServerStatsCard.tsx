"use client";

import { useEffect, useState } from "react";
import { Card, Flex, Text, Dialog, Button, DataList, Badge, Box } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";

type ServerStatsCardProps = {
  size?: "small" | "large";
  showMore?: boolean;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function ServerStatsCard({size="large", showMore=false}: ServerStatsCardProps) {

  const [stats, setStats] = useState<
    { name: string; value: string | number }[]
  >([]);

  

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/server-stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Błąd pobierania statystyk");

      const data = await response.json();
      setStats(data.server_stats || []);
    } catch (err) {
      console.error("ERROR fetchStats:", err);
    }
  };

  // pierwsze pobranie od razu
  fetchStats();

  // potem co 5 sekund
  const intervalId = setInterval(fetchStats, 5000);

  // cleanup przy odmontowaniu komponentu
  return () => clearInterval(intervalId);
}, []);


  return (
    <Flex direction="column" gap="2" className="w-full">

      {stats.length === 0 && <div>Ładowanie…</div>}

      <Flex gap="4" wrap="wrap" className="w-full">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className={size==="large" ? "w-1/3 md:w-1/4 lg:w-1/6 2xl:w-1/10 aspect-square flex items-center justify-center" : "w-1/4 md:w-1/5 lg:w-1/10 2xl:w-1/12 aspect-square flex items-center justify-center"}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              className="p-2 text-center w-full h-full"
            >
              <Text size="6" className="font-bold">{stat.value}</Text>
              <Text size="3">{stat.name}</Text>
            </Flex>
          </Card>
        ))}
        {showMore && (
          <Dialog.Root>
            <Dialog.Trigger className="cursor-pointer">
              <Box
                className={
                  size === "large"
                    ? "w-1/3 md:w-1/4 lg:w-1/6 2xl:w-1/10 aspect-square"
                    : "w-1/4 md:w-1/5 lg:w-1/10 2xl:w-1/12 aspect-square"
                }
              >
                <Card className="w-full h-full hover:border border-slate-600 transition-all duration-100">
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      className="p-2 text-center w-full h-full"
                    >
                      <Text size="4">more</Text>
                    </Flex>
                  </Card>
              </Box>
            </Dialog.Trigger>
            <Dialog.Content>
              <Flex direction={"column"} gap={"3"}>
                <Flex justify="between" align="center">
                  <Dialog.Title className="flex items-center leading-none">Statystyki serwera</Dialog.Title>
                  <Dialog.Close>
                    <Button variant="surface">
                      <Cross2Icon />
                    </Button>
                  </Dialog.Close>
                </Flex>
                <DataList.Root>
                  {stats.map((stat) => (
                    <DataList.Item key={stat.name} align="center">
                      <DataList.Label>{stat.name}</DataList.Label>
                      <DataList.Value>
                        <Badge variant="surface" size={"2"}>
                          {stat.value}
                        </Badge>
                      </DataList.Value>
                    </DataList.Item>
                  ))}
                </DataList.Root>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        )}
      </Flex>
    </Flex>
  );
}
