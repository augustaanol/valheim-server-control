"use client";

import { Flex } from "@radix-ui/themes";
import ServerControlCard from "@/components/ServerControlCard";
import ServerStatsCard from "@/components/ServerStatsCard";

export default function Home() {

  const defaultGap: string = "4";

  return (
    <Flex direction="column" gap={defaultGap}>
			
      <Flex direction={{md:"row", initial: "column"}} gap={defaultGap} justify={"between"} className="flex items-stretch">
        
        <Flex direction={"column"} className="2xl:w-1/4 lg:w-2/5" gap={defaultGap}>
          <ServerControlCard />
        </Flex>

        <Flex direction={"column"} className="2xl:w-3/4 lg:w-3/5" gap={defaultGap}>
          <ServerStatsCard />
        </Flex>
      </Flex>
      
		</Flex>
  );
}
