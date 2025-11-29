"use client";

import { Flex, Card } from "@radix-ui/themes";
import { ServerLogCard } from "@/components/ServerLogCard";

export default function Server() {

    const defaultGap: string = "4";

    return (
        <Flex direction="column" gap={defaultGap}>
            <Flex direction={{initial: "column", md: "row"}} gap={defaultGap}>
                <Card className="w-full lg-w-1/2 p-4 min-h-30"></Card>
                <Card className="w-full lg-w-1/2 p-4 min-h-30"></Card>
            </Flex>
            <ServerLogCard />
        </Flex>
    )
}   