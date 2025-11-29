"use client";

import { Flex, Card, Heading } from "@radix-ui/themes";
import ServerControlCard from "@/components/ServerControlCard";

export default function Home() {

  const defaultGap: string = "4";

  return (
    <Flex direction="column" gap={defaultGap}>
			
      <Flex direction={{md:"row", initial: "column"}} gap={defaultGap} justify={"between"} className="flex items-stretch">
        
        <Flex direction={"column"} className="2xl:w-1/4 lg:w-2/5" gap={defaultGap}>
          <ServerControlCard />
        </Flex>

        <Flex direction={"column"} className="2xl:w-3/4 lg:w-3/5" gap={defaultGap}>
          <Card className="h-full">
            <Flex direction={"column"} gap={"2"} className="p-4">
              <Heading as="h2" mb="2" trim="start">Statystyki</Heading>
              <Flex gap={"2"}>chuj może kiedyś tu coś bedzie ale kurwa zalezy jak mi sie zachce</Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
      
		</Flex>
  );
}
