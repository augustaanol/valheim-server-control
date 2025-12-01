"use client";

import { Flex, Card } from "@radix-ui/themes";
import TeleportCard from "@/components/TeleportCard";

export default function CommandsPage() {

    const defaultGap: string = "4";

    return (
        <Flex direction="column" gap={defaultGap}>
            <Flex direction={{initial: "column", md: "row"}} gap={defaultGap}>
                <Flex className="w-full lg-w-1/2 min-h-30">
                    <TeleportCard />
                </Flex>
                <Flex className="w-full lg-w-1/2 min-h-30">
                    <Card className="w-full"></Card>
                </Flex>
            </Flex>
        </Flex>
    )
}   