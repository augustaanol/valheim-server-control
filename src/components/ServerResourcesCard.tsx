"use client";

import { useEffect, useState } from "react";
import { Card, DataList, Text, Flex, Heading } from "@radix-ui/themes";

type Resources = {
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
  memory_percent: number;
  disabled?: boolean;
  message?: string;
};

export default function ServerResourcesCard() {
  const [resources, setResources] = useState<Resources | null>(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const CONTAINER_NAME =
    process.env.NEXT_PUBLIC_CONTAINER_NAME || "valheim-server";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/container-resources/${CONTAINER_NAME}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setResources(data);
      } catch (err) {
        console.error("ERROR fetchStats:", err);
      }
    };

    fetchStats();
    const intervalId = setInterval(fetchStats, 1000);

    return () => clearInterval(intervalId);
  }, [BACKEND_URL, CONTAINER_NAME]);

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 MB";
    const mb = bytes / 1024 / 1024;
    return mb > 1024
      ? `${(mb / 1024).toFixed(2)} GB`
      : `${mb.toFixed(2)} MB`;
  };

  return (
    <Card>
      <Flex direction={"column"} gap={"4"} className="w-full p-3">
        <Heading as="h2" style={{ cursor: "default" }}>Zużycie zasobów</Heading>
        <DataList.Root>
          {/* CPU */}
          <DataList.Item align="center">
            <DataList.Label minWidth="100px">Zużycie CPU</DataList.Label>
            <DataList.Value>
              <Text>
                {resources
                  ? `${resources.cpu_percent.toFixed(2)}%`
                  : "Ładowanie..."}
              </Text>
            </DataList.Value>
          </DataList.Item>

          {/* RAM absolute */}
          <DataList.Item align="center">
            <DataList.Label minWidth="100px">RAM</DataList.Label>
            <DataList.Value>
              <Text>
                {resources
                  ? `${formatBytes(resources.memory_usage)} / ${formatBytes(
                      resources.memory_limit
                    )}`
                  : "Ładowanie..."}
              </Text>
            </DataList.Value>
          </DataList.Item>

          {/* RAM percent */}
          <DataList.Item align="center">
            <DataList.Label minWidth="140px">Zużycie RAM %</DataList.Label>
            <DataList.Value>
              <Text>
                {resources
                  ? `${resources.memory_percent.toFixed(2)}%`
                  : "Ładowanie..."}
              </Text>
            </DataList.Value>
          </DataList.Item>

        </DataList.Root>
      </Flex>
    </Card>
  );
}
