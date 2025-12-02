"use client";

import { useEffect, useState } from "react";
import { Card, DataList, Text, Flex } from "@radix-ui/themes";

type Resources = {
  cpu_percent?: number;
  memory_usage?: number;
  memory_limit?: number;
  memory_percent?: number;
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
          `${BACKEND_URL}/api/container-resources/${CONTAINER_NAME}`
        );
        if (!response.ok) return;

        const data = await response.json();
        setResources(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [BACKEND_URL, CONTAINER_NAME]);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return "0 MB";
    const mb = bytes / 1024 / 1024;
    return mb > 1024
      ? `${(mb / 1024).toFixed(2)} GB`
      : `${mb.toFixed(2)} MB`;
  };

  return (
    <Card>
      <Flex className="w-full">
        <DataList.Root>

          {/* CPU */}
          <DataList.Item align="center">
            <DataList.Label minWidth="140px">Zużycie CPU</DataList.Label>
            <DataList.Value>
              <Text>
                {resources?.cpu_percent !== undefined
                  ? `${resources.cpu_percent.toFixed(2)}%`
                  : "Brak danych"}
              </Text>
            </DataList.Value>
          </DataList.Item>

          {/* RAM */}
          <DataList.Item align="center">
            <DataList.Label minWidth="140px">RAM</DataList.Label>
            <DataList.Value>
              <Text>
                {resources?.memory_usage !== undefined &&
                resources?.memory_limit !== undefined
                  ? `${formatBytes(resources.memory_usage)} / ${formatBytes(
                      resources.memory_limit
                    )}`
                  : "Brak danych"}
              </Text>
            </DataList.Value>
          </DataList.Item>

          {/* RAM percent */}
          <DataList.Item align="center">
            <DataList.Label minWidth="140px">Zużycie RAM %</DataList.Label>
            <DataList.Value>
              <Text>
                {resources?.memory_percent !== undefined
                  ? `${resources.memory_percent.toFixed(2)}%`
                  : "Brak danych"}
              </Text>
            </DataList.Value>
          </DataList.Item>

          {/* DEV mode message */}
          {resources?.disabled && (
            <DataList.Item align="center">
              <DataList.Label minWidth="140px">Info</DataList.Label>
              <DataList.Value>
                <Text color="yellow">{resources.message}</Text>
              </DataList.Value>
            </DataList.Item>
          )}
        </DataList.Root>
      </Flex>
    </Card>
  );
}
