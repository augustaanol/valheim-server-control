"use client";

import { Card, Flex, Heading, Text, Button, DropdownMenu, Box } from "@radix-ui/themes";
import Image from "next/image";
import { Pirata_One } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useServerStore } from "@/store/serverStore";


const pirataOne = Pirata_One({
        weight: "400",
        subsets: ["latin"],
    });

const navLinks = [
    { name: "Home", href: "/", alwaysVisible: true },
    { name: "Serwer", href: "/server", alwaysVisible: false },
    { name: "Statystyki", href: "/stats", alwaysVisible: true },
    { name: "Komendy", href: "/commands", alwaysVisible: false },
];


export default function Navbar({ titleText }: {titleText: string }) {


    const pathname = usePathname();

    const { serverActive } = useServerStore();

    return (
        <>
        <Flex align={"center"} justify={"between"} direction={"row"} display={{ initial: "none", sm: "flex" }} className="pt-8 mb-16 gap-6 sticky top-0">
            <Flex align={"center"} gap={"5"}>
                <Image alt="logo" src="/images/valheim_logo_large.webp" width={160} height={100} className="sm:w-14 md:w-40 h-auto" />
                <Heading 
                    as="h1" 
                    size={{initial: "6",md: "8"}} 
                    style={{ fontFamily: pirataOne.style.fontFamily }}
                    >
                    {titleText}
                </Heading>
            </Flex>
            <Flex align="center">
                <Card>
                    <Flex align={"center"} gap="6" className="px-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                            <Link key={link.href} href={link.href} hidden={!link.alwaysVisible && !serverActive}>
                                <Text
                                    size="4"
                                    weight={isActive ? "medium" : "regular"}
                                    className={isActive ? "text-white" : "text-gray-400 hover:text-gray-300"}
                                    >
                                {link.name}
                                </Text>
                            </Link>
                            );
                        })}
                    </Flex>
                </Card>
            </Flex>
        </Flex>

        <Flex align={"center"} justify={"between"} display={{ initial: "flex", sm: "none" }} className="pt-6 pb-6 px-1 md:pb-12 sticky top-0">
            <Flex gap={"3"} align="center">
                <Image alt="logo" src="/images/valheim_logo_large.webp" width={160} height={100} className="w-28" />
                <Heading 
                    as="h1" 
                    size={"7"} 
                    style={{ fontFamily: pirataOne.style.fontFamily }}
                    >
                    ADiheim SC
                </Heading>
            </Flex>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="surface" color="gray" size={"3"} className="p-2">
                        <HamburgerMenuIcon width={"20"} height={"20"} />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content size={"2"} variant="soft">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                        <Box key={link.href} p="1"width={"full"}>
                            <Link href={link.href} hidden={!link.alwaysVisible && !serverActive}>
                                <DropdownMenu.Item>
                                        <Text 
                                        size={"5"}
                                        align={"right"}
                                        weight={isActive ? "medium" : "regular"}
                                        className={isActive ? "text-white" : "text-gray-400 hover:text-gray-300"}
                                        >
                                            {link.name}
                                        </Text>
                                </DropdownMenu.Item>
                            </Link>
                        </Box>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Flex>

        </>
    )
}