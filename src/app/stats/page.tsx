"use client";

import { Flex, Card, Heading } from "@radix-ui/themes";

export default function Stats() {

    const defaultGap: string = "4";

    return (
        <Flex direction="column" gap={defaultGap}>
            <Flex direction={{initial: "column", md: "row"}} gap={defaultGap}>
                <Card className="w-full lg-w-1/2 min-h-30">
                    <Flex direction={"column"} className="p-4">
                        <Heading as="h1">Statystyki</Heading>
                    </Flex>
                </Card>
                <Card className="w-full lg-w-1/2 min-h-30"></Card>
            </Flex>
        </Flex>
    )
}   