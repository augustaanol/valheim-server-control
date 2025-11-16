"use client";

import { Flex, Card, Heading } from "@radix-ui/themes";
import ServerControlCard from "@/components/ServerControlCard";
import { ServerLogCard } from "@/components/ServerLogCard";

export default function Home() {

  const defaultGap: string = "4";

  return (
    <Flex direction="column" gap={defaultGap}>
			
      <Flex direction={"row"} gap={defaultGap} justify={"between"}>
        
        <Flex direction={"column"} className="w-1/3" gap={defaultGap}>
          <ServerControlCard />
        </Flex>

        <Flex direction={"column"} className="w-2/3" gap={defaultGap}>
          <Card>
            <Flex direction={"column"} gap={"2"} className="p-2">
              <Heading as="h2" mb="2" trim="start">Statystyki</Heading>
              <Flex gap={"2"}>chuj może kiedyś tu coś bedzie ale kurwa zalezy jak mi sie zachce</Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
			
      <ServerLogCard />
      
		</Flex>
  );
}
