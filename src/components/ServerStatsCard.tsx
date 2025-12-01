"use client";

import { useEffect, useState } from "react";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";

export default function ServerStatsCard() {
  const [stats, setStats] = useState<
    { name: string; value: string | number }[]
  >([]);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/server-stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Błąd pobierania statystyk");

      const data = await response.json();
      setStats(data.stats || []);
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
}, [BACKEND_URL]);


  return (
    <Card className="w-full">
      <Flex direction="column" gap="2" className="p-4 w-full">
        <Heading as="h2" mb="2" trim="start">
          Statystyki
        </Heading>

        {stats.length === 0 && <div>Ładowanie…</div>}

        <Flex gap="4" wrap="wrap" className="w-full">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="w-1/3 md:w-1/4 lg:w-1/6 2xl:w-1/10 aspect-square flex items-center justify-center"
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
        </Flex>
      </Flex>
    </Card>
  );
}
