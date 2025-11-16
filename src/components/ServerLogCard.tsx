"use client";

import { Card, Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";
import useSWR from "swr";
import { useRef, useEffect } from "react";

// Typ odpowiedzi API
interface LogResponse {
  logs: string;
  error?: string;
}

// Fetcher API
const fetcher = (url: string): Promise<LogResponse> =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Błąd serwera: ${res.status}`);
    }
    return res.json();
  });

// --- Funkcje do czyszczenia i formatowania logów ---

/**
 * Czyści linię logu z dziwnych prefixów i znaków sterujących
 */
function cleanLogLine(line: string): string {
  // Usuń wszystkie znaki sterujące poza \n, \t
  const clean = line.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "");

  // Usuń prefixy przed timestampem, np. '�2025-11-16T14:05:02.385544664Z'
  const match = clean.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)(.*)/);
  if (match) {
    return `${match[1]}${match[2]}`.trim();
  }

  return clean.trim();
}

/**
 * Formatuje linię logu, wyciągając timestamp i prezentując go w czytelnej formie
 */
function formatLogLine(line: string): string {
  const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s?(.*)$/;
  const match = line.match(regex);
  if (match) {
    const date = new Date(match[1]);
    const timeStr = isNaN(date.getTime()) ? match[1] : date.toLocaleTimeString("pl-PL");
    return `${timeStr} | ${match[2]}`;
  }
  return line;
}

/**
 * Zwraca kolor logu w zależności od poziomu logu
 */
function getLogColor(line: string): string {
  if (line.includes("DEBUG")) return "gray";
  if (line.includes("INFO")) return "white";
  if (line.includes("WARNING") || line.includes("WARN")) return "orange";
  if (line.includes("ERROR")) return "red";
  return "white";
}

// --- Komponent logów ---

export function ServerLogCard() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { data, error, isValidating } = useSWR<LogResponse, Error>(
    "/api/container-logs?logs=true",
    fetcher,
    { refreshInterval: 3000, keepPreviousData: true }
  );

  // Automatyczne przewijanie do dołu po aktualizacji logów
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>(
        ":scope > [data-radix-scroll-area-viewport]"
      );
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [data?.logs]);

  const logLines = data?.logs
    .split("\n")
    .map(cleanLogLine)
    .filter(Boolean)
    .map(formatLogLine) || [];

  return (
    <Card>
      <Flex direction="column" gap="2" className="p-4">
        <Heading as="h2" mb="2" trim="start">
          Logi
        </Heading>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: 300 }}
          ref={scrollAreaRef}
        >
          <Flex direction="column" gap="1" className="p-1 pr-3">
            {isValidating && <Text size="1" color="gray">Ładowanie logów...</Text>}
            {error && <Text size="1" color="red">Błąd ładowania logów: {error.message}</Text>}
            {data?.error && <Text size="1" color="red">Błąd API: {data.error}</Text>}
            {!error && !data?.error && logLines.length === 0 && !isValidating && (
              <Text size="1" color="gray">Brak logów do wyświetlenia.</Text>
            )}
            {logLines.map((line, idx) => (
              <Text
                key={idx}
                size="1"
                style={{
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "pre-wrap",
                  color: getLogColor(line),
                }}
              >
                {line}
              </Text>
            ))}
          </Flex>
        </ScrollArea>
      </Flex>
    </Card>
  );
}
